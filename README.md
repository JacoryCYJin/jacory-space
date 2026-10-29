<p align="right">简体中文 · <a href="./README.en.md">English</a> · <a href="./README.ja.md">日本語</a></p>

[![Jacory Space：独立艺术刊物风格的摄影拼贴封面，手中的球体逐渐化作像素，黑白影像与钴蓝色块并置](./assets/readme/cover-v2.png)](https://jacoryspace.top/)

# Jacory Space

### 让想法动起来。

有些想法适合写下来，有些最好亲手做出来。

Jacory Space 是我开在浏览器里的一间个人工作室：把好奇做成工具，把思考写成手记，把反复有效的做法整理成可以带走的配方。

你可以来改一张 Minecraft 皮肤，读一篇关于工作与创造的文章，或者找到一个下次用得上的 Prompt。

随便逛逛，也许会发现一个你正好需要的小东西。

**[进来逛逛 ↗](https://jacoryspace.top/)** · [找个工具](https://jacoryspace.top/tools) · [翻翻配方](https://jacoryspace.top/library) · [读篇手记](https://jacoryspace.top/blog)

---

## 01 / 先逛，再说

首页从一句 **WHO AM I?** 开始，接着是会动的物件、点阵，以及关于设计、影像和开发的不同片段。

它也是这间工作室的一件作品。向下滚动，看看我会怎样介绍自己。

[![正式网站首页：WHO AM I?、点阵球体与 Makes Ideas Move](./assets/readme/home-preview.png)](https://jacoryspace.top/)

## 02 / 今天想做点什么？

| 如果你想…… | 可以从这里开始 |
| --- | --- |
| 亲手改一点东西 | [索引](https://jacoryspace.top/tools)收着工具、作品和界面实验，挑一个打开玩玩。 |
| 给下一次创作找个帮手 | [配方](https://jacoryspace.top/library)整理了 Prompt、Agent Skill 和使用说明，也注明了外部资产的来源。 |
| 找一个值得继续想的问题 | [手记](https://jacoryspace.top/blog)记录产品、AI、工作与学习中的观察，以及还在形成的判断。 |

### 给方块人换身衣服

在三维角色上直接画，转个角度看看；打开镜像、调整外层，或者让它动起来。

[Minecraft 皮肤工作台](https://jacoryspace.top/tools/minecraft-skin-editor)支持新建、导入 PNG 和导出皮肤。你不必先弄懂整张皮肤展开图，就能开始试着画几笔。

[![Minecraft 皮肤工作台的真实界面：三维角色、绘画工具及导入导出入口](./assets/readme/skin-editor-preview.png)](https://jacoryspace.top/tools/minecraft-skin-editor)

### 好用的做法，也可以带走

一份配方会说明它能帮什么忙、怎么用，以及适用边界。比如用 Prompt 准备 Minecraft 角色双视角预览，或沿着来源找到 Three.js、GSAP 的技能包。

这里既有自己整理的内容，也有注明来源的外部收录。找到适合的，再带进你自己的创作过程。

[![灵感配方库的真实界面：分类、标签、搜索与 Prompt 和 Skill 条目](./assets/readme/library-preview.png)](https://jacoryspace.top/library)

**[去找一份配方 ↗](https://jacoryspace.top/library)**

### 也可以什么都不做，读一会儿

手记里有框架调研，也有更贴近日常的问题：怎样才算好的工作状态？知道得更多，就真的理解了吗？

可以先读 [《好的工作状态，是专注地做有用的事》](https://jacoryspace.top/blog/016-good-work-state)，再顺着文章之间的链接继续走。

### 有些作品，会从网页里长出去

[Media Parser](https://jacoryspace.top/tools/media-parser)是一款独立的桌面工具，用来处理视频、播客、下载与转写。这里保留它的介绍和入口，软件在自己的仓库里继续生长。

[查看软件仓库](https://github.com/JacoryCYJin/media-parser) · [前往下载页](https://github.com/JacoryCYJin/media-parser/releases)

## 03 / 为什么把这些放在一起？

一段代码、一张图、一篇笔记，常常来自同一个问题。做着做着，工具会变成作品，笔记会长出方法，方法又会帮我做下一件东西。

我想给这些来回留一个地方。

所以这里会有留白，也会有一些不那么严肃的尝试；会留下做成的东西，也会继续记录思考。**Personal OS** 是我给这种长期积累起的名字。

## 04 / 门开着，还在继续建

这里由 Jacory 持续设计、开发、写作和整理。界面与内容入口提供简体中文、English、日本語，具体资产和文章保留各自的原文。

如果你发现了问题，或者试用后想到一个更有趣的点子，欢迎[开一个 Issue](https://github.com/JacoryCYJin/jacory-space/issues)。想先认识一下作者，也可以去[关于页](https://jacoryspace.top/about)坐坐。

---

<details>
<summary>想看看工作台底下？本地运行与项目文档</summary>

网站使用 Vue 3、Vite / Vite SSG、Tailwind CSS、GSAP 和 Three.js 构建。文章以 Markdown 管理，公开页面在构建时生成静态 HTML。

在本仓库中运行：

```bash
cd jacory-space-frontend
npm install
npm run dev
```

本地地址为 `http://localhost:3001`。构建使用 `npm run build`，构建后可运行 `npm run preview` 预览。

[前端说明](./jacory-space-frontend/README.md) · [项目文档](./docs/README.md) · [博客 Markdown 写法](./docs/reference/blog-markdown.md)

</details>
