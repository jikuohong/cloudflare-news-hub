var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// index.js
var DEFAULT_CONFIG = {
  category: "general",
  // 页面浏览分类（单选，跟随导航栏）
  pushCategories: ["general"],
  // 推送分类（多选，独立控制）
  keywords: "",
  excludeKeywords: "",
  maxItems: 20,
  pushHours: "8,12,16,20",
  enabled: true,
  aiSummary: true,
  sources: ["rfa", "voachinese", "bbc_chinese", "bbc_trad", "hk01", "mingpao", "orientaldaily", "singtao", "hkej", "appledaily_tw", "udn", "cna", "rti", "storm", "thenewslens", "ettoday", "setn", "initium", "dwnews", "chosun", "zaobao", "duowei", "googlezh"],
  // 天气推送
  weatherCity: "",
  // 天气推送城市（空则不推送），支持中英文城市名
  weatherEnabled: true
  // 天气推送开关
};
var CATEGORIES = {
  // ── 综合 ──
  general: { label: "\u7EFC\u5408\u65B0\u95FB", icon: "\u{1F4F0}", group: "\u7EFC\u5408" },
  // ── 时事政治 ──
  world: { label: "\u56FD\u9645", icon: "\u{1F30D}", group: "\u65F6\u4E8B" },
  china: { label: "\u4E24\u5CB8\u4E09\u5730", icon: "\u{1F1E8}\u{1F1F3}", group: "\u65F6\u4E8B" },
  politics: { label: "\u653F\u6CBB", icon: "\u{1F3DB}\uFE0F", group: "\u65F6\u4E8B" },
  society: { label: "\u793E\u4F1A", icon: "\u{1F465}", group: "\u65F6\u4E8B" },
  // ── 财经 ──
  business: { label: "\u8D22\u7ECF", icon: "\u{1F4B9}", group: "\u8D22\u7ECF" },
  markets: { label: "\u80A1\u5E02", icon: "\u{1F4C8}", group: "\u8D22\u7ECF" },
  property: { label: "\u623F\u4EA7", icon: "\u{1F3E0}", group: "\u8D22\u7ECF" },
  // ── 科技 ──
  technology: { label: "\u79D1\u6280", icon: "\u{1F4BB}", group: "\u79D1\u6280" },
  ai: { label: "AI \u4EBA\u5DE5\u667A\u80FD", icon: "\u{1F916}", group: "\u79D1\u6280" },
  // ── 生活 ──
  health: { label: "\u5065\u5EB7\u533B\u7597", icon: "\u2764\uFE0F", group: "\u751F\u6D3B" },
  entertainment: { label: "\u5A31\u4E50", icon: "\u{1F3AC}", group: "\u751F\u6D3B" },
  sports: { label: "\u4F53\u80B2", icon: "\u26BD", group: "\u751F\u6D3B" },
  science: { label: "\u79D1\u5B66", icon: "\u{1F52C}", group: "\u751F\u6D3B" },
  culture: { label: "\u6587\u5316\u827A\u672F", icon: "\u{1F3A8}", group: "\u751F\u6D3B" },
  travel: { label: "\u65C5\u6E38", icon: "\u2708\uFE0F", group: "\u751F\u6D3B" }
};
var NEWS_SOURCES = {
  hk01: { label: "\u9999\u6E2F01", flag: "\u{1F1ED}\u{1F1F0}", region: "\u9999\u6E2F" },
  mingpao: { label: "\u660E\u62A5", flag: "\u{1F1ED}\u{1F1F0}", region: "\u9999\u6E2F" },
  orientaldaily: { label: "\u4E1C\u65B9\u65E5\u62A5", flag: "\u{1F1ED}\u{1F1F0}", region: "\u9999\u6E2F" },
  appledaily_tw: { label: "\u81EA\u7531\u65F6\u62A5", flag: "\u{1F1F9}\u{1F1FC}", region: "\u53F0\u6E7E" },
  udn: { label: "\u8054\u5408\u65B0\u95FB\u7F51", flag: "\u{1F1F9}\u{1F1FC}", region: "\u53F0\u6E7E" },
  cna: { label: "\u4E2D\u592E\u793E", flag: "\u{1F1F9}\u{1F1FC}", region: "\u53F0\u6E7E" },
  rti: { label: "\u4E2D\u592E\u5E7F\u64AD\u7535\u53F0", flag: "\u{1F1F9}\u{1F1FC}", region: "\u53F0\u6E7E" },
  rfa: { label: "\u81EA\u7531\u4E9A\u6D32\u7535\u53F0", flag: "\u{1F30F}", region: "\u6D77\u5916" },
  voachinese: { label: "\u7F8E\u56FD\u4E4B\u97F3\u4E2D\u6587", flag: "\u{1F1FA}\u{1F1F8}", region: "\u6D77\u5916" },
  bbc_chinese: { label: "BBC\u4E2D\u6587(\u7B80)", flag: "\u{1F1EC}\u{1F1E7}", region: "\u6D77\u5916" },
  bbc_trad: { label: "BBC\u4E2D\u6587(\u7E41)", flag: "\u{1F1EC}\u{1F1E7}", region: "\u6D77\u5916" },
  initium: { label: "\u7AEF\u4F20\u5A92", flag: "\u{1F310}", region: "\u6D77\u5916" },
  dwnews: { label: "\u5FB7\u56FD\u4E4B\u58F0\u4E2D\u6587", flag: "\u{1F1E9}\u{1F1EA}", region: "\u6D77\u5916" },
  googlezh: { label: "Google\u65B0\u95FB", flag: "\u{1F50D}", region: "\u805A\u5408" },
  chosun: { label: "\u671D\u9C9C\u65E5\u62A5\u4E2D\u6587", flag: "\u{1F1F0}\u{1F1F7}", region: "\u6D77\u5916" },
  zaobao: { label: "\u8054\u5408\u65E9\u62A5", flag: "\u{1F1F8}\u{1F1EC}", region: "\u6D77\u5916" },
  duowei: { label: "\u591A\u7EF4\u65B0\u95FB", flag: "\u{1F310}", region: "\u6D77\u5916" },
  singtao: { label: "\u661F\u5C9B\u65E5\u62A5", flag: "\u{1F1ED}\u{1F1F0}", region: "\u9999\u6E2F" },
  hkej: { label: "\u4FE1\u62A5", flag: "\u{1F1ED}\u{1F1F0}", region: "\u9999\u6E2F" },
  storm: { label: "\u98CE\u4F20\u5A92", flag: "\u{1F1F9}\u{1F1FC}", region: "\u53F0\u6E7E" },
  thenewslens: { label: "\u5173\u952E\u8BC4\u8BBA\u7F51", flag: "\u{1F1F9}\u{1F1FC}", region: "\u53F0\u6E7E" },
  ettoday: { label: "ETtoday", flag: "\u{1F1F9}\u{1F1FC}", region: "\u53F0\u6E7E" },
  setn: { label: "\u4E09\u7ACB\u65B0\u95FB", flag: "\u{1F1F9}\u{1F1FC}", region: "\u53F0\u6E7E" }
};
function getSourceUrl(key, config) {
  const urls = {
    hk01: "https://www.hk01.com/rss/\u4E16\u754C\u5C08\u984C",
    mingpao: "https://news.mingpao.com/rss/pns/s00001.xml",
    orientaldaily: "https://orientaldaily.on.cc/rss/news.xml",
    appledaily_tw: "https://news.ltn.com.tw/rss/all.xml",
    udn: "https://udn.com/rssfeed/news/2/6638?ch=news",
    cna: "https://www.cna.com.tw/rss/aall.aspx",
    rti: "https://www.rti.org.tw/feeds/news.xml",
    rfa: "https://www.rfa.org/mandarin/rss2.xml",
    voachinese: "https://www.voachinese.com/api/zepqeimovm",
    bbc_chinese: "https://feeds.bbci.co.uk/zhongwen/simp/rss.xml",
    bbc_trad: "https://feeds.bbci.co.uk/zhongwen/trad/rss.xml",
    initium: "https://theinitium.com/feed",
    dwnews: "https://rss.dw.com/rdf/rss-chi-all",
    chosun: "https://cnnews.chosun.com/client/news/rss.asp",
    zaobao: "https://www.zaobao.com.sg/rss/singapore",
    duowei: "https://www.dwnews.com/rss/all",
    singtao: "https://std.stheadline.com/rss/newsfeed.xml",
    hkej: "https://www1.hkej.com/rss/index.xml",
    storm: "https://www.storm.mg/rss",
    thenewslens: "https://www.thenewslens.com/rss",
    ettoday: "https://feeds.feedburner.com/ettoday/rss",
    setn: "https://www.setn.com/rss.aspx",
    googlezh: (() => {
      if (config.keywords)
        return "https://news.google.com/rss/search?q=" + encodeURIComponent(config.keywords) + "&hl=zh-TW&gl=TW&ceid=TW:zh-Hant";
      const catMap = {
        world: "WORLD",
        china: "WORLD",
        politics: "NATION",
        society: "NATION",
        business: "BUSINESS",
        markets: "BUSINESS",
        property: "BUSINESS",
        technology: "TECHNOLOGY",
        ai: "TECHNOLOGY",
        health: "HEALTH",
        entertainment: "ENTERTAINMENT",
        sports: "SPORTS",
        science: "SCIENCE",
        culture: "ENTERTAINMENT",
        travel: "TRAVEL"
      };
      const cat = catMap[config.category];
      if (cat)
        return "https://news.google.com/rss/headlines/section/topic/" + cat + "?hl=zh-TW&gl=TW&ceid=TW:zh-Hant";
      return "https://news.google.com/rss?hl=zh-TW&gl=TW&ceid=TW:zh-Hant";
    })()
  };
  return urls[key] || null;
}
__name(getSourceUrl, "getSourceUrl");
var cloudflare_news_hub_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/config" && request.method === "POST")
      return handleSaveConfig(request, env);
    if (url.pathname === "/api/config" && request.method === "GET")
      return handleGetConfig(env);
    if (url.pathname === "/api/test" && request.method === "POST")
      return handleTestPush(env);
    if (url.pathname === "/api/weather-test" && request.method === "POST")
      return handleTestWeather(env);
    if (url.pathname === "/api/news" && request.method === "GET")
      return handleNews(request, env);
    return new Response(renderHTML(await getConfig(env), env), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runNewsPush(env));
  }
};
async function getConfig(env) {
  try {
    const raw = await env.NEWS_CONFIG.get("config");
    return raw ? { ...DEFAULT_CONFIG, ...JSON.parse(raw) } : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}
__name(getConfig, "getConfig");
async function handleGetConfig(env) {
  return Response.json(await getConfig(env));
}
__name(handleGetConfig, "handleGetConfig");
async function handleSaveConfig(request, env) {
  try {
    const body = await request.json();
    await env.NEWS_CONFIG.put("config", JSON.stringify({ ...DEFAULT_CONFIG, ...body }));
    return Response.json({ success: true, message: "\u914D\u7F6E\u5DF2\u4FDD\u5B58" });
  } catch (e) {
    return Response.json({ success: false, message: e.message }, { status: 500 });
  }
}
__name(handleSaveConfig, "handleSaveConfig");
async function fetchFromSource(sourceKey, config, env) {
  const src = NEWS_SOURCES[sourceKey];
  if (!src)
    return [];
  try {
    const url = getSourceUrl(sourceKey, config);
    if (!url)
      return [];
    let xml = null;
    if (env && env.NEWS_CONFIG) {
      const cacheKey = "rss_cache_" + sourceKey;
      try {
        const cached = await env.NEWS_CONFIG.get(cacheKey);
        if (cached)
          xml = cached;
      } catch {
      }
    }
    if (!xml) {
      const resp = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; NewsBot/1.0)" },
        signal: AbortSignal.timeout(1e4)
      });
      if (!resp.ok)
        return [];
      xml = await resp.text();
      if (env && env.NEWS_CONFIG && xml) {
        try {
          await env.NEWS_CONFIG.put("rss_cache_" + sourceKey, xml, { expirationTtl: 480 });
        } catch {
        }
      }
    }
    return parseRss(xml, src.label, src.flag, config, config._maxAgeDays || 7);
  } catch {
    return [];
  }
}
__name(fetchFromSource, "fetchFromSource");
function parseRss(xml, sourceName, sourceFlag, config, maxAgeDays) {
  const items = [];
  const now = Date.now();
  const maxMs = (maxAgeDays || 7) * 24 * 60 * 60 * 1e3;
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = cleanText(decodeHtml(extract(block, "title")));
    const link = extract(block, "link") || extract(block, "guid");
    const desc = cleanText(decodeHtml(extract(block, "description")));
    const pubDate = extract(block, "pubDate");
    if (!title || title.length < 5)
      continue;
    if (pubDate) {
      try {
        let ts = new Date(pubDate).getTime();
        if (isNaN(ts)) {
          const fixed = pubDate.replace(/([\+\-])(\d{2})(\d{2})$/, "$1$2:$3");
          ts = new Date(fixed).getTime();
        }
        if (!isNaN(ts)) {
          const age = now - ts;
          if (age > maxMs || age < -36e5)
            continue;
        }
      } catch (e) {
      }
    }
    if (config.keywords) {
      const kws = config.keywords.split(/[,，\s]+/).filter(Boolean);
      if (!kws.some((k) => title.includes(k)))
        continue;
    }
    if (config.excludeKeywords) {
      const exkws = config.excludeKeywords.split(/[,，\s]+/).filter(Boolean);
      if (exkws.some((k) => title.includes(k)))
        continue;
    }
    items.push({ title, link, desc: desc.slice(0, 120), source: sourceName, flag: sourceFlag, pubDate });
  }
  return items;
}
__name(parseRss, "parseRss");
function titleTokens(title) {
  const clean = title.replace(/[\s\u3000\uff0c\u3001\u3002\uff01\uff1f\u300a\u300b「」『』【】〔〕《》""''·—…、，。！？：；]/g, "");
  const set = /* @__PURE__ */ new Set();
  for (let i = 0; i < clean.length - 1; i++)
    set.add(clean.slice(i, i + 2));
  return set;
}
__name(titleTokens, "titleTokens");
function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 && setB.size === 0)
    return 1;
  let intersection = 0;
  for (const t of setA) {
    if (setB.has(t))
      intersection++;
  }
  return intersection / (setA.size + setB.size - intersection);
}
__name(jaccardSimilarity, "jaccardSimilarity");
function isSimilarTitle(title, acceptedTokenSets, threshold = 0.55) {
  const tokens = titleTokens(title);
  for (const set of acceptedTokenSets) {
    if (jaccardSimilarity(tokens, set) >= threshold)
      return true;
  }
  return false;
}
__name(isSimilarTitle, "isSimilarTitle");
async function fetchAllNews(config, env) {
  const sources = (config.sources || DEFAULT_CONFIG.sources).filter((s) => NEWS_SOURCES[s]);
  const results = await Promise.allSettled(sources.map((s) => fetchFromSource(s, config, env)));
  const buckets = results.filter((r) => r.status === "fulfilled").map((r) => r.value);
  const allItems = [];
  const acceptedTokenSets = [];
  let added = true;
  while (added && allItems.length < config.maxItems) {
    added = false;
    for (const bucket of buckets) {
      if (allItems.length >= config.maxItems)
        break;
      while (bucket.length > 0) {
        const item = bucket.shift();
        if (isSimilarTitle(item.title, acceptedTokenSets))
          continue;
        acceptedTokenSets.push(titleTokens(item.title));
        allItems.push(item);
        added = true;
        break;
      }
    }
  }
  allItems.sort(function(a, b) {
    var ta = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    var tb = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return tb - ta;
  });
  return allItems;
}
__name(fetchAllNews, "fetchAllNews");
function extract(xml, tag) {
  const m = xml.match(new RegExp("<" + tag + "[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/" + tag + ">|<" + tag + "[^>]*>([\\s\\S]*?)<\\/" + tag + ">"));
  return m ? (m[1] || m[2] || "").trim() : "";
}
__name(extract, "extract");
function decodeHtml(str) {
  return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, c) => String.fromCharCode(parseInt(c)));
}
__name(decodeHtml, "decodeHtml");
function cleanText(str) {
  return str.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}
__name(cleanText, "cleanText");
function escapeTg(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
__name(escapeTg, "escapeTg");
async function summarizeWithAI(env, items, config) {
  if (!env.AI)
    return null;
  try {
    const catLabel = (CATEGORIES[config.category] || {}).label || "\u7EFC\u5408";
    const newsList = items.map((item, i) => i + 1 + ". " + item.title).join("\n");
    const prompt = "\u4F60\u662F\u4E13\u4E1A\u65B0\u95FB\u7F16\u8F91\u3002\u4EE5\u4E0B\u662F\u4ECA\u65E5" + catLabel + "\u65B0\u95FB\u6807\u9898\uFF0C\u8BF7\uFF1A\n1. \u63D0\u70BC 3-5 \u4E2A\u6700\u91CD\u8981\u8981\u70B9\uFF0C\u6BCF\u70B9 1-2 \u53E5\uFF0C\u7B80\u6D01\u4E13\u4E1A\n2. \u6700\u540E\u4E00\u53E5\u7ED9\u51FA\u4ECA\u65E5\u8D8B\u52BF\u6216\u503C\u5F97\u5173\u6CE8\u7684\u4FE1\u53F7\n\n" + newsList + "\n\n\u76F4\u63A5\u8F93\u51FA\u6458\u8981\uFF0C\u4E0D\u8981\u524D\u7F00\u3002";
    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600
    });
    return response?.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}
__name(summarizeWithAI, "summarizeWithAI");
async function getAISummary(env, items, config) {
  if (config.aiSummary === false)
    return null;
  if (!env.NEWS_CONFIG)
    return await summarizeWithAI(env, items, config);
  const cacheKey = "summary_cache_" + config.category + "_" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 13);
  try {
    const cached = await env.NEWS_CONFIG.get(cacheKey);
    if (cached)
      return cached;
    const summary = await summarizeWithAI(env, items, config);
    if (summary)
      await env.NEWS_CONFIG.put(cacheKey, summary, { expirationTtl: 86400 });
    return summary;
  } catch {
    return await summarizeWithAI(env, items, config);
  }
}
__name(getAISummary, "getAISummary");
async function handleNews(request, env) {
  try {
    const config = await getConfig(env);
    const reqUrl = new URL(request.url);
    const cat = reqUrl.searchParams.get("cat");
    const webConfig = {
      ...config,
      maxItems: 60,
      keywords: "",
      excludeKeywords: "",
      ...cat && CATEGORIES[cat] ? { category: cat } : {}
    };
    const items = await fetchAllNews(webConfig, env);
    const summary = await getAISummary(env, items, webConfig);
    return Response.json({ success: true, items, summary, category: (CATEGORIES[webConfig.category] || {}).label || "\u7EFC\u5408\u65B0\u95FB" });
  } catch (e) {
    return Response.json({ success: false, message: e.message }, { status: 500 });
  }
}
__name(handleNews, "handleNews");
var PUSHED_CACHE_KEY = "pushed_titles_cache";
async function loadPushedTitles(env) {
  try {
    const raw = await env.NEWS_CONFIG.get(PUSHED_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
__name(loadPushedTitles, "loadPushedTitles");
async function savePushedTitles(env, newTitles, existingTitles) {
  try {
    const merged = [...existingTitles, ...newTitles].slice(-500);
    await env.NEWS_CONFIG.put(PUSHED_CACHE_KEY, JSON.stringify(merged), { expirationTtl: 86400 });
  } catch {
  }
}
__name(savePushedTitles, "savePushedTitles");
function filterAlreadyPushed(items, pushedTitles) {
  const pushedSets = pushedTitles.map((t) => titleTokens(t));
  return items.filter((item) => !isSimilarTitle(item.title, pushedSets));
}
__name(filterAlreadyPushed, "filterAlreadyPushed");
async function buildPlainMessage(env, config) {
  const pushCategories = config.pushCategories || (config.pushCategory ? [config.pushCategory] : null) || [config.category || "general"];
  const allItemsPerCat = await Promise.all(
    pushCategories.map((cat) => {
      const catConfig = { ...config, category: cat, _maxAgeDays: 1 };
      return fetchAllNews(catConfig, env);
    })
  );
  const merged = [];
  const mergedTokenSets = [];
  for (const items2 of allItemsPerCat) {
    for (const item of items2) {
      if (!isSimilarTitle(item.title, mergedTokenSets)) {
        mergedTokenSets.push(titleTokens(item.title));
        merged.push(item);
      }
    }
  }
  merged.sort((a, b) => {
    const ta = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const tb = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return tb - ta;
  });
  const allItems = merged.slice(0, config.maxItems || 20);
  if (allItems.length === 0)
    throw new Error("\u6CA1\u6709\u83B7\u53D6\u5230\u65B0\u95FB");
  const pushedTitles = await loadPushedTitles(env);
  const items = filterAlreadyPushed(allItems, pushedTitles);
  if (items.length === 0)
    throw new Error("\u6CA1\u6709\u65B0\u5185\u5BB9\uFF08\u672C\u6279\u6B21\u65B0\u95FB\u5DF2\u5168\u90E8\u63A8\u9001\u8FC7\uFF09");
  const catLabel = pushCategories.map((c) => (CATEGORIES[c] || {}).label || c).join(" + ");
  const now = (/* @__PURE__ */ new Date()).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
  const summaryConfig = { ...config, category: pushCategories[0] };
  const summary = await getAISummary(env, items, summaryConfig);
  let plain = "\u{1F4F0} \u4E2D\u6587\u65B0\u95FB Hub\n";
  plain += "\u{1F5C2} " + catLabel + " | \u{1F550} " + now + "\n";
  if (summary)
    plain += "\n\u2501\u2501\u2501 \u{1F916} AI \u6458\u8981 \u2501\u2501\u2501\n" + summary + "\n";
  plain += "\n\u2501\u2501\u2501 \u{1F4CE} \u65B0\u95FB\u5217\u8868 \u2501\u2501\u2501\n";
  items.forEach((item, i) => {
    plain += i + 1 + ". " + item.title + "\n   " + (item.link || "") + "\n";
  });
  plain += "\n\u5171 " + items.length + " \u6761";
  let md = "## \u{1F4F0} \u4E2D\u6587\u65B0\u95FB Hub\n";
  md += "**" + catLabel + "** | " + now + "\n\n";
  if (summary)
    md += "### \u{1F916} AI \u6458\u8981\n" + summary + "\n\n";
  md += "### \u{1F4CE} \u65B0\u95FB\u5217\u8868\n";
  items.forEach((item, i) => {
    const link = item.link ? "[" + item.title + "](" + item.link + ")" : item.title;
    md += i + 1 + ". " + item.flag + " **" + item.source + "** " + link + "\n";
  });
  md += "\n> \u5171 " + items.length + " \u6761";
  return { items, plain, md, catLabel, now, summary, pushedTitles };
}
__name(buildPlainMessage, "buildPlainMessage");
async function sendToTelegram(env, message) {
  const token = env.TG_TOKEN, chatId = env.TG_CHAT_ID;
  if (!token || !chatId)
    throw new Error("\u672A\u914D\u7F6E TG_TOKEN \u6216 TG_CHAT_ID");
  const resp = await fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML", disable_web_page_preview: true })
  });
  const data = await resp.json();
  if (!data.ok)
    throw new Error("TG \u63A8\u9001\u5931\u8D25: " + data.description);
  return data;
}
__name(sendToTelegram, "sendToTelegram");
async function sendToTelegramSafe(env, message) {
  const LIMIT = 4e3;
  if (message.length <= LIMIT) {
    return sendToTelegram(env, message);
  }
  const lines = message.split("\n");
  const chunks = [];
  let current = "";
  for (const line of lines) {
    const next = current ? current + "\n" + line : line;
    if (next.length > LIMIT) {
      if (current)
        chunks.push(current);
      current = line.length > LIMIT ? line.slice(0, LIMIT) : line;
    } else {
      current = next;
    }
  }
  if (current)
    chunks.push(current);
  for (let i = 0; i < chunks.length; i++) {
    const part = chunks.length > 1 ? chunks[i] + "\n\n<i>\uFF08" + (i + 1) + "/" + chunks.length + "\uFF09</i>" : chunks[i];
    await sendToTelegram(env, part);
    if (i < chunks.length - 1)
      await new Promise((r) => setTimeout(r, 500));
  }
}
__name(sendToTelegramSafe, "sendToTelegramSafe");
async function pushTelegram(env, config, payload) {
  if (!env.TG_TOKEN || !env.TG_CHAT_ID)
    return { channel: "Telegram", skipped: true };
  const { items, summary, catLabel, now } = payload;
  let msg = "\u{1F4F0} <b>\u4E2D\u6587\u65B0\u95FB Hub</b>\n\u{1F5C2} " + escapeTg(catLabel) + " | \u{1F550} " + escapeTg(now) + "\n";
  if (summary)
    msg += "\n\u2501\u2501\u2501\u2501\u2501 \u{1F916} AI \u4ECA\u65E5\u6458\u8981 \u2501\u2501\u2501\u2501\u2501\n\n" + escapeTg(summary) + "\n";
  msg += "\n\u2501\u2501\u2501\u2501\u2501 \u{1F4CE} \u539F\u6587\u94FE\u63A5 \u2501\u2501\u2501\u2501\u2501\n\n";
  const grouped = {};
  items.forEach((item) => {
    if (!grouped[item.source])
      grouped[item.source] = { flag: item.flag, items: [] };
    grouped[item.source].items.push(item);
  });
  let idx = 1;
  for (const [src, group] of Object.entries(grouped)) {
    msg += group.flag + " <b>" + escapeTg(src) + "</b>\n";
    group.items.forEach((item) => {
      msg += idx + '. <a href="' + item.link + '">' + escapeTg(item.title) + "</a>\n";
      idx++;
    });
    msg += "\n";
  }
  msg += "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u5171 " + items.length + " \u6761";
  await sendToTelegramSafe(env, msg);
  return { channel: "Telegram", ok: true };
}
__name(pushTelegram, "pushTelegram");
async function pushFeishu(env, config, payload) {
  const webhook = env.FEISHU_WEBHOOK;
  if (!webhook)
    return { channel: "\u98DE\u4E66", skipped: true };
  const { md } = payload;
  const body = {
    msg_type: "interactive",
    card: {
      header: { title: { tag: "plain_text", content: "\u{1F4F0} \u4E2D\u6587\u65B0\u95FB Hub" }, template: "blue" },
      elements: [{ tag: "markdown", content: md }]
    }
  };
  const resp = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await resp.json();
  if (data.code !== 0)
    throw new Error("\u98DE\u4E66\u63A8\u9001\u5931\u8D25: " + (data.msg || JSON.stringify(data)));
  return { channel: "\u98DE\u4E66", ok: true };
}
__name(pushFeishu, "pushFeishu");
async function pushDingtalk(env, config, payload) {
  const webhook = env.DINGTALK_WEBHOOK;
  if (!webhook)
    return { channel: "\u9489\u9489", skipped: true };
  const { md, catLabel } = payload;
  let url = webhook;
  if (env.DINGTALK_SECRET) {
    const timestamp = Date.now();
    const strToSign = timestamp + "\n" + env.DINGTALK_SECRET;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(env.DINGTALK_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("HMAC", key, enc.encode(strToSign));
    const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
    url += (url.includes("?") ? "&" : "?") + "timestamp=" + timestamp + "&sign=" + encodeURIComponent(b64);
  }
  const body = {
    msgtype: "markdown",
    markdown: { title: "\u{1F4F0} \u4E2D\u6587\u65B0\u95FB Hub - " + catLabel, text: md }
  };
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await resp.json();
  if (data.errcode !== 0)
    throw new Error("\u9489\u9489\u63A8\u9001\u5931\u8D25: " + (data.errmsg || JSON.stringify(data)));
  return { channel: "\u9489\u9489", ok: true };
}
__name(pushDingtalk, "pushDingtalk");
async function pushWecom(env, config, payload) {
  const webhook = env.WECOM_WEBHOOK;
  if (!webhook)
    return { channel: "\u4F01\u4E1A\u5FAE\u4FE1", skipped: true };
  const { md } = payload;
  const body = { msgtype: "markdown", markdown: { content: md } };
  const resp = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await resp.json();
  if (data.errcode !== 0)
    throw new Error("\u4F01\u4E1A\u5FAE\u4FE1\u63A8\u9001\u5931\u8D25: " + (data.errmsg || JSON.stringify(data)));
  return { channel: "\u4F01\u4E1A\u5FAE\u4FE1", ok: true };
}
__name(pushWecom, "pushWecom");
async function pushPushPlus(env, config, payload) {
  const token = env.PUSHPLUS_TOKEN;
  if (!token)
    return { channel: "PushPlus", skipped: true };
  const { md, catLabel } = payload;
  const body = {
    token,
    title: "\u{1F4F0} \u4E2D\u6587\u65B0\u95FB Hub - " + catLabel,
    content: md,
    template: "markdown"
  };
  const resp = await fetch("https://www.pushplus.plus/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await resp.json();
  if (data.code !== 200)
    throw new Error("PushPlus \u63A8\u9001\u5931\u8D25: " + (data.msg || JSON.stringify(data)));
  return { channel: "PushPlus", ok: true };
}
__name(pushPushPlus, "pushPushPlus");
async function pushBark(env, config, payload) {
  const barkUrl = env.BARK_URL;
  if (!barkUrl)
    return { channel: "Bark", skipped: true };
  const { plain, catLabel } = payload;
  const base = barkUrl.replace(/\/$/, "");
  const resp = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "\u{1F4F0} \u4E2D\u6587\u65B0\u95FB Hub - " + catLabel,
      body: plain.slice(0, 1e3),
      group: "\u65B0\u95FB",
      icon: "https://www.google.com/favicon.ico"
    })
  });
  const data = await resp.json();
  if (data.code !== 200)
    throw new Error("Bark \u63A8\u9001\u5931\u8D25: " + (data.message || JSON.stringify(data)));
  return { channel: "Bark", ok: true };
}
__name(pushBark, "pushBark");
async function pushWxPusher(env, config, payload) {
  const appToken = env.WXPUSHER_APP_TOKEN;
  if (!appToken)
    return { channel: "WxPusher", skipped: true };
  const { md, catLabel } = payload;
  const uids = (env.WXPUSHER_UIDS || "").split(/[,，\s]+/).map((s) => s.trim()).filter(Boolean);
  const topicIds = (env.WXPUSHER_TOPIC_IDS || "").split(/[,，\s]+/).map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
  if (uids.length === 0 && topicIds.length === 0) {
    throw new Error("WxPusher\uFF1A\u8BF7\u914D\u7F6E WXPUSHER_UIDS \u6216 WXPUSHER_TOPIC_IDS");
  }
  const body = {
    appToken,
    content: md,
    summary: "\u{1F4F0} \u4E2D\u6587\u65B0\u95FB Hub - " + catLabel,
    // 消息摘要，显示在微信列表页
    contentType: 3,
    // 3 = Markdown
    uids: uids.length > 0 ? uids : void 0,
    topicIds: topicIds.length > 0 ? topicIds : void 0,
    verifyPayType: 0
    // 0 = 不验证，直接发送
  };
  const resp = await fetch("https://wxpusher.zjiecode.com/api/send/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await resp.json();
  if (data.code !== 1e3)
    throw new Error("WxPusher \u63A8\u9001\u5931\u8D25: " + (data.msg || JSON.stringify(data)));
  return { channel: "WxPusher", ok: true };
}
__name(pushWxPusher, "pushWxPusher");
async function pushNtfy(env, config, payload) {
  const ntfyUrl = env.NTFY_URL;
  if (!ntfyUrl)
    return { channel: "ntfy", skipped: true };
  const { plain, catLabel } = payload;
  const headers = {
    "Title": "\u{1F4F0} \u4E2D\u6587\u65B0\u95FB Hub - " + catLabel,
    "Priority": "default",
    "Tags": "newspaper",
    "Content-Type": "text/plain; charset=utf-8"
  };
  if (env.NTFY_TOKEN)
    headers["Authorization"] = "Bearer " + env.NTFY_TOKEN;
  const resp = await fetch(ntfyUrl, {
    method: "POST",
    headers,
    body: plain.slice(0, 4e3)
  });
  if (!resp.ok)
    throw new Error("ntfy \u63A8\u9001\u5931\u8D25: HTTP " + resp.status);
  return { channel: "ntfy", ok: true };
}
__name(pushNtfy, "pushNtfy");
async function pushGotify(env, config, payload) {
  const gotifyUrl = env.GOTIFY_URL;
  const gotifyToken = env.GOTIFY_TOKEN;
  if (!gotifyUrl || !gotifyToken)
    return { channel: "Gotify", skipped: true };
  const { md, catLabel } = payload;
  const base = gotifyUrl.replace(/\/$/, "");
  const resp = await fetch(base + "/message?token=" + encodeURIComponent(gotifyToken), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "\u{1F4F0} \u4E2D\u6587\u65B0\u95FB Hub - " + catLabel,
      message: md,
      priority: 5,
      extras: {
        "client::display": { contentType: "text/markdown" }
      }
    })
  });
  if (!resp.ok)
    throw new Error("Gotify \u63A8\u9001\u5931\u8D25: HTTP " + resp.status);
  return { channel: "Gotify", ok: true };
}
__name(pushGotify, "pushGotify");
var WEATHER_ICONS = {
  "\u6674": "\u2600\uFE0F",
  "\u6674\u5929": "\u2600\uFE0F",
  "\u9633\u5149": "\u2600\uFE0F",
  "Sunny": "\u2600\uFE0F",
  "Clear": "\u2600\uFE0F",
  "\u591A\u4E91": "\u26C5",
  "\u5C40\u90E8\u591A\u4E91": "\u26C5",
  "Partly": "\u26C5",
  "Cloudy": "\u2601\uFE0F",
  "\u9634": "\u2601\uFE0F",
  "\u96E8": "\u{1F327}\uFE0F",
  "\u5C0F\u96E8": "\u{1F326}\uFE0F",
  "\u4E2D\u96E8": "\u{1F327}\uFE0F",
  "\u5927\u96E8": "\u26C8\uFE0F",
  "\u66B4\u96E8": "\u26C8\uFE0F",
  "\u96F7": "\u26C8\uFE0F",
  "\u96F7\u96E8": "\u26C8\uFE0F",
  "Thunder": "\u26C8\uFE0F",
  "Rain": "\u{1F327}\uFE0F",
  "Drizzle": "\u{1F326}\uFE0F",
  "\u96EA": "\u2744\uFE0F",
  "\u5C0F\u96EA": "\u{1F328}\uFE0F",
  "\u5927\u96EA": "\u2744\uFE0F",
  "Snow": "\u2744\uFE0F",
  "\u96FE": "\u{1F32B}\uFE0F",
  "Fog": "\u{1F32B}\uFE0F",
  "\u973E": "\u{1F637}",
  "\u6C99\u5C18": "\u{1F32A}\uFE0F"
};
function getWeatherIcon(desc) {
  if (!desc)
    return "\u{1F324}\uFE0F";
  for (const [kw, icon] of Object.entries(WEATHER_ICONS)) {
    if (desc.includes(kw))
      return icon;
  }
  return "\u{1F324}\uFE0F";
}
__name(getWeatherIcon, "getWeatherIcon");
function getWindLabel(kmph) {
  const v = parseInt(kmph) || 0;
  if (v < 1)
    return "\u9759\u98CE";
  if (v < 6)
    return "\u8F6F\u98CE";
  if (v < 12)
    return "\u8F7B\u98CE";
  if (v < 20)
    return "\u5FAE\u98CE";
  if (v < 29)
    return "\u548C\u98CE";
  if (v < 39)
    return "\u6E05\u98CE";
  if (v < 50)
    return "\u5F3A\u98CE";
  if (v < 62)
    return "\u52B2\u98CE";
  if (v < 75)
    return "\u5927\u98CE";
  return "\u70C8\u98CE";
}
__name(getWindLabel, "getWindLabel");
function getUVLabel(uv) {
  const v = parseInt(uv) || 0;
  if (v <= 2)
    return v + " \u4F4E";
  if (v <= 5)
    return v + " \u4E2D\u7B49";
  if (v <= 7)
    return v + " \u9AD8";
  if (v <= 10)
    return v + " \u5F88\u9AD8";
  return v + " \u6781\u9AD8";
}
__name(getUVLabel, "getUVLabel");
var HOUR_LABELS = { "0": "00:00", "300": "03:00", "600": "06:00", "900": "09:00", "1200": "12:00", "1500": "15:00", "1800": "18:00", "2100": "21:00" };
async function fetchWeather(city) {
  if (!city)
    return null;
  try {
    const url = "https://wttr.in/" + encodeURIComponent(city) + "?format=j1";
    const resp = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; WeatherBot/1.0)", "Accept-Language": "zh-CN,zh;q=0.9" },
      signal: AbortSignal.timeout(1e4)
    });
    if (!resp.ok)
      return null;
    return await resp.json();
  } catch {
    return null;
  }
}
__name(fetchWeather, "fetchWeather");
function buildWeatherMessage(city, data) {
  if (!data)
    return null;
  const cur = data.current_condition?.[0];
  if (!cur)
    return null;
  const desc = cur.lang_zh?.[0]?.value || cur.weatherDesc?.[0]?.value || "\u672A\u77E5";
  const icon = getWeatherIcon(desc);
  const tempC = cur.temp_C;
  const feelsLike = cur.FeelsLikeC;
  const humidity = cur.humidity;
  const windKmph = cur.windspeedKmph;
  const windDir = cur.winddir16Point;
  const uvIndex = cur.uvIndex;
  const visibility = cur.visibility;
  const today = data.weather?.[0];
  const tomorrow = data.weather?.[1];
  const dayAfter = data.weather?.[2];
  const todayMax = today?.maxtempC;
  const todayMin = today?.mintempC;
  const now = (/* @__PURE__ */ new Date()).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai", year: "numeric", month: "long", day: "numeric", weekday: "long" });
  let plain = "\u{1F324} \u65E9\u5B89\u5929\u6C14\u64AD\u62A5\n";
  plain += "\u{1F4CD} " + city + "  |  " + now + "\n";
  plain += "\n\u2501\u2501\u2501 " + icon + " \u5F53\u524D\u5929\u6C14 \u2501\u2501\u2501\n";
  plain += "\u5929\u6C14\uFF1A" + desc + "\n";
  plain += "\u6C14\u6E29\uFF1A" + tempC + "\xB0C\uFF08\u4F53\u611F " + feelsLike + "\xB0C\uFF09\n";
  plain += "\u4ECA\u65E5\uFF1A" + todayMin + "\xB0C ~ " + todayMax + "\xB0C\n";
  plain += "\u6E7F\u5EA6\uFF1A" + humidity + "%  |  \u98CE\u901F\uFF1A" + windKmph + " km/h " + getWindLabel(windKmph) + "\n";
  plain += "\u80FD\u89C1\u5EA6\uFF1A" + visibility + " km  |  \u7D2B\u5916\u7EBF\uFF1A" + getUVLabel(uvIndex) + "\n";
  if (today?.hourly?.length) {
    plain += "\n\u2501\u2501\u2501 \u23F0 \u4ECA\u65E5\u65F6\u6BB5 \u2501\u2501\u2501\n";
    today.hourly.forEach((h) => {
      const t = HOUR_LABELS[h.time] || h.time;
      const hDesc = h.lang_zh?.[0]?.value || h.weatherDesc?.[0]?.value || "";
      const hIcon = getWeatherIcon(hDesc);
      plain += t + "  " + h.tempC + "\xB0C  " + hIcon + " " + hDesc;
      if (parseInt(h.chanceofrain) > 20)
        plain += "  \u2614" + h.chanceofrain + "%";
      plain += "\n";
    });
  }
  if (tomorrow) {
    const tDesc = tomorrow.hourly?.[4]?.lang_zh?.[0]?.value || tomorrow.hourly?.[4]?.weatherDesc?.[0]?.value || "";
    const tIcon = getWeatherIcon(tDesc);
    plain += "\n\u2501\u2501\u2501 \u{1F4C5} \u660E\u65E5\u9884\u62A5 \u2501\u2501\u2501\n";
    plain += tIcon + " " + tDesc + "  " + tomorrow.mintempC + "\xB0C ~ " + tomorrow.maxtempC + "\xB0C\n";
  }
  if (dayAfter) {
    const dDesc = dayAfter.hourly?.[4]?.lang_zh?.[0]?.value || dayAfter.hourly?.[4]?.weatherDesc?.[0]?.value || "";
    const dIcon = getWeatherIcon(dDesc);
    const da = /* @__PURE__ */ new Date();
    da.setDate(da.getDate() + 2);
    const daLabel = da.getMonth() + 1 + "\u6708" + da.getDate() + "\u65E5";
    plain += dIcon + " \u540E\u5929\uFF08" + daLabel + "\uFF09" + dDesc + "  " + dayAfter.mintempC + "\xB0C ~ " + dayAfter.maxtempC + "\xB0C\n";
  }
  let md = "## " + icon + " \u65E9\u5B89\u5929\u6C14\u64AD\u62A5\n\n";
  md += "**\u{1F4CD} " + city + "**  |  " + now + "\n\n";
  md += "### \u{1F321} \u5F53\u524D\u5929\u6C14\n";
  md += "- \u5929\u6C14\uFF1A**" + desc + "**\n";
  md += "- \u6C14\u6E29\uFF1A**" + tempC + "\xB0C**\uFF08\u4F53\u611F " + feelsLike + "\xB0C\uFF09\n";
  md += "- \u4ECA\u65E5\uFF1A" + todayMin + "\xB0C ~ " + todayMax + "\xB0C\n";
  md += "- \u6E7F\u5EA6\uFF1A" + humidity + "%  |  \u98CE\u901F\uFF1A" + windKmph + " km/h\uFF08" + getWindLabel(windKmph) + "\uFF09\n";
  md += "- \u80FD\u89C1\u5EA6\uFF1A" + visibility + " km  |  \u7D2B\u5916\u7EBF\uFF1A" + getUVLabel(uvIndex) + "\n\n";
  if (today?.hourly?.length) {
    md += "### \u23F0 \u4ECA\u65E5\u65F6\u6BB5\n";
    today.hourly.forEach((h) => {
      const t = HOUR_LABELS[h.time] || h.time;
      const hDesc = h.lang_zh?.[0]?.value || h.weatherDesc?.[0]?.value || "";
      const hIcon = getWeatherIcon(hDesc);
      md += "- **" + t + "** " + h.tempC + "\xB0C  " + hIcon + " " + hDesc;
      if (parseInt(h.chanceofrain) > 20)
        md += "  \u2614" + h.chanceofrain + "%";
      md += "\n";
    });
    md += "\n";
  }
  if (tomorrow || dayAfter) {
    md += "### \u{1F4C5} \u672A\u6765\u9884\u62A5\n";
    if (tomorrow) {
      const tDesc = tomorrow.hourly?.[4]?.lang_zh?.[0]?.value || tomorrow.hourly?.[4]?.weatherDesc?.[0]?.value || "";
      md += "- \u660E\u65E5\uFF1A" + getWeatherIcon(tDesc) + " " + tDesc + "  " + tomorrow.mintempC + "\xB0C ~ " + tomorrow.maxtempC + "\xB0C\n";
    }
    if (dayAfter) {
      const dDesc = dayAfter.hourly?.[4]?.lang_zh?.[0]?.value || dayAfter.hourly?.[4]?.weatherDesc?.[0]?.value || "";
      const da = /* @__PURE__ */ new Date();
      da.setDate(da.getDate() + 2);
      md += "- \u540E\u5929\uFF08" + (da.getMonth() + 1) + "/" + da.getDate() + "\uFF09\uFF1A" + getWeatherIcon(dDesc) + " " + dDesc + "  " + dayAfter.mintempC + "\xB0C ~ " + dayAfter.maxtempC + "\xB0C\n";
    }
  }
  let tg = "\u{1F324} <b>\u65E9\u5B89\u5929\u6C14\u64AD\u62A5</b>\n";
  tg += "\u{1F4CD} <b>" + escapeTg(city) + "</b>  |  " + escapeTg(now) + "\n\n";
  tg += "\u2501\u2501\u2501 " + icon + " <b>\u5F53\u524D\u5929\u6C14</b> \u2501\u2501\u2501\n";
  tg += "\u5929\u6C14\uFF1A<b>" + escapeTg(desc) + "</b>\n";
  tg += "\u6C14\u6E29\uFF1A<b>" + tempC + "\xB0C</b>\uFF08\u4F53\u611F " + feelsLike + "\xB0C\uFF09\n";
  tg += "\u4ECA\u65E5\uFF1A" + todayMin + "\xB0C ~ " + todayMax + "\xB0C\n";
  tg += "\u6E7F\u5EA6\uFF1A" + humidity + "%  |  \u98CE\u901F\uFF1A" + windKmph + " km/h " + getWindLabel(windKmph) + "\n";
  tg += "\u80FD\u89C1\u5EA6\uFF1A" + visibility + " km  |  \u7D2B\u5916\u7EBF\uFF1A" + getUVLabel(uvIndex) + "\n";
  if (today?.hourly?.length) {
    tg += "\n\u2501\u2501\u2501 \u23F0 <b>\u4ECA\u65E5\u65F6\u6BB5</b> \u2501\u2501\u2501\n";
    today.hourly.forEach((h) => {
      const t = HOUR_LABELS[h.time] || h.time;
      const hDesc = h.lang_zh?.[0]?.value || h.weatherDesc?.[0]?.value || "";
      tg += t + "  " + h.tempC + "\xB0C  " + getWeatherIcon(hDesc) + " " + escapeTg(hDesc);
      if (parseInt(h.chanceofrain) > 20)
        tg += "  \u2614" + h.chanceofrain + "%";
      tg += "\n";
    });
  }
  if (tomorrow) {
    const tDesc = tomorrow.hourly?.[4]?.lang_zh?.[0]?.value || tomorrow.hourly?.[4]?.weatherDesc?.[0]?.value || "";
    tg += "\n\u2501\u2501\u2501 \u{1F4C5} <b>\u660E\u65E5\u9884\u62A5</b> \u2501\u2501\u2501\n";
    tg += getWeatherIcon(tDesc) + " " + escapeTg(tDesc) + "  " + tomorrow.mintempC + "\xB0C ~ " + tomorrow.maxtempC + "\xB0C\n";
  }
  if (dayAfter) {
    const dDesc = dayAfter.hourly?.[4]?.lang_zh?.[0]?.value || dayAfter.hourly?.[4]?.weatherDesc?.[0]?.value || "";
    const da = /* @__PURE__ */ new Date();
    da.setDate(da.getDate() + 2);
    tg += getWeatherIcon(dDesc) + " \u540E\u5929\uFF08" + (da.getMonth() + 1) + "/" + da.getDate() + "\uFF09" + escapeTg(dDesc) + "  " + dayAfter.mintempC + "\xB0C ~ " + dayAfter.maxtempC + "\xB0C\n";
  }
  return { plain, md, tg };
}
__name(buildWeatherMessage, "buildWeatherMessage");
var WEATHER_FAILED_KEY = "weather_failed_channels";
async function runWeatherPush(env, config, { isRetry = false } = {}) {
  const city = config.weatherCity?.trim();
  if (!city || config.weatherEnabled === false)
    return { skipped: true, reason: "\u5929\u6C14\u63A8\u9001\u672A\u542F\u7528\u6216\u672A\u8BBE\u7F6E\u57CE\u5E02" };
  let failedChannels = [];
  if (isRetry) {
    try {
      const raw = await env.NEWS_CONFIG.get(WEATHER_FAILED_KEY);
      failedChannels = raw ? JSON.parse(raw) : [];
    } catch {
    }
    if (failedChannels.length === 0)
      return { skipped: true, reason: "\u65E0\u5F85\u91CD\u8BD5\u7684\u5929\u6C14\u6E20\u9053" };
  } else {
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const runKey = "weather_lastRun_" + today;
    try {
      const lastRun = await env.NEWS_CONFIG.get(runKey);
      if (lastRun)
        return { skipped: true, reason: "\u4ECA\u65E5\u5929\u6C14\u5DF2\u63A8\u9001" };
    } catch {
    }
  }
  const data = await fetchWeather(city);
  if (!data)
    return { ok: false, error: "\u5929\u6C14\u6570\u636E\u83B7\u53D6\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u57CE\u5E02\u540D\u79F0" };
  const msgs = buildWeatherMessage(city, data);
  if (!msgs)
    return { ok: false, error: "\u5929\u6C14\u6570\u636E\u89E3\u6790\u5931\u8D25" };
  const allPushers = [
    {
      name: "Telegram",
      fn: async () => {
        if (!env.TG_TOKEN || !env.TG_CHAT_ID)
          return { channel: "Telegram", skipped: true };
        await sendToTelegramSafe(env, msgs.tg);
        return { channel: "Telegram", ok: true };
      }
    },
    {
      name: "\u98DE\u4E66",
      fn: async () => {
        const webhook = env.FEISHU_WEBHOOK;
        if (!webhook)
          return { channel: "\u98DE\u4E66", skipped: true };
        const body = { msg_type: "interactive", card: { header: { title: { tag: "plain_text", content: "\u{1F324} \u65E9\u5B89\u5929\u6C14\u64AD\u62A5 - " + city }, template: "turquoise" }, elements: [{ tag: "markdown", content: msgs.md }] } };
        const resp = await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        const d = await resp.json();
        if (d.code !== 0)
          throw new Error("\u98DE\u4E66\u5929\u6C14\u63A8\u9001\u5931\u8D25: " + d.msg);
        return { channel: "\u98DE\u4E66", ok: true };
      }
    },
    {
      name: "\u9489\u9489",
      fn: async () => {
        const webhook = env.DINGTALK_WEBHOOK;
        if (!webhook)
          return { channel: "\u9489\u9489", skipped: true };
        let url = webhook;
        if (env.DINGTALK_SECRET) {
          const timestamp = Date.now();
          const strToSign = timestamp + "\n" + env.DINGTALK_SECRET;
          const enc = new TextEncoder();
          const key = await crypto.subtle.importKey("raw", enc.encode(env.DINGTALK_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
          const sig = await crypto.subtle.sign("HMAC", key, enc.encode(strToSign));
          const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
          url += (url.includes("?") ? "&" : "?") + "timestamp=" + timestamp + "&sign=" + encodeURIComponent(b64);
        }
        const body = { msgtype: "markdown", markdown: { title: "\u{1F324} \u65E9\u5B89\u5929\u6C14 - " + city, text: msgs.md } };
        const resp = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        const d = await resp.json();
        if (d.errcode !== 0)
          throw new Error("\u9489\u9489\u5929\u6C14\u63A8\u9001\u5931\u8D25: " + d.errmsg);
        return { channel: "\u9489\u9489", ok: true };
      }
    },
    {
      name: "\u4F01\u4E1A\u5FAE\u4FE1",
      fn: async () => {
        const webhook = env.WECOM_WEBHOOK;
        if (!webhook)
          return { channel: "\u4F01\u4E1A\u5FAE\u4FE1", skipped: true };
        const body = { msgtype: "text", text: { content: msgs.md } };
        const resp = await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        const d = await resp.json();
        if (d.errcode !== 0)
          throw new Error("\u4F01\u4E1A\u5FAE\u4FE1\u5929\u6C14\u63A8\u9001\u5931\u8D25: " + d.errmsg);
        return { channel: "\u4F01\u4E1A\u5FAE\u4FE1", ok: true };
      }
    },
    {
      name: "PushPlus",
      fn: async () => {
        const token = env.PUSHPLUS_TOKEN;
        if (!token)
          return { channel: "PushPlus", skipped: true };
        const body = { token, title: "\u{1F324} \u65E9\u5B89\u5929\u6C14 - " + city, content: msgs.md, template: "markdown" };
        const resp = await fetch("https://www.pushplus.plus/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        const d = await resp.json();
        if (d.code !== 200)
          throw new Error("PushPlus\u5929\u6C14\u63A8\u9001\u5931\u8D25: " + d.msg);
        return { channel: "PushPlus", ok: true };
      }
    },
    {
      name: "Bark",
      fn: async () => {
        const barkUrl = env.BARK_URL;
        if (!barkUrl)
          return { channel: "Bark", skipped: true };
        const resp = await fetch(barkUrl.replace(/\/$/, ""), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "\u{1F324} \u65E9\u5B89\u5929\u6C14 - " + city, body: msgs.plain.slice(0, 1e3), group: "\u5929\u6C14", icon: "https://www.google.com/favicon.ico" }) });
        const d = await resp.json();
        if (d.code !== 200)
          throw new Error("Bark\u5929\u6C14\u63A8\u9001\u5931\u8D25: " + d.message);
        return { channel: "Bark", ok: true };
      }
    },
    {
      name: "WxPusher",
      fn: async () => {
        const appToken = env.WXPUSHER_APP_TOKEN;
        if (!appToken)
          return { channel: "WxPusher", skipped: true };
        const uids = (env.WXPUSHER_UIDS || "").split(/[,，\s]+/).map((s) => s.trim()).filter(Boolean);
        const topicIds = (env.WXPUSHER_TOPIC_IDS || "").split(/[,，\s]+/).map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
        if (uids.length === 0 && topicIds.length === 0)
          throw new Error("WxPusher\uFF1A\u8BF7\u914D\u7F6E WXPUSHER_UIDS \u6216 WXPUSHER_TOPIC_IDS");
        const body = { appToken, content: msgs.md, summary: "\u{1F324} \u65E9\u5B89\u5929\u6C14 - " + city, contentType: 3, uids: uids.length > 0 ? uids : void 0, topicIds: topicIds.length > 0 ? topicIds : void 0, verifyPayType: 0 };
        const resp = await fetch("https://wxpusher.zjiecode.com/api/send/message", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        const d = await resp.json();
        if (d.code !== 1e3)
          throw new Error("WxPusher\u5929\u6C14\u63A8\u9001\u5931\u8D25: " + d.msg);
        return { channel: "WxPusher", ok: true };
      }
    },
    {
      name: "ntfy",
      fn: async () => {
        const ntfyUrl = env.NTFY_URL;
        if (!ntfyUrl)
          return { channel: "ntfy", skipped: true };
        const headers = { "Title": "\u{1F324} \u65E9\u5B89\u5929\u6C14 - " + city, "Priority": "default", "Tags": "sunny", "Content-Type": "text/plain; charset=utf-8" };
        if (env.NTFY_TOKEN)
          headers["Authorization"] = "Bearer " + env.NTFY_TOKEN;
        const resp = await fetch(ntfyUrl, { method: "POST", headers, body: msgs.plain.slice(0, 4e3) });
        if (!resp.ok)
          throw new Error("ntfy\u5929\u6C14\u63A8\u9001\u5931\u8D25: HTTP " + resp.status);
        return { channel: "ntfy", ok: true };
      }
    },
    {
      name: "Gotify",
      fn: async () => {
        const gotifyUrl = env.GOTIFY_URL;
        const gotifyToken = env.GOTIFY_TOKEN;
        if (!gotifyUrl || !gotifyToken)
          return { channel: "Gotify", skipped: true };
        const resp = await fetch(gotifyUrl.replace(/\/$/, "") + "/message?token=" + encodeURIComponent(gotifyToken), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "\u{1F324} \u65E9\u5B89\u5929\u6C14 - " + city, message: msgs.md, priority: 5, extras: { "client::display": { contentType: "text/markdown" } } }) });
        if (!resp.ok)
          throw new Error("Gotify\u5929\u6C14\u63A8\u9001\u5931\u8D25: HTTP " + resp.status);
        return { channel: "Gotify", ok: true };
      }
    }
  ];
  const pushers = isRetry ? allPushers.filter((p) => failedChannels.includes(p.name)) : allPushers;
  const results = await Promise.allSettled(pushers.map((p) => p.fn()));
  const newFailedChannels = [];
  const summary = results.map((r, i) => {
    if (r.status === "fulfilled") {
      const v = r.value;
      if (v.skipped)
        return v.channel + ":\u672A\u914D\u7F6E";
      return v.channel + ":\u2705";
    }
    newFailedChannels.push(pushers[i].name);
    return pushers[i].name + ":\u274C(" + (r.reason?.message || "\u672A\u77E5") + ")";
  });
  if (newFailedChannels.length > 0) {
    try {
      await env.NEWS_CONFIG.put(WEATHER_FAILED_KEY, JSON.stringify(newFailedChannels), { expirationTtl: 82800 });
    } catch {
    }
  } else {
    try {
      await env.NEWS_CONFIG.delete(WEATHER_FAILED_KEY);
    } catch {
    }
  }
  const anySuccess = results.some((r) => r.status === "fulfilled" && r.value?.ok);
  if (!isRetry && anySuccess) {
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    try {
      await env.NEWS_CONFIG.put("weather_lastRun_" + today, "1", { expirationTtl: 86400 });
    } catch {
    }
  }
  return { ok: anySuccess, summary, failedChannels: newFailedChannels };
}
__name(runWeatherPush, "runWeatherPush");
async function runAllPush(env, config, { isRetry = false } = {}) {
  let failedChannels = [];
  if (isRetry) {
    try {
      const raw = await env.NEWS_CONFIG.get("push_failed_channels");
      failedChannels = raw ? JSON.parse(raw) : [];
    } catch {
    }
    if (failedChannels.length === 0)
      return { count: 0, summary: ["\u65E0\u5F85\u91CD\u8BD5\u6E20\u9053"] };
  }
  const payload = await buildPlainMessage(env, config);
  const allPushers = [
    { name: "Telegram", fn: pushTelegram },
    { name: "\u98DE\u4E66", fn: pushFeishu },
    { name: "\u9489\u9489", fn: pushDingtalk },
    { name: "\u4F01\u4E1A\u5FAE\u4FE1", fn: pushWecom },
    { name: "PushPlus", fn: pushPushPlus },
    { name: "Bark", fn: pushBark },
    { name: "WxPusher", fn: pushWxPusher },
    { name: "ntfy", fn: pushNtfy },
    { name: "Gotify", fn: pushGotify }
  ];
  const pushers = isRetry ? allPushers.filter((p) => failedChannels.includes(p.name)) : allPushers;
  const results = await Promise.allSettled(
    pushers.map((p) => p.fn(env, config, payload))
  );
  const newFailedChannels = [];
  const summary = results.map((r, i) => {
    if (r.status === "fulfilled") {
      const v = r.value;
      if (v.skipped)
        return v.channel + ":\u672A\u914D\u7F6E";
      return v.channel + ":\u2705";
    }
    newFailedChannels.push(pushers[i].name);
    return pushers[i].name + ":\u274C(" + (r.reason?.message || "\u672A\u77E5\u9519\u8BEF") + ")";
  });
  if (newFailedChannels.length > 0) {
    try {
      await env.NEWS_CONFIG.put("push_failed_channels", JSON.stringify(newFailedChannels), { expirationTtl: 7200 });
    } catch {
    }
  } else {
    try {
      await env.NEWS_CONFIG.delete("push_failed_channels");
    } catch {
    }
  }
  const anySuccess = results.some((r) => r.status === "fulfilled" && !r.value?.skipped);
  if (anySuccess) {
    await savePushedTitles(env, payload.items.map((i) => i.title), payload.pushedTitles);
  }
  return { count: payload.items.length, summary };
}
__name(runAllPush, "runAllPush");
async function runNewsPush(env) {
  const config = await getConfig(env);
  const now = /* @__PURE__ */ new Date();
  const bjTimeStr = now.toLocaleString("en-US", { timeZone: "Asia/Shanghai", hour: "numeric", minute: "numeric", hour12: false });
  const [hourStr, minuteStr] = bjTimeStr.split(":");
  const hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);
  try {
    const weatherFailed = await env.NEWS_CONFIG.get(WEATHER_FAILED_KEY);
    if (weatherFailed) {
      await runWeatherPush(env, config, { isRetry: true });
    }
  } catch {
  }
  if (hour === 7 && minute >= 25 && minute <= 35) {
    await runWeatherPush(env, config);
  }
  if (!config.enabled)
    return;
  const pushHours = String(config.pushHours || config.pushHour || "8").split(/[,，\s]+/).map((h) => parseInt(h.trim())).filter((h) => !isNaN(h));
  const today = now.toISOString().slice(0, 10);
  const runKey = "lastRun_" + today + "_" + hour;
  let failedRaw = null;
  try {
    failedRaw = await env.NEWS_CONFIG.get("push_failed_channels");
  } catch {
  }
  if (failedRaw) {
    await runAllPush(env, config, { isRetry: true });
  }
  if (!pushHours.includes(hour))
    return;
  const lastRun = await env.NEWS_CONFIG.get(runKey);
  if (lastRun)
    return;
  await runAllPush(env, config);
  await env.NEWS_CONFIG.put(runKey, "1");
}
__name(runNewsPush, "runNewsPush");
async function handleTestPush(env) {
  try {
    const config = await getConfig(env);
    const { count, summary } = await runAllPush(env, config);
    return Response.json({ success: true, message: "\u63A8\u9001\u5B8C\u6210\uFF01\u5171 " + count + " \u6761\n" + summary.join(" | ") });
  } catch (e) {
    return Response.json({ success: false, message: e.message }, { status: 500 });
  }
}
__name(handleTestPush, "handleTestPush");
async function handleTestWeather(env) {
  try {
    const config = await getConfig(env);
    const city = config.weatherCity?.trim();
    if (!city)
      return Response.json({ success: false, message: "\u8BF7\u5148\u5728\u63A8\u9001\u8BBE\u7F6E\u4E2D\u586B\u5199\u57CE\u5E02\u540D\u79F0\u5E76\u4FDD\u5B58" });
    const data = await fetchWeather(city);
    if (!data)
      return Response.json({ success: false, message: '\u5929\u6C14\u6570\u636E\u83B7\u53D6\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u57CE\u5E02\u540D\u79F0\uFF08\u652F\u6301\u4E2D\u6587\u6216\u82F1\u6587\uFF0C\u5982"\u5317\u4EAC"/"Beijing"\uFF09' });
    const msgs = buildWeatherMessage(city, data);
    if (!msgs)
      return Response.json({ success: false, message: "\u5929\u6C14\u6570\u636E\u89E3\u6790\u5931\u8D25" });
    try {
      await env.NEWS_CONFIG.delete("weather_lastRun_" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
    } catch {
    }
    try {
      await env.NEWS_CONFIG.delete(WEATHER_FAILED_KEY);
    } catch {
    }
    const result = await runWeatherPush(env, config);
    if (result.skipped)
      return Response.json({ success: false, message: result.reason });
    return Response.json({ success: result.ok, message: "\u5929\u6C14\u63A8\u9001\u5B8C\u6210\uFF01\n" + (result.summary || []).join(" | "), preview: msgs.plain });
  } catch (e) {
    return Response.json({ success: false, message: e.message }, { status: 500 });
  }
}
__name(handleTestWeather, "handleTestWeather");
function buildScript() {
  return `
var currentCategory = 'general';
var sidebarOpen = window.innerWidth > 900;

var CATEGORIES = {
  general:       {label:'\u7EFC\u5408\u65B0\u95FB',   icon:'\u{1F4F0}', group:'\u7EFC\u5408'},
  world:         {label:'\u56FD\u9645',       icon:'\u{1F30D}', group:'\u65F6\u4E8B'},
  china:         {label:'\u4E24\u5CB8\u4E09\u5730',   icon:'\u{1F1E8}\u{1F1F3}', group:'\u65F6\u4E8B'},
  politics:      {label:'\u653F\u6CBB',       icon:'\u{1F3DB}\uFE0F', group:'\u65F6\u4E8B'},
  society:       {label:'\u793E\u4F1A',       icon:'\u{1F465}', group:'\u65F6\u4E8B'},
  business:      {label:'\u8D22\u7ECF',       icon:'\u{1F4B9}', group:'\u8D22\u7ECF'},
  markets:       {label:'\u80A1\u5E02',       icon:'\u{1F4C8}', group:'\u8D22\u7ECF'},
  property:      {label:'\u623F\u4EA7',       icon:'\u{1F3E0}', group:'\u8D22\u7ECF'},
  technology:    {label:'\u79D1\u6280',       icon:'\u{1F4BB}', group:'\u79D1\u6280'},
  ai:            {label:'AI \u4EBA\u5DE5\u667A\u80FD',icon:'\u{1F916}', group:'\u79D1\u6280'},
  health:        {label:'\u5065\u5EB7\u533B\u7597',   icon:'\u2764\uFE0F', group:'\u751F\u6D3B'},
  entertainment: {label:'\u5A31\u4E50',       icon:'\u{1F3AC}', group:'\u751F\u6D3B'},
  sports:        {label:'\u4F53\u80B2',       icon:'\u26BD', group:'\u751F\u6D3B'},
  science:       {label:'\u79D1\u5B66',       icon:'\u{1F52C}', group:'\u751F\u6D3B'},
  culture:       {label:'\u6587\u5316\u827A\u672F',   icon:'\u{1F3A8}', group:'\u751F\u6D3B'},
  travel:        {label:'\u65C5\u6E38',       icon:'\u2708\uFE0F', group:'\u751F\u6D3B'},
};

var SOURCE_LIST = {
  hk01:{label:'\u9999\u6E2F01',flag:'\u{1F1ED}\u{1F1F0}',region:'\u9999\u6E2F'},
  mingpao:{label:'\u660E\u62A5',flag:'\u{1F1ED}\u{1F1F0}',region:'\u9999\u6E2F'},
  orientaldaily:{label:'\u4E1C\u65B9\u65E5\u62A5',flag:'\u{1F1ED}\u{1F1F0}',region:'\u9999\u6E2F'},
  appledaily_tw:{label:'\u81EA\u7531\u65F6\u62A5',flag:'\u{1F1F9}\u{1F1FC}',region:'\u53F0\u6E7E'},
  udn:{label:'\u8054\u5408\u65B0\u95FB\u7F51',flag:'\u{1F1F9}\u{1F1FC}',region:'\u53F0\u6E7E'},
  cna:{label:'\u4E2D\u592E\u793E',flag:'\u{1F1F9}\u{1F1FC}',region:'\u53F0\u6E7E'},
  rti:{label:'\u4E2D\u592E\u5E7F\u64AD\u7535\u53F0',flag:'\u{1F1F9}\u{1F1FC}',region:'\u53F0\u6E7E'},
  rfa:{label:'\u81EA\u7531\u4E9A\u6D32\u7535\u53F0',flag:'\u{1F30F}',region:'\u6D77\u5916'},
  voachinese:{label:'\u7F8E\u56FD\u4E4B\u97F3\u4E2D\u6587',flag:'\u{1F1FA}\u{1F1F8}',region:'\u6D77\u5916'},
  bbc_chinese:{label:'BBC\u4E2D\u6587(\u7B80)',flag:'\u{1F1EC}\u{1F1E7}',region:'\u6D77\u5916'},
  bbc_trad:{label:'BBC\u4E2D\u6587(\u7E41)',flag:'\u{1F1EC}\u{1F1E7}',region:'\u6D77\u5916'},
  initium:{label:'\u7AEF\u4F20\u5A92',flag:'\u{1F310}',region:'\u6D77\u5916'},
  dwnews:{label:'\u5FB7\u56FD\u4E4B\u58F0\u4E2D\u6587',flag:'\u{1F1E9}\u{1F1EA}',region:'\u6D77\u5916'},
  googlezh:{label:'Google\u65B0\u95FB',flag:'\u{1F50D}',region:'\u805A\u5408'},
  chosun:{label:'\u671D\u9C9C\u65E5\u62A5\u4E2D\u6587',flag:'\u{1F1F0}\u{1F1F7}',region:'\u6D77\u5916'},
  zaobao:{label:'\u8054\u5408\u65E9\u62A5',flag:'\u{1F1F8}\u{1F1EC}',region:'\u6D77\u5916'},
  duowei:{label:'\u591A\u7EF4\u65B0\u95FB',flag:'\u{1F310}',region:'\u6D77\u5916'},
  singtao:{label:'\u661F\u5C9B\u65E5\u62A5',flag:'\u{1F1ED}\u{1F1F0}',region:'\u9999\u6E2F'},
  hkej:{label:'\u4FE1\u62A5',flag:'\u{1F1ED}\u{1F1F0}',region:'\u9999\u6E2F'},
  storm:{label:'\u98CE\u4F20\u5A92',flag:'\u{1F1F9}\u{1F1FC}',region:'\u53F0\u6E7E'},
  thenewslens:{label:'\u5173\u952E\u8BC4\u8BBA\u7F51',flag:'\u{1F1F9}\u{1F1FC}',region:'\u53F0\u6E7E'},
  ettoday:{label:'ETtoday',flag:'\u{1F1F9}\u{1F1FC}',region:'\u53F0\u6E7E'},
  setn:{label:'\u4E09\u7ACB\u65B0\u95FB',flag:'\u{1F1F9}\u{1F1FC}',region:'\u53F0\u6E7E'},
};

var config = {};

async function loadConfig() {
  var r = await fetch('/api/config');
  config = await r.json();
  applyConfigToUI();
}

function applyConfigToUI() {
  var pushCats = config.pushCategories || (config.pushCategory ? [config.pushCategory] : ['general']);
  // \u56DE\u586B\u63A8\u9001\u5206\u7C7B chip \u9009\u4E2D\u72B6\u6001
  document.querySelectorAll('.pcat-chip').forEach(function(el) {
    el.classList.toggle('pcat-active', pushCats.includes(el.dataset.cat));
  });
  document.getElementById('kw-input').value = config.keywords || '';
  document.getElementById('exkw-input').value = config.excludeKeywords || '';
  document.getElementById('max-input').value = config.maxItems || 20;
  document.getElementById('hour-input').value = config.pushHours || config.pushHour || '8,12,16,20';
  document.getElementById('enabled-toggle').checked = config.enabled !== false;
  document.getElementById('ai-toggle').checked = config.aiSummary !== false;
  document.getElementById('weather-city-input').value = config.weatherCity || '';
  document.getElementById('weather-enabled-toggle').checked = config.weatherEnabled !== false;
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

// chip \u70B9\u51FB\u5207\u6362
window.togglePushCat = function(el) {
  el.classList.toggle('pcat-active');
  // \u81F3\u5C11\u4FDD\u7559\u4E00\u4E2A\u9009\u4E2D
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
    weatherCity: document.getElementById('weather-city-input').value.trim(),
    weatherEnabled: document.getElementById('weather-enabled-toggle').checked,
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
  showToast('\u6B63\u5728\u63A8\u9001\uFF0C\u8BF7\u7A0D\u5019...', 'info');
  var r = await fetch('/api/test', {method:'POST'});
  var d = await r.json();
  showToast(d.message, d.success ? 'success' : 'error');
}

async function testWeather() {
  var city = document.getElementById('weather-city-input').value.trim();
  if (!city) { showToast('\u8BF7\u5148\u586B\u5199\u57CE\u5E02\u540D\u79F0', 'error'); return; }
  showToast('\u6B63\u5728\u83B7\u53D6\u5929\u6C14\u5E76\u63A8\u9001\uFF0C\u8BF7\u7A0D\u5019...', 'info');
  // \u5148\u4FDD\u5B58\u5F53\u524D\u914D\u7F6E\uFF08\u786E\u4FDD\u57CE\u5E02\u540D\u5DF2\u5199\u5165 KV\uFF09
  await saveConfig();
  var r = await fetch('/api/weather-test', {method:'POST'});
  var d = await r.json();
  showToast(d.message, d.success ? 'success' : 'error');
}
window.testWeather = testWeather;

async function loadNews() {
  var area = document.getElementById('news-area');
  area.innerHTML = '<div class="loading"><div class="spinner"></div><p>\u6B63\u5728\u6293\u53D6\u65B0\u95FB...</p></div>';
  try {
    var r = await fetch('/api/news?cat=' + encodeURIComponent(currentCategory));
    var d = await r.json();
    if (!d.success) { area.innerHTML = '<div class="error-msg">\u83B7\u53D6\u5931\u8D25\uFF1A' + d.message + '</div>'; return; }
    renderNews(d);
  } catch(e) {
    area.innerHTML = '<div class="error-msg">\u7F51\u7EDC\u9519\u8BEF\uFF0C\u8BF7\u5237\u65B0\u91CD\u8BD5</div>';
  }
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  try {
    var diff = Date.now() - new Date(dateStr).getTime();
    var m = Math.floor(diff/60000);
    if (m < 1) return '\u521A\u521A';
    if (m < 60) return m + '\u5206\u949F\u524D';
    var h = Math.floor(m/60);
    if (h < 24) return h + '\u5C0F\u65F6\u524D';
    return Math.floor(h/24) + '\u5929\u524D';
  } catch(e) { return ''; }
}

function renderNews(data) {
  var area = document.getElementById('news-area');
  var catTitle = data.category || '\u7EFC\u5408\u65B0\u95FB';
  var html = '';

  // \u9875\u9762\u6807\u9898\u680F
  html += '<div class="news-header">';
  html += '<h1 class="news-title">\u{1F4F0} ' + catTitle + '</h1>';
  html += '<span class="news-count">' + data.items.length + ' \u6761\u65B0\u95FB</span>';
  html += '</div>';

  // AI \u6458\u8981\u5361\u7247
  if (data.summary) {
    html += '<div class="summary-card">';
    html += '<div class="summary-header"><span class="ai-badge">\u{1F916} AI \u6458\u8981</span></div>';
    html += '<div class="summary-body">' + data.summary.replace(/\\n/g,'<br>') + '</div>';
    html += '</div>';
  }

  // \u65B0\u95FB\u5361\u7247\u7F51\u683C
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

// \u2500\u2500 \u6298\u53E0\u5757 \u2500\u2500
var BLOCK_IDS = ['blk-sources', 'blk-settings', 'blk-channels'];

window.toggleBlock = function(id) {
  var el = document.getElementById(id);
  if (!el) return;
  var isOpen = el.classList.toggle('open');
  // \u8BB0\u4F4F\u72B6\u6001\u5230 localStorage
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
    // \u9ED8\u8BA4\u5168\u90E8\u6536\u8D77\uFF0C\u9664\u975E localStorage \u91CC\u6709\u8BB0\u5F55\u4E3A true
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

// \u2500\u2500 \u65F6\u949F \u2500\u2500
// 正月初一公历日期表（来源：香港天文台，2000-2100）
var CNY_DATA = {
  2000:[2,5],2001:[1,24],2002:[2,12],2003:[2,1],2004:[1,22],
  2005:[2,9],2006:[1,29],2007:[2,18],2008:[2,7],2009:[1,26],
  2010:[2,14],2011:[2,3],2012:[1,23],2013:[2,10],2014:[1,31],
  2015:[2,19],2016:[2,8],2017:[1,28],2018:[2,16],2019:[2,5],
  2020:[1,25],2021:[2,12],2022:[2,1],2023:[1,22],2024:[2,10],
  2025:[1,29],2026:[2,17],2027:[2,6],2028:[1,26],2029:[2,13],
  2030:[2,3],2031:[1,23],2032:[2,11],2033:[1,31],2034:[2,19],
  2035:[2,8],2036:[1,28],2037:[2,15],2038:[2,4],2039:[1,24],
  2040:[2,12],2041:[2,1],2042:[1,22],2043:[2,10],2044:[1,30],
  2045:[2,17],2046:[2,6],2047:[1,26],2048:[2,14],2049:[2,2],
  2050:[1,23],2051:[2,11],2052:[2,1],2053:[2,19],2054:[2,8],
  2055:[1,28],2056:[2,15],2057:[2,4],2058:[1,24],2059:[2,12],
  2060:[2,2],2061:[1,21],2062:[2,9],2063:[1,29],2064:[2,17],
  2065:[2,6],2066:[1,26],2067:[2,14],2068:[2,3],2069:[1,23],
  2070:[2,11],2071:[2,1],2072:[1,22],2073:[2,9],2074:[1,29],
  2075:[2,17],2076:[2,6],2077:[1,26],2078:[2,13],2079:[2,2],
  2080:[1,22],2081:[2,9],2082:[1,29],2083:[2,17],2084:[2,6],
  2085:[1,26],2086:[2,14],2087:[2,3],2088:[1,23],2089:[2,10],
  2090:[1,30],2091:[2,18],2092:[2,7],2093:[1,27],2094:[2,15],
  2095:[2,4],2096:[1,24],2097:[2,12],2098:[2,1],2099:[1,21],
  2100:[2,9]
};
// 各月大小（1=30天大月，0=29天小月，负数=闰月，如-4表示闰四月）
var LMD_DATA = {
  2000:[1,0,1,0,1,0,1,1,0,1,0,1],
  2001:[0,1,0,1,0,1,0,-4,1,1,0,1,0],
  2002:[1,0,1,0,1,0,1,0,1,1,0,1],
  2003:[0,1,0,1,0,1,0,1,0,1,0,1],
  2004:[1,0,1,0,1,1,0,1,0,1,0,1],
  2005:[0,1,0,1,0,-6,1,0,1,1,0,1,0],
  2006:[1,0,1,0,1,0,1,0,1,1,0,1],
  2007:[0,1,0,1,0,1,0,1,0,1,0,1],
  2008:[1,0,1,0,1,0,1,0,1,0,1,1],
  2009:[0,1,0,1,0,1,0,-5,1,0,1,1,0],
  2010:[1,0,1,0,1,0,1,0,1,0,1,0],
  2011:[1,1,0,1,0,1,0,1,0,1,0,1],
  2012:[0,-4,1,0,1,0,1,0,1,1,0,1,0],
  2013:[1,0,1,0,1,0,1,0,1,1,0,1],
  2014:[0,1,0,1,0,1,0,1,0,1,0,1],
  2015:[1,0,1,0,1,0,1,-6,0,1,0,1,0],
  2016:[1,1,0,1,0,1,0,1,0,1,0,1],
  2017:[0,1,0,1,0,1,0,1,0,1,1,0],
  2018:[1,0,1,0,1,0,1,0,-5,1,0,1,0],
  2019:[1,0,1,0,1,0,1,0,1,0,1,0],
  2020:[1,1,0,1,0,1,0,1,0,1,0,1],
  2021:[0,1,0,1,-4,1,0,1,0,1,0,1,0],
  2022:[1,0,1,0,1,0,1,0,1,0,1,0],
  2023:[1,1,0,1,0,1,0,1,0,1,0,1],
  2024:[0,1,0,1,0,1,-6,0,1,1,0,1,0],
  2025:[1,0,1,0,1,0,1,0,1,1,0,1],
  2026:[0,1,0,1,0,1,0,1,0,1,0,1],
  2027:[1,0,1,0,1,0,1,1,0,1,0,1],
  2028:[0,1,0,1,0,1,0,-5,1,1,0,1,0],
  2029:[1,0,1,0,1,0,1,0,1,1,0,1],
  2030:[0,1,0,1,0,1,0,1,0,1,0,1],
  2031:[1,0,1,0,1,1,0,1,0,1,0,1],
  2032:[0,1,0,1,0,-3,1,0,1,1,0,1,0],
  2033:[1,0,1,0,1,0,1,0,1,1,0,1],
  2034:[0,1,0,1,0,1,0,1,0,1,0,1],
  2035:[1,0,1,0,1,0,1,0,-6,1,0,1,0],
  2036:[1,1,0,1,0,1,0,1,0,1,0,1],
  2037:[0,1,0,1,0,1,0,1,0,1,0,1],
  2038:[1,0,1,1,0,1,-5,0,1,0,1,1,0],
  2039:[1,0,1,0,1,0,1,0,1,0,1,0],
  2040:[1,1,0,1,0,1,0,1,0,1,0,1],
  2041:[0,1,0,1,0,1,-4,0,1,1,0,1,0],
  2042:[1,0,1,0,1,0,1,0,1,1,0,1],
  2043:[0,1,0,1,0,1,0,1,0,1,0,1],
  2044:[1,0,1,0,1,0,1,1,0,1,0,1],
  2045:[0,1,0,1,0,1,0,-8,1,1,0,1,0],
  2046:[1,0,1,0,1,0,1,0,1,1,0,1],
  2047:[0,1,0,1,0,1,0,1,0,1,0,1],
  2048:[1,0,1,0,1,1,0,1,0,1,0,1],
  2049:[0,1,0,-2,1,0,1,0,1,1,0,1,0],
  2050:[1,0,1,0,1,0,1,0,1,1,0,1],
  2051:[0,1,0,1,0,1,0,1,0,1,0,1],
  2052:[0,1,0,1,0,1,-7,0,1,0,1,1,0],
  2053:[1,0,1,0,1,0,1,0,1,0,1,0],
  2054:[1,0,1,0,1,0,1,0,1,0,1,1],
  2055:[0,1,0,1,0,1,0,-4,1,0,1,1,0],
  2056:[1,0,1,0,1,0,1,0,1,0,1,0],
  2057:[1,1,0,1,0,1,0,1,0,1,0,1],
  2058:[0,1,0,1,0,-3,1,0,1,1,0,1,0],
  2059:[1,0,1,0,1,0,1,0,1,1,0,1],
  2060:[0,1,0,1,0,1,0,1,0,1,0,1],
  2061:[1,0,1,0,1,0,1,1,0,1,0,1],
  2062:[0,1,0,1,0,1,0,-8,1,1,0,1,0],
  2063:[1,0,1,0,1,0,1,0,1,1,0,1],
  2064:[0,1,0,1,0,1,0,1,0,1,0,1],
  2065:[1,0,1,0,1,1,0,1,0,1,0,1],
  2066:[0,1,0,1,0,-5,1,0,1,1,0,1,0],
  2067:[1,0,1,0,1,0,1,0,1,1,0,1],
  2068:[0,1,0,1,0,1,0,1,0,1,0,1],
  2069:[1,0,1,0,1,0,1,0,1,0,1,1],
  2070:[0,1,0,1,0,1,-3,0,1,1,0,1,0],
  2071:[1,0,1,0,1,0,1,0,1,1,0,1],
  2072:[0,1,0,1,0,1,0,1,0,1,0,1],
  2073:[1,0,1,0,1,1,0,1,0,1,0,1],
  2074:[0,1,0,1,0,-6,1,0,1,1,0,1,0],
  2075:[1,0,1,0,1,0,1,0,1,1,0,1],
  2076:[0,1,0,1,0,1,0,1,0,1,0,1],
  2077:[1,0,1,0,1,0,1,0,1,0,1,1],
  2078:[0,1,0,1,-4,1,0,1,0,1,0,1,0],
  2079:[1,0,1,0,1,0,1,0,1,0,1,0],
  2080:[1,1,0,1,0,1,0,1,0,1,0,1],
  2081:[0,1,0,1,0,1,-2,0,1,1,0,1,0],
  2082:[1,0,1,0,1,0,1,0,1,1,0,1],
  2083:[0,1,0,1,0,1,0,1,0,1,0,1],
  2084:[1,0,1,0,1,1,0,1,0,1,0,1],
  2085:[0,1,0,1,0,-7,1,0,1,1,0,1,0],
  2086:[1,0,1,0,1,0,1,0,1,1,0,1],
  2087:[0,1,0,1,0,1,0,1,0,1,0,1],
  2088:[1,0,1,0,1,0,1,0,1,0,1,1],
  2089:[0,1,0,1,-5,1,0,1,0,1,0,1,0],
  2090:[1,0,1,0,1,0,1,0,1,0,1,0],
  2091:[1,1,0,1,0,1,0,1,0,1,0,1],
  2092:[0,1,0,1,0,1,-3,0,1,1,0,1,0],
  2093:[1,0,1,0,1,0,1,0,1,1,0,1],
  2094:[0,1,0,1,0,1,0,1,0,1,0,1],
  2095:[1,0,1,0,1,1,0,1,0,1,0,1],
  2096:[0,1,0,1,0,-8,1,0,1,1,0,1,0],
  2097:[1,0,1,0,1,0,1,0,1,1,0,1],
  2098:[0,1,0,1,0,1,0,1,0,1,0,1],
  2099:[1,0,1,0,1,0,1,1,0,1,0,1],
  2100:[0,1,0,1,0,1,-6,0,1,1,0,1,0]
};
var LM_N=['正','二','三','四','五','六','七','八','九','十','冬','腊'];
var LD_N=['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
  '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
  '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
var TG_N=['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
var DZ_N=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
var ZD_N=['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];

function lunarDate(date) {
  var y=date.getFullYear(), m=date.getMonth()+1, d=date.getDate();
  var lunarYear=y, cny=CNY_DATA[y];
  if(!cny) return '';
  if(m<cny[0]||(m===cny[0]&&d<cny[1])){ lunarYear=y-1; cny=CNY_DATA[lunarYear]; if(!cny) return ''; }
  var diff=Math.round((new Date(y,m-1,d)-new Date(lunarYear,cny[0]-1,cny[1]))/86400000);
  var arr=LMD_DATA[lunarYear]; if(!arr) return '';
  var lm=1,ld=diff,isLeap=false,leapLbl=0;
  for(var i=0;i<arr.length;i++){
    var mv=arr[i], isLM=mv<0, days=(Math.abs(mv)===1)?30:29;
    if(isLM) leapLbl=-mv;
    if(ld<days){ isLeap=isLM; lm=isLM?leapLbl:(i+1-(leapLbl>0?1:0)); break; }
    ld-=days;
  }
  var gi=(lunarYear-4)%10; if(gi<0)gi+=10;
  var zi=(lunarYear-4)%12; if(zi<0)zi+=12;
  return TG_N[gi]+DZ_N[zi]+'年（'+ZD_N[zi]+'年）'+(isLeap?'闰':'')+LM_N[(lm-1)%12]+'月'+LD_N[ld];
}

function updateClock() {
  var now = new Date();
  var h = String(now.getHours()).padStart(2,'0');
  var m = String(now.getMinutes()).padStart(2,'0');
  var s = String(now.getSeconds()).padStart(2,'0');
  var weeks = ['\u661F\u671F\u65E5','\u661F\u671F\u4E00','\u661F\u671F\u4E8C','\u661F\u671F\u4E09','\u661F\u671F\u56DB','\u661F\u671F\u4E94','\u661F\u671F\u516D'];
  var y = now.getFullYear();
  var mo = String(now.getMonth()+1).padStart(2,'0');
  var d = String(now.getDate()).padStart(2,'0');
  var timeEl = document.getElementById('clock-time');
  var dateEl = document.getElementById('clock-date');
  var weekEl = document.getElementById('clock-week');
  var lunarEl = document.getElementById('clock-lunar');
  if (timeEl) timeEl.textContent = h + ':' + m + ':' + s;
  if (dateEl) dateEl.textContent = y + '\u5E74' + mo + '\u6708' + d + '\u65E5';
  if (weekEl) weekEl.textContent = weeks[now.getDay()];
  var lunar = lunarDate(now);
  var sepEl = document.getElementById('clock-sep-lunar');
  if (!lunar) console.warn('lunarDate empty, y='+now.getFullYear()+' m='+(now.getMonth()+1)+' d='+now.getDate());
  if (lunarEl) lunarEl.textContent = lunar ? '农历 ' + lunar : '';
  if (sepEl) sepEl.style.display = lunar ? '' : 'none';
}
updateClock();
setInterval(updateClock, 1000);

// \u2500\u2500 \u6DF1\u8272/\u6D45\u8272\u6A21\u5F0F \u2500\u2500
function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  var btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = dark ? '\u2600\uFE0F' : '\u{1F319}';
}

function toggleTheme() {
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  var newDark = !isDark;
  localStorage.setItem('theme', newDark ? 'dark' : 'light');
  applyTheme(newDark);
}

function initTheme() {
  // \u4F18\u5148\u7528\u7528\u6237\u624B\u52A8\u9009\u62E9\uFF0C\u5426\u5219\u8DDF\u968F\u7CFB\u7EDF
  var saved = localStorage.getItem('theme');
  if (saved) {
    applyTheme(saved === 'dark');
  } else {
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark);
  }
  // \u76D1\u542C\u7CFB\u7EDF\u4E3B\u9898\u53D8\u5316\uFF08\u4EC5\u5F53\u7528\u6237\u672A\u624B\u52A8\u8BBE\u7F6E\u65F6\u751F\u6548\uFF09
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) applyTheme(e.matches);
  });
}
initTheme();
`;
}
__name(buildScript, "buildScript");
function renderHTML(config, env) {
  const catOptions = Object.entries(CATEGORIES).map(function(e) {
    return '<option value="' + e[0] + '"' + (config.category === e[0] ? " selected" : "") + ">" + e[1].icon + " " + e[1].label + "</option>";
  }).join("");
  const pushCats = config.pushCategories || (config.pushCategory ? [config.pushCategory] : ["general"]);
  const groups = {};
  Object.entries(CATEGORIES).forEach(([k, v]) => {
    if (!groups[v.group])
      groups[v.group] = [];
    groups[v.group].push({ key: k, ...v });
  });
  const pushChips = Object.entries(groups).map(([grpName, cats]) => {
    const chips = cats.map((c) => {
      const active = pushCats.includes(c.key) ? " pcat-active" : "";
      return '<span class="pcat-chip' + active + '" data-cat="' + c.key + '" onclick="togglePushCat(this)">' + c.icon + " " + c.label + "</span>";
    }).join("");
    return '<div class="pcat-group"><span class="pcat-group-label">' + grpName + "</span>" + chips + "</div>";
  }).join("");
  const navGroups = {};
  Object.entries(CATEGORIES).forEach(([k, v]) => {
    if (!navGroups[v.group])
      navGroups[v.group] = [];
    navGroups[v.group].push({ key: k, ...v });
  });
  const navItems = Object.entries(navGroups).map(([grpName, cats]) => {
    const items = cats.map(
      (c) => '<div class="nav-item' + (config.category === c.key ? " active" : "") + '" data-cat="' + c.key + `" onclick="selectCategory('` + c.key + `')"><span class="nav-icon">` + c.icon + '</span><span class="nav-label">' + c.label + "</span></div>"
    ).join("");
    return '<div class="nav-group-label">' + grpName + "</div>" + items;
  }).join("");
  const CHANNELS = [
    {
      icon: "\u2708\uFE0F",
      name: "Telegram",
      vars: [
        { key: "TG_TOKEN", configured: !!(env && env.TG_TOKEN) },
        { key: "TG_CHAT_ID", configured: !!(env && env.TG_CHAT_ID) }
      ]
    },
    {
      icon: "\u{1FAB6}",
      name: "\u98DE\u4E66",
      vars: [{ key: "FEISHU_WEBHOOK", configured: !!(env && env.FEISHU_WEBHOOK) }]
    },
    {
      icon: "\u{1F4CE}",
      name: "\u9489\u9489",
      vars: [
        { key: "DINGTALK_WEBHOOK", configured: !!(env && env.DINGTALK_WEBHOOK) },
        { key: "DINGTALK_SECRET", configured: !!(env && env.DINGTALK_SECRET), optional: true }
      ]
    },
    {
      icon: "\u{1F4BC}",
      name: "\u4F01\u4E1A\u5FAE\u4FE1",
      vars: [{ key: "WECOM_WEBHOOK", configured: !!(env && env.WECOM_WEBHOOK) }]
    },
    {
      icon: "\u2795",
      name: "PushPlus",
      vars: [{ key: "PUSHPLUS_TOKEN", configured: !!(env && env.PUSHPLUS_TOKEN) }]
    },
    {
      icon: "\u{1F514}",
      name: "Bark",
      vars: [{ key: "BARK_URL", configured: !!(env && env.BARK_URL) }]
    },
    {
      icon: "\u{1F4AC}",
      name: "WxPusher",
      vars: [
        { key: "WXPUSHER_APP_TOKEN", configured: !!(env && env.WXPUSHER_APP_TOKEN) },
        { key: "WXPUSHER_UIDS", configured: !!(env && env.WXPUSHER_UIDS), optional: true },
        { key: "WXPUSHER_TOPIC_IDS", configured: !!(env && env.WXPUSHER_TOPIC_IDS), optional: true }
      ]
    },
    {
      icon: "\u{1F514}",
      name: "ntfy",
      vars: [
        { key: "NTFY_URL", configured: !!(env && env.NTFY_URL) },
        { key: "NTFY_TOKEN", configured: !!(env && env.NTFY_TOKEN), optional: true }
      ]
    },
    {
      icon: "\u{1F4E1}",
      name: "Gotify",
      vars: [
        { key: "GOTIFY_URL", configured: !!(env && env.GOTIFY_URL) },
        { key: "GOTIFY_TOKEN", configured: !!(env && env.GOTIFY_TOKEN) }
      ]
    }
  ];
  function isChannelReady(ch) {
    return ch.vars.filter((v) => !v.optional).every((v) => v.configured);
  }
  __name(isChannelReady, "isChannelReady");
  const channelItems = CHANNELS.map((ch) => {
    const ready = isChannelReady(ch);
    const varTags = ch.vars.map((v) => {
      if (v.configured) {
        return '<span class="ch-tag ch-tag-ok">' + v.key + " \u2713</span>";
      } else if (v.optional) {
        return '<span class="ch-tag ch-tag-opt">' + v.key + '<span class="ch-opt-label">\u53EF\u9009</span></span>';
      } else {
        return '<span class="ch-tag ch-tag-missing">' + v.key + "</span>";
      }
    }).join("");
    return '<div class="push-channel-item' + (ready ? " ch-ready" : "") + '"><span class="ch-icon">' + ch.icon + '</span><div class="ch-body"><div class="ch-name-row"><span class="ch-name">' + ch.name + "</span>" + (ready ? '<span class="ch-status ch-status-ok">\u5DF2\u914D\u7F6E</span>' : '<span class="ch-status ch-status-off">\u672A\u914D\u7F6E</span>') + '</div><div class="ch-vars">' + varTags + "</div></div></div>";
  }).join("");
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

/* Weather settings section */
.weather-section { margin-top: 10px; border: 1px solid var(--border); border-radius: 8px; padding: 10px; background: linear-gradient(135deg, #0ea5e920 0%, #38bdf820 100%); border-color: #0ea5e940; }
[data-theme="dark"] .weather-section { background: linear-gradient(135deg, #0c4a6e40 0%, #0e749040 100%); border-color: #0369a160; }
.weather-section-title { font-size: 12px; font-weight: 700; color: var(--text); margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.weather-time-badge { font-size: 10px; background: #0ea5e9; color: white; padding: 1px 7px; border-radius: 20px; font-weight: 600; letter-spacing: .03em; }
.weather-test-btn { width: 100%; padding: 7px; background: #0ea5e9; color: white; border: none; border-radius: 7px; font-size: 12px; font-weight: 600; cursor: pointer; margin-top: 8px; transition: background .15s; }
.weather-test-btn:hover { background: #0284c7; }

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
    "<!DOCTYPE html>",
    '<html lang="zh-CN">',
    "<head>",
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1.0">',
    "<title>\u4E2D\u6587\u65B0\u95FB Hub</title>",
    "<style>" + css + "</style>",
    "</head>",
    "<body>",
    // Top bar
    '<div class="topbar">',
    '  <button class="menu-btn" onclick="toggleSidebar()"><i></i><i></i><i></i></button>',
    '  <div class="topbar-logo"><span>\u{1F4F0}</span>\u4E2D\u6587\u65B0\u95FB Hub</div>',
    '  <div class="topbar-clock">',
    '    <span class="clock-time" id="clock-time">--:--:--</span>',
    '    <span class="clock-sep">|</span>',
    '    <span class="clock-date" id="clock-date"></span>',
    '    <span class="clock-week" id="clock-week"></span>',
    '    <span class="clock-sep" id="clock-sep-lunar">|</span>',
    '    <span class="clock-lunar" id="clock-lunar"></span>',
    "  </div>",
    '  <div class="topbar-right">',
    '    <button class="topbar-btn" id="theme-btn" onclick="toggleTheme()" title="\u5207\u6362\u6697\u8272/\u4EAE\u8272">\u{1F319}</button>',
    '    <button class="topbar-btn" onclick="loadNews()">\u{1F504} \u5237\u65B0</button>',
    '    <button class="topbar-btn primary" onclick="testPush()">\u{1F4E4} \u7ACB\u5373\u63A8\u9001</button>',
    "  </div>",
    "</div>",
    '<div class="overlay" id="overlay"></div>',
    '<div class="layout">',
    // Sidebar
    '<div class="sidebar" id="sidebar">',
    '  <div class="sidebar-section">',
    '    <div class="sidebar-section-title">\u65B0\u95FB\u5206\u7C7B</div>',
    navItems,
    "  </div>",
    '  <div class="settings-panel">',
    // ── 折叠块 1：新闻来源 ──
    '    <div class="collapse-block" id="blk-sources">',
    `      <button class="collapse-hd" onclick="toggleBlock('blk-sources')">`,
    '        <span>\u{1F4E1} \u65B0\u95FB\u6765\u6E90</span><span class="collapse-arrow">\u25BE</span>',
    "      </button>",
    '      <div class="collapse-bd">',
    '        <div id="src-grid"></div>',
    "      </div>",
    "    </div>",
    // ── 折叠块 2：推送设置 ──
    '    <div class="collapse-block" id="blk-settings">',
    `      <button class="collapse-hd" onclick="toggleBlock('blk-settings')">`,
    '        <span>\u2699\uFE0F \u63A8\u9001\u8BBE\u7F6E</span><span class="collapse-arrow">\u25BE</span>',
    "      </button>",
    '      <div class="collapse-bd">',
    '        <div class="form-group">',
    '          <label class="form-label">\u63A8\u9001\u5206\u7C7B <small style="color:#94a3b8;font-weight:400">\u53EF\u591A\u9009</small></label>',
    '          <div class="pcat-wrap">' + pushChips + "</div>",
    "        </div>",
    '        <div class="form-group">',
    '          <input class="form-control" type="number" id="max-input" value="' + config.maxItems + '" min="1" max="50">',
    "        </div>",
    '        <div class="form-group">',
    '          <label class="form-label">\u5305\u542B\u5173\u952E\u8BCD <small style="color:#94a3b8;font-weight:400">\u9017\u53F7\u5206\u9694</small></label>',
    '          <input class="form-control" type="text" id="kw-input" value="' + config.keywords + '" placeholder="\u9017\u53F7\u5206\u9694">',
    "        </div>",
    '        <div class="form-group">',
    '          <label class="form-label">\u6392\u9664\u5173\u952E\u8BCD <small style="color:#94a3b8;font-weight:400">\u9017\u53F7\u5206\u9694</small></label>',
    '          <input class="form-control" type="text" id="exkw-input" value="' + config.excludeKeywords + '" placeholder="\u9017\u53F7\u5206\u9694">',
    "        </div>",
    '        <div class="form-group">',
    '          <label class="form-label">\u63A8\u9001\u65F6\u95F4\uFF08\u5317\u4EAC\u65F6\u95F4\uFF0C\u9017\u53F7\u5206\u9694\uFF09</label>',
    '          <input class="form-control" type="text" id="hour-input" placeholder="\u4F8B\u5982: 8,12,16,20" value="' + (config.pushHours || config.pushHour || "8,12,16,20") + '">',
    "        </div>",
    '        <div class="toggle-row">',
    '          <span class="toggle-label">\u5B9A\u65F6\u63A8\u9001</span>',
    '          <label class="toggle"><input type="checkbox" id="enabled-toggle"' + (config.enabled ? " checked" : "") + '><span class="toggle-slider"></span></label>',
    "        </div>",
    '        <div class="toggle-row">',
    '          <span class="toggle-label">AI \u6458\u8981</span>',
    '          <label class="toggle"><input type="checkbox" id="ai-toggle"' + (config.aiSummary !== false ? " checked" : "") + '><span class="toggle-slider"></span></label>',
    "        </div>",
    // ── 天气推送设置 ──
    '        <div class="weather-section">',
    '          <div class="weather-section-title">\u{1F324} \u65E9\u5B89\u5929\u6C14\u63A8\u9001 <span class="weather-time-badge">\u6BCF\u5929 7:30</span></div>',
    '          <div class="form-group" style="margin-bottom:6px">',
    '            <label class="form-label">\u57CE\u5E02\u540D\u79F0 <small style="color:#94a3b8;font-weight:400">\u4E2D\u6587\u6216\u82F1\u6587\u5747\u53EF</small></label>',
    '            <div style="display:flex;gap:6px;align-items:center">',
    '              <input class="form-control" type="text" id="weather-city-input" value="' + (config.weatherCity || "") + '" placeholder="\u5982\uFF1A\u5317\u4EAC / Shanghai / Hong Kong" style="flex:1">',
    "            </div>",
    '            <div style="font-size:11px;color:var(--text-secondary);margin-top:4px;padding:0 2px">',
    "              \u652F\u6301\u5168\u7403\u57CE\u5E02 \xB7 \u6570\u636E\u6765\u81EA wttr.in \xB7 \u65E0\u9700 API Key",
    "            </div>",
    "          </div>",
    '          <div class="toggle-row" style="padding:4px 2px">',
    '            <span class="toggle-label">\u542F\u7528\u5929\u6C14\u63A8\u9001</span>',
    '            <label class="toggle"><input type="checkbox" id="weather-enabled-toggle"' + (config.weatherEnabled !== false ? " checked" : "") + '><span class="toggle-slider"></span></label>',
    "          </div>",
    '          <button class="weather-test-btn" onclick="testWeather()">\u26C5 \u6D4B\u8BD5\u5929\u6C14\u63A8\u9001</button>',
    "        </div>",
    "      </div>",
    "    </div>",
    // ── 折叠块 3：推送渠道 ──
    '    <div class="collapse-block" id="blk-channels">',
    `      <button class="collapse-hd" onclick="toggleBlock('blk-channels')">`,
    '        <span>\u{1F4EC} \u63A8\u9001\u6E20\u9053</span><span class="collapse-arrow">\u25BE</span>',
    "      </button>",
    '      <div class="collapse-bd">',
    '        <div class="push-channels">',
    channelItems,
    "        </div>",
    '        <p class="push-hint">\u5728 Cloudflare Worker \u2192 Settings \u2192 Variables \u4E2D\u6DFB\u52A0\u53D8\u91CF\u540E\u5237\u65B0\u9875\u9762\u5373\u53EF\u751F\u6548\u3002</p>',
    "      </div>",
    "    </div>",
    '    <button class="save-btn" onclick="saveConfig()">\u{1F4BE} \u4FDD\u5B58\u914D\u7F6E</button>',
    "  </div>",
    "</div>",
    // Main
    '<div class="main" id="main">',
    '  <div id="news-area"><div class="loading"><div class="spinner"></div><p>\u6B63\u5728\u52A0\u8F7D\u65B0\u95FB...</p></div></div>',
    "</div>",
    "</div>",
    '<div class="toast" id="toast"></div>',
    "<script>" + buildScript() + "<\/script>",
    "</body>",
    "</html>"
  ].join("\n");
}
__name(renderHTML, "renderHTML");
export {
  cloudflare_news_hub_default as default
};
//# sourceMappingURL=index.js.map
