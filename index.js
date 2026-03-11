// ============================================================
// Cloudflare News Hub - 中文媒体版 (侧边栏 + 新闻卡片)
// ============================================================

const DEFAULT_CONFIG = {
  category: 'general',
  keywords: '',
  excludeKeywords: '',
  maxItems: 20,
  pushHours: '8,12,16,20',
  enabled: true,
  aiSummary: true,
  sources: ['rfa', 'voachinese', 'bbc_chinese', 'bbc_trad', 'hk01', 'mingpao', 'orientaldaily', 'singtao', 'hkej', 'appledaily_tw', 'udn', 'cna', 'rti', 'storm', 'thenewslens', 'ettoday', 'setn', 'initium', 'dwnews', 'chosun', 'zaobao', 'duowei', 'googlezh'],
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

const NEWS_SOURCES = {
  hk01:        { label: '香港01',       flag: '🇭🇰', region: '香港' },
  mingpao:     { label: '明报',         flag: '🇭🇰', region: '香港' },
  orientaldaily:{ label: '东方日报',    flag: '🇭🇰', region: '香港' },
  appledaily_tw:{ label: '自由时报',    flag: '🇹🇼', region: '台湾' },
  udn:         { label: '联合新闻网',   flag: '🇹🇼', region: '台湾' },
  cna:         { label: '中央社',       flag: '🇹🇼', region: '台湾' },
  rti:         { label: '中央广播电台', flag: '🇹🇼', region: '台湾' },
  rfa:         { label: '自由亚洲电台', flag: '🌏', region: '海外' },
  voachinese:  { label: '美国之音中文', flag: '🇺🇸', region: '海外' },
  bbc_chinese: { label: 'BBC中文(简)',   flag: '🇬🇧', region: '海外' },
  bbc_trad:    { label: 'BBC中文(繁)',   flag: '🇬🇧', region: '海外' },
  initium:     { label: '端传媒',       flag: '🌐', region: '海外' },
  dwnews:      { label: '德国之声中文', flag: '🇩🇪', region: '海外' },
  googlezh:    { label: 'Google新闻',   flag: '🔍', region: '聚合' },
  chosun:      { label: '朝鲜日报中文', flag: '🇰🇷', region: '海外' },
  zaobao:      { label: '联合早报',     flag: '🇸🇬', region: '海外' },
  duowei:      { label: '多维新闻',     flag: '🌐', region: '海外' },
  singtao:     { label: '星岛日报',     flag: '🇭🇰', region: '香港' },
  hkej:        { label: '信报',         flag: '🇭🇰', region: '香港' },
  storm:       { label: '风传媒',       flag: '🇹🇼', region: '台湾' },
  thenewslens: { label: '关键评论网',   flag: '🇹🇼', region: '台湾' },
  ettoday:     { label: 'ETtoday',      flag: '🇹🇼', region: '台湾' },
  setn:        { label: '三立新闻',     flag: '🇹🇼', region: '台湾' },
};

function getSourceUrl(key, config) {
  const urls = {
    hk01:         'https://www.hk01.com/rss/世界專題',
    mingpao:      'https://news.mingpao.com/rss/pns/s00001.xml',
    orientaldaily:'https://orientaldaily.on.cc/rss/news.xml',
    appledaily_tw:'https://news.ltn.com.tw/rss/all.xml',
    udn:          'https://udn.com/rssfeed/news/2/6638?ch=news',
    cna:          'https://www.cna.com.tw/rss/aall.aspx',
    rti:          'https://www.rti.org.tw/feeds/news.xml',
    rfa:          'https://www.rfa.org/mandarin/rss2.xml',
    voachinese:   'https://www.voachinese.com/api/zepqeimovm',
    bbc_chinese:  'https://feeds.bbci.co.uk/zhongwen/simp/rss.xml',  // 简体
    bbc_trad:     'https://feeds.bbci.co.uk/zhongwen/trad/rss.xml',
    bbc_trad:     'https://feeds.bbci.co.uk/zhongwen/trad/rss.xml',
    initium:      'https://theinitium.com/feed',
    dwnews:       'https://rss.dw.com/rdf/rss-chi-all',
    chosun:       'https://cnnews.chosun.com/client/news/rss.asp',
    zaobao:       'https://www.zaobao.com.sg/rss/singapore',
    duowei:       'https://www.dwnews.com/rss/all',
    singtao:      'https://std.stheadline.com/rss/newsfeed.xml',
    hkej:         'https://www1.hkej.com/rss/index.xml',
    storm:        'https://www.storm.mg/rss',
    thenewslens:  'https://www.thenewslens.com/rss',
    ettoday:      'https://feeds.feedburner.com/ettoday/rss',
    setn:         'https://www.setn.com/rss.aspx',
    googlezh:     (() => {
      if (config.keywords) return 'https://news.google.com/rss/search?q=' + encodeURIComponent(config.keywords) + '&hl=zh-TW&gl=TW&ceid=TW:zh-Hant';
      const catMap = { world:'WORLD', business:'BUSINESS', technology:'TECHNOLOGY', entertainment:'ENTERTAINMENT', sports:'SPORTS', science:'SCIENCE', health:'HEALTH' };
      const cat = catMap[config.category];
      if (cat) return 'https://news.google.com/rss/headlines/section/topic/' + cat + '?hl=zh-TW&gl=TW&ceid=TW:zh-Hant';
      return 'https://news.google.com/rss?hl=zh-TW&gl=TW&ceid=TW:zh-Hant';
    })(),
  };
  return urls[key] || null;
}

// ============================================================
// 主入口
// ============================================================
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/config' && request.method === 'POST') return handleSaveConfig(request, env);
    if (url.pathname === '/api/config' && request.method === 'GET')  return handleGetConfig(env);
    if (url.pathname === '/api/test'   && request.method === 'POST') return handleTestPush(env);
    if (url.pathname === '/api/news'   && request.method === 'GET')  return handleNews(env);
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
  const src = NEWS_SOURCES[sourceKey];
  if (!src) return [];
  try {
    const url = getSourceUrl(sourceKey, config);
    if (!url) return [];
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)' },
      signal: AbortSignal.timeout(10000),
    });
    if (!resp.ok) return [];
    const xml = await resp.text();
    return parseRss(xml, src.label, src.flag, config, config._maxAgeDays || 7);
  } catch { return []; }
}

function parseRss(xml, sourceName, sourceFlag, config, maxAgeDays) {
  const items = [];
  const now = Date.now();
  const maxMs = (maxAgeDays || 7) * 24 * 60 * 60 * 1000;
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = cleanText(decodeHtml(extract(block, 'title')));
    const link  = extract(block, 'link') || extract(block, 'guid');
    const desc  = cleanText(decodeHtml(extract(block, 'description')));
    const pubDate = extract(block, 'pubDate');
    if (!title || title.length < 5) continue;
    // 时间过滤：有日期的过滤掉超期内容
    if (pubDate) {
      try {
        // 兼容多种日期格式
        let ts = new Date(pubDate).getTime();
        // 如果解析失败尝试修正时区写法 e.g. "+0800" -> "+08:00"
        if (isNaN(ts)) {
          const fixed = pubDate.replace(/([\+\-])(\d{2})(\d{2})$/, '$1$2:$3');
          ts = new Date(fixed).getTime();
        }
        if (!isNaN(ts)) {
          const age = now - ts;
          if (age > maxMs || age < -3600000) continue; // 允许1小时误差
        }
        // 无法解析的日期不过滤
      } catch(e) {}
    }
    if (config.keywords) {
      const kws = config.keywords.split(/[,，\s]+/).filter(Boolean);
      if (!kws.some(k => title.includes(k))) continue;
    }
    if (config.excludeKeywords) {
      const exkws = config.excludeKeywords.split(/[,，\s]+/).filter(Boolean);
      if (exkws.some(k => title.includes(k))) continue;
    }
    items.push({ title, link, desc: desc.slice(0, 120), source: sourceName, flag: sourceFlag, pubDate });
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
  // 按发布时间降序排列，无时间的排最后
  allItems.sort(function(a, b) {
    var ta = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    var tb = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return tb - ta;
  });
  return allItems;
}

function extract(xml, tag) {
  const m = xml.match(new RegExp('<' + tag + '[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/' + tag + '>|<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>'));
  return m ? (m[1] || m[2] || '').trim() : '';
}
function decodeHtml(str) {
  return str.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ').replace(/&#(\d+);/g,(_,c)=>String.fromCharCode(parseInt(c)));
}
function cleanText(str) {
  return str
    .replace(/<[^>]*>/g, '')          // 去除 HTML 标签
    .replace(/[\u2610-\u2612\u2614-\u26FF\u2702-\u27B0]/g, '') // 去除杂项符号(☒☐☑等)
    .replace(/\s+/g, ' ')
    .trim();
}
function escapeTg(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ============================================================
// AI 摘要
// ============================================================
async function summarizeWithAI(env, items, config) {
  if (!env.AI) return null;
  try {
    const catLabel = CATEGORIES[config.category] || '综合';
    const newsList = items.map((item, i) => (i+1) + '. ' + item.title).join('\n');
    const prompt = '你是专业新闻编辑。以下是今日' + catLabel + '新闻标题，请：\n1. 提炼 3-5 个最重要要点，每点 1-2 句，简洁专业\n2. 最后一句给出今日趋势或值得关注的信号\n\n' + newsList + '\n\n直接输出摘要，不要前缀。';
    const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
    });
    return response?.choices?.[0]?.message?.content?.trim() || null;
  } catch { return null; }
}

// ============================================================
// API: 新闻 + 摘要
// ============================================================
async function handleNews(env) {
  try {
    const config = await getConfig(env);
    const webConfig = { ...config, maxItems: 60, keywords: '', excludeKeywords: '' };
    const items = await fetchAllNews(webConfig);

    // AI摘要缓存：同一小时内只生成一次，节省 Workers AI 额度
    let summary = null;
    if (config.aiSummary !== false) {
      const cacheKey = 'summary_cache_' + config.category + '_' + new Date().toISOString().slice(0, 13); // 精确到小时
      try {
        const cached = await env.NEWS_CONFIG.get(cacheKey);
        if (cached) {
          summary = cached;
        } else {
          summary = await summarizeWithAI(env, items, config);
          if (summary) {
            await env.NEWS_CONFIG.put(cacheKey, summary, { expirationTtl: 86400 }); // 保留24小时后自动删除，key按小时区分
          }
        }
      } catch (e) {
        // 缓存读写失败则直接生成
        summary = await summarizeWithAI(env, items, config);
      }
    }

    return Response.json({ success: true, items, summary, category: CATEGORIES[config.category] || '综合新闻' });
  } catch (e) { return Response.json({ success: false, message: e.message }, { status: 500 }); }
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

async function buildTgMessage(env, config) {
  const tgConfig = { ...config, _maxAgeDays: 1 };
  const items = await fetchAllNews(tgConfig);
  if (items.length === 0) throw new Error('没有获取到新闻');
  const catLabel = CATEGORIES[config.category] || '综合新闻';
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  let msg = '📰 <b>中文新闻 Hub</b>\n🗂 ' + escapeTg(catLabel) + ' | 🕐 ' + escapeTg(now) + '\n';
  if (config.aiSummary !== false) {
    const summary = await summarizeWithAI(env, items, config);
    if (summary) msg += '\n━━━━━ 🤖 AI 今日摘要 ━━━━━\n\n' + escapeTg(summary) + '\n';
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
      msg += idx + '. <a href="' + item.link + '">' + escapeTg(item.title) + '</a>\n';
      idx++;
    });
    msg += '\n';
  }
  msg += '━━━━━━━━━━━━━━━━━━━━\n共 ' + items.length + ' 条';
  await sendToTelegram(env, msg);
  return items.length;
}

async function runNewsPush(env) {
  const config = await getConfig(env);
  if (!config.enabled) return;
  const now = new Date();
  const hour = parseInt(now.toLocaleString('en-US', { timeZone: 'Asia/Shanghai', hour: 'numeric', hour12: false }));
  // 支持多个推送时间，逗号分隔
  const pushHours = String(config.pushHours || config.pushHour || '8')
    .split(/[,，\s]+/).map(h => parseInt(h.trim())).filter(h => !isNaN(h));
  if (!pushHours.includes(hour)) return;
  // 用 小时 作为当天推送标记，避免同一小时重复推送
  const today = now.toISOString().slice(0, 10);
  const runKey = 'lastRun_' + today + '_' + hour;
  const lastRun = await env.NEWS_CONFIG.get(runKey);
  if (lastRun) return;
  await buildTgMessage(env, config);
  await env.NEWS_CONFIG.put(runKey, '1');
}

async function handleTestPush(env) {
  try {
    const config = await getConfig(env);
    const count = await buildTgMessage(env, config);
    return Response.json({ success: true, message: '推送成功！共发送 ' + count + ' 条新闻' });
  } catch (e) { return Response.json({ success: false, message: e.message }, { status: 500 }); }
}

// ============================================================
// 前端 HTML
// ============================================================
function buildScript() {
  return `
var currentCategory = 'general';
var sidebarOpen = window.innerWidth > 900;

var CATEGORIES = {
  general:'综合新闻', world:'国际', business:'财经',
  technology:'科技', entertainment:'娱乐', sports:'体育',
  science:'科学', health:'健康'
};

var SOURCE_LIST = {
  hk01:{label:'香港01',flag:'🇭🇰',region:'香港'},
  mingpao:{label:'明报',flag:'🇭🇰',region:'香港'},
  orientaldaily:{label:'东方日报',flag:'🇭🇰',region:'香港'},
  appledaily_tw:{label:'自由时报',flag:'🇹🇼',region:'台湾'},
  udn:{label:'联合新闻网',flag:'🇹🇼',region:'台湾'},
  cna:{label:'中央社',flag:'🇹🇼',region:'台湾'},
  rti:{label:'中央广播电台',flag:'🇹🇼',region:'台湾'},
  rfa:{label:'自由亚洲电台',flag:'🌏',region:'海外'},
  voachinese:{label:'美国之音中文',flag:'🇺🇸',region:'海外'},
  bbc_chinese:{label:'BBC中文(简)',flag:'🇬🇧',region:'海外'},
  bbc_trad:{label:'BBC中文(繁)',flag:'🇬🇧',region:'海外'},
  initium:{label:'端传媒',flag:'🌐',region:'海外'},
  dwnews:{label:'德国之声中文',flag:'🇩🇪',region:'海外'},
  googlezh:{label:'Google新闻',flag:'🔍',region:'聚合'},
  chosun:{label:'朝鲜日报中文',flag:'🇰🇷',region:'海外'},
  zaobao:{label:'联合早报',flag:'🇸🇬',region:'海外'},
  duowei:{label:'多维新闻',flag:'🌐',region:'海外'},
  singtao:{label:'星岛日报',flag:'🇭🇰',region:'香港'},
  hkej:{label:'信报',flag:'🇭🇰',region:'香港'},
  storm:{label:'风传媒',flag:'🇹🇼',region:'台湾'},
  thenewslens:{label:'关键评论网',flag:'🇹🇼',region:'台湾'},
  ettoday:{label:'ETtoday',flag:'🇹🇼',region:'台湾'},
  setn:{label:'三立新闻',flag:'🇹🇼',region:'台湾'},
};

var config = {};

async function loadConfig() {
  var r = await fetch('/api/config');
  config = await r.json();
  applyConfigToUI();
}

function applyConfigToUI() {
  document.getElementById('cat-select').value = config.category || 'general';
  document.getElementById('kw-input').value = config.keywords || '';
  document.getElementById('exkw-input').value = config.excludeKeywords || '';
  document.getElementById('max-input').value = config.maxItems || 20;
  document.getElementById('hour-input').value = config.pushHours || config.pushHour || '8,12,16,20';
  document.getElementById('enabled-toggle').checked = config.enabled !== false;
  document.getElementById('ai-toggle').checked = config.aiSummary !== false;
  currentCategory = config.category || 'general';
  renderSourceGrid(config.sources || []);
  updateNavActive();
}

function renderSourceGrid(selected) {
  var regions = {};
  Object.entries(SOURCE_LIST).forEach(function(e) {
    var k = e[0], v = e[1];
    if (!regions[v.region]) regions[v.region] = [];
    regions[v.region].push({key:k, ...v});
  });
  var html = '';
  Object.entries(regions).forEach(function(e) {
    html += '<div class="src-region-label">' + e[0] + '</div>';
    e[1].forEach(function(src) {
      var checked = selected.includes(src.key) ? 'checked' : '';
      html += '<label class="src-item ' + (checked?'active':'') + '">';
      html += '<input type="checkbox" value="' + src.key + '" ' + checked + ' onchange="toggleSrc(this)">';
      html += '<span>' + src.flag + ' ' + src.label + '</span></label>';
    });
  });
  document.getElementById('src-grid').innerHTML = html;
}

function toggleSrc(el) {
  el.parentElement.classList.toggle('active', el.checked);
}

function updateNavActive() {
  document.querySelectorAll('.nav-item').forEach(function(el) {
    el.classList.toggle('active', el.dataset.cat === currentCategory);
  });
}

function selectCategory(cat) {
  currentCategory = cat;
  config.category = cat;
  updateNavActive();
  loadNews();
}

async function saveConfig() {
  var sources = Array.from(document.querySelectorAll('#src-grid input:checked')).map(function(el){return el.value;});
  var newConf = {
    category: document.getElementById('cat-select').value,
    keywords: document.getElementById('kw-input').value,
    excludeKeywords: document.getElementById('exkw-input').value,
    maxItems: parseInt(document.getElementById('max-input').value) || 20,
    pushHours: document.getElementById('hour-input').value,
    enabled: document.getElementById('enabled-toggle').checked,
    aiSummary: document.getElementById('ai-toggle').checked,
    sources: sources,
  };
  config = newConf;
  currentCategory = newConf.category;
  updateNavActive();
  var r = await fetch('/api/config', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(newConf)});
  var d = await r.json();
  showToast(d.message, d.success ? 'success' : 'error');
  loadNews();
}

async function testPush() {
  showToast('正在推送，请稍候...', 'info');
  var r = await fetch('/api/test', {method:'POST'});
  var d = await r.json();
  showToast(d.message, d.success ? 'success' : 'error');
}

async function loadNews() {
  var area = document.getElementById('news-area');
  area.innerHTML = '<div class="loading"><div class="spinner"></div><p>正在抓取新闻...</p></div>';
  try {
    var r = await fetch('/api/news');
    var d = await r.json();
    if (!d.success) { area.innerHTML = '<div class="error-msg">获取失败：' + d.message + '</div>'; return; }
    renderNews(d);
  } catch(e) {
    area.innerHTML = '<div class="error-msg">网络错误，请刷新重试</div>';
  }
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  try {
    var diff = Date.now() - new Date(dateStr).getTime();
    var m = Math.floor(diff/60000);
    if (m < 1) return '刚刚';
    if (m < 60) return m + '分钟前';
    var h = Math.floor(m/60);
    if (h < 24) return h + '小时前';
    return Math.floor(h/24) + '天前';
  } catch(e) { return ''; }
}

function renderNews(data) {
  var area = document.getElementById('news-area');
  var catTitle = data.category || '综合新闻';
  var html = '';

  // 页面标题栏
  html += '<div class="news-header">';
  html += '<h1 class="news-title">📰 ' + catTitle + '</h1>';
  html += '<span class="news-count">' + data.items.length + ' 条新闻</span>';
  html += '</div>';

  // AI 摘要卡片
  if (data.summary) {
    html += '<div class="summary-card">';
    html += '<div class="summary-header"><span class="ai-badge">🤖 AI 摘要</span></div>';
    html += '<div class="summary-body">' + data.summary.replace(/\\n/g,'<br>') + '</div>';
    html += '</div>';
  }

  // 新闻卡片网格
  html += '<div class="news-grid">';
  data.items.forEach(function(item, i) {
    var ago = timeAgo(item.pubDate);
    html += '<a class="news-card" href="' + item.link + '" target="_blank">';
    html += '<div class="card-left">';
    html += '<span class="card-source">' + item.flag + ' ' + item.source + '</span>';
    if (ago) html += '<span class="card-time">' + ago + '</span>';
    html += '</div>';
    html += '<div class="card-body">';
    html += '<div class="card-title">' + item.title + '</div>';
    if (item.desc) html += '<div class="card-desc">' + item.desc + '</div>';
    html += '</div>';
    html += '</a>';
  });
  html += '</div>';

  area.innerHTML = html;
}

function showToast(msg, type) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + (type||'info');
  setTimeout(function(){ t.className = 'toast'; }, 4000);
}

window.toggleSidebar = function() {
  sidebarOpen = !sidebarOpen;
  document.getElementById('sidebar').classList.toggle('open', sidebarOpen);
  document.getElementById('overlay').classList.toggle('show', sidebarOpen && window.innerWidth <= 900);
};
window.selectCategory = selectCategory;
window.saveConfig = saveConfig;
window.testPush = testPush;

document.addEventListener('DOMContentLoaded', function() {
  loadConfig().then(function(){ loadNews(); });
  document.getElementById('overlay').addEventListener('click', function(){
    if(window.innerWidth <= 900) {
      sidebarOpen = false;
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('overlay').classList.remove('show');
    }
  });
});

// ── 时钟 ──
function lunarDate(date) {
  // 农历干支速查（1900-2100简化算法）
  var lunarMonths = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
  var lunarDays = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
    '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
    '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
  var heavenly = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  var earthly  = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  var animals  = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
  // 基准：1900年1月31日为农历正月初一（庚子年）
  var baseDate = new Date(1900, 0, 31);
  var offset = Math.floor((date - baseDate) / 86400000);
  // 简化：用平均农历月29.5306天估算
  var totalDays = offset;
  var lunarYear = 1900;
  // 粗算年
  var approxYear = Math.floor(totalDays / 365.25) + 1900;
  // 干支
  var yearOffset = approxYear - 1900;
  var stem = heavenly[((yearOffset % 10) + 10) % 10];
  var branch = earthly[((yearOffset % 12) + 12) % 12];
  var animal = animals[((yearOffset % 12) + 12) % 12];
  // 粗算月日（用近似值展示，满足日常需求）
  var dayInYear = totalDays % 354;
  var month = Math.min(11, Math.floor(dayInYear / 29.5));
  var day = Math.min(29, Math.floor(dayInYear % 29.5));
  return stem + branch + '年（' + animal + '年）' + lunarMonths[month] + '月' + lunarDays[day];
}

function updateClock() {
  var now = new Date();
  var h = String(now.getHours()).padStart(2,'0');
  var m = String(now.getMinutes()).padStart(2,'0');
  var s = String(now.getSeconds()).padStart(2,'0');
  var weeks = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
  var y = now.getFullYear();
  var mo = String(now.getMonth()+1).padStart(2,'0');
  var d = String(now.getDate()).padStart(2,'0');
  var timeEl = document.getElementById('clock-time');
  var dateEl = document.getElementById('clock-date');
  var weekEl = document.getElementById('clock-week');
  var lunarEl = document.getElementById('clock-lunar');
  if (timeEl) timeEl.textContent = h + ':' + m + ':' + s;
  if (dateEl) dateEl.textContent = y + '年' + mo + '月' + d + '日';
  if (weekEl) weekEl.textContent = weeks[now.getDay()];
  if (lunarEl) lunarEl.textContent = '农历 ' + lunarDate(now);
}
updateClock();
setInterval(updateClock, 1000);

// ── 深色/浅色模式 ──
function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  var btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = dark ? '☀️' : '🌙';
}

function toggleTheme() {
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  var newDark = !isDark;
  localStorage.setItem('theme', newDark ? 'dark' : 'light');
  applyTheme(newDark);
}

function initTheme() {
  // 优先用用户手动选择，否则跟随系统
  var saved = localStorage.getItem('theme');
  if (saved) {
    applyTheme(saved === 'dark');
  } else {
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark);
  }
  // 监听系统主题变化（仅当用户未手动设置时生效）
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) applyTheme(e.matches);
  });
}
initTheme();
`;
}

function renderHTML(config) {
  const catOptions = Object.entries(CATEGORIES).map(function(e) {
    return '<option value="' + e[0] + '"' + (config.category === e[0] ? ' selected' : '') + '>' + e[1] + '</option>';
  }).join('');
  // hourOptions removed - using text input now

  const navItems = Object.entries(CATEGORIES).map(function(e) {
    return '<div class="nav-item' + (config.category === e[0] ? ' active' : '') + '" data-cat="' + e[0] + '" onclick="selectCategory(\'' + e[0] + '\')">' +
      '<span class="nav-icon">' + {'general':'📰','world':'🌍','business':'💹','technology':'💻','entertainment':'🎬','sports':'⚽','science':'🔬','health':'❤️'}[e[0]] + '</span>' +
      '<span class="nav-label">' + e[1] + '</span></div>';
  }).join('');

  const css = `
:root {
  --bg: #f0f2f5;
  --sidebar-bg: #ffffff;
  --card-bg: #ffffff;
  --border: #e8eaed;
  --text: #1a1a2e;
  --text-secondary: #6b7280;
  --accent: #2563eb;
  --accent-light: #eff6ff;
  --summary-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --radius: 12px;
  --shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-hover: 0 4px 12px rgba(0,0,0,0.12);
  --sidebar-w: 240px;
}
[data-theme="dark"] {
  --bg: #0f1117;
  --sidebar-bg: #1a1d27;
  --card-bg: #1e2130;
  --border: #2d3148;
  --text: #e8eaf0;
  --text-secondary: #8b92a9;
  --accent: #4f8ef7;
  --accent-light: #1a2540;
  --shadow: 0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2);
  --shadow-hover: 0 4px 12px rgba(0,0,0,0.4);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; display: flex; flex-direction: column; }

/* Top bar */
.topbar { height: 52px; background: var(--sidebar-bg); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 16px; gap: 12px; position: fixed; top: 0; left: 0; right: 0; z-index: 100; }
.topbar-logo { font-size: 15px; font-weight: 700; color: var(--accent); display: flex; align-items: center; gap: 6px; }
.topbar-logo span { font-size: 20px; }
.menu-btn { width: 32px; height: 32px; border: none; background: none; cursor: pointer; display: flex; flex-direction: column; justify-content: center; gap: 5px; padding: 4px; border-radius: 6px; }
.menu-btn:hover { background: var(--bg); }
.menu-btn i { display: block; height: 2px; background: var(--text-secondary); border-radius: 2px; transition: .2s; }
.topbar-right { margin-left: auto; display: flex; gap: 8px; }
.topbar-btn { padding: 6px 14px; border-radius: 8px; border: 1px solid var(--border); background: var(--card-bg); color: var(--text); font-size: 13px; cursor: pointer; transition: all .15s; white-space: nowrap; }
.topbar-btn:hover { background: var(--accent); color: white; border-color: var(--accent); }
.topbar-btn.primary { background: var(--accent); color: white; border-color: var(--accent); }
.topbar-btn.primary:hover { background: #1d4ed8; }

/* Layout */
.layout { display: flex; margin-top: 52px; min-height: calc(100vh - 52px); }

/* Sidebar */
.sidebar { width: var(--sidebar-w); background: var(--sidebar-bg); border-right: 1px solid var(--border); position: fixed; top: 52px; bottom: 0; left: 0; overflow-y: auto; z-index: 50; transition: transform .25s; display: flex; flex-direction: column; }
.sidebar-section { padding: 16px 12px 8px; }
.sidebar-section-title { font-size: 11px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: .06em; padding: 0 8px; margin-bottom: 4px; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 14px; color: var(--text-secondary); transition: all .15s; margin-bottom: 2px; }
.nav-item:hover { background: var(--bg); color: var(--text); }
.nav-item.active { background: var(--accent-light); color: var(--accent); font-weight: 600; }
.nav-icon { font-size: 16px; width: 20px; text-align: center; }

/* Settings panel in sidebar */
.settings-panel { padding: 8px 12px 16px; border-top: 1px solid var(--border); margin-top: auto; }
.settings-title { font-size: 11px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: .06em; padding: 12px 8px 8px; }
.form-group { margin-bottom: 10px; }
.form-label { font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; display: block; padding: 0 2px; }
.form-control { width: 100%; padding: 7px 10px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; color: var(--text); background: var(--bg); outline: none; transition: border .15s; }
.form-control:focus { border-color: var(--accent); background: white; }
.toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 6px 2px; }
.toggle-label { font-size: 13px; color: var(--text); }
.toggle { position: relative; width: 36px; height: 20px; }
.toggle input { opacity: 0; width: 0; height: 0; }
.toggle-slider { position: absolute; inset: 0; background: #d1d5db; border-radius: 20px; cursor: pointer; transition: .2s; }
.toggle-slider::after { content: ''; position: absolute; width: 16px; height: 16px; background: white; border-radius: 50%; top: 2px; left: 2px; transition: .2s; }
.toggle input:checked + .toggle-slider { background: var(--accent); }
.toggle input:checked + .toggle-slider::after { transform: translateX(16px); }
.src-region-label { font-size: 11px; color: var(--text-secondary); font-weight: 600; padding: 6px 2px 3px; text-transform: uppercase; letter-spacing: .04em; }
.src-item { display: flex; align-items: center; gap: 6px; padding: 5px 8px; border-radius: 6px; cursor: pointer; font-size: 12px; color: var(--text-secondary); transition: all .15s; margin-bottom: 1px; }
.src-item input { display: none; }
.src-item.active { color: var(--accent); background: var(--accent-light); }
.src-item:hover { background: var(--bg); color: var(--text); }
.save-btn { width: 100%; padding: 9px; background: var(--accent); color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; margin-top: 10px; transition: background .15s; }
.save-btn:hover { background: #1d4ed8; }

/* Main content */
.main { margin-left: var(--sidebar-w); flex: 1; padding: 24px; min-width: 0; }
.news-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.news-title { font-size: 22px; font-weight: 700; color: var(--text); }
.news-count { font-size: 13px; color: var(--text-secondary); background: var(--border); padding: 3px 10px; border-radius: 20px; }

/* Summary card */
.summary-card { background: var(--summary-bg); border-radius: var(--radius); padding: 20px 24px; margin-bottom: 20px; color: white; }
.summary-header { margin-bottom: 10px; }
.ai-badge { font-size: 12px; font-weight: 700; background: rgba(255,255,255,0.2); padding: 3px 10px; border-radius: 20px; letter-spacing: .04em; }
.summary-body { font-size: 14px; line-height: 1.8; opacity: .95; }

/* News grid */
.news-grid { display: flex; flex-direction: column; gap: 8px; }
.news-card { background: var(--card-bg); border-radius: var(--radius); padding: 14px 18px; border: 1px solid var(--border); text-decoration: none; color: inherit; display: flex; align-items: flex-start; gap: 14px; transition: all .15s; box-shadow: var(--shadow); }
.news-card:hover { box-shadow: var(--shadow-hover); border-color: var(--accent); transform: translateX(2px); }
.card-left { flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 4px; min-width: 90px; }
.card-source { font-size: 11px; font-weight: 600; color: var(--accent); background: var(--accent-light); padding: 2px 8px; border-radius: 20px; white-space: nowrap; }
.card-time { font-size: 11px; color: var(--text-secondary); white-space: nowrap; }
.card-body { flex: 1; min-width: 0; }
.card-title { font-size: 14px; font-weight: 600; color: var(--text); line-height: 1.5; margin-bottom: 4px; }
.card-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.6; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Loading */
.loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; gap: 16px; color: var(--text-secondary); }
.spinner { width: 36px; height: 36px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.error-msg { text-align: center; padding: 60px 20px; color: #ef4444; font-size: 14px; }

/* Toast */
.toast { position: fixed; bottom: 24px; right: 24px; padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; opacity: 0; transform: translateY(10px); transition: all .25s; pointer-events: none; z-index: 999; max-width: 320px; }
.toast.show { opacity: 1; transform: translateY(0); }
.toast.success { background: #064e3b; color: #6ee7b7; }
.toast.error { background: #450a0a; color: #fca5a5; }
.toast.info { background: #1e3a5f; color: #93c5fd; }

/* Topbar clock */
.topbar-clock { display: flex; align-items: center; gap: 12px; position: absolute; left: 50%; transform: translateX(-50%); }
.clock-time { font-size: 16px; font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; letter-spacing: .03em; }
.clock-date { font-size: 13px; color: var(--text); font-weight: 500; }
.clock-week { font-size: 13px; color: var(--accent); font-weight: 600; }
.clock-lunar { font-size: 12px; color: var(--text-secondary); }
.clock-sep { color: var(--border); font-size: 14px; }
@media (max-width: 900px) { .topbar-clock { display: none; } }

/* Overlay */
.overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.3); z-index: 40; }
.overlay.show { display: block; }

@media (max-width: 900px) {
  .sidebar { transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); }
  .main { margin-left: 0; padding: 16px; }
  .card-desc { display: none; }
}
`;

  return [
    '<!DOCTYPE html>',
    '<html lang="zh-CN">',
    '<head>',
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1.0">',
    '<title>中文新闻 Hub</title>',
    '<style>' + css + '</style>',
    '</head>',
    '<body>',

    // Top bar
    '<div class="topbar">',
    '  <button class="menu-btn" onclick="toggleSidebar()"><i></i><i></i><i></i></button>',
    '  <div class="topbar-logo"><span>📰</span>中文新闻 Hub</div>',
    '  <div class="topbar-clock">',
    '    <span class="clock-time" id="clock-time">--:--:--</span>',
    '    <span class="clock-sep">|</span>',
    '    <span class="clock-date" id="clock-date"></span>',
    '    <span class="clock-week" id="clock-week"></span>',
    '    <span class="clock-sep">|</span>',
    '    <span class="clock-lunar" id="clock-lunar"></span>',
    '  </div>',
    '  <div class="topbar-right">',
    '    <button class="topbar-btn" id="theme-btn" onclick="toggleTheme()" title="切换暗色/亮色">🌙</button>',
    '    <button class="topbar-btn" onclick="loadNews()">🔄 刷新</button>',
    '    <button class="topbar-btn primary" onclick="testPush()">📤 推送 TG</button>',
    '  </div>',
    '</div>',

    '<div class="overlay" id="overlay"></div>',

    '<div class="layout">',

    // Sidebar
    '<div class="sidebar" id="sidebar">',
    '  <div class="sidebar-section">',
    '    <div class="sidebar-section-title">新闻分类</div>',
    navItems,
    '  </div>',

    '  <div class="settings-panel">',
    '    <div class="settings-title">⚙️ 设置</div>',

    '    <div class="form-group">',
    '      <label class="form-label">新闻分类</label>',
    '      <select class="form-control" id="cat-select">' + catOptions + '</select>',
    '    </div>',

    '    <div class="form-group">',
    '      <label class="form-label">推送条数</label>',
    '      <input class="form-control" type="number" id="max-input" value="' + config.maxItems + '" min="1" max="50">',
    '    </div>',

    '    <div class="form-group">',
    '      <label class="form-label">包含关键词 <small style="color:#94a3b8;font-weight:400">（仅影响TG推送）</small></label>',
    '      <input class="form-control" type="text" id="kw-input" value="' + config.keywords + '" placeholder="逗号分隔">',
    '    </div>',

    '    <div class="form-group">',
    '      <label class="form-label">排除关键词 <small style="color:#94a3b8;font-weight:400">（仅影响TG推送）</small></label>',
    '      <input class="form-control" type="text" id="exkw-input" value="' + config.excludeKeywords + '" placeholder="逗号分隔">',
    '    </div>',

    '    <div class="form-group">',
    '      <label class="form-label">推送时间（北京时间，多个用逗号分隔）</label>',
    '      <input class="form-control" type="text" id="hour-input" placeholder="例如: 8,12,16,20" value="' + (config.pushHours || config.pushHour || '8,12,16,20') + '">',
    '    </div>',

    '    <div class="toggle-row">',
    '      <span class="toggle-label">定时推送</span>',
    '      <label class="toggle"><input type="checkbox" id="enabled-toggle"' + (config.enabled ? ' checked' : '') + '><span class="toggle-slider"></span></label>',
    '    </div>',
    '    <div class="toggle-row">',
    '      <span class="toggle-label">AI 摘要</span>',
    '      <label class="toggle"><input type="checkbox" id="ai-toggle"' + (config.aiSummary !== false ? ' checked' : '') + '><span class="toggle-slider"></span></label>',
    '    </div>',

    '    <div class="settings-title" style="padding-top:14px">📡 新闻来源</div>',
    '    <div id="src-grid"></div>',

    '    <button class="save-btn" onclick="saveConfig()">💾 保存配置</button>',
    '  </div>',
    '</div>',

    // Main
    '<div class="main" id="main">',
    '  <div id="news-area"><div class="loading"><div class="spinner"></div><p>正在加载新闻...</p></div></div>',
    '</div>',

    '</div>',

    '<div class="toast" id="toast"></div>',
    '<script>' + buildScript() + '</script>',
    '</body>',
    '</html>',
  ].join('\n');
}
