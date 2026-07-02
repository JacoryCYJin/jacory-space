# Markdown Capability Comparison

## 1. 背景

对比 Notion、飞书 / Lark Docs 和 Jacory Space 当前博客 Markdown 能力。

目标只看“是否支持某类内容块”，不展开交互细节和实现成本。

标记：

| 标记 | 含义 |
|---|---|
| 支持 | 原生支持，或 Jacory Space 当前已实现 |
| 部分 | 支持相近能力，但模型或表现不完全一致 |
| 不支持 | 当前不支持 |
| 不适用 | 产品模型不同，不按这一类能力组织 |

## 2. 调研对象

| 对象 | 范围 |
|---|---|
| Notion | Markdown shortcut、内容块、链接提及、书签、目录 |
| 飞书 / Lark Docs | Docs 内容块、网页链接、@、目录、快捷键 |
| Jacory Space | 当前博客 Markdown parser 和渲染实现 |

## 3. 功能表格对比

| 功能块 | Notion | 飞书 / Lark | Jacory Space 当前 | 备注 |
|---|---|---|---|---|
| 段落 | 支持 | 支持 | 支持 | 基础文本块 |
| 标题 | 支持 | 支持 | 支持 | Jacory Space 支持 `##` / `###` 进入目录 |
| 粗体 / 斜体 / 行内代码 | 支持 | 支持 | 支持 | Jacory Space 支持 `**`、`*`、反引号 |
| 删除线 | 支持 | 支持 | 支持 | Jacory Space 支持 `~~text~~` |
| 行内文本高亮 | 支持 | 支持 | 支持 | Jacory Space 支持 `==text==` |
| 高亮块 | 部分 | 支持 | 支持 | Jacory Space 支持 `:::highlight` |
| 普通链接 | 支持 | 支持 | 支持 | Jacory Space 支持 `[text](url)` |
| 裸 URL 自动链接 | 支持 | 支持 | 支持 | Jacory Space 自动识别 `http(s)` |
| 外链提及 | 支持 | 部分 | 支持 | Notion 有 Paste as mention；Jacory Space 用 `@link[url]` |
| 书签 / 链接预览卡片 | 支持 | 支持 | 支持 | Jacory Space 用 `:::link` |
| 文档 / 页面提及 | 支持 | 支持 | 支持 | Jacory Space 支持 `@post[slug]` 站内文章提及 |
| 双向链接 / backlinks | 支持 | 支持 | 不支持 | Jacory Space 当前没有反链系统 |
| 引用 | 支持 | 支持 | 支持 | Jacory Space 支持 `>` 和引用来源 |
| 分隔线 | 支持 | 支持 | 支持 | Jacory Space 支持 `---` |
| 无序列表 | 支持 | 支持 | 支持 | Jacory Space 支持嵌套 |
| 有序列表 | 支持 | 支持 | 支持 | Jacory Space 支持嵌套 |
| 任务列表 | 支持 | 支持 | 支持 | Jacory Space 支持 `[x]` / `[ ]` |
| Toggle / 折叠 | 支持 | 部分 | 不支持 | 飞书支持多级列表折叠；Jacory Space 暂无折叠块 |
| 表格 | 支持 | 支持 | 支持 | Jacory Space 支持 Markdown 表格和对齐 |
| 代码块 | 支持 | 支持 | 支持 | Jacory Space 支持 fenced code |
| 图片 | 支持 | 支持 | 支持 | Jacory Space 支持普通图、右浮动、宽图 |
| 图片 caption | 支持 | 部分 | 支持 | Jacory Space 用图片 title / alt 生成 caption |
| Callout / 提示块 | 支持 | 支持 | 支持 | Jacory Space 当前支持 note / warning |
| 目录 / TOC | 支持 | 支持 | 支持 | Jacory Space 从标题自动生成 toc |
| 自定义锚点 | 部分 | 部分 | 支持 | Notion / 飞书偏块链接；Jacory Space 支持 `{#id}` |
| Frontmatter 元数据 | 不适用 | 不适用 | 支持 | Jacory Space 用于标题、分类、排序等 |
| HTML 内嵌 | 不支持 | 不支持 | 不支持 | 当前不建议放开 raw HTML |

## Sources

- [Notion Keyboard shortcuts](https://www.notion.com/help/keyboard-shortcuts)
- [Notion Intro to writing & editing](https://www.notion.com/help/writing-and-editing-basics)
- [Notion Embeds, bookmarks & link mentions](https://www.notion.com/help/embed-and-connect-other-apps)
- [Notion Link previews](https://www.notion.com/help/link-previews)
- [Notion Format your page](https://www.notion.com/help/columns-headings-and-dividers)
- [Notion Style & customize your page](https://www.notion.com/help/customize-and-style-your-content)
- [Lark Use blocks in Docs](https://www.larksuite.com/hc/en-US/articles/608015471697-use-blocks-in-docs)
- [Lark Get started with Docs](https://www.larksuite.com/hc/en-US/articles/560483946591-get-started-with-docs)
- [Lark Insert web links in Docs](https://www.larksuite.com/hc/en-US/articles/146555922217-insert-web-links-in-docs)
- [Lark Use headings and table of contents in Docs](https://www.larksuite.com/hc/en-US/articles/832981202410-use-headings-and-table-of-contents-in-docs)
- [Lark Use numbered and bulleted lists in Docs](https://www.larksuite.com/hc/en-US/articles/027898368045-use-numbered-and-bulleted-lists-in-docs)
- [Lark Insert callouts in Docs](https://www.larksuite.com/hc/en-US/articles/610649161215-insert-callouts-in-docs)
- [Lark Insert code blocks in Docs](https://www.larksuite.com/hc/en-US/articles/765028877064-insert-code-blocks-in-docs)
- [Lark Insert images in Docs](https://www.larksuite.com/hc/en-US/articles/270485351424-insert-images-in-docs)
- [飞书 在文档中使用 @ 功能](https://www.feishu.cn/hc/zh-CN/articles/561128148413-%E5%9C%A8%E6%96%87%E6%A1%A3%E4%B8%AD%E4%BD%BF%E7%94%A8-%40-%E5%8A%9F%E8%83%BD)
- [飞书 在文档中插入网页链接](https://www.feishu.cn/hc/zh-CN/articles/024005464952-%E5%9C%A8%E6%96%87%E6%A1%A3%E4%B8%AD%E6%8F%92%E5%85%A5%E7%BD%91%E9%A1%B5%E9%93%BE%E6%8E%A5)
- [飞书 在文档中获取并使用锚点链接](https://www.feishu.cn/hc/zh-CN/articles/990666397657-%E5%9C%A8%E6%96%87%E6%A1%A3%E4%B8%AD%E8%8E%B7%E5%8F%96%E5%B9%B6%E4%BD%BF%E7%94%A8%E9%94%9A%E7%82%B9%E9%93%BE%E6%8E%A5)
