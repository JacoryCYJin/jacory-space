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

## 行内样式

```md
**粗体**
*斜体*
`行内代码`
~~删除线~~
==高亮==
```

转义：

```md
\*不会变成斜体\*
\`不会变成代码\`
```

## 链接

普通链接：

```md
[Jacory Space](https://github.com/JacoryCYJin/jacory-space)
```

裸 URL：

```md
https://example.com/path
```

提及：

```md
@link[https://popicon.life/remembering-russi-taylor-as-mcdonalds-birdie-the-early-bird/]
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

## 分隔线

```md
---
```
