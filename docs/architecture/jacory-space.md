# Jacory Space Architecture

## Top Level

```txt
site/
  jacory-space-frontend/  # Vite + Vue 3 + Tailwind public website
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
/media-parser   -> MediaParserSoftware.vue
/video-parser   -> redirect /media-parser
/podcast-parser -> redirect /media-parser
/blog           -> Blog.vue
/blog/:slug     -> BlogPost.vue
/about          -> About.vue
```

`/media-parser` is the software introduction page that links to:

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
