// ============================================================
// Cloudflare News Hub - 单文件 Worker
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
};

const CATEGORIES = {
  general:       { label: '综合新闻', topic: '' },
  world:         { label: '国际', topic: 'CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtcG5HZ0pLVWlnQVAB' },
  business:      { label: '财经', topic: 'CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtcG5HZ0pLVWlnQVAB' },
  technology:    { label: '科技', topic: 'CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtcG5HZ0pLVWlnQVAB' },
  entertainment: { label: '娱乐', topic: 'CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtcG5HZ0pLVWlnQVAB' },
  sports:        { label: '体育', topic: 'CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtcG5HZ0pLVWlnQVAB' },
  science:       { label: '科学', topic: 'CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtcG5HZ0pLVWlnQVAB' },
  health:        { label: '健康', topic: 'CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtcG5HZ0pLVWlnQVAB' },
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
// 主入口
// ============================================================
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/config' && request.method === 'POST') {
      return handleSaveConfig(request, env);
    }
    if (url.pathname === '/api/config' && request.method === 'GET') {
      return handleGetConfig(env);
    }
    if (url.pathname === '/api/test' && request.method === 'POST') {
      return handleTestPush(env);
    }
    if (url.pathname === '/api/preview' && request.method === 'GET') {
      return handlePreview(env);
    }

    return new Response(renderHTML(await getConfig(env)), {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
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
  } catch {
    return DEFAULT_CONFIG;
  }
}

async function handleGetConfig(env) {
  const config = await getConfig(env);
  return Response.json(config);
}

async function handleSaveConfig(request, env) {
  try {
    const body = await request.json();
    const config = { ...DEFAULT_CONFIG, ...body };
    await env.NEWS_CONFIG.put('config', JSON.stringify(config));
    return Response.json({ success: true, message: '配置已保存' });
  } catch (e) {
    return Response.json({ success: false, message: e.message }, { status: 500 });
  }
}

// ============================================================
// 新闻获取
// ============================================================
function buildRssUrl(config) {
  const hl = config.language;
  const gl = config.region;

  if (config.keywords) {
    const q = encodeURIComponent(config.keywords);
    return `https://news.google.com/rss/search?q=${q}&hl=${hl}&gl=${gl}&ceid=${gl}:${hl}`;
  }

  const catMap = {
    general:       '',
    world:         'WORLD',
    business:      'BUSINESS',
    technology:    'TECHNOLOGY',
    entertainment: 'ENTERTAINMENT',
    sports:        'SPORTS',
    science:       'SCIENCE',
    health:        'HEALTH',
  };

  const cat = catMap[config.category] || '';
  if (cat) {
    return `https://news.google.com/rss/headlines/section/topic/${cat}?hl=${hl}&gl=${gl}&ceid=${gl}:${hl}`;
  }
  return `https://news.google.com/rss?hl=${hl}&gl=${gl}&ceid=${gl}:${hl}`;
}

async function fetchNews(config) {
  const url = buildRssUrl(config);
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)' },
  });

  if (!resp.ok) throw new Error(`RSS 请求失败: ${resp.status}`);

  const xml = await resp.text();
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < (config.maxItems || 10)) {
    const block = match[1];
    const title = decodeHtml(extract(block, 'title'));
    const link  = extract(block, 'link') || extract(block, 'guid');
    const pub   = extract(block, 'pubDate');
    const source = extract(block, 'source') || '';

    if (!title) continue;

    // 关键词过滤
    if (config.keywords) {
      const kws = config.keywords.split(/[,，\s]+/).filter(Boolean);
      if (!kws.some(k => title.includes(k))) continue;
    }

    // 排除词过滤
    if (config.excludeKeywords) {
      const exkws = config.excludeKeywords.split(/[,，\s]+/).filter(Boolean);
      if (exkws.some(k => title.includes(k))) continue;
    }

    items.push({ title, link, pub, source });
  }

  return items;
}

function extract(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return m ? (m[1] || m[2] || '').trim() : '';
}

function decodeHtml(str) {
  return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

// ============================================================
// Telegram 推送
// ============================================================
async function sendToTelegram(env, message) {
  const token = env.TG_TOKEN;
  const chatId = env.TG_CHAT_ID;

  if (!token || !chatId) throw new Error('未配置 TG_TOKEN 或 TG_CHAT_ID');

  const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: false,
    }),
  });

  const data = await resp.json();
  if (!data.ok) throw new Error(`TG 推送失败: ${data.description}`);
  return data;
}

function formatMessage(items, config) {
  const catLabel = CATEGORIES[config.category]?.label || '综合新闻';
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  let msg = `📰 <b>Cloudflare News Hub</b>\n`;
  msg += `🗂 ${catLabel} | 🕐 ${now}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  items.forEach((item, i) => {
    msg += `${i + 1}. <a href="${item.link}">${item.title}</a>\n`;
    if (item.source) msg += `   📡 ${item.source}\n`;
    msg += '\n';
  });

  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `共 ${items.length} 条新闻`;
  return msg;
}

// ============================================================
// 定时推送逻辑
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

  const items = await fetchNews(config);
  if (items.length === 0) return;

  const message = formatMessage(items, config);
  await sendToTelegram(env, message);
  await env.NEWS_CONFIG.put('lastRun', today);
  await env.NEWS_CONFIG.put('lastMessage', message);
}

// ============================================================
// API: 测试推送
// ============================================================
async function handleTestPush(env) {
  try {
    const config = await getConfig(env);
    const items = await fetchNews(config);
    if (items.length === 0) {
      return Response.json({ success: false, message: '没有获取到新闻，请检查配置' });
    }
    const message = formatMessage(items, config);
    await sendToTelegram(env, message);
    return Response.json({ success: true, message: `推送成功！共发送 ${items.length} 条新闻` });
  } catch (e) {
    return Response.json({ success: false, message: e.message }, { status: 500 });
  }
}

// ============================================================
// API: 预览新闻
// ============================================================
async function handlePreview(env) {
  try {
    const config = await getConfig(env);
    const items = await fetchNews(config);
    return Response.json({ success: true, items });
  } catch (e) {
    return Response.json({ success: false, message: e.message }, { status: 500 });
  }
}

// ============================================================
// 前端 UI
// ============================================================
function renderHTML(config) {
  const langOptions = Object.entries(LANGUAGES).map(([v, l]) =>
    `<option value="${v}" ${config.language === v ? 'selected' : ''}>${l}</option>`
  ).join('');

  const regionOptions = ['CN', 'TW', 'HK', 'US', 'JP', 'KR', 'FR', 'DE'].map(r =>
    `<option value="${r}" ${config.region === r ? 'selected' : ''}>${r}</option>`
  ).join('');

  const catOptions = Object.entries(CATEGORIES).map(([v, c]) =>
    `<option value="${v}" ${config.category === v ? 'selected' : ''}>${c.label}</option>`
  ).join('');

  const hourOptions = Array.from({ length: 24 }, (_, i) =>
    `<option value="${i}" ${String(config.pushHour) === String(i) ? 'selected' : ''}>${String(i).padStart(2, '0')}:00</option>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cloudflare News Hub</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; }
  .header { background: linear-gradient(135deg, #1e40af, #7c3aed); padding: 24px 32px; display: flex; align-items: center; gap: 16px; }
  .header h1 { font-size: 24px; font-weight: 700; color: white; }
  .header span { font-size: 32px; }
  .container { max-width: 800px; margin: 32px auto; padding: 0 16px; }
  .card { background: #1e293b; border-radius: 12px; padding: 24px; margin-bottom: 20px; border: 1px solid #334155; }
  .card h2 { font-size: 16px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-group { margin-bottom: 16px; }
  .form-group label { display: block; font-size: 14px; color: #94a3b8; margin-bottom: 6px; }
  .form-group select, .form-group input { width: 100%; padding: 10px 14px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #e2e8f0; font-size: 14px; outline: none; transition: border-color 0.2s; }
  .form-group select:focus, .form-group input:focus { border-color: #3b82f6; }
  .toggle { display: flex; align-items: center; gap: 12px; }
  .toggle input[type=checkbox] { width: 40px; height: 22px; appearance: none; background: #334155; border-radius: 11px; position: relative; cursor: pointer; transition: background 0.2s; }
  .toggle input[type=checkbox]:checked { background: #3b82f6; }
  .toggle input[type=checkbox]::after { content: ''; width: 18px; height: 18px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: left 0.2s; }
  .toggle input[type=checkbox]:checked::after { left: 20px; }
  .btn { padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s; }
  .btn-primary { background: #3b82f6; color: white; }
  .btn-primary:hover { background: #2563eb; }
  .btn-success { background: #10b981; color: white; }
  .btn-success:hover { background: #059669; }
  .btn-secondary { background: #334155; color: #e2e8f0; }
  .btn-secondary:hover { background: #475569; }
  .btn-group { display: flex; gap: 12px; flex-wrap: wrap; }
  .alert { padding: 12px 16px; border-radius: 8px; font-size: 14px; margin-top: 16px; display: none; }
  .alert-success { background: #064e3b; color: #6ee7b7; border: 1px solid #10b981; }
  .alert-error { background: #450a0a; color: #fca5a5; border: 1px solid #ef4444; }
  .preview-list { margin-top: 16px; }
  .preview-item { padding: 12px; background: #0f172a; border-radius: 8px; margin-bottom: 8px; border-left: 3px solid #3b82f6; }
  .preview-item a { color: #60a5fa; text-decoration: none; font-size: 14px; line-height: 1.5; }
  .preview-item a:hover { color: #93c5fd; }
  .preview-item .meta { font-size: 12px; color: #64748b; margin-top: 4px; }
  .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
  .status-on { background: #064e3b; color: #6ee7b7; }
  .status-off { background: #450a0a; color: #fca5a5; }
  .loading { display: inline-block; width: 16px; height: 16px; border: 2px solid #334155; border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
</style>
</head>
<body>
<div class="header">
  <span>📰</span>
  <div>
    <h1>Cloudflare News Hub</h1>
    <p style="color:#93c5fd;font-size:13px;margin-top:4px;">自动新闻聚合 · Telegram 推送</p>
  </div>
</div>

<div class="container">

  <!-- 基本设置 -->
  <div class="card">
    <h2>⚙️ 基本设置</h2>
    <div class="form-row">
      <div class="form-group">
        <label>语言</label>
        <select id="language">${langOptions}</select>
      </div>
      <div class="form-group">
        <label>地区</label>
        <select id="region">${regionOptions}</select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>新闻分类</label>
        <select id="category">${catOptions}</select>
      </div>
      <div class="form-group">
        <label>每次推送条数</label>
        <input type="number" id="maxItems" value="${config.maxItems}" min="1" max="20">
      </div>
    </div>
  </div>

  <!-- 关键词设置 -->
  <div class="card">
    <h2>🔍 关键词过滤</h2>
    <div class="form-group">
      <label>包含关键词（多个用逗号分隔，留空则不过滤）</label>
      <input type="text" id="keywords" value="${config.keywords}" placeholder="例如: AI,人工智能,ChatGPT">
    </div>
    <div class="form-group">
      <label>排除关键词（多个用逗号分隔）</label>
      <input type="text" id="excludeKeywords" value="${config.excludeKeywords}" placeholder="例如: 广告,推广">
    </div>
  </div>

  <!-- 推送设置 -->
  <div class="card">
    <h2>📨 推送设置</h2>
    <div class="form-row">
      <div class="form-group">
        <label>每日推送时间（北京时间）</label>
        <select id="pushHour">${hourOptions}</select>
      </div>
      <div class="form-group">
        <label>推送状态</label>
        <div class="toggle" style="margin-top:8px;">
          <input type="checkbox" id="enabled" ${config.enabled ? 'checked' : ''}>
          <label for="enabled" id="enabledLabel">${config.enabled ? '已启用' : '已停用'}</label>
        </div>
      </div>
    </div>
  </div>

  <!-- 操作按钮 -->
  <div class="card">
    <h2>🎮 操作</h2>
    <div class="btn-group">
      <button class="btn btn-primary" onclick="saveConfig()">💾 保存配置</button>
      <button class="btn btn-success" onclick="testPush()">📤 立即测试推送</button>
      <button class="btn btn-secondary" onclick="previewNews()">👁 预览新闻</button>
    </div>
    <div id="alert" class="alert"></div>
  </div>

  <!-- 新闻预览 -->
  <div class="card" id="previewCard" style="display:none;">
    <h2>📋 新闻预览</h2>
    <div id="previewList" class="preview-list"></div>
  </div>

</div>

<script>
  document.getElementById('enabled').addEventListener('change', function() {
    document.getElementById('enabledLabel').textContent = this.checked ? '已启用' : '已停用';
  });

  function showAlert(msg, type) {
    const el = document.getElementById('alert');
    el.className = 'alert alert-' + type;
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 5000);
  }

  async function saveConfig() {
    const config = {
      language: document.getElementById('language').value,
      region: document.getElementById('region').value,
      category: document.getElementById('category').value,
      keywords: document.getElementById('keywords').value,
      excludeKeywords: document.getElementById('excludeKeywords').value,
      maxItems: parseInt(document.getElementById('maxItems').value),
      pushHour: document.getElementById('pushHour').value,
      enabled: document.getElementById('enabled').checked,
    };
    const resp = await fetch('/api/config', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(config) });
    const data = await resp.json();
    showAlert(data.message, data.success ? 'success' : 'error');
  }

  async function testPush() {
    showAlert('正在推送，请稍候...', 'success');
    const resp = await fetch('/api/test', { method: 'POST' });
    const data = await resp.json();
    showAlert(data.message, data.success ? 'success' : 'error');
  }

  async function previewNews() {
    const card = document.getElementById('previewCard');
    const list = document.getElementById('previewList');
    card.style.display = 'block';
    list.innerHTML = '<div class="loading"></div> 加载中...';
    const resp = await fetch('/api/preview');
    const data = await resp.json();
    if (!data.success) { list.innerHTML = '<p style="color:#f87171">' + data.message + '</p>'; return; }
    if (data.items.length === 0) { list.innerHTML = '<p style="color:#94a3b8">没有获取到新闻</p>'; return; }
    list.innerHTML = data.items.map((item, i) =>
      '<div class="preview-item">' +
      '<a href="' + item.link + '" target="_blank">' + (i+1) + '. ' + item.title + '</a>' +
      (item.source ? '<div class="meta">📡 ' + item.source + '</div>' : '') +
      '</div>'
    ).join('');
  }
</script>
</body>
</html>`;
}
