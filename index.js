// ============================================================
// Cloudflare News Hub - 中文媒体版 (侧边栏 + 新闻卡片)
// ============================================================

const DEFAULT_CONFIG = {
  category: 'general',            // 页面浏览分类（单选，跟随导航栏）
  pushCategories: ['general'],     // 推送分类（多选，独立控制）
  keywords: '',
  excludeKeywords: '',
  maxItems: 20,
  pushHours: '8,12,16,20',
  enabled: true,
  aiSummary: true,
  sources: ['rfa', 'voachinese', 'bbc_chinese', 'bbc_trad', 'hk01', 'mingpao', 'orientaldaily', 'singtao', 'hkej', 'appledaily_tw', 'udn', 'cna', 'rti', 'storm', 'thenewslens', 'ettoday', 'setn', 'initium', 'dwnews', 'chosun', 'zaobao', 'duowei', 'googlezh'],
};

const CATEGORIES = {
  // ── 综合 ──
  general:        { label: '综合新闻',   icon: '📰', group: '综合' },
  // ── 时事政治 ──
  world:          { label: '国际',       icon: '🌍', group: '时事' },
  china:          { label: '两岸三地',   icon: '🇨🇳', group: '时事' },
  politics:       { label: '政治',       icon: '🏛️', group: '时事' },
  society:        { label: '社会',       icon: '👥', group: '时事' },
  // ── 财经 ──
  business:       { label: '财经',       icon: '💹', group: '财经' },
  markets:        { label: '股市',       icon: '📈', group: '财经' },
  property:       { label: '房产',       icon: '🏠', group: '财经' },
  // ── 科技 ──
  technology:     { label: '科技',       icon: '💻', group: '科技' },
  ai:             { label: 'AI 人工智能', icon: '🤖', group: '科技' },
  // ── 生活 ──
  health:         { label: '健康医疗',   icon: '❤️', group: '生活' },
  entertainment:  { label: '娱乐',       icon: '🎬', group: '生活' },
  sports:         { label: '体育',       icon: '⚽', group: '生活' },
  science:        { label: '科学',       icon: '🔬', group: '生活' },
  culture:        { label: '文化艺术',   icon: '🎨', group: '生活' },
  travel:         { label: '旅游',       icon: '✈️', group: '生活' },
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
    googlezh:     (() => {
      if (config.keywords) return 'https://news.google.com/rss/search?q=' + encodeURIComponent(config.keywords) + '&hl=zh-TW&gl=TW&ceid=TW:zh-Hant';
      const catMap = {
        world:'WORLD', china:'WORLD', politics:'NATION', society:'NATION',
        business:'BUSINESS', markets:'BUSINESS', property:'BUSINESS',
        technology:'TECHNOLOGY', ai:'TECHNOLOGY',
        health:'HEALTH', entertainment:'ENTERTAINMENT',
        sports:'SPORTS', science:'SCIENCE',
        culture:'ENTERTAINMENT', travel:'TRAVEL',
      };
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
    if (url.pathname === '/api/news'   && request.method === 'GET')  return handleNews(request, env);
    return new Response(renderHTML(await getConfig(env), env), { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
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
// 新闻获取（优化⑤：RSS 源 KV 缓存 8 分钟）
// ============================================================
async function fetchFromSource(sourceKey, config, env) {
  const src = NEWS_SOURCES[sourceKey];
  if (!src) return [];
  try {
    const url = getSourceUrl(sourceKey, config);
    if (!url) return [];

    let xml = null;

    // 尝试从 KV 缓存读取 RSS 原始内容
    if (env && env.NEWS_CONFIG) {
      const cacheKey = 'rss_cache_' + sourceKey;
      try {
        const cached = await env.NEWS_CONFIG.get(cacheKey);
        if (cached) xml = cached;
      } catch {}
    }

    // 缓存未命中则实际请求
    if (!xml) {
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)' },
        signal: AbortSignal.timeout(10000),
      });
      if (!resp.ok) return [];
      xml = await resp.text();
      // 写入 KV，TTL 8 分钟
      if (env && env.NEWS_CONFIG && xml) {
        try { await env.NEWS_CONFIG.put('rss_cache_' + sourceKey, xml, { expirationTtl: 480 }); } catch {}
      }
    }

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

// ============================================================
// 标题相似度去重（优化②）
// 将标题分解为字符 bigram 集合，计算 Jaccard 相似度
// 同一事件不同来源标题相似度通常 > 0.5
// ============================================================
function titleTokens(title) {
  // 去除标点空格，取连续2字符bigram
  const clean = title.replace(/[\s\u3000\uff0c\u3001\u3002\uff01\uff1f\u300a\u300b「」『』【】〔〕《》""''·—…、，。！？：；]/g, '');
  const set = new Set();
  for (let i = 0; i < clean.length - 1; i++) set.add(clean.slice(i, i + 2));
  return set;
}

function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 1;
  let intersection = 0;
  for (const t of setA) { if (setB.has(t)) intersection++; }
  return intersection / (setA.size + setB.size - intersection);
}

function isSimilarTitle(title, acceptedTokenSets, threshold = 0.55) {
  const tokens = titleTokens(title);
  for (const set of acceptedTokenSets) {
    if (jaccardSimilarity(tokens, set) >= threshold) return true;
  }
  return false;
}

async function fetchAllNews(config, env) {
  const sources = (config.sources || DEFAULT_CONFIG.sources).filter(s => NEWS_SOURCES[s]);

  // 优化⑤：RSS 源缓存，每个源缓存 8 分钟，减少对外请求
  const results = await Promise.allSettled(sources.map(s => fetchFromSource(s, config, env)));
  const buckets = results.filter(r => r.status === 'fulfilled').map(r => r.value);

  const allItems = [];
  const acceptedTokenSets = []; // 已收录标题的 bigram 集合列表（用于相似度比对）

  let added = true;
  while (added && allItems.length < config.maxItems) {
    added = false;
    for (const bucket of buckets) {
      if (allItems.length >= config.maxItems) break;
      while (bucket.length > 0) {
        const item = bucket.shift();
        // 优化②：用 Jaccard 相似度替代简单前缀匹配
        if (isSimilarTitle(item.title, acceptedTokenSets)) continue;
        acceptedTokenSets.push(titleTokens(item.title));
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
  return str.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
}
function escapeTg(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ============================================================
// AI 摘要（优化④：统一缓存，页面和推送共用同一份）
// ============================================================
async function summarizeWithAI(env, items, config) {
  if (!env.AI) return null;
  try {
    const catLabel = (CATEGORIES[config.category] || {}).label || '综合';
    const newsList = items.map((item, i) => (i+1) + '. ' + item.title).join('\n');
    const prompt = '你是专业新闻编辑。以下是今日' + catLabel + '新闻标题，请：\n1. 提炼 3-5 个最重要要点，每点 1-2 句，简洁专业\n2. 最后一句给出今日趋势或值得关注的信号\n\n' + newsList + '\n\n直接输出摘要，不要前缀。';
    const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
    });
    return response?.choices?.[0]?.message?.content?.trim() || null;
  } catch { return null; }
}

// 统一的带缓存摘要获取（精确到小时，页面和推送共享）
async function getAISummary(env, items, config) {
  if (config.aiSummary === false) return null;
  if (!env.NEWS_CONFIG) return await summarizeWithAI(env, items, config);
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
// API: 新闻 + 摘要
// ============================================================
async function handleNews(request, env) {
  try {
    const config = await getConfig(env);
    const reqUrl = new URL(request.url);
    // 支持前端通过 ?cat=xxx 切换分类，不依赖 KV 存储的默认值
    const cat = reqUrl.searchParams.get('cat');
    const webConfig = {
      ...config,
      maxItems: 60,
      keywords: '',
      excludeKeywords: '',
      ...(cat && CATEGORIES[cat] ? { category: cat } : {}),
    };
    const items = await fetchAllNews(webConfig, env);
    const summary = await getAISummary(env, items, webConfig);
    return Response.json({ success: true, items, summary, category: (CATEGORIES[webConfig.category] || {}).label || '综合新闻' });
  } catch (e) { return Response.json({ success: false, message: e.message }, { status: 500 }); }
}

// ============================================================
// 推送渠道
// 所有 Token/Key 均通过 Cloudflare Worker 环境变量配置：
//   TG_TOKEN            Telegram Bot Token
//   TG_CHAT_ID          Telegram Chat ID
//   FEISHU_WEBHOOK      飞书自定义机器人 Webhook URL
//   DINGTALK_WEBHOOK    钉钉自定义机器人 Webhook URL
//   DINGTALK_SECRET     钉钉加签密钥（可选，有加签时填写）
//   WECOM_WEBHOOK       企业微信机器人 Webhook URL
//   PUSHPLUS_TOKEN      PushPlus 用户 Token
//   BARK_URL            Bark 推送 URL，例如 https://api.day.app/your_key
//   WXPUSHER_APP_TOKEN  WxPusher appToken
//   WXPUSHER_UIDS       接收用户 UID，逗号分隔
//   WXPUSHER_TOPIC_IDS  主题 ID，逗号分隔（可选）
//   NTFY_URL            ntfy 推送地址（含 topic），如 https://ntfy.sh/your_topic
//   NTFY_TOKEN          ntfy 访问令牌（可选，服务端开启认证时填写）
//   GOTIFY_URL          Gotify 服务地址，如 https://gotify.example.com
//   GOTIFY_TOKEN        Gotify 应用 Token
// ============================================================

// ── 优化①：跨批次推送去重 ──────────────────────────────────
// 将已推送标题的 bigram 集合持久化到 KV，TTL 24小时
// 下次推送前先过滤掉已推过的内容

const PUSHED_CACHE_KEY = 'pushed_titles_cache';

async function loadPushedTitles(env) {
  try {
    const raw = await env.NEWS_CONFIG.get(PUSHED_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];  // 返回已推标题数组
  } catch { return []; }
}

async function savePushedTitles(env, newTitles, existingTitles) {
  try {
    // 合并新旧，保留最近 500 条，避免 KV value 过大
    const merged = [...existingTitles, ...newTitles].slice(-500);
    await env.NEWS_CONFIG.put(PUSHED_CACHE_KEY, JSON.stringify(merged), { expirationTtl: 86400 });
  } catch {}
}

function filterAlreadyPushed(items, pushedTitles) {
  // 把历史已推标题全部转为 bigram 集合
  const pushedSets = pushedTitles.map(t => titleTokens(t));
  return items.filter(item => !isSimilarTitle(item.title, pushedSets));
}

// ── 构建消息 payload（含去重、多分类合并）────────────────────
async function buildPlainMessage(env, config) {
  // 兼容旧版单分类字段
  const pushCategories = config.pushCategories
    || (config.pushCategory ? [config.pushCategory] : null)
    || [config.category || 'general'];

  // 多分类并发抓取，合并去重
  const allItemsPerCat = await Promise.all(
    pushCategories.map(cat => {
      const catConfig = { ...config, category: cat, _maxAgeDays: 1 };
      return fetchAllNews(catConfig, env);
    })
  );

  // 跨分类合并，用相似度再次去重
  const merged = [];
  const mergedTokenSets = [];
  for (const items of allItemsPerCat) {
    for (const item of items) {
      if (!isSimilarTitle(item.title, mergedTokenSets)) {
        mergedTokenSets.push(titleTokens(item.title));
        merged.push(item);
      }
    }
  }

  // 按时间降序，截取 maxItems
  merged.sort((a, b) => {
    const ta = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const tb = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return tb - ta;
  });
  const allItems = merged.slice(0, config.maxItems || 20);

  if (allItems.length === 0) throw new Error('没有获取到新闻');

  // 跨批次去重
  const pushedTitles = await loadPushedTitles(env);
  const items = filterAlreadyPushed(allItems, pushedTitles);
  if (items.length === 0) throw new Error('没有新内容（本批次新闻已全部推送过）');

  // 分类标签：多个用 + 连接
  const catLabel = pushCategories
    .map(c => (CATEGORIES[c] || {}).label || c)
    .join(' + ');
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

  // AI 摘要用第一个分类作为上下文
  const summaryConfig = { ...config, category: pushCategories[0] };
  const summary = await getAISummary(env, items, summaryConfig);

  // 纯文本版
  let plain = '📰 中文新闻 Hub\n';
  plain += '🗂 ' + catLabel + ' | 🕐 ' + now + '\n';
  if (summary) plain += '\n━━━ 🤖 AI 摘要 ━━━\n' + summary + '\n';
  plain += '\n━━━ 📎 新闻列表 ━━━\n';
  items.forEach((item, i) => {
    plain += (i + 1) + '. ' + item.title + '\n   ' + (item.link || '') + '\n';
  });
  plain += '\n共 ' + items.length + ' 条';

  // Markdown 版
  let md = '## 📰 中文新闻 Hub\n';
  md += '**' + catLabel + '** | ' + now + '\n\n';
  if (summary) md += '### 🤖 AI 摘要\n' + summary + '\n\n';
  md += '### 📎 新闻列表\n';
  items.forEach((item, i) => {
    const link = item.link ? '[' + item.title + '](' + item.link + ')' : item.title;
    md += (i + 1) + '. ' + item.flag + ' **' + item.source + '** ' + link + '\n';
  });
  md += '\n> 共 ' + items.length + ' 条';

  return { items, plain, md, catLabel, now, summary, pushedTitles };
}

// ── Telegram ────────────────────────────────────────────────
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

// 优化③：将长消息按 4000 字符拆分，避免 Telegram 4096 字符上限报错
async function sendToTelegramSafe(env, message) {
  const LIMIT = 4000;
  if (message.length <= LIMIT) {
    return sendToTelegram(env, message);
  }
  // 按换行拆分，贪心合并成不超过 LIMIT 的分段
  const lines = message.split('\n');
  const chunks = [];
  let current = '';
  for (const line of lines) {
    const next = current ? current + '\n' + line : line;
    if (next.length > LIMIT) {
      if (current) chunks.push(current);
      current = line.length > LIMIT ? line.slice(0, LIMIT) : line;
    } else {
      current = next;
    }
  }
  if (current) chunks.push(current);

  for (let i = 0; i < chunks.length; i++) {
    const part = chunks.length > 1 ? chunks[i] + '\n\n<i>（' + (i+1) + '/' + chunks.length + '）</i>' : chunks[i];
    await sendToTelegram(env, part);
    // 多段之间稍作等待，避免触发 Telegram 速率限制
    if (i < chunks.length - 1) await new Promise(r => setTimeout(r, 500));
  }
}

async function pushTelegram(env, config, payload) {
  if (!env.TG_TOKEN || !env.TG_CHAT_ID) return { channel: 'Telegram', skipped: true };
  const { items, summary, catLabel, now } = payload;
  let msg = '📰 <b>中文新闻 Hub</b>\n🗂 ' + escapeTg(catLabel) + ' | 🕐 ' + escapeTg(now) + '\n';
  if (summary) msg += '\n━━━━━ 🤖 AI 今日摘要 ━━━━━\n\n' + escapeTg(summary) + '\n';
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
  await sendToTelegramSafe(env, msg);  // 优化③ 分段发送
  return { channel: 'Telegram', ok: true };
}

// ── 飞书 ────────────────────────────────────────────────────
async function pushFeishu(env, config, payload) {
  const webhook = env.FEISHU_WEBHOOK;
  if (!webhook) return { channel: '飞书', skipped: true };
  const { md } = payload;
  const body = {
    msg_type: 'interactive',
    card: {
      header: { title: { tag: 'plain_text', content: '📰 中文新闻 Hub' }, template: 'blue' },
      elements: [{ tag: 'markdown', content: md }],
    },
  };
  const resp = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await resp.json();
  if (data.code !== 0) throw new Error('飞书推送失败: ' + (data.msg || JSON.stringify(data)));
  return { channel: '飞书', ok: true };
}

// ── 钉钉 ────────────────────────────────────────────────────
async function pushDingtalk(env, config, payload) {
  const webhook = env.DINGTALK_WEBHOOK;
  if (!webhook) return { channel: '钉钉', skipped: true };
  const { md, catLabel } = payload;
  let url = webhook;
  // 加签支持
  if (env.DINGTALK_SECRET) {
    const timestamp = Date.now();
    const strToSign = timestamp + '\n' + env.DINGTALK_SECRET;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(env.DINGTALK_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig = await crypto.subtle.sign('HMAC', key, enc.encode(strToSign));
    const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
    url += (url.includes('?') ? '&' : '?') + 'timestamp=' + timestamp + '&sign=' + encodeURIComponent(b64);
  }
  const body = {
    msgtype: 'markdown',
    markdown: { title: '📰 中文新闻 Hub - ' + catLabel, text: md },
  };
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await resp.json();
  if (data.errcode !== 0) throw new Error('钉钉推送失败: ' + (data.errmsg || JSON.stringify(data)));
  return { channel: '钉钉', ok: true };
}

// ── 企业微信 ────────────────────────────────────────────────
async function pushWecom(env, config, payload) {
  const webhook = env.WECOM_WEBHOOK;
  if (!webhook) return { channel: '企业微信', skipped: true };
  const { md } = payload;
  const body = { msgtype: 'markdown', markdown: { content: md } };
  const resp = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await resp.json();
  if (data.errcode !== 0) throw new Error('企业微信推送失败: ' + (data.errmsg || JSON.stringify(data)));
  return { channel: '企业微信', ok: true };
}

// ── PushPlus ─────────────────────────────────────────────────
async function pushPushPlus(env, config, payload) {
  const token = env.PUSHPLUS_TOKEN;
  if (!token) return { channel: 'PushPlus', skipped: true };
  const { md, catLabel } = payload;
  const body = {
    token,
    title: '📰 中文新闻 Hub - ' + catLabel,
    content: md,
    template: 'markdown',
  };
  const resp = await fetch('https://www.pushplus.plus/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await resp.json();
  if (data.code !== 200) throw new Error('PushPlus 推送失败: ' + (data.msg || JSON.stringify(data)));
  return { channel: 'PushPlus', ok: true };
}

// ── Bark ─────────────────────────────────────────────────────
async function pushBark(env, config, payload) {
  const barkUrl = env.BARK_URL;
  if (!barkUrl) return { channel: 'Bark', skipped: true };
  const { plain, catLabel } = payload;
  // 使用 POST JSON 避免 GET URL 特殊字符被截断
  const base = barkUrl.replace(/\/$/, '');
  const resp = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: '📰 中文新闻 Hub - ' + catLabel,
      body: plain.slice(0, 1000),
      group: '新闻',
      icon: 'https://www.google.com/favicon.ico',
    }),
  });
  const data = await resp.json();
  if (data.code !== 200) throw new Error('Bark 推送失败: ' + (data.message || JSON.stringify(data)));
  return { channel: 'Bark', ok: true };
}

// ── WxPusher ─────────────────────────────────────────────────
// 环境变量：
//   WXPUSHER_APP_TOKEN   应用的 appToken（在 WxPusher 后台创建应用后获得）
//   WXPUSHER_UIDS        接收消息的用户 UID，多个用英文逗号分隔，例如 UID_xxx,UID_yyy
//   WXPUSHER_TOPIC_IDS   接收消息的主题 ID，多个用英文逗号分隔（可选，与 UIDS 二选一或同时填）
async function pushWxPusher(env, config, payload) {
  const appToken = env.WXPUSHER_APP_TOKEN;
  if (!appToken) return { channel: 'WxPusher', skipped: true };

  const { md, catLabel } = payload;

  // 解析 UID 列表（允许为空，此时依赖 topicIds）
  const uids = (env.WXPUSHER_UIDS || '')
    .split(/[,，\s]+/).map(s => s.trim()).filter(Boolean);

  // 解析 Topic ID 列表
  const topicIds = (env.WXPUSHER_TOPIC_IDS || '')
    .split(/[,，\s]+/).map(s => parseInt(s.trim())).filter(n => !isNaN(n));

  if (uids.length === 0 && topicIds.length === 0) {
    throw new Error('WxPusher：请配置 WXPUSHER_UIDS 或 WXPUSHER_TOPIC_IDS');
  }

  const body = {
    appToken,
    content: md,
    summary: '📰 中文新闻 Hub - ' + catLabel,  // 消息摘要，显示在微信列表页
    contentType: 3,   // 3 = Markdown
    uids: uids.length > 0 ? uids : undefined,
    topicIds: topicIds.length > 0 ? topicIds : undefined,
    verifyPayType: 0, // 0 = 不验证，直接发送
  };

  const resp = await fetch('https://wxpusher.zjiecode.com/api/send/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await resp.json();
  // WxPusher 成功时 code=1000
  if (data.code !== 1000) throw new Error('WxPusher 推送失败: ' + (data.msg || JSON.stringify(data)));
  return { channel: 'WxPusher', ok: true };
}

// ── ntfy ─────────────────────────────────────────────────────
// 环境变量：
//   NTFY_URL      ntfy 推送地址，含 topic，如 https://ntfy.sh/your_topic
//                 自托管示例：https://ntfy.example.com/your_topic
//   NTFY_TOKEN    访问令牌（可选，服务端开启认证时填写）
async function pushNtfy(env, config, payload) {
  const ntfyUrl = env.NTFY_URL;
  if (!ntfyUrl) return { channel: 'ntfy', skipped: true };
  const { plain, catLabel } = payload;
  const headers = {
    'Title':    '📰 中文新闻 Hub - ' + catLabel,
    'Priority': 'default',
    'Tags':     'newspaper',
    'Content-Type': 'text/plain; charset=utf-8',
  };
  if (env.NTFY_TOKEN) headers['Authorization'] = 'Bearer ' + env.NTFY_TOKEN;
  const resp = await fetch(ntfyUrl, {
    method: 'POST',
    headers,
    body: plain.slice(0, 4000),
  });
  if (!resp.ok) throw new Error('ntfy 推送失败: HTTP ' + resp.status);
  return { channel: 'ntfy', ok: true };
}

// ── Gotify ────────────────────────────────────────────────────
// 环境变量：
//   GOTIFY_URL    Gotify 服务地址，如 https://gotify.example.com
//   GOTIFY_TOKEN  应用 Token（在 Gotify 后台「Apps」中创建应用获得）
async function pushGotify(env, config, payload) {
  const gotifyUrl = env.GOTIFY_URL;
  const gotifyToken = env.GOTIFY_TOKEN;
  if (!gotifyUrl || !gotifyToken) return { channel: 'Gotify', skipped: true };
  const { md, catLabel } = payload;
  const base = gotifyUrl.replace(/\/$/, '');
  const resp = await fetch(base + '/message?token=' + encodeURIComponent(gotifyToken), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title:    '📰 中文新闻 Hub - ' + catLabel,
      message:  md,
      priority: 5,
      extras: {
        'client::display': { contentType: 'text/markdown' },
      },
    }),
  });
  if (!resp.ok) throw new Error('Gotify 推送失败: HTTP ' + resp.status);
  return { channel: 'Gotify', ok: true };
}

// ── 统一推送入口（优化①⑥）──────────────────────────────────
async function runAllPush(env, config, { isRetry = false } = {}) {
  // 优化⑥：重试模式，先读取失败渠道，若无则提前返回，避免无谓构建 payload
  let failedChannels = [];
  if (isRetry) {
    try {
      const raw = await env.NEWS_CONFIG.get('push_failed_channels');
      failedChannels = raw ? JSON.parse(raw) : [];
    } catch {}
    if (failedChannels.length === 0) return { count: 0, summary: ['无待重试渠道'] };
  }

  const payload = await buildPlainMessage(env, config);

  const allPushers = [
    { name: 'Telegram',   fn: pushTelegram },
    { name: '飞书',        fn: pushFeishu },
    { name: '钉钉',        fn: pushDingtalk },
    { name: '企业微信',    fn: pushWecom },
    { name: 'PushPlus',   fn: pushPushPlus },
    { name: 'Bark',        fn: pushBark },
    { name: 'WxPusher',   fn: pushWxPusher },
    { name: 'ntfy',        fn: pushNtfy },
    { name: 'Gotify',      fn: pushGotify },
  ];

  // 重试模式只跑上次失败的渠道
  const pushers = isRetry
    ? allPushers.filter(p => failedChannels.includes(p.name))
    : allPushers;

  const results = await Promise.allSettled(
    pushers.map(p => p.fn(env, config, payload))
  );

  const newFailedChannels = [];
  const summary = results.map((r, i) => {
    if (r.status === 'fulfilled') {
      const v = r.value;
      if (v.skipped) return v.channel + ':未配置';
      return v.channel + ':✅';
    }
    // 记录失败渠道，供下次重试
    newFailedChannels.push(pushers[i].name);
    return pushers[i].name + ':❌(' + (r.reason?.message || '未知错误') + ')';
  });

  // 优化⑥：保存失败渠道列表（TTL 2小时，超时自动清除）
  if (newFailedChannels.length > 0) {
    try { await env.NEWS_CONFIG.put('push_failed_channels', JSON.stringify(newFailedChannels), { expirationTtl: 7200 }); } catch {}
  } else {
    try { await env.NEWS_CONFIG.delete('push_failed_channels'); } catch {}
  }

  // 优化①：推送成功后保存已推标题（不管是否全部渠道成功，只要有一个成功就记录）
  const anySuccess = results.some(r => r.status === 'fulfilled' && !r.value?.skipped);
  if (anySuccess) {
    await savePushedTitles(env, payload.items.map(i => i.title), payload.pushedTitles);
  }

  return { count: payload.items.length, summary };
}

async function runNewsPush(env) {
  const config = await getConfig(env);
  if (!config.enabled) return;
  const now = new Date();
  const hour = parseInt(now.toLocaleString('en-US', { timeZone: 'Asia/Shanghai', hour: 'numeric', hour12: false }));
  const pushHours = String(config.pushHours || config.pushHour || '8')
    .split(/[,，\s]+/).map(h => parseInt(h.trim())).filter(h => !isNaN(h));

  const today = now.toISOString().slice(0, 10);
  const runKey = 'lastRun_' + today + '_' + hour;

  // 优化⑥：检查是否有上次失败需要重试
  let failedRaw = null;
  try { failedRaw = await env.NEWS_CONFIG.get('push_failed_channels'); } catch {}
  if (failedRaw) {
    // 有失败渠道，先尝试重试（不受整点限制）
    await runAllPush(env, config, { isRetry: true });
  }

  if (!pushHours.includes(hour)) return;
  const lastRun = await env.NEWS_CONFIG.get(runKey);
  if (lastRun) return;

  await runAllPush(env, config);
  await env.NEWS_CONFIG.put(runKey, '1');
}

async function handleTestPush(env) {
  try {
    const config = await getConfig(env);
    const { count, summary } = await runAllPush(env, config);
    return Response.json({ success: true, message: '推送完成！共 ' + count + ' 条\n' + summary.join(' | ') });
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
  general:       {label:'综合新闻',   icon:'📰', group:'综合'},
  world:         {label:'国际',       icon:'🌍', group:'时事'},
  china:         {label:'两岸三地',   icon:'🇨🇳', group:'时事'},
  politics:      {label:'政治',       icon:'🏛️', group:'时事'},
  society:       {label:'社会',       icon:'👥', group:'时事'},
  business:      {label:'财经',       icon:'💹', group:'财经'},
  markets:       {label:'股市',       icon:'📈', group:'财经'},
  property:      {label:'房产',       icon:'🏠', group:'财经'},
  technology:    {label:'科技',       icon:'💻', group:'科技'},
  ai:            {label:'AI 人工智能',icon:'🤖', group:'科技'},
  health:        {label:'健康医疗',   icon:'❤️', group:'生活'},
  entertainment: {label:'娱乐',       icon:'🎬', group:'生活'},
  sports:        {label:'体育',       icon:'⚽', group:'生活'},
  science:       {label:'科学',       icon:'🔬', group:'生活'},
  culture:       {label:'文化艺术',   icon:'🎨', group:'生活'},
  travel:        {label:'旅游',       icon:'✈️', group:'生活'},
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
  var pushCats = config.pushCategories || (config.pushCategory ? [config.pushCategory] : ['general']);
  // 回填推送分类 chip 选中状态
  document.querySelectorAll('.pcat-chip').forEach(function(el) {
    el.classList.toggle('pcat-active', pushCats.includes(el.dataset.cat));
  });
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

// chip 点击切换
window.togglePushCat = function(el) {
  el.classList.toggle('pcat-active');
  // 至少保留一个选中
  var actives = document.querySelectorAll('.pcat-chip.pcat-active');
  if (actives.length === 0) el.classList.add('pcat-active');
};

async function saveConfig() {
  var sources = Array.from(document.querySelectorAll('#src-grid input:checked')).map(function(el){return el.value;});
  var pushCategories = Array.from(document.querySelectorAll('.pcat-chip.pcat-active')).map(function(el){return el.dataset.cat;});
  if (pushCategories.length === 0) pushCategories = ['general'];
  var newConf = {
    category: currentCategory,
    pushCategories: pushCategories,
    keywords: document.getElementById('kw-input').value,
    excludeKeywords: document.getElementById('exkw-input').value,
    maxItems: parseInt(document.getElementById('max-input').value) || 20,
    pushHours: document.getElementById('hour-input').value,
    enabled: document.getElementById('enabled-toggle').checked,
    aiSummary: document.getElementById('ai-toggle').checked,
    sources: sources,
  };
  config = newConf;
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
    var r = await fetch('/api/news?cat=' + encodeURIComponent(currentCategory));
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

// ── 折叠块 ──
var BLOCK_IDS = ['blk-sources', 'blk-settings', 'blk-channels'];

window.toggleBlock = function(id) {
  var el = document.getElementById(id);
  if (!el) return;
  var isOpen = el.classList.toggle('open');
  // 记住状态到 localStorage
  try {
    var state = JSON.parse(localStorage.getItem('collapse_state') || '{}');
    state[id] = isOpen;
    localStorage.setItem('collapse_state', JSON.stringify(state));
  } catch(e) {}
};

function initCollapseBlocks() {
  var state = {};
  try { state = JSON.parse(localStorage.getItem('collapse_state') || '{}'); } catch(e) {}
  BLOCK_IDS.forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    // 默认全部收起，除非 localStorage 里有记录为 true
    if (state[id] === true) el.classList.add('open');
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initCollapseBlocks();
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

function renderHTML(config, env) {
  const catOptions = Object.entries(CATEGORIES).map(function(e) {
    return '<option value="' + e[0] + '"' + (config.category === e[0] ? ' selected' : '') + '>' + e[1].icon + ' ' + e[1].label + '</option>';
  }).join('');

  // 推送分类多选 chip HTML（服务端渲染选中状态）
  const pushCats = config.pushCategories
    || (config.pushCategory ? [config.pushCategory] : ['general']);
  // 按 group 分组渲染
  const groups = {};
  Object.entries(CATEGORIES).forEach(([k, v]) => {
    if (!groups[v.group]) groups[v.group] = [];
    groups[v.group].push({ key: k, ...v });
  });
  const pushChips = Object.entries(groups).map(([grpName, cats]) => {
    const chips = cats.map(c => {
      const active = pushCats.includes(c.key) ? ' pcat-active' : '';
      return '<span class="pcat-chip' + active + '" data-cat="' + c.key + '" onclick="togglePushCat(this)">' + c.icon + ' ' + c.label + '</span>';
    }).join('');
    return '<div class="pcat-group"><span class="pcat-group-label">' + grpName + '</span>' + chips + '</div>';
  }).join('');

  // 导航栏：分组显示
  const navGroups = {};
  Object.entries(CATEGORIES).forEach(([k, v]) => {
    if (!navGroups[v.group]) navGroups[v.group] = [];
    navGroups[v.group].push({ key: k, ...v });
  });
  const navItems = Object.entries(navGroups).map(([grpName, cats]) => {
    const items = cats.map(c =>
      '<div class="nav-item' + (config.category === c.key ? ' active' : '') + '" data-cat="' + c.key + '" onclick="selectCategory(\'' + c.key + '\')">' +
        '<span class="nav-icon">' + c.icon + '</span>' +
        '<span class="nav-label">' + c.label + '</span>' +
      '</div>'
    ).join('');
    return '<div class="nav-group-label">' + grpName + '</div>' + items;
  }).join('');

  // 推送渠道配置状态检测（服务端渲染）
  const CHANNELS = [
    {
      icon: '✈️', name: 'Telegram',
      vars: [
        { key: 'TG_TOKEN',   configured: !!(env && env.TG_TOKEN) },
        { key: 'TG_CHAT_ID', configured: !!(env && env.TG_CHAT_ID) },
      ],
    },
    {
      icon: '🪶', name: '飞书',
      vars: [{ key: 'FEISHU_WEBHOOK', configured: !!(env && env.FEISHU_WEBHOOK) }],
    },
    {
      icon: '📎', name: '钉钉',
      vars: [
        { key: 'DINGTALK_WEBHOOK', configured: !!(env && env.DINGTALK_WEBHOOK) },
        { key: 'DINGTALK_SECRET',  configured: !!(env && env.DINGTALK_SECRET), optional: true },
      ],
    },
    {
      icon: '💼', name: '企业微信',
      vars: [{ key: 'WECOM_WEBHOOK', configured: !!(env && env.WECOM_WEBHOOK) }],
    },
    {
      icon: '➕', name: 'PushPlus',
      vars: [{ key: 'PUSHPLUS_TOKEN', configured: !!(env && env.PUSHPLUS_TOKEN) }],
    },
    {
      icon: '🔔', name: 'Bark',
      vars: [{ key: 'BARK_URL', configured: !!(env && env.BARK_URL) }],
    },
    {
      icon: '💬', name: 'WxPusher',
      vars: [
        { key: 'WXPUSHER_APP_TOKEN',  configured: !!(env && env.WXPUSHER_APP_TOKEN) },
        { key: 'WXPUSHER_UIDS',       configured: !!(env && env.WXPUSHER_UIDS),      optional: true },
        { key: 'WXPUSHER_TOPIC_IDS',  configured: !!(env && env.WXPUSHER_TOPIC_IDS), optional: true },
      ],
    },
    {
      icon: '🔔', name: 'ntfy',
      vars: [
        { key: 'NTFY_URL',   configured: !!(env && env.NTFY_URL) },
        { key: 'NTFY_TOKEN', configured: !!(env && env.NTFY_TOKEN), optional: true },
      ],
    },
    {
      icon: '📡', name: 'Gotify',
      vars: [
        { key: 'GOTIFY_URL',   configured: !!(env && env.GOTIFY_URL) },
        { key: 'GOTIFY_TOKEN', configured: !!(env && env.GOTIFY_TOKEN) },
      ],
    },
  ];

  // 判断渠道整体是否已配置（必填项全部有值）
  function isChannelReady(ch) {
    return ch.vars.filter(v => !v.optional).every(v => v.configured);
  }

  // 渲染每个渠道条目
  const channelItems = CHANNELS.map(ch => {
    const ready = isChannelReady(ch);
    // 变量标签：已配置绿色✓，未配置显示变量名
    const varTags = ch.vars.map(v => {
      if (v.configured) {
        return '<span class="ch-tag ch-tag-ok">' + v.key + ' ✓</span>';
      } else if (v.optional) {
        return '<span class="ch-tag ch-tag-opt">' + v.key + '<span class="ch-opt-label">可选</span></span>';
      } else {
        return '<span class="ch-tag ch-tag-missing">' + v.key + '</span>';
      }
    }).join('');
    return (
      '<div class="push-channel-item' + (ready ? ' ch-ready' : '') + '">' +
        '<span class="ch-icon">' + ch.icon + '</span>' +
        '<div class="ch-body">' +
          '<div class="ch-name-row">' +
            '<span class="ch-name">' + ch.name + '</span>' +
            (ready
              ? '<span class="ch-status ch-status-ok">已配置</span>'
              : '<span class="ch-status ch-status-off">未配置</span>') +
          '</div>' +
          '<div class="ch-vars">' + varTags + '</div>' +
        '</div>' +
      '</div>'
    );
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
.nav-group-label { font-size: 10px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: .06em; padding: 10px 20px 3px; opacity: .7; }

/* Push category chips */
.pcat-wrap { display: flex; flex-direction: column; gap: 4px; }
.pcat-group { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; }
.pcat-group-label { font-size: 10px; font-weight: 700; color: var(--text-secondary); width: 100%; padding-top: 4px; text-transform: uppercase; letter-spacing: .04em; }
.pcat-chip { font-size: 11px; padding: 3px 8px; border-radius: 20px; border: 1px solid var(--border); background: var(--bg); color: var(--text-secondary); cursor: pointer; transition: all .15s; white-space: nowrap; user-select: none; }
.pcat-chip:hover { border-color: var(--accent); color: var(--accent); }
.pcat-chip.pcat-active { background: var(--accent); color: #fff; border-color: var(--accent); font-weight: 600; }
[data-theme="dark"] .pcat-chip.pcat-active { background: var(--accent); }

/* Settings panel in sidebar */
.settings-panel { padding: 8px 12px 16px; border-top: 1px solid var(--border); margin-top: auto; }
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

/* Collapse blocks */
.collapse-block { border: 1px solid var(--border); border-radius: 8px; margin-bottom: 6px; overflow: hidden; }
.collapse-hd { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; background: var(--bg); border: none; cursor: pointer; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: .05em; transition: background .15s; gap: 6px; }
.collapse-hd:hover { background: var(--border); color: var(--text); }
.collapse-arrow { font-size: 12px; transition: transform .2s; flex-shrink: 0; }
.collapse-block.open > .collapse-hd .collapse-arrow { transform: rotate(180deg); }
.collapse-bd { display: none; padding: 10px 10px 12px; border-top: 1px solid var(--border); }
.collapse-block.open > .collapse-bd { display: block; }
.src-region-label { font-size: 11px; color: var(--text-secondary); font-weight: 600; padding: 6px 2px 3px; text-transform: uppercase; letter-spacing: .04em; }
.push-channels { display: flex; flex-direction: column; gap: 5px; margin-bottom: 8px; }
.push-channel-item { display: flex; align-items: flex-start; gap: 8px; padding: 7px 8px; border-radius: 8px; background: var(--bg); border: 1px solid var(--border); transition: border-color .15s; }
.push-channel-item.ch-ready { border-color: #16a34a55; background: #f0fdf4; }
[data-theme="dark"] .push-channel-item.ch-ready { background: #052e16; border-color: #16a34a88; }
.ch-icon { font-size: 15px; flex-shrink: 0; margin-top: 2px; }
.ch-body { flex: 1; min-width: 0; }
.ch-name-row { display: flex; align-items: center; gap: 5px; margin-bottom: 4px; }
.ch-name { font-size: 12px; font-weight: 600; color: var(--text); }
.ch-status { font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 10px; flex-shrink: 0; }
.ch-status-ok  { background: #dcfce7; color: #15803d; }
.ch-status-off { background: var(--border); color: var(--text-secondary); }
[data-theme="dark"] .ch-status-ok  { background: #14532d; color: #4ade80; }
[data-theme="dark"] .ch-status-off { background: #2d3148; color: #6b7280; }
.ch-vars { display: flex; flex-wrap: wrap; gap: 3px; }
.ch-tag { font-size: 10px; font-family: monospace; padding: 1px 5px; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px; }
.ch-tag-ok      { background: #dcfce7; color: #15803d; }
.ch-tag-missing { background: #fef2f2; color: #b91c1c; border: 1px dashed #fca5a5; }
.ch-tag-opt     { background: var(--bg); color: var(--text-secondary); border: 1px solid var(--border); }
[data-theme="dark"] .ch-tag-ok      { background: #14532d; color: #4ade80; }
[data-theme="dark"] .ch-tag-missing { background: #450a0a; color: #fca5a5; border-color: #7f1d1d; }
[data-theme="dark"] .ch-tag-opt     { background: #1e2130; color: #6b7280; }
.ch-opt-label { font-size: 9px; opacity: .7; }
.push-hint { font-size: 11px; color: var(--text-secondary); line-height: 1.5; padding: 4px 2px 10px; }
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
    '    <button class="topbar-btn primary" onclick="testPush()">📤 立即推送</button>',
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

    // ── 折叠块 1：新闻来源 ──
    '    <div class="collapse-block" id="blk-sources">',
    '      <button class="collapse-hd" onclick="toggleBlock(\'blk-sources\')">',
    '        <span>📡 新闻来源</span><span class="collapse-arrow">▾</span>',
    '      </button>',
    '      <div class="collapse-bd">',
    '        <div id="src-grid"></div>',
    '      </div>',
    '    </div>',

    // ── 折叠块 2：推送设置 ──
    '    <div class="collapse-block" id="blk-settings">',
    '      <button class="collapse-hd" onclick="toggleBlock(\'blk-settings\')">',
    '        <span>⚙️ 推送设置</span><span class="collapse-arrow">▾</span>',
    '      </button>',
    '      <div class="collapse-bd">',

    '        <div class="form-group">',
    '          <label class="form-label">推送分类 <small style="color:#94a3b8;font-weight:400">可多选</small></label>',
    '          <div class="pcat-wrap">' + pushChips + '</div>',
    '        </div>',

    '        <div class="form-group">',
    '          <input class="form-control" type="number" id="max-input" value="' + config.maxItems + '" min="1" max="50">',
    '        </div>',

    '        <div class="form-group">',
    '          <label class="form-label">包含关键词 <small style="color:#94a3b8;font-weight:400">逗号分隔</small></label>',
    '          <input class="form-control" type="text" id="kw-input" value="' + config.keywords + '" placeholder="逗号分隔">',
    '        </div>',

    '        <div class="form-group">',
    '          <label class="form-label">排除关键词 <small style="color:#94a3b8;font-weight:400">逗号分隔</small></label>',
    '          <input class="form-control" type="text" id="exkw-input" value="' + config.excludeKeywords + '" placeholder="逗号分隔">',
    '        </div>',

    '        <div class="form-group">',
    '          <label class="form-label">推送时间（北京时间，逗号分隔）</label>',
    '          <input class="form-control" type="text" id="hour-input" placeholder="例如: 8,12,16,20" value="' + (config.pushHours || config.pushHour || '8,12,16,20') + '">',
    '        </div>',

    '        <div class="toggle-row">',
    '          <span class="toggle-label">定时推送</span>',
    '          <label class="toggle"><input type="checkbox" id="enabled-toggle"' + (config.enabled ? ' checked' : '') + '><span class="toggle-slider"></span></label>',
    '        </div>',
    '        <div class="toggle-row">',
    '          <span class="toggle-label">AI 摘要</span>',
    '          <label class="toggle"><input type="checkbox" id="ai-toggle"' + (config.aiSummary !== false ? ' checked' : '') + '><span class="toggle-slider"></span></label>',
    '        </div>',

    '      </div>',
    '    </div>',

    // ── 折叠块 3：推送渠道 ──
    '    <div class="collapse-block" id="blk-channels">',
    '      <button class="collapse-hd" onclick="toggleBlock(\'blk-channels\')">',
    '        <span>📬 推送渠道</span><span class="collapse-arrow">▾</span>',
    '      </button>',
    '      <div class="collapse-bd">',
    '        <div class="push-channels">',
    channelItems,
    '        </div>',
    '        <p class="push-hint">在 Cloudflare Worker → Settings → Variables 中添加变量后刷新页面即可生效。</p>',
    '      </div>',
    '    </div>',

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
