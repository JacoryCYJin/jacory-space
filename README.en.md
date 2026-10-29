<p align="right"><a href="./README.md">简体中文</a> · English · <a href="./README.ja.md">日本語</a></p>

[![Jacory Space: an independent art publication cover with a sphere dissolving into pixels in a human hand, monochrome photography and cobalt ink](./assets/readme/cover-v2.png)](https://jacoryspace.top/)

# Jacory Space

### Makes Ideas Move.

Some ideas want to be written down. Others need to be made.

Jacory Space is my personal studio in the browser: curiosity becomes tools, thoughts become field notes, and useful ways of working become recipes you can take with you.

Drop in to paint a Minecraft skin, read a reflection on work and creativity, or find a prompt that might help with your next project.

Have a look around. You might find a small thing you needed.

**[Come on in ↗](https://jacoryspace.top/)** · [Find a tool](https://jacoryspace.top/tools) · [Browse recipes](https://jacoryspace.top/library) · [Read field notes](https://jacoryspace.top/blog)

---

## 01 / Look around first

The homepage opens with **WHO AM I?**, followed by moving objects, a dot matrix, and fragments of visual design, photography, video and development.

It is a piece of work in its own right. Scroll down and see how I introduce myself.

[![The live homepage: WHO AM I?, a halftone sphere and Makes Ideas Move](./assets/readme/home-preview.png)](https://jacoryspace.top/)

## 02 / What are you in the mood to do?

| If you want to… | Start here |
| --- | --- |
| Make a small change with your own hands | The [Index](https://jacoryspace.top/tools) collects tools, projects and interface experiments. Pick one and play. |
| Find a helper for your next project | [Recipes](https://jacoryspace.top/library) collects prompts, agent skills and instructions, with sources for external assets. |
| Spend time with a worthwhile question | [Field Notes](https://jacoryspace.top/blog) explores products, AI, work and learning, including ideas still taking shape. |

### A new outfit for a blocky friend

Paint directly on a 3D character and turn it around to check your work. Try mirror painting, adjust the outer layer, or play an animation.

The [Minecraft Skin Workbench](https://jacoryspace.top/tools/minecraft-skin-editor) lets you create a skin, import a PNG and export your result. You can start with a few brushstrokes before learning your way around an entire unfolded skin texture.

[![The live Minecraft Skin Workbench with a 3D character, painting tools and import/export controls](./assets/readme/skin-editor-preview.png)](https://jacoryspace.top/tools/minecraft-skin-editor)

### Take a useful approach with you

Each recipe explains what it helps with, how to use it and where its limits are. You could prepare a two-view Minecraft character preview with a prompt, or follow the source links to Three.js and GSAP skill packages.

The collection includes material I put together and external work with its sources credited. Find something that fits, then bring it into your own creative process.

[![The live recipe library with categories, tags, search, prompts and skills](./assets/readme/library-preview.png)](https://jacoryspace.top/library)

**[Find a recipe ↗](https://jacoryspace.top/library)**

### Or just read for a while

Field Notes includes framework research and questions closer to everyday life: what makes a good working state? Does knowing more mean understanding more?

Start with [“A good working state means focusing on useful work”](https://jacoryspace.top/blog/016-good-work-state) (Chinese), then follow the links between articles.

### Some projects grow beyond the browser

[Media Parser](https://jacoryspace.top/tools/media-parser) is a separate desktop application for video, podcasts, downloads and transcription. This site introduces it and points you to the software, which continues to develop in its own repository.

[Software repository](https://github.com/JacoryCYJin/media-parser) · [Downloads](https://github.com/JacoryCYJin/media-parser/releases)

## 03 / Why keep these things together?

A piece of code, an image and a note often start with the same question. A tool can become a creative work; a note can become a method; that method can help make the next thing.

I wanted somewhere to keep those connections.

There is room here for quiet space and playful experiments, for finished work and thoughts still in progress. **Personal OS** is the name I give to this ongoing accumulation.

## 04 / The door is open. The work continues.

Designed, built, written and curated by Jacory. The interface and content navigation offer Simplified Chinese, English and Japanese; individual assets and articles retain their original languages.

Found a problem, or had an interesting idea after trying something? [Open an issue](https://github.com/JacoryCYJin/jacory-space/issues). To get to know the person behind the space, visit [About](https://jacoryspace.top/about).

---

<details>
<summary>Under the workbench: run locally and explore the docs</summary>

Built with Vue 3, Vite / Vite SSG, Tailwind CSS, GSAP and Three.js. Articles live in Markdown; public pages are rendered to static HTML at build time.

From this repository:

```bash
cd jacory-space-frontend
npm install
npm run dev
```

The development site runs at `http://localhost:3001`. Use `npm run build` to build, then `npm run preview` to preview the output.

[Frontend guide](./jacory-space-frontend/README.md) · [Project docs](./docs/README.md) · [Blog Markdown reference](./docs/reference/blog-markdown.md)

</details>
