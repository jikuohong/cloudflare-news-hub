# 📰 中文新闻 Hub

> 运行在 **Cloudflare Workers** 上的零服务器中文新闻聚合与多渠道推送系统

<div align="center">

![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![Media Sources](https://img.shields.io/badge/媒体来源-23家-blue)
![Push Channels](https://img.shields.io/badge/推送渠道-9个-purple)
![AI Powered](https://img.shields.io/badge/AI-Llama_3.1-orange)

**[部署步骤](#-部署步骤) · [推送渠道](#-推送渠道配置) · [环境变量](#-环境变量一览) · [常见问题](#-常见问题)**

</div>

---

## ✨ 特性

| | 特性 | 说明 |
|---|---|---|
| ⚡ | **零服务器** | 完全运行在 Cloudflare Workers，无需购买服务器、无需维护 |
| 🆓 | **完全免费** | Workers 免费额度每天 10 万次请求，完全够用 |
| 🌐 | **23 家媒体** | 港台海外主流中文媒体，RSS 实时聚合 |
| 📬 | **9 个推送渠道** | Telegram / 飞书 / 钉钉 / 企业微信 / PushPlus / Bark / WxPusher / ntfy / Gotify |
| 🤖 | **AI 摘要** | Workers AI（Llama 3.1）每日要点提炼，按小时缓存 |
| 🔁 | **智能去重** | Jaccard 相似度算法 + 跨批次历史去重，24 小时内每条新闻最多推一次 |
| 🔄 | **失败重试** | 推送失败渠道自动记录，下次触发时补发 |
| 🌙 | **深色模式** | 自动跟随系统，支持手动切换 |

---

## 🚀 部署步骤

### 前置准备

1. 注册 [Cloudflare](https://cloudflare.com) 账号（免费）
2. 在 Workers & Pages 创建一个新 **Worker**
3. 创建一个 **KV Namespace**，绑定到 Worker，变量名设为 `NEWS_CONFIG`
4. （可选）开启 **Workers AI** 绑定，变量名 `AI`，启用 AI 摘要功能

### 部署代码

1. 将 `index.js` 全部内容粘贴到 Worker 编辑器
2. 点击右上角 **Deploy** 部署
3. 访问 Worker URL，看到新闻界面即部署成功 🎉

### 配置定时推送

前往 Worker → **Triggers → Cron Triggers**，添加：

```
0 * * * *
```

> 每小时整点触发一次，系统根据你在侧边栏设置的推送时间决定是否实际推送，同一小时内不会重复推送。

---

## 📬 推送渠道配置

所有变量均在 **Cloudflare Worker → Settings → Variables** 中配置，配置完成后刷新页面，侧边栏会实时显示 `✅ 已配置` / `未配置` 状态。

### ✈️ Telegram

| 变量名 | 说明 |
|--------|------|
| `TG_TOKEN` | BotFather 创建的 Bot Token |
| `TG_CHAT_ID` | 接收消息的 Chat ID（支持群组，ID 以 `-` 开头） |

<details>
<summary>获取方式</summary>

1. 向 [@BotFather](https://t.me/botfather) 发送 `/newbot`，获得 `TG_TOKEN`
2. 向 Bot 发一条消息，然后访问：
   ```
   https://api.telegram.org/bot<TOKEN>/getUpdates
   ```
3. 从返回 JSON 中找到 `chat.id`，填入 `TG_CHAT_ID`

> 💡 消息超过 4096 字符时自动分段发送，段间等待 500ms 避免触发限流。

</details>

---

### 🪶 飞书

| 变量名 | 说明 |
|--------|------|
| `FEISHU_WEBHOOK` | 自定义机器人 Webhook URL |

<details>
<summary>获取方式</summary>

飞书群 → 右上角「设置」→「机器人」→「添加机器人」→「自定义机器人」→ 复制 Webhook 地址

消息以**卡片（Card）格式**发送，支持 Markdown。

</details>

---

### 📎 钉钉

| 变量名 | 是否必填 | 说明 |
|--------|----------|------|
| `DINGTALK_WEBHOOK` | ✅ 必填 | 自定义机器人 Webhook URL |
| `DINGTALK_SECRET` | 可选 | 加签密钥（启用加签安全设置时填写） |

<details>
<summary>获取方式</summary>

钉钉群 → 「智能群助手」→「添加机器人」→「自定义」→ 安全设置选「加签」→ 复制密钥和 Webhook URL

> ⚠️ Webhook URL 中必须包含 `access_token` 参数。加签密钥使用 HMAC-SHA256，系统自动拼接 `timestamp` 和 `sign`。

</details>

---

### 💼 企业微信

| 变量名 | 说明 |
|--------|------|
| `WECOM_WEBHOOK` | 群机器人 Webhook URL |

<details>
<summary>获取方式</summary>

企业微信群 → 右键群名称 → 「添加群机器人」→「创建新的机器人」→ 复制 Webhook 地址

消息以 **Markdown 格式**发送。

</details>

---

### ➕ PushPlus

| 变量名 | 说明 |
|--------|------|
| `PUSHPLUS_TOKEN` | 用户 Token |

前往 [pushplus.plus](https://www.pushplus.plus) 注册获取 Token，消息推送至微信公众号。

---

### 🔔 Bark（iOS）

| 变量名 | 说明 |
|--------|------|
| `BARK_URL` | 完整推送地址，如 `https://api.day.app/your_key` |

App Store 下载 [Bark](https://apps.apple.com/app/bark-customed-notifications/id1403753865)，打开 App 复制推送地址。支持自托管 Bark 服务器。

> 消息使用 POST JSON 方式发送，避免 URL 特殊字符截断问题。

---

### 💬 WxPusher

| 变量名 | 是否必填 | 说明 |
|--------|----------|------|
| `WXPUSHER_APP_TOKEN` | ✅ 必填 | 应用 appToken |
| `WXPUSHER_UIDS` | 二选一 | 接收用户 UID，逗号分隔，如 `UID_xxx,UID_yyy` |
| `WXPUSHER_TOPIC_IDS` | 二选一 | 主题 ID，逗号分隔 |

> ⚠️ **注意：** 微信官方已限制模板消息，通过微信公众号接收需下载 WxPusher APP。若需微信推送，推荐改用 **PushPlus**。

---

### 🔔 ntfy

| 变量名 | 是否必填 | 说明 |
|--------|----------|------|
| `NTFY_URL` | ✅ 必填 | 推送地址，含 topic，如 `https://ntfy.sh/your_topic` |
| `NTFY_TOKEN` | 可选 | 访问令牌（服务端开启认证时填写） |

<details>
<summary>配置说明</summary>

**使用公共服务器（ntfy.sh）：**
1. 访问 [ntfy.sh](https://ntfy.sh)，直接用任意 topic 名称（无需注册）
2. 填入 `NTFY_URL`，如 `https://ntfy.sh/my-news-hub-abc123`
3. 手机端订阅同一 topic 即可收到推送

**自托管服务器：**
```
NTFY_URL = https://ntfy.example.com/your_topic
NTFY_TOKEN = your_access_token   # 仅在服务端配置了认证时需要填写
```

> 💡 ntfy 完全开源，支持 Android / iOS / Web，无需账号，自托管友好。消息以纯文本格式发送（截取前 4000 字符）。

</details>

---

### 📡 Gotify

| 变量名 | 是否必填 | 说明 |
|--------|----------|------|
| `GOTIFY_URL` | ✅ 必填 | Gotify 服务地址，如 `https://gotify.example.com` |
| `GOTIFY_TOKEN` | ✅ 必填 | 应用 Token（在 Gotify 后台「Apps」中创建应用获得） |

<details>
<summary>配置说明</summary>

1. 部署 [Gotify 服务端](https://gotify.net/docs/install)（Docker 一键部署）
2. 在 Gotify 后台 → **Apps** → 创建新应用 → 复制 Token
3. 填入 `GOTIFY_URL`（服务器地址，不含路径）和 `GOTIFY_TOKEN`

```
GOTIFY_URL   = https://gotify.example.com
GOTIFY_TOKEN = AbCdEfGhIjKlMnOp
```

消息以 **Markdown 格式**发送（`priority: 5`），客户端支持 Android / Web，iOS 需借助 [Gotify-APNS](https://github.com/gotify/server/issues/47) 中转。

> ⚠️ Gotify 为**自托管**服务，需要自行部署服务端，不提供公共云服务。

</details>

---

## 🗺️ 环境变量一览

| 变量名 | 渠道 | 必填 |
|--------|------|------|
| `TG_TOKEN` | Telegram | ✅ |
| `TG_CHAT_ID` | Telegram | ✅ |
| `FEISHU_WEBHOOK` | 飞书 | ✅ |
| `DINGTALK_WEBHOOK` | 钉钉 | ✅ |
| `DINGTALK_SECRET` | 钉钉（加签） | 可选 |
| `WECOM_WEBHOOK` | 企业微信 | ✅ |
| `PUSHPLUS_TOKEN` | PushPlus | ✅ |
| `BARK_URL` | Bark | ✅ |
| `WXPUSHER_APP_TOKEN` | WxPusher | ✅ |
| `WXPUSHER_UIDS` | WxPusher | 二选一 |
| `WXPUSHER_TOPIC_IDS` | WxPusher | 二选一 |
| `NTFY_URL` | ntfy | ✅ |
| `NTFY_TOKEN` | ntfy | 可选 |
| `GOTIFY_URL` | Gotify | ✅ |
| `GOTIFY_TOKEN` | Gotify | ✅ |

> 未配置的渠道自动跳过，已配置渠道**全部并发推送**，互不影响。

---

## 📡 新闻来源

共 23 家，可在侧边栏「📡 新闻来源」中按需勾选。

| 地区 | 媒体 |
|------|------|
| 🇭🇰 香港 | 香港01 · 明报 · 东方日报 · 星岛日报 · 信报 |
| 🇹🇼 台湾 | 自由时报 · 联合新闻网 · 中央社 · 中央广播电台 · 风传媒 · 关键评论网 · ETtoday · 三立新闻 |
| 🌏 海外 | 自由亚洲电台（RFA）· 美国之音中文（VOA）· BBC中文（简/繁）· 端传媒 · 德国之声中文 · 多维新闻 |
| 🇰🇷🇸🇬 海外 | 朝鲜日报中文 · 联合早报 |
| 🔍 聚合 | Google 新闻（支持按分类/关键词定制） |

---

## 🗂️ 新闻分类

侧边栏左侧可切换**页面浏览分类**，推送设置中可**多选推送分类**。

| 分组 | 分类 |
|------|------|
| 综合 | 📰 综合新闻 |
| 时事 | 🌍 国际 · 🇨🇳 两岸三地 · 🏛️ 政治 · 👥 社会 |
| 财经 | 💹 财经 · 📈 股市 · 🏠 房产 |
| 科技 | 💻 科技 · 🤖 AI 人工智能 |
| 生活 | ❤️ 健康医疗 · 🎬 娱乐 · ⚽ 体育 · 🔬 科学 · 🎨 文化艺术 · ✈️ 旅游 |

---

## 🔧 核心优化说明

<details>
<summary><b>① Jaccard 标题相似度去重（同批次）</b></summary>

将标题拆解为字符 bigram（连续 2 字符），计算两个标题集合的 Jaccard 系数。相似度 ≥ **0.55** 视为同一事件，同批次内自动过滤冗余报道。

**示例：**
```
❌ 台湾总统宣布新经济政策，将加大科技投入   （联合报）
✅ 赖清德今日宣布科技经济政策，扩大投资       （中央社）→ 保留

Jaccard 相似度 = 0.62 > 0.55，自动去重
```

</details>

<details>
<summary><b>② 跨批次历史去重</b></summary>

每次推送成功后，将本批标题存入 KV（TTL 24 小时，最多保留 500 条）。下次推送前先与历史记录做相似度比对，**只推真正新增的内容**。

</details>

<details>
<summary><b>③ Telegram 自动分段</b></summary>

Telegram 单消息上限 4096 字符。系统自动按换行切分为多段（每段 ≤ 4000 字符），段间等待 500ms 避免触发速率限制，每段末尾标注「（1/N）」。

</details>

<details>
<summary><b>④ AI 摘要统一缓存</b></summary>

页面访问和定时推送共用同一套 KV 缓存（Key 精确到小时）。同一小时内无论哪个先触发，均复用同一份摘要，**Workers AI 每小时最多调用一次**。

</details>

<details>
<summary><b>⑤ RSS 源 KV 缓存（8 分钟）</b></summary>

每个 RSS 源缓存 8 分钟（`rss_cache_<源名>`，TTL 480 秒）。缓存命中时直接读取，大幅降低对外请求数和页面加载时间。

</details>

<details>
<summary><b>⑥ 推送失败自动重试</b></summary>

推送失败的渠道写入 KV（`push_failed_channels`，TTL 2 小时）。下一个 Cron 触发时先检查失败列表，仅对失败渠道补发，成功后自动清除记录。

</details>

---

## 🗄️ KV 存储键说明

| Key | 用途 | TTL |
|-----|------|-----|
| `config` | 用户配置（分类、来源、推送时间等） | 永久 |
| `pushed_titles_cache` | 已推标题历史（跨批次去重） | 24 小时 |
| `rss_cache_<source>` | RSS 源原始内容缓存 | 8 分钟 |
| `summary_cache_<cat>_<hour>` | AI 摘要缓存（按分类+小时） | 24 小时 |
| `lastRun_<date>_<hour>` | 当天当小时是否已推标记 | 24 小时 |
| `push_failed_channels` | 上次推送失败的渠道列表 | 2 小时 |

---

## ❓ 常见问题

<details>
<summary><b>侧边栏显示「未配置」，但我已经填了变量？</b></summary>

环境变量修改后需要重新 **Deploy** Worker，或等待 Cloudflare 自动刷新后再访问页面。

</details>

<details>
<summary><b>点击「立即推送」报错「没有新内容」？</b></summary>

说明 24 小时内已推过的新闻占满了当前抓取结果。可以：
- 在侧边栏勾选更多新闻来源
- 等几小时后重试
- 在 Cloudflare KV 控制台手动删除 `pushed_titles_cache` 键重置去重记录

</details>

<details>
<summary><b>AI 摘要没有出现？</b></summary>

请确认：
1. Worker 已绑定 Workers AI（变量名 `AI`）
2. 侧边栏「AI 摘要」开关已开启
3. 当前账号有 Workers AI 免费额度

</details>

<details>
<summary><b>Telegram 收到了好几条消息？</b></summary>

这是正常的**自动分段**行为。新闻条目多时消息超过 4000 字符，系统自动拆分多段发送。可在推送设置中减少「推送条数」来控制消息长度。

</details>

<details>
<summary><b>钉钉推送失败报签名错误？</b></summary>

检查 `DINGTALK_SECRET` 是否正确，且 Webhook URL 中已包含 `access_token` 参数。加签计算使用 HMAC-SHA256，系统自动拼接 `timestamp` 和 `sign` 参数。

</details>

<details>
<summary><b>如何只推特定关键词的新闻？</b></summary>

在侧边栏「⚙️ 推送设置」中填写**包含关键词**（逗号分隔），推送时只保留标题包含关键词的新闻。同时支持**排除关键词**过滤不想看的内容。

</details>

---

## 📄 License

MIT © 2025 中文新闻 Hub

---

<div align="center">

**Powered by [Cloudflare Workers](https://workers.cloudflare.com) · [Workers AI](https://developers.cloudflare.com/workers-ai) · [Workers KV](https://developers.cloudflare.com/kv)**

如果这个项目对你有帮助，欢迎 ⭐ Star 支持一下！

</div>
