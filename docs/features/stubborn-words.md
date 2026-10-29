# 顽固单词 · 每日过词器

入口：`/tools/stubborn-words`，也可从网站工具索引进入。

## 范围

只读取 Notion「每日复习」视图匹配的词条，在软件中乱序练习。当前视图为
`401b7127-7273-80a1-96f9-000c4cc7c28f`，数据源为「顽固单词」。
不自行用“最近 24 小时”或“只看未掌握”重建近似筛选。

读取后固定本批词条；重新读取、整批重练和待巩固复测时重新洗牌。
刷新页面保留已完成队列及其判断，只重排剩余部分；恢复时立即保存新顺序。
有至少两个候选词时，避免连续两次从相同候选词开始；零个或一个词不强制更换。
一轮进行中不自行换序，暂停后继续沿用当前顺序，“上一词”按实际队列返回。
Notion 的数据、筛选与排序均不修改。

先展示英文，选择“记得清”或“记不清”后显示完整中文释义。
按中文或英文分号逐项分行，保留分号、原始词性及局部加粗，不改写源内容。
不单独设置“模糊”：它与“记不清”在本工具中采用相同巩固流程。

- 记得清：核对正确后点“下一个”，该词不进入本轮巩固。
- 记不清：核对后点“下一个”，进入本轮待巩固词。
- 记错了：只在选择“记得清”并翻开释义后显示，点选即纠正判断并进入下一词。
  与“记不清”进入同一个待巩固列表，不另设优先级，开始复测时统一洗牌。

结束页提供“复习待巩固词”或整批重练，仍可随时结束。
复测时核对正确的“记得清”退出待巩固范围，记不清或记错的词继续保留。
本地记录仍使用兼容原版的布尔标记，已有进度无需迁移或清空。
翻开前尚未完成核对的选择不计入结果；暂停后从该词重新回忆，刷新后从重排的剩余队列继续。
返回上一词会撤回该词的本轮选择，重新选择。结束复习清除本轮标记和位置，
保留已读取的词表供再次练习。

每个浏览器的 localStorage 只保存本批词条、位置及本轮标记，用于刷新和暂停后续练。
不保存 Notion 凭据或网站访问口令。不做跨设备同步、跨天排程、自动掌握判断。
浏览器禁用存储时会提示，仍能完成当前复习。

## 只读接入

前端请求同源 `GET /api/word-review`。服务端：

1. 校验网站访问口令。
2. `GET /v1/views/{view_id}` 读取视图名称。
3. `POST /v1/views/{view_id}/queries` 按保存的视图创建临时读取结果。
4. 必要时用 `GET` 翻页；较长的富文本属性通过属性读取接口补齐。
5. 返回词条 ID、英文、释义的文字片段与加粗标记，以及读取时间。

Notion API 版本固定 `2026-03-11`。视图查询属于 `read_content` / `read_property`
能力；不会更新视图、词条、状态、次数、首次日期或更改日期。
临时查询按 Notion 机制自动过期，不调用任何删除或更新接口。
不需要、也不使用 `update_content` 或 `insert_content` 能力。

发生读取失败、权限不足或结构变化时返回错误；不把错误当作空词表，
也不以测试数据替代真实内容。已有进度直到新读取成功才会替换。

## 本地配置

聊天内的 Notion 连接不是网站运行凭据。需要建立只读 Notion connection，
将目标数据库分享给它，再将以下两项添加至
`jacory-space-frontend/.env.local`（该文件已由仓库忽略）：

```dotenv
NOTION_WORD_REVIEW_TOKEN=<只读 Notion connection 的 token>
WORD_REVIEW_ACCESS_KEY=<自行设置的足够长的随机访问口令>
```

页面只输入第二项访问口令，绝不输入 Notion token。禁止使用 `VITE_` 前缀保存 token，
禁止将凭据写入前端、静态资源或仓库。两个值未配置时，接口返回 `NOT_CONFIGURED`，
避免私人词表成为公开 API。所有接口响应使用 `private, no-store`，不开放跨域读取。

可选 `NOTION_WORD_REVIEW_VIEW_ID` 用于以后更换来源视图，不配置则读取上述已确认视图。
Vite 开发服务和 `vite preview` 使用同一个只读接口。修改环境配置后按项目现有方式重载服务；
若已有服务由用户启动，不擅自启停。

## 生产部署

现有网站仍以 Vite SSG 生成公开静态页面；不在构建时读取或打包私人单词。
静态页面单独部署不能运行 Notion 接口。

提供了可选 Cloudflare Pages Functions 适配器：
`jacory-space-frontend/functions/api/word-review.js`，复用相同服务端处理函数。
只有选择 Cloudflare Pages Functions 部署时才使用此适配器；不能据此假定当前网站已部署到该平台。
项目根目录应为 `jacory-space-frontend`，输出目录为 `dist`，
在部署平台服务端 Secrets 中配置上述两项凭据。
其他托管平台需要挂载同等的同源服务端处理函数，并保留口令校验及禁缓存行为。
本次不修改线上账号、域名、连接权限或部署配置。

## 验证

在 `jacory-space-frontend/` 执行：

```bash
node --test tests/word-review.test.mjs
npm run build
```

自动验证覆盖分号换行与加粗保留、两档回忆与纠错、待巩固词复测、撤回选择、恢复进度、只读请求范围、口令校验、
视图翻页、富文本分页、空视图和读取错误。模拟数据只用于测试，不进入产品页面。
真实 Notion 联通需要完成上述凭据配置后，在页面读取并与 Notion 视图逐条比对。

本地浏览器回归入口：`/tests/word-review-browser.html`。该页明确标注合成词表，
可初始化两条测试词验证翻卡、标记、重看、刷新续练及 1440px iframe 布局。
结束后使用“清除测试进度并返回真实页面”移除该浏览器中的测试批次。
此 HTML 不属于生产构建入口，不能作为真实词表接入的替代。

## 官方参考

- [Notion：Working with views](https://developers.notion.com/guides/data-apis/working-with-views)
- [Notion：Rich text](https://developers.notion.com/reference/rich-text)
- [Notion：Retrieve a page property item](https://developers.notion.com/reference/retrieve-a-page-property)
- [Vite 5：Plugin API](https://v5.vite.dev/guide/api-plugin.html)
- [Cloudflare Pages：Functions routing](https://developers.cloudflare.com/pages/functions/routing/)
