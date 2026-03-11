// ============================================================
// Cloudflare News Hub - 单文件 Worker (含 AI 摘要)
// ============================================================

const DEFAULT_CONFIG = {
  language: 'zh-CN',
  region: 'CN',
  category: 'general',
  keywords: '',
  excludeKeywords: '',
  maxItems: 10,
  pushHour: '8',
  enabled: true,
  aiSummary: true,
  sources: ['google', 'reuters', 'bbc', 'xinhua', 'ap'],
};

const CATEGORIES = {
  general:       '综合新闻',
  world:         '国际',
  business:      '财经',
  technology:    '科技',
  entertainment: '娱乐',
  sports:        '体育',
  science:       '科学',
  health:        '健康',
};

const LANGUAGES = {
  'zh-CN': '简体中文 (中国)',
  'zh-TW': '繁體中文 (台灣)',
  'en-US': 'English (US)',
  'ja-JP': '日本語',
  'ko-KR': '한국어',
  'fr-FR': 'Français',
  'de-DE': 'Deutsch',
};

// ============================================================
// 新闻源定义
// ============================================================
const NEWS_SOURCES = {
  google: {
    label: 'Google News', flag: '🔍',
    getUrl: (config) => {
      const hl = config.language, gl = config.region;
      if (config.keywords) return `https://news.google.com/rss/search?q=${encodeURIComponent(config.keywords)}&hl=${hl}&gl=${gl}&ceid=${gl}:${hl}`;
      const catMap = { world:'WORLD', business:'BUSINESS', technology:'TECHNOLOGY', entertainment:'ENTERTAINMENT', sports:'SPORTS', science:'SCIENCE', health:'HEALTH' };
      const cat = catMap[config.category];
      if (cat) return `https://news.google.com/rss/headlines/section/topic/${cat}?hl=${hl}&gl=${gl}&ceid=${gl}:${hl}`;
      return `https://news.google.com/rss?hl=${hl}&gl=${gl}&ceid=${gl}:${hl}`;
    },
  },
  reuters: {
    label: '路透社 Reuters', flag: '📡',
    getUrl: (config) => {
      const catMap = { world:'world', business:'business', technology:'technology', science:'science', health:'health', sports:'sports', entertainment:'lifestyle' };
      return `https://feeds.reuters.com/reuters/${catMap[config.category] || 'world'}News`;
    },
  },
  bbc: {
    label: 'BBC News', flag: '🇬🇧',
    getUrl: (config) => {
      const catMap = { world:'world', business:'business', technology:'technology', science:'science_and_environment', health:'health', sports:'sport', entertainment:'entertainment_and_arts' };
      return `http://feeds.bbci.co.uk/news/${catMap[config.category] || 'world'}/rss.xml`;
    },
  },
  xinhua: {
    label: '新华社', flag: '🇨🇳',
    getUrl: () => 'https://feeds.feedburner.com/NewHuaNet-EnglishNews',
  },
  ap: {
    label: '美联社 AP', flag: '🗞',
    getUrl: (config) => {
      const catMap = { world:'intl', business:'business', technology:'technology', science:'science', health:'health', sports:'sports', entertainment:'entertainment' };
      return `https://rsshub.app/apnews/topics/${catMap[config.category] || 'intl'}`;
    },
  },
  bloomberg: {
    label: '彭博社 Bloomberg', flag: '💹',
    getUrl: () => 'https://feeds.bloomberg.com/markets/news.rss',
  },
  ft: {
    label: '金融时报 FT', flag: '🏦',
    getUrl: () => 'https://www.ft.com/rss/home',
  },
  guardian: {
    label: '卫报 The Guardian', flag: '🌐',
    getUrl: (config) => {
      const catMap = { world:'world', business:'business', technology:'technology', science:'science', health:'society', sports:'sport', entertainment:'culture' };
      return `https://www.theguardian.com/${catMap[config.category] || 'world'}/rss`;
    },
  },
  nhk: {
    label: 'NHK World', flag: '🇯🇵',
    getUrl: () => 'https://www3.nhk.or.jp/rss/news/cat0.xml',
  },
  aljazeera: {
    label: '半岛电视台 Al Jazeera', flag: '🌍',
    getUrl: () => 'https://www.aljazeera.com/xml/rss/all.xml',
  },
};

// ============================================================
// 主入口
// ============================================================
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/config' && request.method === 'POST') return handleSaveConfig(request, env);
    if (url.pathname === '/api/config' && request.method === 'GET')  return handleGetConfig(env);
    if (url.pathname === '/api/test'   && request.method === 'POST') return handleTestPush(env);
    if (url.pathname === '/api/preview'&& request.method === 'GET')  return handlePreview(env);
    return new Response(renderHTML(await getConfig(env)), { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runNewsPush(env));
  },
};

// ============================================================
// 配置管理
// ============================================================
async function getConfig(env) {
  try {
    const raw = await env.NEWS_CONFIG.get('config');
    return raw ? { ...DEFAULT_CONFIG, ...JSON.parse(raw) } : DEFAULT_CONFIG;
  } catch { return DEFAULT_CONFIG; }
}
async function handleGetConfig(env) { return Response.json(await getConfig(env)); }
async function handleSaveConfig(request, env) {
  try {
    const body = await request.json();
    await env.NEWS_CONFIG.put('config', JSON.stringify({ ...DEFAULT_CONFIG, ...body }));
    return Response.json({ success: true, message: '配置已保存' });
  } catch (e) { return Response.json({ success: false, message: e.message }, { status: 500 }); }
}

// ============================================================
// 新闻获取（多源并发）
// ============================================================
async function fetchFromSource(sourceKey, config) {
  const source = NEWS_SOURCES[sourceKey];
  if (!source) return [];
  try {
    const url = source.getUrl(config);
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!resp.ok) return [];
    const xml = await resp.text();
    return parseRss(xml, source.label, source.flag, config);
  } catch { return []; }
}

function parseRss(xml, sourceName, sourceFlag, config) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = decodeHtml(extract(block, 'title'));
    const link  = extract(block, 'link') || extract(block, 'guid');
    if (!title || title.length < 5) continue;
    if (config.keywords) {
      const kws = config.keywords.split(/[,，\s]+/).filter(Boolean);
      if (!kws.some(k => title.includes(k))) continue;
    }
    if (config.excludeKeywords) {
      const exkws = config.excludeKeywords.split(/[,，\s]+/).filter(Boolean);
      if (exkws.some(k => title.includes(k))) continue;
    }
    items.push({ title, link, source: sourceName, flag: sourceFlag });
  }
  return items;
}

async function fetchAllNews(config) {
  const sources = (config.sources || DEFAULT_CONFIG.sources).filter(s => NEWS_SOURCES[s]);
  const perSource = Math.max(2, Math.ceil(config.maxItems / sources.length));
  const results = await Promise.allSettled(sources.map(s => fetchFromSource(s, config)));
  const allItems = [];
  const seen = new Set();
  results.forEach(r => {
    if (r.status !== 'fulfilled') return;
    let count = 0;
    for (const item of r.value) {
      if (count >= perSource) break;
      const key = item.title.slice(0, 20);
      if (seen.has(key)) continue;
      seen.add(key);
      allItems.push(item);
      count++;
    }
  });
  return allItems.slice(0, config.maxItems);
}

function extract(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return m ? (m[1] || m[2] || '').trim() : '';
}
function decodeHtml(str) {
  return str.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
}

// ============================================================
// Workers AI 摘要
// ============================================================
async function summarizeWithAI(env, items, config) {
  if (!env.AI) return null;
  try {
    const catLabel = CATEGORIES[config.category] || '综合';
    const newsList = items.map((item, i) => `${i+1}. [${item.source}] ${item.title}`).join('\n');
    const prompt = `你是一位专业的新闻编辑助手。以下是来自多家权威媒体的今日${catLabel}新闻标题，请完成以下任务：

1. 用中文提炼出 3-5 个最重要的新闻要点，每点 1-2 句话，语言简洁专业
2. 最后用一句话给出今日整体趋势或值得关注的信号

新闻列表：
${newsList}

请直接输出摘要内容，不要有多余的前缀说明。`;

    const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
    });
    return response?.choices?.[0]?.message?.content?.trim() || null;
  } catch (e) {
    console.error('AI 摘要失败:', e.message);
    return null;
  }
}

// ============================================================
// Telegram 推送
// ============================================================
async function sendToTelegram(env, message) {
  const token = env.TG_TOKEN, chatId = env.TG_CHAT_ID;
  if (!token || !chatId) throw new Error('未配置 TG_TOKEN 或 TG_CHAT_ID');
  const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML', disable_web_page_preview: true }),
  });
  const data = await resp.json();
  if (!data.ok) throw new Error(`TG 推送失败: ${data.description}`);
  return data;
}

async function formatMessage(items, config, env) {
  const catLabel = CATEGORIES[config.category] || '综合新闻';
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

  let msg = `📰 <b>Cloudflare News Hub</b>\n`;
  msg += `🗂 ${catLabel} | 🕐 ${now}\n`;

  // AI 摘要部分
  if (config.aiSummary !== false) {
    const summary = await summarizeWithAI(env, items, config);
    if (summary) {
      msg += `\n━━━━━ 🤖 AI 今日摘要 ━━━━━\n\n`;
      msg += `${summary}\n`;
    }
  }

  // 原文链接列表
  msg += `\n━━━━━ 📎 原文链接 ━━━━━\n\n`;

  // 按来源分组
  const grouped = {};
  items.forEach(item => {
    if (!grouped[item.source]) grouped[item.source] = { flag: item.flag, items: [] };
    grouped[item.source].items.push(item);
  });

  let idx = 1;
  for (const [src, group] of Object.entries(grouped)) {
    msg += `${group.flag} <b>${src}</b>\n`;
    group.items.forEach(item => {
      msg += `${idx}. <a href="${item.link}">${item.title}</a>\n`;
      idx++;
    });
    msg += '\n';
  }

  msg += `━━━━━━━━━━━━━━━━━━━━\n共 ${items.length} 条`;
  return msg;
}

// ============================================================
// 定时推送
// ============================================================
async function runNewsPush(env) {
  const config = await getConfig(env);
  if (!config.enabled) return;
  const now = new Date();
  const hour = now.toLocaleString('en-US', { timeZone: 'Asia/Shanghai', hour: 'numeric', hour12: false });
  if (String(config.pushHour) !== String(hour)) return;
  const lastRun = await env.NEWS_CONFIG.get('lastRun');
  const today = now.toISOString().slice(0, 10);
  if (lastRun === today) return;
  const items = await fetchAllNews(config);
  if (items.length === 0) return;
  const message = await formatMessage(items, config, env);
  await sendToTelegram(env, message);
  await env.NEWS_CONFIG.put('lastRun', today);
}

async function handleTestPush(env) {
  try {
    const config = await getConfig(env);
    const items = await fetchAllNews(config);
    if (items.length === 0) return Response.json({ success: false, message: '没有获取到新闻，请检查配置' });
    const message = await formatMessage(items, config, env);
    await sendToTelegram(env, message);
    return Response.json({ success: true, message: `推送成功！共发送 ${items.length} 条新闻` });
  } catch (e) { return Response.json({ success: false, message: e.message }, { status: 500 }); }
}

async function handlePreview(env) {
  try {
    const config = await getConfig(env);
    const items = await fetchAllNews(config);
    let summary = null;
    if (config.aiSummary !== false) summary = await summarizeWithAI(env, items, config);
    return Response.json({ success: true, items, summary });
  } catch (e) { return Response.json({ success: false, message: e.message }, { status: 500 }); }
}

// ============================================================
// 前端 UI
// ============================================================
function renderHTML(config) {
  const langOptions = Object.entries(LANGUAGES).map(([v,l]) =>
    `<option value="${v}" ${config.language===v?'selected':''}>${l}</option>`).join('');
  const regionOptions = ['CN','TW','HK','US','JP','KR','FR','DE'].map(r =>
    `<option value="${r}" ${config.region===r?'selected':''}>${r}</option>`).join('');
  const catOptions = Object.entries(CATEGORIES).map(([v,l]) =>
    `<option value="${v}" ${config.category===v?'selected':''}>${l}</option>`).join('');
  const hourOptions = Array.from({length:24},(_,i) =>
    `<option value="${i}" ${String(config.pushHour)===String(i)?'selected':''}>${String(i).padStart(2,'0')}:00</option>`).join('');
  const sourcesChecked = config.sources || DEFAULT_CONFIG.sources;
  const sourceCheckboxes = Object.entries(NEWS_SOURCES).map(([key, src]) =>
    `<label class="src-label">
      <input type="checkbox" name="sources" value="${key}" ${sourcesChecked.includes(key)?'checked':''}>
      <span>${src.flag} ${src.label}</span>
    </label>`).join('');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Cloudflare News Hub</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh}
  .header{background:linear-gradient(135deg,#1e40af,#7c3aed);padding:24px 32px;display:flex;align-items:center;gap:16px}
  .header h1{font-size:24px;font-weight:700;color:white}
  .container{max-width:820px;margin:32px auto;padding:0 16px}
  .card{background:#1e293b;border-radius:12px;padding:24px;margin-bottom:20px;border:1px solid #334155}
  .card h2{font-size:14px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:20px}
  .form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .form-group{margin-bottom:16px}
  .form-group label{display:block;font-size:14px;color:#94a3b8;margin-bottom:6px}
  select,input[type=text],input[type=number]{width:100%;padding:10px 14px;background:#0f172a;border:1px solid #334155;border-radius:8px;color:#e2e8f0;font-size:14px;outline:none;transition:border-color .2s}
  select:focus,input:focus{border-color:#3b82f6}
  .src-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-top:4px}
  .src-label{display:flex;align-items:center;gap:8px;padding:10px 14px;background:#0f172a;border:1px solid #334155;border-radius:8px;cursor:pointer;transition:border-color .2s;font-size:14px}
  .src-label:hover{border-color:#3b82f6}
  .src-label input{width:16px;height:16px;accent-color:#3b82f6;flex-shrink:0}
  .toggle{display:flex;align-items:center;gap:12px;margin-top:8px}
  .toggle input[type=checkbox]{width:40px;height:22px;appearance:none;background:#334155;border-radius:11px;position:relative;cursor:pointer;transition:background .2s}
  .toggle input[type=checkbox]:checked{background:#3b82f6}
  .toggle input[type=checkbox]::after{content:'';width:18px;height:18px;background:white;border-radius:50%;position:absolute;top:2px;left:2px;transition:left .2s}
  .toggle input[type=checkbox]:checked::after{left:20px}
  .btn{padding:10px 20px;border-radius:8px;border:none;cursor:pointer;font-size:14px;font-weight:600;transition:all .2s}
  .btn-primary{background:#3b82f6;color:white}.btn-primary:hover{background:#2563eb}
  .btn-success{background:#10b981;color:white}.btn-success:hover{background:#059669}
  .btn-secondary{background:#334155;color:#e2e8f0}.btn-secondary:hover{background:#475569}
  .btn-group{display:flex;gap:12px;flex-wrap:wrap}
  .alert{padding:12px 16px;border-radius:8px;font-size:14px;margin-top:16px;display:none}
  .alert-success{background:#064e3b;color:#6ee7b7;border:1px solid #10b981}
  .alert-error{background:#450a0a;color:#fca5a5;border:1px solid #ef4444}
  .ai-summary{background:#1e1b4b;border:1px solid #4338ca;border-radius:8px;padding:16px;margin-bottom:16px;font-size:14px;line-height:1.8;color:#c7d2fe}
  .ai-label{font-size:12px;color:#818cf8;margin-bottom:8px;font-weight:600}
  .preview-item{padding:12px;background:#0f172a;border-radius:8px;margin-bottom:8px;border-left:3px solid #3b82f6}
  .preview-item a{color:#60a5fa;text-decoration:none;font-size:14px;line-height:1.5}
  .src-tag{display:inline-block;padding:2px 8px;border-radius:4px;background:#1e3a5f;color:#60a5fa;font-size:11px;margin-right:6px;margin-bottom:4px}
  @media(max-width:600px){.form-row{grid-template-columns:1fr}}
</style>
</head>
<body>
<div class="header">
  <span style="font-size:32px">📰</span>
  <div>
    <h1>Cloudflare News Hub</h1>
    <p style="color:#93c5fd;font-size:13px;margin-top:4px">多源聚合 · AI 摘要 · Telegram 推送</p>
  </div>
</div>
<div class="container">

  <div class="card">
    <h2>📡 新闻来源</h2>
    <div class="src-grid">${sourceCheckboxes}</div>
  </div>

  <div class="card">
    <h2>⚙️ 基本设置</h2>
    <div class="form-row">
      <div class="form-group"><label>语言</label><select id="language">${langOptions}</select></div>
      <div class="form-group"><label>地区</label><select id="region">${regionOptions}</select></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>新闻分类</label><select id="category">${catOptions}</select></div>
      <div class="form-group"><label>每次推送条数</label><input type="number" id="maxItems" value="${config.maxItems}" min="1" max="50"></div>
    </div>
  </div>

  <div class="card">
    <h2>🔍 关键词过滤</h2>
    <div class="form-group"><label>包含关键词（逗号分隔，留空不过滤）</label><input type="text" id="keywords" value="${config.keywords}" placeholder="例如: AI,人工智能"></div>
    <div class="form-group"><label>排除关键词</label><input type="text" id="excludeKeywords" value="${config.excludeKeywords}" placeholder="例如: 广告,推广"></div>
  </div>

  <div class="card">
    <h2>📨 推送设置</h2>
    <div class="form-row">
      <div class="form-group"><label>每日推送时间（北京时间）</label><select id="pushHour">${hourOptions}</select></div>
      <div class="form-group">
        <label>推送状态</label>
        <div class="toggle"><input type="checkbox" id="enabled" ${config.enabled?'checked':''}><label for="enabled" id="enabledLabel">${config.enabled?'已启用':'已停用'}</label></div>
      </div>
    </div>
    <div class="form-group">
      <label>AI 摘要</label>
      <div class="toggle"><input type="checkbox" id="aiSummary" ${config.aiSummary!==false?'checked':''}><label for="aiSummary" id="aiSummaryLabel">${config.aiSummary!==false?'已启用':'已停用'}</label></div>
    </div>
  </div>

  <div class="card">
    <h2>🎮 操作</h2>
    <div class="btn-group">
      <button class="btn btn-primary" onclick="saveConfig()">💾 保存配置</button>
      <button class="btn btn-success" onclick="testPush()">📤 立即测试推送</button>
      <button class="btn btn-secondary" onclick="previewNews()">👁 预览新闻</button>
    </div>
    <div id="alert" class="alert"></div>
  </div>

  <div class="card" id="previewCard" style="display:none">
    <h2>📋 新闻预览</h2>
    <div id="previewList"></div>
  </div>

</div>
<script>
  document.getElementById('enabled').addEventListener('change',function(){
    document.getElementById('enabledLabel').textContent=this.checked?'已启用':'已停用';
  });
  document.getElementById('aiSummary').addEventListener('change',function(){
    document.getElementById('aiSummaryLabel').textContent=this.checked?'已启用':'已停用';
  });
  function showAlert(msg,type){
    const el=document.getElementById('alert');
    el.className='alert alert-'+type;el.textContent=msg;el.style.display='block';
    setTimeout(()=>el.style.display='none',6000);
  }
  function getSelectedSources(){
    return [...document.querySelectorAll('input[name=sources]:checked')].map(el=>el.value);
  }
  async function saveConfig(){
    const config={
      language:document.getElementById('language').value,
      region:document.getElementById('region').value,
      category:document.getElementById('category').value,
      keywords:document.getElementById('keywords').value,
      excludeKeywords:document.getElementById('excludeKeywords').value,
      maxItems:parseInt(document.getElementById('maxItems').value),
      pushHour:document.getElementById('pushHour').value,
      enabled:document.getElementById('enabled').checked,
      aiSummary:document.getElementById('aiSummary').checked,
      sources:getSelectedSources(),
    };
    const resp=await fetch('/api/config',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(config)});
    const data=await resp.json();
    showAlert(data.message,data.success?'success':'error');
  }
  async function testPush(){
    showAlert('正在生成 AI 摘要并推送，请稍候（约10-20秒）...','success');
    const resp=await fetch('/api/test',{method:'POST'});
    const data=await resp.json();
    showAlert(data.message,data.success?'success':'error');
  }
  async function previewNews(){
    const card=document.getElementById('previewCard');
    const list=document.getElementById('previewList');
    card.style.display='block';
    list.innerHTML='<p style="color:#94a3b8">🤖 正在抓取新闻并生成 AI 摘要，请稍候...</p>';
    const resp=await fetch('/api/preview');
    const data=await resp.json();
    if(!data.success){list.innerHTML='<p style="color:#f87171">'+data.message+'</p>';return;}
    if(data.items.length===0){list.innerHTML='<p style="color:#94a3b8">没有获取到新闻</p>';return;}
    let html='';
    if(data.summary){
      html+='<div class="ai-summary"><div class="ai-label">🤖 AI 今日摘要</div>'+data.summary.replace(/\n/g,'<br>')+'</div>';
    }
    html+=data.items.map((item,i)=>
      '<div class="preview-item">'+
      '<span class="src-tag">'+item.flag+' '+item.source+'</span>'+
      '<a href="'+item.link+'" target="_blank">'+(i+1)+'. '+item.title+'</a>'+
      '</div>'
    ).join('');
    list.innerHTML=html;
  }
</script>
</body>
</html>`;
}
