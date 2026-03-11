// ============================================================
// Cloudflare News Hub - 中文媒体版 (含港台海外)
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
  sources: ['rfa', 'voachinese', 'bbc_chinese', 'hk01', 'initium'],
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

// ============================================================
// 非大陆中文媒体新闻源
// ============================================================
const NEWS_SOURCES = {
  // 港台媒体
  hk01: {
    label: '香港01', flag: '🇭🇰',
    getUrl: () => 'https://www.hk01.com/rss/世界專題',
  },
  mingpao: {
    label: '明报', flag: '🇭🇰',
    getUrl: () => 'https://news.mingpao.com/rss/pns/s00001.xml',
  },
  scmp_chinese: {
    label: '南华早报(中)', flag: '🇭🇰',
    getUrl: () => 'https://www.scmp.com/rss/91/feed',
  },
  appledaily_tw: {
    label: '自由时报', flag: '🇹🇼',
    getUrl: () => 'https://news.ltn.com.tw/rss/all.xml',
  },
  udn: {
    label: '联合新闻网', flag: '🇹🇼',
    getUrl: () => 'https://udn.com/rssfeed/news/2/6638?ch=news',
  },
  cna: {
    label: '中央社(台湾)', flag: '🇹🇼',
    getUrl: () => 'https://www.cna.com.tw/rss/aall.aspx',
  },
  // 海外中文媒体
  rfa: {
    label: '自由亚洲电台', flag: '🌏',
    getUrl: () => 'https://www.rfa.org/mandarin/rss2.xml',
  },
  voachinese: {
    label: '美国之音中文', flag: '🇺🇸',
    getUrl: () => 'https://www.voachinese.com/api/zepqeimovm',
  },
  bbc_chinese: {
    label: 'BBC中文', flag: '🇬🇧',
    getUrl: () => 'https://feeds.bbci.co.uk/zhongwen/simp/rss.xml',
  },
  initium: {
    label: '端传媒', flag: '🌐',
    getUrl: () => 'https://theinitium.com/feed',
  },
  dwnews: {
    label: '德国之声中文', flag: '🇩🇪',
    getUrl: () => 'https://rss.dw.com/rdf/rss-chi-all',
  },
  rti: {
    label: '中央广播电台(台)', flag: '🇹🇼',
    getUrl: () => 'https://www.rti.org.tw/feeds/news.xml',
  },
  googlezh: {
    label: 'Google新闻(中文)', flag: '🔍',
    getUrl: (config) => {
      if (config.keywords) return 'https://news.google.com/rss/search?q=' + encodeURIComponent(config.keywords) + '&hl=zh-TW&gl=TW&ceid=TW:zh-Hant';
      const catMap = { world:'WORLD', business:'BUSINESS', technology:'TECHNOLOGY', entertainment:'ENTERTAINMENT', sports:'SPORTS', science:'SCIENCE', health:'HEALTH' };
      const cat = catMap[config.category];
      if (cat) return 'https://news.google.com/rss/headlines/section/topic/' + cat + '?hl=zh-TW&gl=TW&ceid=TW:zh-Hant';
      return 'https://news.google.com/rss?hl=zh-TW&gl=TW&ceid=TW:zh-Hant';
    },
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
// 新闻获取
// ============================================================
async function fetchFromSource(sourceKey, config) {
  const source = NEWS_SOURCES[sourceKey];
  if (!source) return [];
  try {
    const url = source.getUrl(config);
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)' },
      signal: AbortSignal.timeout(10000),
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
    const title = cleanTitle(decodeHtml(extract(block, 'title')));
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
  const results = await Promise.allSettled(sources.map(s => fetchFromSource(s, config)));
  const buckets = results.filter(r => r.status === 'fulfilled').map(r => r.value);
  const allItems = [];
  const seen = new Set();
  let added = true;
  while (added && allItems.length < config.maxItems) {
    added = false;
    for (const bucket of buckets) {
      if (allItems.length >= config.maxItems) break;
      while (bucket.length > 0) {
        const item = bucket.shift();
        const key = item.title.slice(0, 20);
        if (seen.has(key)) continue;
        seen.add(key);
        allItems.push(item);
        added = true;
        break;
      }
    }
  }
  return allItems;
}

function extract(xml, tag) {
  const m = xml.match(new RegExp('<' + tag + '[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/' + tag + '>|<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>'));
  return m ? (m[1] || m[2] || '').trim() : '';
}

function decodeHtml(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)));
}

// 清理标题：去除残留 HTML 标签、多余空白
function cleanTitle(str) {
  return str
    .replace(/<[^>]*>/g, '')   // 去除所有 HTML 标签（包括 CDATA 残留）
    .replace(/\s+/g, ' ')
    .trim();
}

// 转义 Telegram HTML 模式中的特殊字符（仅用于正文文字，非链接）
function escapeTg(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================================
// AI 摘要
// ============================================================
async function summarizeWithAI(env, items, config) {
  if (!env.AI) return null;
  try {
    const catLabel = CATEGORIES[config.category] || '综合';
    const newsList = items.map((item, i) => (i + 1) + '. ' + item.title).join('\n');
    const prompt = '你是专业新闻编辑。以下是今日' + catLabel + '新闻标题，请：\n1. 提炼 3-5 个最重要要点，每点 1-2 句，简洁专业\n2. 最后一句给出今日趋势或值得关注的信号\n\n' + newsList + '\n\n直接输出摘要，不要前缀。';
    const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
    });
    return response?.choices?.[0]?.message?.content?.trim() || null;
  } catch (e) {
    console.error('摘要失败:', e.message);
    return null;
  }
}

// ============================================================
// Telegram 推送
// ============================================================
async function sendToTelegram(env, message) {
  const token = env.TG_TOKEN, chatId = env.TG_CHAT_ID;
  if (!token || !chatId) throw new Error('未配置 TG_TOKEN 或 TG_CHAT_ID');
  const resp = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML', disable_web_page_preview: true }),
  });
  const data = await resp.json();
  if (!data.ok) throw new Error('TG 推送失败: ' + data.description);
  return data;
}

async function buildAndSend(env, config) {
  const items = await fetchAllNews(config);
  if (items.length === 0) throw new Error('没有获取到新闻，请检查网络或新闻源配置');

  const catLabel = CATEGORIES[config.category] || '综合新闻';
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

  let msg = '📰 <b>中文新闻 Hub</b>\n';
  msg += '🗂 ' + escapeTg(catLabel) + ' | 🕐 ' + escapeTg(now) + '\n';

  if (config.aiSummary !== false) {
    const summary = await summarizeWithAI(env, items, config);
    if (summary) {
      msg += '\n━━━━━ 🤖 AI 今日摘要 ━━━━━\n\n' + escapeTg(summary) + '\n';
    }
  }

  msg += '\n━━━━━ 📎 原文链接 ━━━━━\n\n';

  const grouped = {};
  items.forEach(item => {
    if (!grouped[item.source]) grouped[item.source] = { flag: item.flag, items: [] };
    grouped[item.source].items.push(item);
  });

  let idx = 1;
  for (const [src, group] of Object.entries(grouped)) {
    msg += group.flag + ' <b>' + escapeTg(src) + '</b>\n';
    group.items.forEach(item => {
      // 标题转义，链接不转义
      msg += idx + '. <a href="' + item.link + '">' + escapeTg(item.title) + '</a>\n';
      idx++;
    });
    msg += '\n';
  }
  msg += '━━━━━━━━━━━━━━━━━━━━\n共 ' + items.length + ' 条';

  await sendToTelegram(env, msg);
  return items.length;
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
  await buildAndSend(env, config);
  await env.NEWS_CONFIG.put('lastRun', today);
}

async function handleTestPush(env) {
  try {
    const config = await getConfig(env);
    const count = await buildAndSend(env, config);
    return Response.json({ success: true, message: '推送成功！共发送 ' + count + ' 条新闻' });
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
function buildClientScript() {
  var lines = [];
  lines.push("document.getElementById('enabled').addEventListener('change', function() {");
  lines.push("  document.getElementById('enabledLabel').textContent = this.checked ? '\u5df2\u542f\u7528' : '\u5df2\u505c\u7528';");
  lines.push("});");
  lines.push("document.getElementById('aiSummary').addEventListener('change', function() {");
  lines.push("  document.getElementById('aiSummaryLabel').textContent = this.checked ? '\u5df2\u542f\u7528' : '\u5df2\u505c\u7528';");
  lines.push("});");
  lines.push("function showAlert(msg, type) {");
  lines.push("  var el = document.getElementById('alert');");
  lines.push("  el.className = 'alert alert-' + type;");
  lines.push("  el.textContent = msg;");
  lines.push("  el.style.display = 'block';");
  lines.push("  setTimeout(function(){ el.style.display = 'none'; }, 8000);");
  lines.push("}");
  lines.push("function getSelectedSources() {");
  lines.push("  return Array.from(document.querySelectorAll('input[name=sources]:checked')).map(function(el){ return el.value; });");
  lines.push("}");
  lines.push("window.saveConfig = async function() {");
  lines.push("  var config = {");
  lines.push("    language: document.getElementById('language').value,");
  lines.push("    region: document.getElementById('region').value,");
  lines.push("    category: document.getElementById('category').value,");
  lines.push("    keywords: document.getElementById('keywords').value,");
  lines.push("    excludeKeywords: document.getElementById('excludeKeywords').value,");
  lines.push("    maxItems: parseInt(document.getElementById('maxItems').value),");
  lines.push("    pushHour: document.getElementById('pushHour').value,");
  lines.push("    enabled: document.getElementById('enabled').checked,");
  lines.push("    aiSummary: document.getElementById('aiSummary').checked,");
  lines.push("    sources: getSelectedSources(),");
  lines.push("  };");
  lines.push("  var resp = await fetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });");
  lines.push("  var data = await resp.json();");
  lines.push("  showAlert(data.message, data.success ? 'success' : 'error');");
  lines.push("};");
  lines.push("window.testPush = async function() {");
  lines.push("  showAlert('\u6b63\u5728\u6293\u53d6\u5e76\u751f\u6210\u6458\u8981\uff0c\u8bf7\u7a0d\u5019\uff0810-20\u79d2\uff09...', 'success');");
  lines.push("  var resp = await fetch('/api/test', { method: 'POST' });");
  lines.push("  var data = await resp.json();");
  lines.push("  showAlert(data.message, data.success ? 'success' : 'error');");
  lines.push("};");
  lines.push("window.previewNews = async function() {");
  lines.push("  var card = document.getElementById('previewCard');");
  lines.push("  var list = document.getElementById('previewList');");
  lines.push("  card.style.display = 'block';");
  lines.push("  list.innerHTML = '<p style=\"color:#94a3b8\">\u6b63\u5728\u6293\u53d6\u65b0\u95fb\uff0c\u8bf7\u7a0d\u5019...</p>';");
  lines.push("  var resp = await fetch('/api/preview');");
  lines.push("  var data = await resp.json();");
  lines.push("  if (!data.success) { list.innerHTML = '<p style=\"color:#f87171\">' + data.message + '</p>'; return; }");
  lines.push("  if (!data.items || data.items.length === 0) { list.innerHTML = '<p style=\"color:#94a3b8\">\u6ca1\u6709\u83b7\u53d6\u5230\u65b0\u95fb</p>'; return; }");
  lines.push("  var html = '';");
  lines.push("  if (data.summary) {");
  lines.push("    html += '<div class=\"ai-summary\"><div class=\"ai-label\">AI \u4eca\u65e5\u6458\u8981</div>' + data.summary.split('\\n').join('<br>') + '</div>';");
  lines.push("  }");
  lines.push("  html += data.items.map(function(item, i) {");
  lines.push("    return '<div class=\"preview-item\">' +");
  lines.push("      '<span class=\"src-tag\">' + item.flag + ' ' + item.source + '</span>' +");
  lines.push("      '<a href=\"' + item.link + '\" target=\"_blank\">' + (i + 1) + '. ' + item.title + '</a>' +");
  lines.push("      '</div>';");
  lines.push("  }).join('');");
  lines.push("  list.innerHTML = html;");
  lines.push("};");
  return lines.join('\n');
}

function renderHTML(config) {
  const langOptions = [['zh-CN','简体中文'],['zh-TW','繁體中文']].map(function(e) {
    return '<option value="' + e[0] + '"' + (config.language === e[0] ? ' selected' : '') + '>' + e[1] + '</option>';
  }).join('');
  const regionOptions = ['CN','TW','HK'].map(function(r) {
    return '<option value="' + r + '"' + (config.region === r ? ' selected' : '') + '>' + r + '</option>';
  }).join('');
  const catOptions = Object.entries(CATEGORIES).map(function(e) {
    return '<option value="' + e[0] + '"' + (config.category === e[0] ? ' selected' : '') + '>' + e[1] + '</option>';
  }).join('');
  const hourOptions = Array.from({length:24}, function(_, i) {
    return '<option value="' + i + '"' + (String(config.pushHour) === String(i) ? ' selected' : '') + '>' + String(i).padStart(2,'0') + ':00</option>';
  }).join('');
  const sourcesChecked = config.sources || DEFAULT_CONFIG.sources;
  const sourceCheckboxes = Object.entries(NEWS_SOURCES).map(function(e) {
    const key = e[0], src = e[1];
    return '<label class="src-label"><input type="checkbox" name="sources" value="' + key + '"' + (sourcesChecked.includes(key) ? ' checked' : '') + '><span>' + src.flag + ' ' + src.label + '</span></label>';
  }).join('');

  const enabledChecked = config.enabled ? ' checked' : '';
  const enabledLabel = config.enabled ? '已启用' : '已停用';
  const aiChecked = config.aiSummary !== false ? ' checked' : '';
  const aiLabel = config.aiSummary !== false ? '已启用' : '已停用';

  const css = [
    '*{box-sizing:border-box;margin:0;padding:0}',
    'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh}',
    '.header{background:linear-gradient(135deg,#1e40af,#7c3aed);padding:24px 32px;display:flex;align-items:center;gap:16px}',
    '.header h1{font-size:24px;font-weight:700;color:white}',
    '.container{max-width:820px;margin:32px auto;padding:0 16px}',
    '.card{background:#1e293b;border-radius:12px;padding:24px;margin-bottom:20px;border:1px solid #334155}',
    '.card h2{font-size:14px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:20px}',
    '.form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}',
    '.form-group{margin-bottom:16px}',
    '.form-group label{display:block;font-size:14px;color:#94a3b8;margin-bottom:6px}',
    'select,input[type=text],input[type=number]{width:100%;padding:10px 14px;background:#0f172a;border:1px solid #334155;border-radius:8px;color:#e2e8f0;font-size:14px;outline:none;transition:border-color .2s}',
    'select:focus,input:focus{border-color:#3b82f6}',
    '.src-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-top:4px}',
    '.src-label{display:flex;align-items:center;gap:8px;padding:10px 14px;background:#0f172a;border:1px solid #334155;border-radius:8px;cursor:pointer;transition:border-color .2s;font-size:14px}',
    '.src-label:hover{border-color:#3b82f6}',
    '.src-label input{width:16px;height:16px;accent-color:#3b82f6;flex-shrink:0}',
    '.toggle{display:flex;align-items:center;gap:12px;margin-top:8px}',
    '.toggle input[type=checkbox]{width:40px;height:22px;appearance:none;background:#334155;border-radius:11px;position:relative;cursor:pointer;transition:background .2s}',
    '.toggle input[type=checkbox]:checked{background:#3b82f6}',
    '.toggle input[type=checkbox]::after{content:"";width:18px;height:18px;background:white;border-radius:50%;position:absolute;top:2px;left:2px;transition:left .2s}',
    '.toggle input[type=checkbox]:checked::after{left:20px}',
    '.btn{padding:10px 20px;border-radius:8px;border:none;cursor:pointer;font-size:14px;font-weight:600;transition:all .2s}',
    '.btn-primary{background:#3b82f6;color:white}.btn-primary:hover{background:#2563eb}',
    '.btn-success{background:#10b981;color:white}.btn-success:hover{background:#059669}',
    '.btn-secondary{background:#334155;color:#e2e8f0}.btn-secondary:hover{background:#475569}',
    '.btn-group{display:flex;gap:12px;flex-wrap:wrap}',
    '.alert{padding:12px 16px;border-radius:8px;font-size:14px;margin-top:16px;display:none}',
    '.alert-success{background:#064e3b;color:#6ee7b7;border:1px solid #10b981}',
    '.alert-error{background:#450a0a;color:#fca5a5;border:1px solid #ef4444}',
    '.ai-summary{background:#1e1b4b;border:1px solid #4338ca;border-radius:8px;padding:16px;margin-bottom:16px;font-size:14px;line-height:1.8;color:#c7d2fe}',
    '.ai-label{font-size:12px;color:#818cf8;margin-bottom:8px;font-weight:600}',
    '.preview-item{padding:12px;background:#0f172a;border-radius:8px;margin-bottom:8px;border-left:3px solid #3b82f6}',
    '.preview-item a{color:#60a5fa;text-decoration:none;font-size:14px;line-height:1.5}',
    '.src-tag{display:inline-block;padding:2px 8px;border-radius:4px;background:#1e3a5f;color:#60a5fa;font-size:11px;margin-right:6px;margin-bottom:4px}',
    '@media(max-width:600px){.form-row{grid-template-columns:1fr}}',
  ].join('\n');

  return [
    '<!DOCTYPE html>',
    '<html lang="zh-CN">',
    '<head>',
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1.0">',
    '<title>中文新闻 Hub</title>',
    '<style>', css, '</style>',
    '</head>',
    '<body>',
    '<div class="header">',
    '  <span style="font-size:32px">📰</span>',
    '  <div>',
    '    <h1>中文新闻 Hub</h1>',
    '    <p style="color:#93c5fd;font-size:13px;margin-top:4px">港台·海外华文媒体聚合 · AI 摘要 · Telegram 推送</p>',
    '  </div>',
    '</div>',
    '<div class="container">',
    '  <div class="card">',
    '    <h2>📡 新闻来源</h2>',
    '    <p style="font-size:12px;color:#64748b;margin-bottom:12px">🇭🇰 香港：香港01、明报、南华早报(中)　🇹🇼 台湾：自由时报、联合新闻网、中央社、中央广播电台　🌏 海外：自由亚洲电台、美国之音、BBC中文、端传媒、德国之声中文</p>',
    '    <div class="src-grid">' + sourceCheckboxes + '</div>',
    '  </div>',
    '  <div class="card">',
    '    <h2>⚙️ 基本设置</h2>',
    '    <div class="form-row">',
    '      <div class="form-group"><label>语言</label><select id="language">' + langOptions + '</select></div>',
    '      <div class="form-group"><label>地区</label><select id="region">' + regionOptions + '</select></div>',
    '    </div>',
    '    <div class="form-row">',
    '      <div class="form-group"><label>新闻分类</label><select id="category">' + catOptions + '</select></div>',
    '      <div class="form-group"><label>每次推送条数</label><input type="number" id="maxItems" value="' + config.maxItems + '" min="1" max="50"></div>',
    '    </div>',
    '  </div>',
    '  <div class="card">',
    '    <h2>🔍 关键词过滤</h2>',
    '    <div class="form-group"><label>包含关键词（逗号分隔，留空不过滤）</label><input type="text" id="keywords" value="' + config.keywords + '" placeholder="例如: 经济,科技"></div>',
    '    <div class="form-group"><label>排除关键词</label><input type="text" id="excludeKeywords" value="' + config.excludeKeywords + '" placeholder="例如: 广告,推广"></div>',
    '  </div>',
    '  <div class="card">',
    '    <h2>📨 推送设置</h2>',
    '    <div class="form-row">',
    '      <div class="form-group"><label>每日推送时间（北京时间）</label><select id="pushHour">' + hourOptions + '</select></div>',
    '      <div class="form-group">',
    '        <label>推送状态</label>',
    '        <div class="toggle"><input type="checkbox" id="enabled"' + enabledChecked + '><label for="enabled" id="enabledLabel">' + enabledLabel + '</label></div>',
    '      </div>',
    '    </div>',
    '    <div class="form-group">',
    '      <label>AI 摘要</label>',
    '      <div class="toggle"><input type="checkbox" id="aiSummary"' + aiChecked + '><label for="aiSummary" id="aiSummaryLabel">' + aiLabel + '</label></div>',
    '    </div>',
    '  </div>',
    '  <div class="card">',
    '    <h2>🎮 操作</h2>',
    '    <div class="btn-group">',
    '      <button class="btn btn-primary" onclick="saveConfig()">💾 保存配置</button>',
    '      <button class="btn btn-success" onclick="testPush()">📤 立即测试推送</button>',
    '      <button class="btn btn-secondary" onclick="previewNews()">👁 预览新闻</button>',
    '    </div>',
    '    <div id="alert" class="alert"></div>',
    '  </div>',
    '  <div class="card" id="previewCard" style="display:none">',
    '    <h2>📋 新闻预览</h2>',
    '    <div id="previewList"></div>',
    '  </div>',
    '</div>',
    '<script>',
    buildClientScript(),
    '</script>',
    '</body>',
    '</html>',
  ].join('\n');
}
