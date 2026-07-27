# 网站 SEO 与静态收录

## 目标

让 `jacoryspace.top` 的公开页面可以被搜索引擎稳定发现、抓取和建立索引，同时保持现有 Vue 页面交互、路由和内容维护方式不变。

本方案解决三个问题：

- 纯客户端渲染的初始 HTML 缺少正文，抓取结果不稳定。
- 站点没有可用的 `sitemap.xml`，搜索引擎不知道优先发现哪些页面。
- 各页面缺少独立的标题、描述、规范地址和社交分享元信息。

## 规范地址

主站地址固定为：

```text
https://jacoryspace.top
```

`www.jacoryspace.top` 由 Cloudflare 的单一重定向规则以 `301` 跳转到主站，并保留路径与查询参数。例如：

```text
https://www.jacoryspace.top/blog/021-startup-flexibility-hidden-rules
  -> https://jacoryspace.top/blog/021-startup-flexibility-hidden-rules
```

该规则属于 Cloudflare 账号配置，不由代码仓库自动创建。规则应保持以下语义：

```text
source: https://www.jacoryspace.top/*
target: https://jacoryspace.top/${1}
status: 301
preserve query string: enabled
```

## 构建链路

```text
Markdown 博客与路由
  -> scripts/generate-seo-assets.mjs
  -> public/robots.txt + public/sitemap.xml
  -> vite-ssg build
  -> dist/ 中的静态 HTML、资源与 SEO 文件
```

`jacory-space-frontend/package.json` 中的构建命令为：

```bash
npm run build
```

该命令会先生成 SEO 资源，再通过 `vite-ssg` 为公开路由生成静态 HTML。部署平台必须使用这个命令，并发布 `jacory-space-frontend/dist/`。

## 收录范围

以下页面会被预渲染并写入 sitemap：

- `/`
- `/tools`
- `/tools/media-parser`
- `/tools/minecraft-skin-editor`
- `/blog`
- `/about`
- 每一篇 `src/content/blog/*.md` 对应的 `/blog/:slug`

`999-markdown-parser-fixture.md` 是 Markdown 解析测试资源，不会进入 sitemap 或预渲染公开文章列表。

历史兼容跳转，如 `/media-parser`、`/video-parser` 与 `/podcast-parser`，不进入 sitemap；其目标页面使用规范地址收录。

## 元信息与结构化数据

### 站点与常规页面

`src/App.vue` 根据路由生成：

- `title`
- `meta[name="description"]`
- `link[rel="canonical"]`
- Open Graph：`og:title`、`og:description`、`og:type`、`og:url`、`og:site_name`
- `twitter:card`
- 首页 `WebSite` JSON-LD

所有 canonical URL 都使用非 `www` 主站地址。

### 博客文章

`src/views/BlogPost.vue` 在文章内容加载完成后生成：

- 文章独立标题与摘要
- 文章 canonical URL 与 Open Graph 标签
- `article:published_time`
- `BlogPosting` JSON-LD

文章日期来自 Markdown frontmatter 的 `date` 字段。月级历史日期会在结构化数据中补为当月第一天，例如 `2026.06` 变为 `2026-06-01`。

## 文件职责

| 文件 | 职责 |
| --- | --- |
| `jacory-space-frontend/src/main.js` | Vite SSG 应用入口，枚举公开博客路由。 |
| `jacory-space-frontend/src/App.vue` | 常规页面的 SEO 标签与首页结构化数据。 |
| `jacory-space-frontend/src/views/BlogPost.vue` | 文章 SEO 标签、文章结构化数据与服务端预取。 |
| `jacory-space-frontend/src/i18n/index.js` | 静态渲染环境下的语言初始化保护。 |
| `jacory-space-frontend/scripts/generate-seo-assets.mjs` | 生成 `robots.txt` 和 `sitemap.xml`。 |
| `jacory-space-frontend/public/robots.txt` | 允许抓取并声明 sitemap。 |
| `jacory-space-frontend/public/sitemap.xml` | 构建后的公开 URL 清单。 |
| `jacory-space-frontend/vite.config.js` | 静态渲染所需的服务端构建依赖配置。 |

## 新增博客后的行为

新增符合 frontmatter 规范的 `src/content/blog/<slug>.md` 后，不需要手动编辑 sitemap。

下一次执行 `npm run build` 时，构建脚本会自动：

1. 将文章路由加入静态预渲染。
2. 将文章的 canonical URL 加入 `sitemap.xml`。
3. 在文章静态 HTML 中输出文章级 SEO 标签和 `BlogPosting` 数据。

## 发布后的检查

部署完成后，检查：

```bash
curl -I https://jacoryspace.top/
curl https://jacoryspace.top/robots.txt
curl https://jacoryspace.top/sitemap.xml
curl -I https://www.jacoryspace.top/
```

预期：

- 根域名页面返回 `200`。
- `robots.txt` 包含 `Sitemap: https://jacoryspace.top/sitemap.xml`。
- `sitemap.xml` 返回 XML，不是网站首页 HTML。
- `www` 返回 `301`，其 `Location` 指向非 `www` 地址。
- 任意博客页面的响应 HTML 包含文章标题、正文、canonical 和 `BlogPosting` JSON-LD。

## 搜索平台提交

代码与部署完成后，由域名所有者在 Google Search Console 完成：

1. 以 DNS 验证 `jacoryspace.top`。
2. 提交 `https://jacoryspace.top/sitemap.xml`。
3. 使用“网址检查”请求收录首页和重要文章。

Bing Webmaster Tools 可使用同一 sitemap；可以在 Google Search Console 验证完成后导入。

搜索引擎收录需要自行抓取和评估，提交 sitemap 或请求收录不会保证即时出现或指定关键词排名。

## 已知边界

- 网站语言切换通过客户端状态完成，没有独立的语言 URL，因此当前不输出 `hreflang`。
- 本方案不自动登录或提交 Google Search Console、Bing Webmaster Tools。
- Cloudflare 重定向规则由账号配置维护；仓库仅记录期望行为。
