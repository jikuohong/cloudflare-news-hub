// ============================================================
// Cloudflare News Hub - 中文媒体版 (全功能版)
// ============================================================

const DEFAULT_CONFIG = {
  category: 'general',
  keywords: '',
  excludeKeywords: '',
  maxItems: 20,
  pushHours: '8,12,16,20',
  enabled: true,
  aiSummary: true,
  sources: ['rfa','voachinese','bbc_chinese','bbc_trad','hk01','mingpao','orientaldaily','singtao','hkej','appledaily_tw','udn','cna','rti','storm','thenewslens','ettoday','setn','initium','dwnews','chosun','zaobao','duowei','googlezh'],
  // 推送渠道
  tgEnabled: true,
  wxpusherEnabled: false, wxpusherToken: '', wxpusherUid: '',
  barkEnabled: false, barkUrl: '',
  wxworkEnabled: false, wxworkWebhook: '',
  dingEnabled: false, dingWebhook: '',
  feishuEnabled: false, feishuWebhook: '',
  pushplusEnabled: false, pushplusToken: '',
};

const CATEGORIES = {
  general:'综合新闻', world:'国际', business:'财经',
  technology:'科技', entertainment:'娱乐', sports:'体育',
  science:'科学', health:'健康',
};

const NEWS_SOURCES = {
  hk01:        { label:'香港01',       flag:'🇭🇰', region:'香港', color:'#e63946' },
  mingpao:     { label:'明报',         flag:'🇭🇰', region:'香港', color:'#c1121f' },
  orientaldaily:{ label:'东方日报',    flag:'🇭🇰', region:'香港', color:'#d62828' },
  singtao:     { label:'星岛日报',     flag:'🇭🇰', region:'香港', color:'#e07c24' },
  hkej:        { label:'信报',         flag:'🇭🇰', region:'香港', color:'#b5563a' },
  appledaily_tw:{ label:'自由时报',    flag:'🇹🇼', region:'台湾', color:'#2196f3' },
  udn:         { label:'联合新闻网',   flag:'🇹🇼', region:'台湾', color:'#1565c0' },
  cna:         { label:'中央社',       flag:'🇹🇼', region:'台湾', color:'#0d47a1' },
  rti:         { label:'中央广播电台', flag:'🇹🇼', region:'台湾', color:'#1976d2' },
  storm:       { label:'风传媒',       flag:'🇹🇼', region:'台湾', color:'#303f9f' },
  thenewslens: { label:'关键评论网',   flag:'🇹🇼', region:'台湾', color:'#512da8' },
  ettoday:     { label:'ETtoday',      flag:'🇹🇼', region:'台湾', color:'#7b1fa2' },
  setn:        { label:'三立新闻',     flag:'🇹🇼', region:'台湾', color:'#6a1b9a' },
  rfa:         { label:'自由亚洲电台', flag:'🌏', region:'海外', color:'#2e7d32' },
  voachinese:  { label:'美国之音中文', flag:'🇺🇸', region:'海外', color:'#1b5e20' },
  bbc_chinese: { label:'BBC中文(简)',  flag:'🇬🇧', region:'海外', color:'#bf360c' },
  bbc_trad:    { label:'BBC中文(繁)',  flag:'🇬🇧', region:'海外', color:'#d84315' },
  initium:     { label:'端传媒',       flag:'📰',  region:'海外', color:'#4e342e' },
  dwnews:      { label:'德国之声中文', flag:'🇩🇪', region:'海外', color:'#37474f' },
  chosun:      { label:'朝鲜日报中文', flag:'🇰🇷', region:'海外', color:'#00695c' },
  zaobao:      { label:'联合早报',     flag:'🇸🇬', region:'海外', color:'#004d40' },
  duowei:      { label:'多维新闻',     flag:'📡',  region:'海外', color:'#455a64' },
  googlezh:    { label:'Google新闻',   flag:'🔍',  region:'聚合', color:'#546e7a' },
};

function getSourceUrl(key, config) {
  if (key === 'googlezh') {
    if (config && config.keywords) return 'https://news.google.com/rss/search?q=' + encodeURIComponent(config.keywords) + '&hl=zh-TW&gl=TW&ceid=TW:zh-Hant';
    const catMap = { world:'WORLD', business:'BUSINESS', technology:'TECHNOLOGY', entertainment:'ENTERTAINMENT', sports:'SPORTS', science:'SCIENCE', health:'HEALTH' };
    const cat = config && catMap[config.category];
    if (cat) return 'https://news.google.com/rss/headlines/section/topic/' + cat + '?hl=zh-TW&gl=TW&ceid=TW:zh-Hant';
    return 'https://news.google.com/rss?hl=zh-TW&gl=TW&ceid=TW:zh-Hant';
  }
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
    bbc_chinese:  'https://feeds.bbci.co.uk/zhongwen/simp/rss.xml',
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
    googlezh: '__GOOGLEZH__',  // placeholder, resolved in getSourceUrl
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
    if (url.pathname === '/api/health' && request.method === 'GET')  return handleHealth(env);
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
// 新闻获取 (含失败重试)
// ============================================================
async function fetchWithRetry(url, options, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const resp = await fetch(url, { ...options, signal: AbortSignal.timeout(10000) });
      if (resp.ok) return resp;
      if (i === retries) return null;
    } catch (e) {
      if (i === retries) return null;
      await new Promise(r => setTimeout(r, 1000 * (i + 1))); // 递增等待
    }
  }
  return null;
}

async function fetchFromSource(sourceKey, config) {
  const src = NEWS_SOURCES[sourceKey];
  if (!src) return { key: sourceKey, items: [], ok: false };
  try {
    const url = getSourceUrl(sourceKey, config);
    if (!url) return { key: sourceKey, items: [], ok: false };
    const resp = await fetchWithRetry(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)' } });
    if (!resp) return { key: sourceKey, items: [], ok: false };
    const xml = await resp.text();
    const items = parseRss(xml, src.label, src.flag, src.color, config, config._maxAgeDays || 7);
    return { key: sourceKey, items, ok: true };
  } catch {
    return { key: sourceKey, items: [], ok: false };
  }
}

function parseRss(xml, sourceName, sourceFlag, sourceColor, config, maxAgeDays) {
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
    if (pubDate) {
      try {
        let ts = new Date(pubDate).getTime();
        if (isNaN(ts)) {
          const fixed = pubDate.replace(/([\+\-])(\d{2})(\d{2})$/, '$1$2:$3');
          ts = new Date(fixed).getTime();
        }
        if (!isNaN(ts)) {
          const age = now - ts;
          if (age > maxMs || age < -3600000) continue;
        }
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
    items.push({ title, link, desc: desc.slice(0, 120), source: sourceName, flag: sourceFlag, color: sourceColor, pubDate });
  }
  return items;
}

async function fetchAllNews(config) {
  const sources = (config.sources || DEFAULT_CONFIG.sources).filter(s => NEWS_SOURCES[s]);
  const results = await Promise.allSettled(sources.map(s => fetchFromSource(s, config)));
  const buckets = results.filter(r => r.status === 'fulfilled').map(r => r.value.items);
  const healthMap = {};
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') healthMap[sources[i]] = r.value.ok;
    else healthMap[sources[i]] = false;
  });
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
  allItems.sort((a, b) => {
    const ta = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const tb = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return tb - ta;
  });
  return { items: allItems, healthMap };
}

// ============================================================
// 来源健康检查
// ============================================================
async function handleHealth(env) {
  try {
    const config = await getConfig(env);
    const sources = (config.sources || DEFAULT_CONFIG.sources).filter(s => NEWS_SOURCES[s]);
    const results = await Promise.allSettled(sources.map(async s => {
      const url = getSourceUrl(s, config);
      if (!url) return { key: s, ok: false, reason: '无URL' };
      const resp = await fetchWithRetry(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      return { key: s, ok: !!resp, label: NEWS_SOURCES[s].label };
    }));
    const health = results.map(r => r.status === 'fulfilled' ? r.value : { ok: false });
    return Response.json({ success: true, health });
  } catch (e) { return Response.json({ success: false, message: e.message }, { status: 500 }); }
}

// ============================================================
// 工具函数
// ============================================================
function extract(xml, tag) {
  const m = xml.match(new RegExp('<' + tag + '[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/' + tag + '>|<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>'));
  return m ? (m[1] || m[2] || '').trim() : '';
}
function decodeHtml(str) {
  return str.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ').replace(/&#(\d+);/g,(_,c)=>String.fromCharCode(parseInt(c)));
}
function cleanText(str) {
  return str.replace(/<[^>]*>/g,'').replace(/[\u2610-\u2612\u2614-\u26FF\u2702-\u27B0]/g,'').replace(/\s+/g,' ').trim();
}
function escapeTg(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ============================================================
// AI 摘要 (含缓存)
// ============================================================
async function summarizeWithAI(env, items, config) {
  if (!env.AI) return null;
  try {
    const catLabel = CATEGORIES[config.category] || '综合';
    const newsList = items.slice(0, 30).map((item, i) => (i+1) + '. ' + item.title).join('\n');
    const prompt = '你是专业新闻编辑。以下是今日' + catLabel + '新闻标题，请：\n1. 提炼 3-5 个最重要要点，每点 1-2 句，简洁专业\n2. 最后一句给出今日趋势或值得关注的信号\n\n' + newsList + '\n\n直接输出摘要，不要前缀。';
    const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
    });
    return response?.choices?.[0]?.message?.content?.trim() || null;
  } catch { return null; }
}

async function getCachedSummary(env, items, config) {
  if (config.aiSummary === false) return null;
  const cacheKey = 'summary_cache_' + config.category + '_' + new Date().toISOString().slice(0, 13);
  try {
    const cached = await env.NEWS_CONFIG.get(cacheKey);
    if (cached) return cached;
    const summary = await summarizeWithAI(env, items, config);
    if (summary) await env.NEWS_CONFIG.put(cacheKey, summary, { expirationTtl: 86400 });
    return summary;
  } catch {
    return await summarizeWithAI(env, items, config);
  }
}

// ============================================================
// API: 新闻
// ============================================================
async function handleNews(env) {
  try {
    const config = await getConfig(env);
    const webConfig = { ...config, maxItems: 60, keywords: '', excludeKeywords: '' };
    const { items, healthMap } = await fetchAllNews(webConfig);
    const summary = await getCachedSummary(env, items, config);
    return Response.json({ success: true, items, summary, healthMap, category: CATEGORIES[config.category] || '综合新闻' });
  } catch (e) { return Response.json({ success: false, message: e.message }, { status: 500 }); }
}

// ============================================================
// 推送渠道
// ============================================================
async function sendToTelegram(env, config, message) {
  if (!config.tgEnabled) return;
  const token = env.TG_TOKEN, chatId = env.TG_CHAT_ID;
  if (!token || !chatId) return;
  const resp = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message.html, parse_mode: 'HTML', disable_web_page_preview: true }),
  });
  const data = await resp.json();
  if (!data.ok) throw new Error('TG推送失败: ' + data.description);
}

async function sendToWxpusher(config, message) {
  if (!config.wxpusherEnabled || !config.wxpusherToken || !config.wxpusherUid) return;
  await fetch('https://wxpusher.zjiecode.com/api/send/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ appToken: config.wxpusherToken, content: message.text, summary: message.title, contentType: 1, uids: [config.wxpusherUid] }),
  });
}

async function sendToBark(config, message) {
  if (!config.barkEnabled || !config.barkUrl) return;
  const url = config.barkUrl.replace(/\/$/, '') + '/' + encodeURIComponent(message.title) + '/' + encodeURIComponent(message.text);
  await fetch(url);
}

async function sendToWxwork(config, message) {
  if (!config.wxworkEnabled || !config.wxworkWebhook) return;
  await fetch(config.wxworkWebhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ msgtype: 'text', text: { content: message.title + '\n\n' + message.text } }),
  });
}

async function sendToDing(config, message) {
  if (!config.dingEnabled || !config.dingWebhook) return;
  await fetch(config.dingWebhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ msgtype: 'text', text: { content: message.title + '\n\n' + message.text } }),
  });
}

async function sendToFeishu(config, message) {
  if (!config.feishuEnabled || !config.feishuWebhook) return;
  await fetch(config.feishuWebhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ msg_type: 'text', content: { text: message.title + '\n\n' + message.text } }),
  });
}

async function sendToPushplus(config, message) {
  if (!config.pushplusEnabled || !config.pushplusToken) return;
  await fetch('https://www.pushplus.plus/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: config.pushplusToken, title: message.title, content: message.text, template: 'txt' }),
  });
}

// ============================================================
// 推送去重 + 构建消息
// ============================================================
async function buildAndPush(env, config) {
  const tgConfig = { ...config, _maxAgeDays: 1 };
  const { items: allItems } = await fetchAllNews(tgConfig);
  if (allItems.length === 0) throw new Error('没有获取到新闻');

  // 推送去重：过滤上次已推过的标题
  const dedupeKey = 'pushed_titles';
  let pushedTitles = new Set();
  try {
    const raw = await env.NEWS_CONFIG.get(dedupeKey);
    if (raw) pushedTitles = new Set(JSON.parse(raw));
  } catch {}

  const items = allItems.filter(item => !pushedTitles.has(item.title.slice(0, 30)));
  if (items.length === 0) throw new Error('所有新闻均已推送过，无新内容');

  // 更新已推送标题（只保留最近500条）
  const newTitles = [...pushedTitles, ...items.map(i => i.title.slice(0, 30))].slice(-500);
  await env.NEWS_CONFIG.put(dedupeKey, JSON.stringify(newTitles), { expirationTtl: 86400 * 2 });

  const catLabel = CATEGORIES[config.category] || '综合新闻';
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const summary = config.aiSummary !== false ? await summarizeWithAI(env, items, config) : null;

  // 构建纯文本版本（通用）
  let textMsg = '📰 中文新闻 Hub\n🗂 ' + catLabel + ' | 🕐 ' + now + '\n';
  if (summary) textMsg += '\n── AI 今日摘要 ──\n' + summary + '\n';
  textMsg += '\n── 原文链接 ──\n\n';
  items.forEach((item, i) => { textMsg += (i+1) + '. 【' + item.source + '】' + item.title + '\n' + item.link + '\n\n'; });
  textMsg += '共 ' + items.length + ' 条';

  // 构建 TG HTML 版本
  let htmlMsg = '📰 <b>中文新闻 Hub</b>\n🗂 ' + escapeTg(catLabel) + ' | 🕐 ' + escapeTg(now) + '\n';
  if (summary) htmlMsg += '\n━━━━━ 🤖 AI 今日摘要 ━━━━━\n\n' + escapeTg(summary) + '\n';
  htmlMsg += '\n━━━━━ 📎 原文链接 ━━━━━\n\n';
  const grouped = {};
  items.forEach(item => {
    if (!grouped[item.source]) grouped[item.source] = { flag: item.flag, items: [] };
    grouped[item.source].items.push(item);
  });
  let idx = 1;
  for (const [src, group] of Object.entries(grouped)) {
    htmlMsg += group.flag + ' <b>' + escapeTg(src) + '</b>\n';
    group.items.forEach(item => { htmlMsg += idx++ + '. <a href="' + item.link + '">' + escapeTg(item.title) + '</a>\n'; });
    htmlMsg += '\n';
  }
  htmlMsg += '━━━━━━━━━━━━━━━━━━━━\n共 ' + items.length + ' 条';

  const message = { title: '📰 ' + catLabel + ' 新闻汇总', text: textMsg, html: htmlMsg };

  // 并发推送所有渠道
  await Promise.allSettled([
    sendToTelegram(env, config, message),
    sendToWxpusher(config, message),
    sendToBark(config, message),
    sendToWxwork(config, message),
    sendToDing(config, message),
    sendToFeishu(config, message),
    sendToPushplus(config, message),
  ]);

  return items.length;
}

async function runNewsPush(env) {
  const config = await getConfig(env);
  if (!config.enabled) return;
  const now = new Date();
  const hour = parseInt(now.toLocaleString('en-US', { timeZone: 'Asia/Shanghai', hour: 'numeric', hour12: false }));
  const pushHours = String(config.pushHours || '8').split(/[,，\s]+/).map(h => parseInt(h.trim())).filter(h => !isNaN(h));
  if (!pushHours.includes(hour)) return;
  const today = now.toISOString().slice(0, 10);
  const runKey = 'lastRun_' + today + '_' + hour;
  const lastRun = await env.NEWS_CONFIG.get(runKey);
  if (lastRun) return;
  await buildAndPush(env, config);
  await env.NEWS_CONFIG.put(runKey, '1');
}

async function handleTestPush(env) {
  try {
    const config = await getConfig(env);
    const count = await buildAndPush(env, config);
    return Response.json({ success: true, message: '推送成功！共发送 ' + count + ' 条新闻' });
  } catch (e) { return Response.json({ success: false, message: e.message }, { status: 500 }); }
}

// ============================================================
// 前端脚本
// ============================================================
function buildScript() {
  return `
var currentCategory = 'general';
var sidebarOpen = window.innerWidth > 900;
var readItems = new Set(JSON.parse(localStorage.getItem('readItems') || '[]'));

var CATEGORIES = { general:'综合新闻', world:'国际', business:'财经', technology:'科技', entertainment:'娱乐', sports:'体育', science:'科学', health:'健康' };

var SOURCE_LIST = {
  hk01:{label:'香港01',flag:'🇭🇰',region:'\u9999\u6e2f',color:'#e63946'},
  mingpao:{label:'\u660e\u62a5',flag:'🇭🇰',region:'\u9999\u6e2f',color:'#c1121f'},
  orientaldaily:{label:'\u4e1c\u65b9\u65e5\u62a5',flag:'🇭🇰',region:'\u9999\u6e2f',color:'#d62828'},
  singtao:{label:'\u661f\u5c9b\u65e5\u62a5',flag:'🇭🇰',region:'\u9999\u6e2f',color:'#e07c24'},
  hkej:{label:'\u4fe1\u62a5',flag:'🇭🇰',region:'\u9999\u6e2f',color:'#b5563a'},
  appledaily_tw:{label:'\u81ea\u7531\u65f6\u62a5',flag:'🇹🇼',region:'\u53f0\u6e7e',color:'#2196f3'},
  udn:{label:'\u8054\u5408\u65b0\u95fb\u7f51',flag:'🇹🇼',region:'\u53f0\u6e7e',color:'#1565c0'},
  cna:{label:'\u4e2d\u592e\u793e',flag:'🇹🇼',region:'\u53f0\u6e7e',color:'#0d47a1'},
  rti:{label:'\u4e2d\u592e\u5e7f\u64ad\u7535\u53f0',flag:'🇹🇼',region:'\u53f0\u6e7e',color:'#1976d2'},
  storm:{label:'\u98ce\u4f20\u5a92',flag:'🇹🇼',region:'\u53f0\u6e7e',color:'#303f9f'},
  thenewslens:{label:'\u5173\u952e\u8bc4\u8bba\u7f51',flag:'🇹🇼',region:'\u53f0\u6e7e',color:'#512da8'},
  ettoday:{label:'ETtoday',flag:'🇹🇼',region:'\u53f0\u6e7e',color:'#7b1fa2'},
  setn:{label:'\u4e09\u7acb\u65b0\u95fb',flag:'🇹🇼',region:'\u53f0\u6e7e',color:'#6a1b9a'},
  rfa:{label:'\u81ea\u7531\u4e9a\u6d32\u7535\u53f0',flag:'🌏',region:'\u6d77\u5916',color:'#2e7d32'},
  voachinese:{label:'\u7f8e\u56fd\u4e4b\u97f3\u4e2d\u6587',flag:'🇺🇸',region:'\u6d77\u5916',color:'#1b5e20'},
  bbc_chinese:{label:'BBC\u4e2d\u6587(\u7b80)',flag:'🇬🇧',region:'\u6d77\u5916',color:'#bf360c'},
  bbc_trad:{label:'BBC\u4e2d\u6587(\u7e41)',flag:'🇬🇧',region:'\u6d77\u5916',color:'#d84315'},
  initium:{label:'\u7aef\u4f20\u5a92',flag:'📰',region:'\u6d77\u5916',color:'#4e342e'},
  dwnews:{label:'\u5fb7\u56fd\u4e4b\u58f0\u4e2d\u6587',flag:'🇩🇪',region:'\u6d77\u5916',color:'#37474f'},
  chosun:{label:'\u671d\u9c9c\u65e5\u62a5\u4e2d\u6587',flag:'🇰🇷',region:'\u6d77\u5916',color:'#00695c'},
  zaobao:{label:'\u8054\u5408\u65e9\u62a5',flag:'🇸🇬',region:'\u6d77\u5916',color:'#004d40'},
  duowei:{label:'\u591a\u7ef4\u65b0\u95fb',flag:'📡',region:'\u6d77\u5916',color:'#455a64'},
  googlezh:{label:'Google\u65b0\u95fb',flag:'🔍',region:'\u805a\u5408',color:'#546e7a'},
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
  document.getElementById('hour-input').value = config.pushHours || '8,12,16,20';
  document.getElementById('enabled-toggle').checked = config.enabled !== false;
  document.getElementById('ai-toggle').checked = config.aiSummary !== false;
  // push channels
  document.getElementById('tg-toggle').checked = config.tgEnabled !== false;
  document.getElementById('wxpusher-toggle').checked = !!config.wxpusherEnabled;
  document.getElementById('wxpusher-token').value = config.wxpusherToken || '';
  document.getElementById('wxpusher-uid').value = config.wxpusherUid || '';
  document.getElementById('bark-toggle').checked = !!config.barkEnabled;
  document.getElementById('bark-url').value = config.barkUrl || '';
  document.getElementById('wxwork-toggle').checked = !!config.wxworkEnabled;
  document.getElementById('wxwork-webhook').value = config.wxworkWebhook || '';
  document.getElementById('ding-toggle').checked = !!config.dingEnabled;
  document.getElementById('ding-webhook').value = config.dingWebhook || '';
  document.getElementById('feishu-toggle').checked = !!config.feishuEnabled;
  document.getElementById('feishu-webhook').value = config.feishuWebhook || '';
  document.getElementById('pushplus-toggle').checked = !!config.pushplusEnabled;
  document.getElementById('pushplus-token').value = config.pushplusToken || '';
  currentCategory = config.category || 'general';
  renderSourceGrid(config.sources || []);
  updateNavActive();
}

function renderSourceGrid(selected) {
  var regions = {};
  Object.entries(SOURCE_LIST).forEach(function(e) {
    var k = e[0], v = e[1];
    if (!regions[v.region]) regions[v.region] = [];
    regions[v.region].push(Object.assign({key:k}, v));
  });
  var html = '';
  Object.entries(regions).forEach(function(e) {
    html += '<div class="src-region-label">' + e[0] + '</div>';
    e[1].forEach(function(src) {
      var checked = selected.includes(src.key) ? 'checked' : '';
      html += '<label class="src-item ' + (checked?'active':'') + '" style="' + (checked?'--src-color:'+src.color:'') + '">';
      html += '<input type="checkbox" value="' + src.key + '" ' + checked + ' onchange="toggleSrc(this, \'' + src.color + '\')">';
      html += '<span>' + src.flag + ' ' + src.label + '</span></label>';
    });
  });
  document.getElementById('src-grid').innerHTML = html;
}

function toggleSrc(el, color) {
  el.parentElement.classList.toggle('active', el.checked);
  if (el.checked) el.parentElement.style.setProperty('--src-color', color);
  else el.parentElement.style.removeProperty('--src-color');
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
    tgEnabled: document.getElementById('tg-toggle').checked,
    wxpusherEnabled: document.getElementById('wxpusher-toggle').checked,
    wxpusherToken: document.getElementById('wxpusher-token').value,
    wxpusherUid: document.getElementById('wxpusher-uid').value,
    barkEnabled: document.getElementById('bark-toggle').checked,
    barkUrl: document.getElementById('bark-url').value,
    wxworkEnabled: document.getElementById('wxwork-toggle').checked,
    wxworkWebhook: document.getElementById('wxwork-webhook').value,
    dingEnabled: document.getElementById('ding-toggle').checked,
    dingWebhook: document.getElementById('ding-webhook').value,
    feishuEnabled: document.getElementById('feishu-toggle').checked,
    feishuWebhook: document.getElementById('feishu-webhook').value,
    pushplusEnabled: document.getElementById('pushplus-toggle').checked,
    pushplusToken: document.getElementById('pushplus-token').value,
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
  showToast('\u6b63\u5728\u63a8\u9001\uff0c\u8bf7\u7a0d\u5019...', 'info');
  var r = await fetch('/api/test', {method:'POST'});
  var d = await r.json();
  showToast(d.message, d.success ? 'success' : 'error');
}

async function checkHealth() {
  showToast('\u6b63\u5728\u68c0\u6d4b\u6765\u6e90\u5065\u5eb7...', 'info');
  var r = await fetch('/api/health');
  var d = await r.json();
  if (!d.success) { showToast('\u68c0\u6d4b\u5931\u8d25', 'error'); return; }
  var ok = d.health.filter(function(h){return h.ok;}).length;
  var fail = d.health.filter(function(h){return !h.ok;});
  var msg = '\u5065\u5eb7: ' + ok + '/' + d.health.length + '\u4e2a\u6e90\u53ef\u7528';
  if (fail.length) msg += '\uff0c\u5931\u8d25: ' + fail.map(function(f){return f.label||f.key;}).join(', ');
  showToast(msg, fail.length ? 'error' : 'success');
  // Mark failed sources in sidebar
  d.health.forEach(function(h) {
    var el = document.querySelector('#src-grid input[value="' + h.key + '"]');
    if (el) {
      el.parentElement.classList.toggle('src-fail', !h.ok);
    }
  });
}

var searchQuery = '';
function filterNews(q) {
  searchQuery = q.toLowerCase();
  document.querySelectorAll('.news-card').forEach(function(card) {
    var title = card.querySelector('.card-title').textContent.toLowerCase();
    var src = card.querySelector('.card-source').textContent.toLowerCase();
    card.style.display = (!searchQuery || title.includes(searchQuery) || src.includes(searchQuery)) ? '' : 'none';
  });
  var visible = document.querySelectorAll('.news-card:not([style*="none"])').length;
  var countEl = document.getElementById('news-count');
  if (countEl) countEl.textContent = searchQuery ? visible + ' \u6761\u5339\u914d' : visible + ' \u6761\u65b0\u95fb';
}

function markRead(titleKey) {
  readItems.add(titleKey);
  localStorage.setItem('readItems', JSON.stringify([...readItems].slice(-300)));
}

async function loadNews() {
  var area = document.getElementById('news-area');
  area.innerHTML = '<div class="loading"><div class="spinner"></div><p>\u6b63\u5728\u6293\u53d6\u65b0\u95fb...</p></div>';
  try {
    var r = await fetch('/api/news');
    var d = await r.json();
    if (!d.success) { area.innerHTML = '<div class="error-msg">\u83b7\u53d6\u5931\u8d25\uff1a' + d.message + '</div>'; return; }
    renderNews(d);
    // Re-apply search filter if active
    if (searchQuery) filterNews(searchQuery);
  } catch(e) {
    area.innerHTML = '<div class="error-msg">\u7f51\u7edc\u9519\u8bef\uff0c\u8bf7\u5237\u65b0\u91cd\u8bd5</div>';
  }
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  try {
    var diff = Date.now() - new Date(dateStr).getTime();
    var m = Math.floor(diff/60000);
    if (m < 1) return '\u521a\u521a';
    if (m < 60) return m + '\u5206\u949f\u524d';
    var h = Math.floor(m/60);
    if (h < 24) return h + '\u5c0f\u65f6\u524d';
    return Math.floor(h/24) + '\u5929\u524d';
  } catch(e) { return ''; }
}

function renderNews(data) {
  var area = document.getElementById('news-area');
  var catTitle = data.category || '\u7efc\u5408\u65b0\u95fb';
  var html = '';

  html += '<div class="news-header">';
  html += '<h1 class="news-title">📰 ' + catTitle + '</h1>';
  html += '<div style="display:flex;align-items:center;gap:8px">';
  html += '<span class="news-count" id="news-count">' + data.items.length + ' \u6761\u65b0\u95fb</span>';
  html += '</div></div>';

  // 搜索框
  html += '<div class="search-bar"><input class="search-input" type="text" placeholder="\u641c\u7d22\u65b0\u95fb\u6807\u9898\u3001\u6765\u6e90..." oninput="filterNews(this.value)" value="' + searchQuery + '"></div>';

  if (data.summary) {
    html += '<div class="summary-card"><div class="summary-header"><span class="ai-badge">🤖 AI \u6458\u8981</span></div>';
    html += '<div class="summary-body">' + data.summary.replace(/\n/g,'<br>') + '</div></div>';
  }

  html += '<div class="news-grid">';
  data.items.forEach(function(item) {
    var ago = timeAgo(item.pubDate);
    var titleKey = item.title.slice(0, 30);
    var isRead = readItems.has(titleKey);
    var color = item.color || '#2563eb';
    html += '<a class="news-card' + (isRead?' read':'') + '" href="' + item.link + '" target="_blank" onclick="markRead(\'' + titleKey.replace(/'/g,"\\'") + '\')">';
    html += '<div class="card-left">';
    html += '<span class="card-source" style="background:' + color + '20;color:' + color + '">' + item.flag + ' ' + item.source + '</span>';
    if (ago) html += '<span class="card-time">' + ago + '</span>';
    html += '</div>';
    html += '<div class="card-body">';
    html += '<div class="card-title">' + item.title + '</div>';
    if (item.desc) html += '<div class="card-desc">' + item.desc + '</div>';
    html += '</div>';
    if (isRead) html += '<span class="read-badge">\u5df2\u8bfb</span>';
    html += '</a>';
  });
  html += '</div>';
  area.innerHTML = html;
}

function showToast(msg, type) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + (type||'info');
  setTimeout(function(){ t.className = 'toast'; }, 5000);
}

window.toggleSidebar = function() {
  sidebarOpen = !sidebarOpen;
  document.getElementById('sidebar').classList.toggle('open', sidebarOpen);
  document.getElementById('overlay').classList.toggle('show', sidebarOpen && window.innerWidth <= 900);
};
window.selectCategory = selectCategory;
window.saveConfig = saveConfig;
window.testPush = testPush;
window.checkHealth = checkHealth;
window.filterNews = filterNews;
window.markRead = markRead;

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
  var lunarMonths = ['\u6b63','\u4e8c','\u4e09','\u56db','\u4e94','\u516d','\u4e03','\u516b','\u4e5d','\u5341','\u51ac','\u814a'];
  var lunarDays = ['\u521d\u4e00','\u521d\u4e8c','\u521d\u4e09','\u521d\u56db','\u521d\u4e94','\u521d\u516d','\u521d\u4e03','\u521d\u516b','\u521d\u4e5d','\u521d\u5341','\u5341\u4e00','\u5341\u4e8c','\u5341\u4e09','\u5341\u56db','\u5341\u4e94','\u5341\u516d','\u5341\u4e03','\u5341\u516b','\u5341\u4e5d','\u4e8c\u5341','\u5eff\u4e00','\u5eff\u4e8c','\u5eff\u4e09','\u5eff\u56db','\u5eff\u4e94','\u5eff\u516d','\u5eff\u4e03','\u5eff\u516b','\u5eff\u4e5d','\u4e09\u5341'];
  var heavenly = ['\u7532','\u4e59','\u4e19','\u4e01','\u620a','\u5df1','\u5e9a','\u8f9b','\u58ec','\u7678'];
  var earthly = ['\u5b50','\u4e11','\u5bc5','\u536f','\u8fb0','\u5df3','\u5348','\u672a','\u7533','\u9149','\u620c','\u4ea5'];
  var animals = ['\u9f20','\u725b','\u864e','\u5154','\u9f99','\u86c7','\u9a6c','\u7f8a','\u7334','\u9e21','\u72d7','\u732a'];
  var baseDate = new Date(1900, 0, 31);
  var offset = Math.floor((date - baseDate) / 86400000);
  var approxYear = Math.floor(offset / 365.25) + 1900;
  var yearOffset = approxYear - 1900;
  var stem = heavenly[((yearOffset % 10) + 10) % 10];
  var branch = earthly[((yearOffset % 12) + 12) % 12];
  var animal = animals[((yearOffset % 12) + 12) % 12];
  var dayInYear = offset % 354;
  var month = Math.min(11, Math.floor(dayInYear / 29.5));
  var day = Math.min(29, Math.floor(dayInYear % 29.5));
  return stem + branch + '\u5e74\uff08' + animal + '\u5e74\uff09' + lunarMonths[month] + '\u6708' + lunarDays[day];
}

function updateClock() {
  var now = new Date();
  var weeks = ['\u661f\u671f\u65e5','\u661f\u671f\u4e00','\u661f\u671f\u4e8c','\u661f\u671f\u4e09','\u661f\u671f\u56db','\u661f\u671f\u4e94','\u661f\u671f\u516d'];
  var te = document.getElementById('clock-time');
  var de = document.getElementById('clock-date');
  var we = document.getElementById('clock-week');
  var le = document.getElementById('clock-lunar');
  if (te) te.textContent = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0') + ':' + String(now.getSeconds()).padStart(2,'0');
  if (de) de.textContent = now.getFullYear() + '\u5e74' + String(now.getMonth()+1).padStart(2,'0') + '\u6708' + String(now.getDate()).padStart(2,'0') + '\u65e5';
  if (we) we.textContent = weeks[now.getDay()];
  if (le) le.textContent = '\u519c\u5386 ' + lunarDate(now);
}
updateClock();
setInterval(updateClock, 1000);

// ── 深色/浅色模式 ──
function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  var btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = dark ? '\u2600\uFE0F' : '🌙';
}
function toggleTheme() {
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  applyTheme(!isDark);
}
function initTheme() {
  var saved = localStorage.getItem('theme');
  if (saved) { applyTheme(saved === 'dark'); }
  else { applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches); }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) applyTheme(e.matches);
  });
}
initTheme();
window.toggleTheme = toggleTheme;
`;
}

// ============================================================
// 渲染 HTML
// ============================================================
function renderHTML(config) {
  const catOptions = Object.entries(CATEGORIES).map(function(e) {
    return '<option value="' + e[0] + '"' + (config.category === e[0] ? ' selected' : '') + '>' + e[1] + '</option>';
  }).join('');

  const navIcons = { general:'📰', world:'🌍', business:'💹', technology:'💻', entertainment:'🎬', sports:'⚽', science:'🔬', health:'❤️' };
  const navItems = Object.entries(CATEGORIES).map(function(e) {
    return '<div class="nav-item' + (config.category === e[0] ? ' active' : '') + '" data-cat="' + e[0] + '" onclick="selectCategory(\'' + e[0] + '\')">' +
      '<span class="nav-icon">' + navIcons[e[0]] + '</span><span class="nav-label">' + e[1] + '</span></div>';
  }).join('');

  const css = `
:root {
  --bg:#f0f2f5; --sidebar-bg:#fff; --card-bg:#fff; --border:#e8eaed;
  --text:#1a1a2e; --text-secondary:#6b7280; --accent:#2563eb; --accent-light:#eff6ff;
  --summary-bg:linear-gradient(135deg,#667eea 0%,#764ba2 100%);
  --radius:12px; --shadow:0 1px 3px rgba(0,0,0,.08),0 1px 2px rgba(0,0,0,.04);
  --shadow-hover:0 4px 12px rgba(0,0,0,.12); --sidebar-w:240px;
}
[data-theme="dark"] {
  --bg:#0f1117; --sidebar-bg:#1a1d27; --card-bg:#1e2130; --border:#2d3148;
  --text:#e8eaf0; --text-secondary:#8b92a9; --accent:#4f8ef7; --accent-light:#1a2540;
  --shadow:0 1px 3px rgba(0,0,0,.3); --shadow-hover:0 4px 12px rgba(0,0,0,.4);
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;display:flex;flex-direction:column}
.topbar{height:52px;background:var(--sidebar-bg);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 16px;gap:12px;position:fixed;top:0;left:0;right:0;z-index:100}
.topbar-logo{font-size:15px;font-weight:700;color:var(--accent);display:flex;align-items:center;gap:6px}
.topbar-logo span{font-size:20px}
.menu-btn{width:32px;height:32px;border:none;background:none;cursor:pointer;display:flex;flex-direction:column;justify-content:center;gap:5px;padding:4px;border-radius:6px}
.menu-btn:hover{background:var(--bg)}
.menu-btn i{display:block;height:2px;background:var(--text-secondary);border-radius:2px}
.topbar-clock{display:flex;align-items:center;gap:10px;position:absolute;left:50%;transform:translateX(-50%)}
.clock-time{font-size:16px;font-weight:700;color:var(--text);font-variant-numeric:tabular-nums}
.clock-date,.clock-week,.clock-lunar{font-size:13px;color:var(--text-secondary)}
.clock-week{color:var(--accent);font-weight:600}
.clock-sep{color:var(--border);font-size:14px}
.topbar-right{margin-left:auto;display:flex;gap:8px}
.topbar-btn{padding:6px 14px;border-radius:8px;border:1px solid var(--border);background:var(--card-bg);color:var(--text);font-size:13px;cursor:pointer;transition:all .15s;white-space:nowrap}
.topbar-btn:hover{background:var(--accent);color:#fff;border-color:var(--accent)}
.topbar-btn.primary{background:var(--accent);color:#fff;border-color:var(--accent)}
.topbar-btn.primary:hover{background:#1d4ed8}
.layout{display:flex;margin-top:52px;min-height:calc(100vh - 52px)}
.sidebar{width:var(--sidebar-w);background:var(--sidebar-bg);border-right:1px solid var(--border);position:fixed;top:52px;bottom:0;left:0;overflow-y:auto;z-index:50;transition:transform .25s;display:flex;flex-direction:column}
.sidebar-section{padding:16px 12px 8px}
.sidebar-section-title{font-size:11px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.06em;padding:0 8px;margin-bottom:4px}
.nav-item{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;cursor:pointer;font-size:14px;color:var(--text-secondary);transition:all .15s;margin-bottom:2px}
.nav-item:hover{background:var(--bg);color:var(--text)}
.nav-item.active{background:var(--accent-light);color:var(--accent);font-weight:600}
.nav-icon{font-size:16px;width:20px;text-align:center}
.settings-panel{padding:8px 12px 16px;border-top:1px solid var(--border)}
.settings-title{font-size:11px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.06em;padding:12px 8px 8px}
.form-group{margin-bottom:10px}
.form-label{font-size:12px;color:var(--text-secondary);margin-bottom:4px;display:block;padding:0 2px}
.form-control{width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;color:var(--text);background:var(--bg);outline:none;transition:border .15s}
.form-control:focus{border-color:var(--accent)}
.toggle-row{display:flex;align-items:center;justify-content:space-between;padding:6px 2px}
.toggle-label{font-size:13px;color:var(--text)}
.toggle{position:relative;width:36px;height:20px;flex-shrink:0}
.toggle input{opacity:0;width:0;height:0}
.toggle-slider{position:absolute;inset:0;background:#d1d5db;border-radius:20px;cursor:pointer;transition:.2s}
.toggle-slider::after{content:'';position:absolute;width:16px;height:16px;background:#fff;border-radius:50%;top:2px;left:2px;transition:.2s}
.toggle input:checked + .toggle-slider{background:var(--accent)}
.toggle input:checked + .toggle-slider::after{transform:translateX(16px)}
.push-channel{margin-bottom:10px;border:1px solid var(--border);border-radius:8px;overflow:hidden}
.push-channel-header{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:var(--bg);font-size:13px;font-weight:500;color:var(--text)}
.push-channel-body{padding:8px 10px;display:none;border-top:1px solid var(--border)}
.push-channel-body.open{display:block}
.src-region-label{font-size:11px;color:var(--text-secondary);font-weight:600;padding:6px 2px 3px;text-transform:uppercase;letter-spacing:.04em}
.src-item{display:flex;align-items:center;gap:6px;padding:5px 8px;border-radius:6px;cursor:pointer;font-size:12px;color:var(--text-secondary);transition:all .15s;margin-bottom:1px}
.src-item input{display:none}
.src-item.active{color:var(--src-color,var(--accent));background:color-mix(in srgb,var(--src-color,var(--accent)) 12%,transparent)}
.src-item.src-fail{opacity:.4;text-decoration:line-through}
.src-item:hover{background:var(--bg);color:var(--text)}
.save-btn{width:100%;padding:9px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;margin-top:10px;transition:background .15s}
.save-btn:hover{background:#1d4ed8}
.main{margin-left:var(--sidebar-w);flex:1;padding:24px;min-width:0}
.news-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.news-title{font-size:22px;font-weight:700;color:var(--text)}
.news-count{font-size:13px;color:var(--text-secondary);background:var(--border);padding:3px 10px;border-radius:20px}
.search-bar{margin-bottom:16px}
.search-input{width:100%;padding:10px 14px;border:1px solid var(--border);border-radius:10px;font-size:14px;color:var(--text);background:var(--card-bg);outline:none;transition:border .15s}
.search-input:focus{border-color:var(--accent)}
.summary-card{background:var(--summary-bg);border-radius:var(--radius);padding:20px 24px;margin-bottom:20px;color:#fff}
.summary-header{margin-bottom:10px}
.ai-badge{font-size:12px;font-weight:700;background:rgba(255,255,255,.2);padding:3px 10px;border-radius:20px;letter-spacing:.04em}
.summary-body{font-size:14px;line-height:1.8;opacity:.95}
.news-grid{display:flex;flex-direction:column;gap:8px}
.news-card{background:var(--card-bg);border-radius:var(--radius);padding:14px 18px;border:1px solid var(--border);text-decoration:none;color:inherit;display:flex;align-items:flex-start;gap:14px;transition:all .15s;box-shadow:var(--shadow);position:relative}
.news-card:hover{box-shadow:var(--shadow-hover);border-color:var(--accent);transform:translateX(2px)}
.news-card.read{opacity:.55}
.card-left{flex-shrink:0;display:flex;flex-direction:column;align-items:flex-start;gap:4px;min-width:100px}
.card-source{font-size:11px;font-weight:600;padding:2px 8px;border-radius:20px;white-space:nowrap}
.card-time{font-size:11px;color:var(--text-secondary);white-space:nowrap}
.card-body{flex:1;min-width:0}
.card-title{font-size:14px;font-weight:600;color:var(--text);line-height:1.5;margin-bottom:4px}
.card-desc{font-size:12px;color:var(--text-secondary);line-height:1.6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.read-badge{position:absolute;top:10px;right:12px;font-size:10px;color:var(--text-secondary);background:var(--border);padding:1px 6px;border-radius:10px}
.loading{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 20px;gap:16px;color:var(--text-secondary)}
.spinner{width:36px;height:36px;border:3px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.error-msg{text-align:center;padding:60px 20px;color:#ef4444;font-size:14px}
.toast{position:fixed;bottom:24px;right:24px;padding:12px 20px;border-radius:10px;font-size:14px;font-weight:500;opacity:0;transform:translateY(10px);transition:all .25s;pointer-events:none;z-index:999;max-width:360px}
.toast.show{opacity:1;transform:translateY(0)}
.toast.success{background:#064e3b;color:#6ee7b7}
.toast.error{background:#450a0a;color:#fca5a5}
.toast.info{background:#1e3a5f;color:#93c5fd}
.overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.3);z-index:40}
.overlay.show{display:block}
@media(max-width:900px){
  .sidebar{transform:translateX(-100%)}
  .sidebar.open{transform:translateX(0)}
  .main{margin-left:0;padding:16px}
  .topbar-clock{display:none}
  .card-desc{display:none}
}`;

  // push channel rows
  function toggleInput(id) {
    return 'onclick="var b=document.getElementById(\'' + id + '\');b.classList.toggle(\'open\')"';
  }
  const pushChannels = [
    ['tg', 'Telegram', '🤖', [], 'tg-toggle'],
    ['wxpusher', 'WxPusher（微信）', '💬', [
      ['wxpusher-token', 'AppToken'],
      ['wxpusher-uid', 'UID'],
    ], 'wxpusher-toggle'],
    ['bark', 'Bark（iOS）', '🍎', [['bark-url', 'Bark URL (https://api.day.app/xxx)']], 'bark-toggle'],
    ['wxwork', '企业微信', '💼', [['wxwork-webhook', 'Webhook URL']], 'wxwork-toggle'],
    ['ding', '钉钉', '📎', [['ding-webhook', 'Webhook URL']], 'ding-toggle'],
    ['feishu', '飞书', '🪐', [['feishu-webhook', 'Webhook URL']], 'feishu-toggle'],
    ['pushplus', 'PushPlus（微信）', '📲', [['pushplus-token', 'Token']], 'pushplus-toggle'],
  ];

  const pushHTML = pushChannels.map(function(ch) {
    const [key, label, icon, fields, toggleId] = ch;
    const checked = key === 'tg' ? (config.tgEnabled !== false) : !!config[key + 'Enabled'];
    let html = '<div class="push-channel">';
    html += '<div class="push-channel-header">';
    html += '<span>' + icon + ' ' + label + '</span>';
    html += '<div style="display:flex;align-items:center;gap:8px">';
    if (fields.length) html += '<span style="font-size:11px;color:var(--text-secondary);cursor:pointer" ' + toggleInput(key + '-body') + '>配置 ▾</span>';
    html += '<label class="toggle"><input type="checkbox" id="' + toggleId + '"' + (checked ? ' checked' : '') + '><span class="toggle-slider"></span></label>';
    html += '</div></div>';
    if (fields.length) {
      html += '<div class="push-channel-body" id="' + key + '-body">';
      fields.forEach(function(f) {
        const val = config[f[0].replace(/-/g,'').replace('wxpushertoken','wxpusherToken').replace('wxpusheruid','wxpusherUid').replace('barkurl','barkUrl').replace('wxworkwebhook','wxworkWebhook').replace('dingwebhook','dingWebhook').replace('feishuwebhook','feishuWebhook').replace('pushplustoken','pushplusToken')] || '';
        html += '<label class="form-label">' + f[1] + '</label>';
        html += '<input class="form-control" type="text" id="' + f[0] + '" value="' + (val || '') + '" placeholder="' + f[1] + '" style="margin-bottom:6px">';
      });
      html += '</div>';
    }
    html += '</div>';
    return html;
  }).join('');

  return [
    '<!DOCTYPE html>',
    '<html lang="zh-CN">',
    '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">',
    '<title>中文新闻 Hub</title><style>' + css + '</style></head>',
    '<body>',
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
    '    <button class="topbar-btn" id="theme-btn" onclick="toggleTheme()" title="切换主题">🌙</button>',
    '    <button class="topbar-btn" onclick="checkHealth()">🔍 检测来源</button>',
    '    <button class="topbar-btn" onclick="loadNews()">🔄 刷新</button>',
    '    <button class="topbar-btn primary" onclick="testPush()">📤 推送</button>',
    '  </div>',
    '</div>',
    '<div class="overlay" id="overlay"></div>',
    '<div class="layout">',
    '<div class="sidebar" id="sidebar">',
    '  <div class="sidebar-section">',
    '    <div class="sidebar-section-title">新闻分类</div>',
    navItems,
    '  </div>',
    '  <div class="settings-panel">',
    '    <div class="settings-title">⚙️ 设置</div>',
    '    <div class="form-group"><label class="form-label">新闻分类</label><select class="form-control" id="cat-select">' + catOptions + '</select></div>',
    '    <div class="form-group"><label class="form-label">推送条数</label><input class="form-control" type="number" id="max-input" value="' + config.maxItems + '" min="1" max="50"></div>',
    '    <div class="form-group"><label class="form-label">包含关键词 <small style="color:#94a3b8;font-weight:400">（仅影响推送）</small></label><input class="form-control" type="text" id="kw-input" value="' + (config.keywords||'') + '" placeholder="逗号分隔"></div>',
    '    <div class="form-group"><label class="form-label">排除关键词 <small style="color:#94a3b8;font-weight:400">（仅影响推送）</small></label><input class="form-control" type="text" id="exkw-input" value="' + (config.excludeKeywords||'') + '" placeholder="逗号分隔"></div>',
    '    <div class="form-group"><label class="form-label">推送时间（北京时间，逗号分隔）</label><input class="form-control" type="text" id="hour-input" placeholder="例如: 8,12,16,20" value="' + (config.pushHours||'8,12,16,20') + '"></div>',
    '    <div class="toggle-row"><span class="toggle-label">定时推送</span><label class="toggle"><input type="checkbox" id="enabled-toggle"' + (config.enabled ? ' checked' : '') + '><span class="toggle-slider"></span></label></div>',
    '    <div class="toggle-row"><span class="toggle-label">AI 摘要</span><label class="toggle"><input type="checkbox" id="ai-toggle"' + (config.aiSummary !== false ? ' checked' : '') + '><span class="toggle-slider"></span></label></div>',
    '    <div class="settings-title" style="padding-top:14px">📲 推送渠道</div>',
    pushHTML,
    '    <div class="settings-title" style="padding-top:14px">📡 新闻来源</div>',
    '    <div id="src-grid"></div>',
    '    <button class="save-btn" onclick="saveConfig()">💾 保存配置</button>',
    '  </div>',
    '</div>',
    '<div class="main" id="main">',
    '  <div id="news-area"><div class="loading"><div class="spinner"></div><p>正在加载新闻...</p></div></div>',
    '</div>',
    '</div>',
    '<div class="toast" id="toast"></div>',
    '<script>' + buildScript() + '</script>',
    '</body></html>',
  ].join('\n');
}
