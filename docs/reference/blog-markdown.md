# Blog Markdown Reference

## 文件位置

```txt
jacory-space-frontend/src/content/blog/
```

## Frontmatter

```md
---
title: "文章标题"
description: "文章描述"
date: "2026.07.01"
category: "method"
index: "999"
readTime: "5 MIN"
tags:
  - TagA
  - TagB
---
```

## 标题

```md
## 01. 二级标题

### 01.1 三级标题
```

自定义锚点：

```md
## 标题 {#custom-id}
```

目录只收集 `##` 和 `###`。

## 段落换行

普通段落内的单个换行会按页面换行渲染：

```md
一个功能到底解决什么问题？
做到什么程度算完成？
哪些地方不能动？
```

空行仍然表示新段落。

## 行内样式

```md
**粗体**
*斜体*
`行内代码`
~~删除线~~
==高亮==
@color[blue][蓝色文字]
@mark[yellow][黄色高亮]
@accent[强调色简写]
```

转义：

```md
\*不会变成斜体\*
\`不会变成代码\`
```

说明：

- `**文字**` 用于普通加粗。
- `==文字==` 用于默认浅色行内高亮，等价于 `@mark[default][文字]`。
- `@color[token][文字]` 用于字体颜色。
- `@mark[token][文字]` 用于行内高亮底色。
- `@accent[文字]` 是 `@color[blue][文字]` 的兼容简写。
- 支持的 token：`default`、`gray`、`blue`、`green`、`yellow`、`orange`、`red`、`purple`、`pink`。
- CMS 推荐生成 `@color[token][文字]` 和 `@mark[token][文字]`，不要生成 raw HTML、内联 CSS 或任意 hex 色值。
- 色板只作用于行内文字；`:::highlight` 高亮块暂不支持自定义颜色。

Jacory Space 版冷静色板：

| Token | 用途建议 |
|---|---|
| `default` | 默认文字或默认浅高亮 |
| `gray` | 弱化、旁注、低优先级信息 |
| `blue` | 主要强调、核心结论 |
| `green` | 正向状态、通过、可行 |
| `yellow` | 注意、提醒、待判断 |
| `orange` | 过程风险、成本、阻塞 |
| `red` | 错误、反例、明确风险 |
| `purple` | 概念、抽象层、框架 |
| `pink` | 人物、情绪、轻量提示 |

本地测试 fixture：

- `jacory-space-frontend/src/content/blog/999-markdown-parser-fixture.md` 用于本地验证解析能力。
- 该文件和对应 link preview 缓存已加入 `.gitignore`，不要提交到线上内容。
- 如需本地生成链接预览，运行 `npm run lp -- 999-markdown-parser-fixture`。

## 链接

普通链接：

```md
[Jacory Space](https://github.com/JacoryCYJin/jacory-space)
```

裸 URL：

```md
https://example.com/path
```

外链提及：

```md
@link[https://popicon.life/remembering-russi-taylor-as-mcdonalds-birdie-the-early-bird/]
```

站内文章提及：

```md
@post[011-ai-clarity-before-efficiency]
```

书签：

```md
:::link
https://popicon.life/remembering-russi-taylor-as-mcdonalds-birdie-the-early-bird/
:::
```

生成链接预览缓存：

```bash
cd jacory-space-frontend
npm run lp -- 999-markdown-parser-fixture
```

扫描全部：

```bash
cd jacory-space-frontend
npm run lp:all
```

缓存位置：

```txt
jacory-space-frontend/src/content/link-previews/<md-file-name>.json
```

## 引用

```md
> 引用第一行
> 引用第二行
> — 引用来源
```

## 列表

无序列表：

```md
- 一级项目
  - 二级项目
    - 三级项目
```

有序列表：

```md
1. 第一步
2. 第二步
3. 第三步
```

任务列表：

```md
- [x] 已完成
- [ ] 未完成
  - [x] 子任务已完成
  - [ ] 子任务未完成
```

## 表格

```md
| 左对齐 | 居中 | 右对齐 |
| :-- | :-: | --: |
| Alpha | Beta | 100 |
| Long text | Center | 999 |
```

## 代码块

````md
```js
const clarity = true
```
````

## 图片

普通图片：

```md
![图片描述](/images/blog/example.svg "图片标题")
```

右浮动图片：

```md
![figure:right 图片描述](/images/blog/example.svg "图片标题")
```

宽图：

```md
![figure:wide 图片描述](/images/blog/example.svg "图片标题")
```

内联图：

```md
![figure:inline 图片描述](/images/blog/example.svg "图片标题")
```

## 提示块

Note：

```md
:::note
这是 note 内容。
:::
```

Warning：

```md
:::warning
这是 warning 内容。
:::
```

Highlight：

```md
:::highlight
这是 highlight 内容。
:::
```

## 分隔线

```md
---
```
