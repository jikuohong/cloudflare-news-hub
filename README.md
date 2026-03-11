# 📰 Cloudflare News Hub

自动从 Google News 抓取新闻，按语言、分类、关键词过滤后推送到 Telegram。

部署在 Cloudflare Workers 上，完全免费，每天定时自动推送。

---

## 功能特性

- 多语言支持（中文、英文、日文、韩文等）
- 按分类抓取（综合、科技、财经、体育等）
- 关键词过滤 / 排除词过滤
- 每日定时推送到 Telegram
- 网页设置面板，无需改代码
- GitHub 推送后自动部署

---

## 部署步骤

### 第一步：创建 GitHub 仓库

1. 登录 GitHub，新建仓库，命名为 `cloudflare-news-hub`，设为 **Public**
2. 将以下文件上传到仓库根目录：
   - `index.js`
   - `wrangler.toml`
   - `.github/workflows/deploy.yml`

---

### 第二步：Cloudflare 控制台配置

#### 2.1 创建 KV 命名空间

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 左侧菜单 → **Workers 和 Pages** → **KV**
3. 点击 **创建命名空间**，名称填 `NEWS_CONFIG`
4. 创建后复制 **命名空间 ID**

#### 2.2 修改 wrangler.toml

打开 `wrangler.toml`，将 `id` 替换为刚才复制的 KV ID：

```toml
[[kv_namespaces]]
binding = "NEWS_CONFIG"
id = "你的KV命名空间ID"
```

#### 2.3 创建 Cloudflare API Token

1. 点击右上角头像 → **我的个人资料** → **API 令牌**
2. 点击 **创建令牌** → 使用 **Edit Cloudflare Workers** 模板
3. 创建后复制 Token（只显示一次）

#### 2.4 配置 Telegram Bot

1. 打开 Telegram，搜索 `@BotFather`
2. 发送 `/newbot`，按提示创建 Bot，获取 **Bot Token**（格式：`123456:ABC-DEF...`）
3. 获取你的 Chat ID：
   - 搜索 `@userinfobot`，发送任意消息，获取你的 `ID`
   - 或者将 Bot 加入群组，发送消息后访问：
     `https://api.telegram.org/bot{你的Token}/getUpdates`

#### 2.5 添加 Worker 环境变量

1. **Workers 和 Pages** → 找到 `cloudflare-news-hub` → **设置** → **变量和机密**
2. 添加以下两个**加密变量**：

| 变量名 | 值 |
|--------|-----|
| `TG_TOKEN` | Telegram Bot Token |
| `TG_CHAT_ID` | 你的 Telegram Chat ID |

---

### 第三步：GitHub 配置

#### 3.1 添加 GitHub Secret

1. 打开你的 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**，添加：

| Secret 名称 | 值 |
|------------|-----|
| `CLOUDFLARE_API_TOKEN` | 第 2.3 步创建的 Cloudflare API Token |

#### 3.2 触发自动部署

修改任意文件（比如 `wrangler.toml` 填入正确的 KV ID）后 push 到 `main` 分支，GitHub Actions 会自动部署到 Cloudflare Workers。

---

### 第四步：配置定时触发器

1. **Workers 和 Pages** → 找到 Worker → **触发器** → **Cron 触发器**
2. 添加触发器：`0 * * * *`（每小时执行一次，Worker 内部会判断是否到了推送时间）

---

### 第五步：使用设置面板

部署成功后，访问你的 Worker 地址（如 `https://cloudflare-news-hub.你的账号.workers.dev`）：

1. 选择语言、地区、分类
2. 设置关键词过滤（可选）
3. 设置每日推送时间（北京时间）
4. 点击 **保存配置**
5. 点击 **立即测试推送** 验证是否正常

---

## 文件结构

```
cloudflare-news-hub/
├── index.js                    # Worker 主文件（全部逻辑）
├── wrangler.toml               # Cloudflare 配置
└── .github/
    └── workflows/
        └── deploy.yml          # GitHub Actions 自动部署
```

---

## 常见问题

**Q: 推送时间不准确？**
Worker 每小时执行一次，内部以北京时间判断小时数，误差在 1 小时以内。

**Q: 获取不到中文新闻？**
语言选 `简体中文 (中国)`，地区选 `CN`，分类选 `综合新闻`。

**Q: Telegram 推送失败？**
检查 `TG_TOKEN` 和 `TG_CHAT_ID` 是否正确，以及 Bot 是否已启动（先给 Bot 发一条消息）。

**Q: 如何推送到群组？**
将 Bot 加入群组，Chat ID 填群组 ID（以 `-` 开头的负数）。

---

## 免费额度说明

Cloudflare Workers 免费套餐：
- 每天 100,000 次请求
- KV 每天 100,000 次读取

本项目每小时执行一次，每天 24 次，远低于免费限额。
