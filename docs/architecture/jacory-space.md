# Jacory Space Architecture

## Top Level

```txt
site/
  jacory-space-frontend/  # Vite + Vue 3 + Tailwind + Vite SSG public website
  docs/                   # project docs
  scripts/dev.sh          # frontend dev service runner
```

The media parser backend and desktop runtime now live in the separate `media-parser` repository.
This site is a pure frontend surface.

## Runtime

```txt
frontend 3001
```

```bash
bash scripts/dev.sh
bash scripts/dev.sh status
bash scripts/dev.sh stop
```

Runtime files:

```txt
.dev/  # local pids/logs
```

## Frontend

```txt
jacory-space-frontend/src/
  main.js
  App.vue
  router/index.js
  views/
  components/
  content/
  lib/
  i18n/
  style.css
```

Routes:

```txt
/               -> Home.vue
/tools          -> Tools.vue
/tools/media-parser -> MediaParserSoftware.vue
/media-parser   -> redirect /tools/media-parser
/video-parser   -> redirect /tools/media-parser
/podcast-parser -> redirect /tools/media-parser
/tools/minecraft-skin-editor -> MinecraftSkinEditor.vue
/blog           -> Blog.vue
/blog/:slug     -> BlogPost.vue
/about          -> About.vue
```

`/tools/media-parser` is the software introduction page that links to:

```txt
https://github.com/JacoryCYJin/media-parser
https://github.com/JacoryCYJin/media-parser/releases
```

## Shared Style

```txt
src/style.css
tailwind.config.js
```

Style direction:

```txt
cool white background
hairline borders
Geist Sans + Geist Mono
single cool-blue accent
no heavy shadows
```

## Static Rendering and SEO

The public site is statically rendered during `npm run build` with Vite SSG. The
build emits HTML for public routes and blog posts, so crawlers receive page
content and route-specific metadata without running the Vue client first.

```txt
scripts/generate-seo-assets.mjs
  -> public/robots.txt + public/sitemap.xml
  -> vite-ssg build
  -> dist/
```

SEO ownership, post-deploy checks, and search platform handoff are documented
in [`../operations/site-seo-indexing.md`](../operations/site-seo-indexing.md).

## Blog Content

```txt
src/content/blog/*.md
src/content/blog-categories.js
src/content/link-previews/*.json
src/lib/blog/index.js
src/lib/markdown/
src/components/blog/MarkdownArticle.vue
```

Flow:

```txt
Markdown files
  -> import.meta.glob raw loaders
  -> frontmatter validation
  -> category resolution
  -> markdown parseDocument()
  -> MarkdownArticle render
```

Commands:

```bash
cd jacory-space-frontend
npm run lp -- <blog-slug>
npm run lp:all
```

## Docs

```txt
docs/overview/      # overview, research, drafts
docs/features/      # PRD and feature scope
docs/reference/     # stable syntax/config reference
docs/architecture/  # system/module structure
docs/operations/    # run/deploy/troubleshooting when needed
docs/archive/       # old docs
```

Media Parser API contracts, desktop packaging notes, and Python media-core docs belong in `../media-parser/`.
