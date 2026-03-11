# 📰 Cloudflare News Hub

自动从多家权威媒体抓取新闻，经 **Workers AI 智能摘要**后推送到 Telegram。

部署在 Cloudflare Workers 上，完全免费，每天定时自动推送。

---

## ✨ 功能特性

- **10 家权威媒体**：Google News、路透社、BBC、新华社、美联社、彭博社、金融时报、卫报、NHK、半岛电视台
- **🤖 AI 智能摘要**：Workers AI（Llama 3.1）自动提炼今日新闻要点
- 多语言支持（中文、英文、日文、韩文等）
- 按分类抓取（综合、科技、财经、体育等）
- 关键词过滤 / 排除词过滤
- 每日定时推送到 Telegram
- 网页设置面板，无需改代码
- GitHub 推送后自动部署

---

## 📨 推送格式

```
📰 Cloudflare News Hub
🗂 综合新闻 | 🕐 2026/3/11 08:00:00

━━━━━ 🤖 AI 今日摘要 ━━━━━

1. 全球科技巨头加速布局 AI 芯片...
2. 美联储暗示年内降息预期收窄...
3. ...

━━━━━ 📎 原文链接 ━━━━━

🔍 Google News
1. 标题...

📡 路透社 Reuters
2. 标题...
```

---

## 🚀 部署步骤

### 第一步：创建 GitHub 仓库

1. 登录 GitHub，新建公开仓库，命名为 `cloudflare-news-hub`
2. 上传以下文件到根目录：
   - `index.js`
   - `wrangler.toml`
   - `.github/workflows/deploy.yml`

---

### 第二步：Cloudflare 控制台配置

#### 2.1 创建 KV 命名空间

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **Workers 和 Pages** → **KV** → **创建命名空间**
3. 名称填 `NEWS_CONFIG`，创建后复制 **命名空间 ID**

#### 2.2 修改 wrangler.toml

将 `id` 替换为刚才复制的 KV ID：

```toml
name = "cloudflare-news-hub"
main = "index.js"
compatibility_date = "2024-03-01"

[ai]
binding = "AI"

[[kv_namespaces]]
binding = "NEWS_CONFIG"
id = "你的KV命名空间ID"    # ← 改这里

[triggers]
crons = ["0 * * * *"]
```

#### 2.3 创建 Cloudflare API Token

1. 右上角头像 → **我的个人资料** → **API 令牌**
2. **创建令牌** → 使用 **Edit Cloudflare Workers** 模板
3. 确认包含以下权限：
   - `Account - Workers Scripts - Edit`
   - `Account - Workers KV Storage - Edit`
   - `User - User Details - Read`
4. 创建后复制 Token（只显示一次）

#### 2.4 配置 Telegram Bot

1. 打开 Telegram，搜索 `@BotFather`
2. 发送 `/newbot`，创建 Bot，获取 **Bot Token**（格式：`123456:ABC-DEF...`）
3. 获取你的 Chat ID：搜索 `@userinfobot`，发送任意消息即可获取

#### 2.5 添加 Worker 环境变量

**Workers 和 Pages** → 找到 Worker → **设置** → **变量和机密**，添加：

| 变量名 | 类型 | 值 |
|--------|------|----|
| `TG_TOKEN` | 加密变量 | Telegram Bot Token |
| `TG_CHAT_ID` | 加密变量 | 你的 Telegram Chat ID |

---

### 第三步：GitHub 配置

#### 3.1 添加 GitHub Secret

仓库 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**：

| Secret 名称 | 值 |
|------------|-----|
| `CLOUDFLARE_API_TOKEN` | 第 2.3 步创建的 Token |

#### 3.2 触发自动部署

将修改好的 `wrangler.toml`（填入正确 KV ID）push 到 `main` 分支，GitHub Actions 自动部署。

---

### 第四步：使用设置面板

部署成功后访问 Worker 地址（如 `https://cloudflare-news-hub.你的账号.workers.dev`）：

1. 勾选需要的**新闻来源**（最多 10 家）
2. 选择语言、地区、分类
3. 设置关键词过滤（可选）
4. 设置每日推送时间（北京时间）
5. 开启/关闭 **AI 摘要**
6. 点击 **保存配置**
7. 点击 **立即测试推送** 验证（约 10~20 秒，AI 生成摘要需要时间）

---

## 📁 文件结构

```
cloudflare-news-hub/
├── index.js                    # Worker 主文件（全部逻辑）
├── wrangler.toml               # Cloudflare 配置
└── .github/
    └── workflows/
        └── deploy.yml          # GitHub Actions 自动部署
```

---

## 🌐 支持的新闻来源

| 来源 | 特点 |
|------|------|
| 🔍 Google News | 多语言聚合，支持分类和关键词 |
| 📡 路透社 Reuters | 全球突发新闻权威 |
| 🇬🇧 BBC News | 英国权威媒体 |
| 🇨🇳 新华社 | 中国官方媒体 |
| 🗞 美联社 AP | 美国权威通讯社 |
| 💹 彭博社 Bloomberg | 财经专业媒体 |
| 🏦 金融时报 FT | 国际财经权威 |
| 🌐 卫报 The Guardian | 英国大报，深度报道 |
| 🇯🇵 NHK World | 日本国家广播 |
| 🌍 半岛电视台 Al Jazeera | 中东视角国际新闻 |

---

## 💰 免费额度说明

| 服务 | 免费额度 | 本项目消耗 |
|------|---------|-----------|
| Workers 请求 | 10万次/天 | 每天 24 次 ✅ |
| Workers AI | 10,000 Neurons/天 | 每次推送约 500 ✅ |
| KV 读写 | 10万次/天 | 每天不足 100 次 ✅ |

每天推送 1~4 次完全免费，无需担心费用。

---

## ❓ 常见问题

**Q: AI 摘要是中文的吗？**
是的，Prompt 指定了用中文输出，无论新闻来源是什么语言。

**Q: 测试推送很慢？**
正常，AI 生成摘要需要 10~20 秒。定时推送在后台执行，不影响使用。

**Q: 可以推送到群组吗？**
可以，将 Bot 加入群组，`TG_CHAT_ID` 填群组 ID（以 `-` 开头的负数）。

**Q: 推送时间不准确？**
Worker 每小时唤醒一次，以北京时间判断，误差在 1 小时以内。

**Q: 某个媒体抓取失败怎么办？**
多源并发抓取，单个源失败不影响其他源，会自动跳过。
