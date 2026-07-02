---
title: "Markdown 解析能力测试"
description: "用于测试当前博客 Markdown 解析器支持的标题、目录、行内样式、列表、任务列表、表格、图片、引用、代码块和提示块。"
date: "2026.07.01"
category: "method"
index: "999"
readTime: "5 MIN"
tags:
  - Markdown
  - Parser
  - Test
---

## 01. 标题与自定义锚点 {#heading-custom-id}

这个标题使用了自定义 id：`{#heading-custom-id}`。目录点击后应该跳到这里。

### 01.1 三级标题

三级标题也会进入目录，但不会自动加 `01 / 02 / 03` 编号。

## 02. 行内样式

这是普通段落，包含 **粗体**、*斜体*、`行内代码`、~~删除线~~、==重点高亮==。

这是普通链接：[Jacory Space](https://github.com/JacoryCYJin/jacory-space)。

这是裸链接，应该自动变成链接：https://example.com/path.

这是站内文章提及：@post[011-ai-clarity-before-efficiency]。

这是转义测试：\*这里不应该变成斜体\*，\`这里不应该变成代码\`。

## 03. 引用

> 真正的问题不是 AI 会不会写代码。
> 而是我们有没有先把问题说清楚。
> — 测试引用来源

## 04. 无序列表与嵌套列表

- 一级项目 A
  - 二级项目 A.1
  - 二级项目 A.2
    - 三级项目 A.2.1
- 一级项目 B
  这一行是列表项的续写内容。
- 一级项目 C

## 05. 有序列表

1. 第一步：明确目标
2. 第二步：划定范围
3. 第三步：确认验收标准

## 06. 任务列表

- [x] 已完成的任务
- [ ] 未完成的任务
  - [x] 子任务已完成
  - [ ] 子任务未完成

## 07. 表格与对齐

| 左对齐 | 居中 | 右对齐 |
| :-- | :-: | --: |
| Alpha | Beta | 100 |
| Long text | Center | 999 |

## 08. 代码块

```js
const clarity = true

function shipWithAI(scope) {
  if (!scope) {
    return 'slow'
  }

  return clarity ? 'fast enough' : 'fast but messy'
}
```

## 09. 图片：右浮动

![figure:right White space as structure](/images/blog/cold-white-01.svg "White space as structure")

这段文字用于测试右浮动图片。图片应该在桌面端浮到右侧，正文围绕它排版；在移动端应该自然回到正文流里。

## 10. 图片：宽图

![figure:wide Wide figure example](/images/blog/cold-white-01.svg "Wide figure example")

## 11. Note 提示块

:::note
这是一个 note 块。

它应该使用受控样式渲染，而不是直接插入 HTML。
:::

## 12. Warning 提示块

:::warning
这是一个 warning 块。

它适合放重要提醒、限制、风险或不要忽略的规则。
:::

## 13. Highlight 高亮块

:::highlight
这是一个 highlight 块。

它适合放需要整段强调、但不一定是风险或警告的内容。
:::

## 14. 分隔线

---

分隔线之后的段落。这里用于确认 `---` 会被渲染成文章内部分隔线。

## 15. 外链预览块

这是提及链接：@link[https://popicon.life/remembering-russi-taylor-as-mcdonalds-birdie-the-early-bird/]。它应该以内联形式显示 logo 和标题。

:::link
https://github.com/JacoryCYJin/jacory-space
:::

:::link
https://popicon.life/remembering-russi-taylor-as-mcdonalds-birdie-the-early-bird/
:::
