// ============================================================
// Cloudflare News Hub - 单文件 Worker (含 AI 摘要 + 中文翻译)
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
  sources: ['google', 'bbc', 'bloomberg', 'guardian', 'dw'],
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
// 新闻源（仅保留稳定可用的 RSS 地址）
// ============================================================
const NEWS_SOURCES = {
  google: {
    label: 'Google News', flag: '🔍',
    getUrl: (config) => {
      const hl = config.language, gl = config.region;
      if (config.keywords) return 'https://news.google.com/rss/search?q=' + encodeURIComponent(config.keywords) + '&hl=' + hl + '&gl=' + gl + '&ceid=' + gl + ':' + hl;
      const catMap = { world:'WORLD', business:'BUSINESS', technology:'TECHNOLOGY', entertainment:'ENTERTAINMENT', sports:'SPORTS', science:'SCIENCE', health:'HEALTH' };
      const cat = catMap[config.category];
      if (cat) return 'https://news.google.com/rss/headlines/section/topic/' + cat + '?hl=' + hl + '&gl=' + gl + '&ceid=' + gl + ':' + hl;
      return 'https://news.google.com/rss?hl=' + hl + '&gl=' + gl + '&ceid=' + gl + ':' + hl;
    },
  },
  bbc: {
    label: 'BBC News', flag: '🇬🇧',
    getUrl: (config) => {
      const catMap = { world:'world', business:'business', technology:'technology', science:'science_and_environment', health:'health', sports:'sport', entertainment:'entertainment_and_arts' };
      return 'https://feeds.bbci.co.uk/news/' + (catMap[config.category] || 'world') + '/rss.xml';
    },
  },
  bloomberg: {
    label: '彭博社 Bloomberg', flag: '💹',
    getUrl: () => 'https://feeds.bloomberg.com/markets/news.rss',
  },
  guardian: {
    label: '卫报 The Guardian', flag: '🌐',
    getUrl: (config) => {
      const catMap = { world:'world', business:'business', technology:'technology', science:'science', health:'society', sports:'sport', entertainment:'culture' };
      return 'https://www.theguardian.com/' + (catMap[config.category] || 'world') + '/rss';
    },
  },
  dw: {
    label: '德国之声 DW', flag: '📻',
    getUrl: () => 'https://rss.dw.com/rdf/rss-en-all',
  },
  france24: {
    label: 'France 24', flag: '🇫🇷',
    getUrl: () => 'https://www.france24.com/en/rss',
  },
  aljazeera: {
    label: '半岛电视台 Al Jazeera', flag: '🌍',
    getUrl: () => 'https://www.aljazeera.com/xml/rss/all.xml',
  },
  nhk: {
    label: 'NHK World', flag: '🇯🇵',
    getUrl: () => 'https://www3.nhk.or.jp/rss/news/cat0.xml',
  },
  xinhua: {
    label: '新华社', flag: '🇨🇳',
    getUrl: () => 'https://feeds.feedburner.com/NewHuaNet-EnglishNews',
  },
  reuters: {
    label: '路透社 Reuters', flag: '📡',
    getUrl: () => 'https://feeds.reuters.com/reuters/topNews',
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
// 新闻获取 —— 修复：先抓足够多，再统一截取 maxItems 条
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
  // 每个源最多取 maxItems 条，保证有足够候选
  const results = await Promise.allSettled(sources.map(s => fetchFromSource(s, config)));
  const allItems = [];
  const seen = new Set();
  // 轮询每个源，依次各取一条，确保来源均衡且总数达标
  const buckets = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);
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
  return str.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
}

// 判断标题是否已经是中文（含中文字符比例 > 30%）
function isChinese(text) {
  const cjk = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  return cjk / text.length > 0.3;
}

// ============================================================
// Workers AI：批量翻译英文标题为中文
// ============================================================
async function translateTitles(env, items) {
  if (!env.AI) return items;
  // 只翻译非中文标题
  const toTranslate = items.filter(item => !isChinese(item.title));
  if (toTranslate.length === 0) return items;

  try {
    const numbered = toTranslate.map((item, i) => (i + 1) + '. ' + item.title).join('\n');
    const prompt = '请将以下新闻标题逐条翻译为简体中文，保持编号格式，只输出翻译结果，不要任何解释：\n\n' + numbered;
    const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    });
    const raw = response?.choices?.[0]?.message?.content?.trim() || '';
    const lines = raw.split('\n').filter(l => l.trim());
    // 把翻译结果映射回对应条目
    const translMap = {};
    lines.forEach(line => {
      const m = line.match(/^(\d+)[.、．]\s*(.+)/);
      if (m) translMap[parseInt(m[1])] = m[2].trim();
    });
    toTranslate.forEach((item, i) => {
      if (translMap[i + 1]) item.titleZh = translMap[i + 1];
    });
  } catch (e) {
    console.error('翻译失败:', e.message);
  }
  return items;
}

// ============================================================
// Workers AI 摘要
// ============================================================
async function summarizeWithAI(env, items, config) {
  if (!env.AI) return null;
  try {
    const catLabel = CATEGORIES[config.category] || '综合';
    // 用中文标题做摘要（若有翻译则用翻译版）
    const newsList = items.map((item, i) => (i + 1) + '. ' + (item.titleZh || item.title)).join('\n');
    const prompt = '你是一位专业的新闻编辑助手。以下是今日' + catLabel + '新闻标题，请：\n1. 用中文提炼 3-5 个最重要的新闻要点，每点 1-2 句话，简洁专业\n2. 最后一句给出今日整体趋势或值得关注的信号\n\n新闻列表：\n' + newsList + '\n\n直接输出摘要，不要前缀说明。';
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
  const resp = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML', disable_web_page_preview: true }),
  });
  const data = await resp.json();
  if (!data.ok) throw new Error('TG 推送失败: ' + data.description);
  return data;
}

async function formatMessage(items, config, env) {
  const catLabel = CATEGORIES[config.category] || '综合新闻';
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

  // 先翻译所有非中文标题
  items = await translateTitles(env, items);

  let msg = '📰 <b>Cloudflare News Hub</b>\n';
  msg += '🗂 ' + catLabel + ' | 🕐 ' + now + '\n';

  // AI 摘要
  if (config.aiSummary !== false) {
    const summary = await summarizeWithAI(env, items, config);
    if (summary) {
      msg += '\n━━━━━ 🤖 AI 今日摘要 ━━━━━\n\n';
      msg += summary + '\n';
    }
  }

  // 原文链接列表，标题显示中文
  msg += '\n━━━━━ 📎 原文链接 ━━━━━\n\n';
  const grouped = {};
  items.forEach(item => {
    if (!grouped[item.source]) grouped[item.source] = { flag: item.flag, items: [] };
    grouped[item.source].items.push(item);
  });
  let idx = 1;
  for (const [src, group] of Object.entries(grouped)) {
    msg += group.flag + ' <b>' + src + '</b>\n';
    group.items.forEach(item => {
      const displayTitle = item.titleZh || item.title;
      msg += idx + '. <a href="' + item.link + '">' + displayTitle + '</a>\n';
      idx++;
    });
    msg += '\n';
  }
  msg += '━━━━━━━━━━━━━━━━━━━━\n共 ' + items.length + ' 条';
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
    return Response.json({ success: true, message: '推送成功！共发送 ' + items.length + ' 条新闻' });
  } catch (e) { return Response.json({ success: false, message: e.message }, { status: 500 }); }
}

async function handlePreview(env) {
  try {
    const config = await getConfig(env);
    const items = await fetchAllNews(config);
    // 预览也做翻译
    const translatedItems = await translateTitles(env, items);
    let summary = null;
    if (config.aiSummary !== false) summary = await summarizeWithAI(env, translatedItems, config);
    // 预览返回带中文标题的数据
    const displayItems = translatedItems.map(item => ({
      ...item,
      title: item.titleZh || item.title,
    }));
    return Response.json({ success: true, items: displayItems, summary });
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
  lines.push("  setTimeout(function(){ el.style.display = 'none'; }, 6000);");
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
  lines.push("  showAlert('\u6b63\u5728\u7ffb\u8bd1\u5e76\u751f\u6210\u6458\u8981\uff0c\u8bf7\u7a0d\u5019\uff0820-30\u79d2\uff09...', 'success');");
  lines.push("  var resp = await fetch('/api/test', { method: 'POST' });");
  lines.push("  var data = await resp.json();");
  lines.push("  showAlert(data.message, data.success ? 'success' : 'error');");
  lines.push("};");
  lines.push("window.previewNews = async function() {");
  lines.push("  var card = document.getElementById('previewCard');");
  lines.push("  var list = document.getElementById('previewList');");
  lines.push("  card.style.display = 'block';");
  lines.push("  list.innerHTML = '<p style=\"color:#94a3b8\">\u6b63\u5728\u6293\u53d6\u5e76\u7ffb\u8bd1\u65b0\u95fb\uff0c\u8bf7\u7a0d\u5019...</p>';");
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
  const langOptions = Object.entries(LANGUAGES).map(function(e) {
    return '<option value="' + e[0] + '"' + (config.language === e[0] ? ' selected' : '') + '>' + e[1] + '</option>';
  }).join('');
  const regionOptions = ['CN','TW','HK','US','JP','KR','FR','DE'].map(function(r) {
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
    '<title>Cloudflare News Hub</title>',
    '<style>', css, '</style>',
    '</head>',
    '<body>',
    '<div class="header">',
    '  <span style="font-size:32px">📰</span>',
    '  <div>',
    '    <h1>Cloudflare News Hub</h1>',
    '    <p style="color:#93c5fd;font-size:13px;margin-top:4px">多源聚合 · AI翻译 · AI摘要 · Telegram推送</p>',
    '  </div>',
    '</div>',
    '<div class="container">',
    '  <div class="card">',
    '    <h2>📡 新闻来源</h2>',
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
    '    <div class="form-group"><label>包含关键词（逗号分隔，留空不过滤）</label><input type="text" id="keywords" value="' + config.keywords + '" placeholder="例如: AI,人工智能"></div>',
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
    '      <label>AI 摘要（含自动翻译）</label>',
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
    '    <h2>📋 新闻预览（中文）</h2>',
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
