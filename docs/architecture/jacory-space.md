# Jacory Space Architecture

## Top Level

```txt
jacory-space/
  jacory-space-frontend/              # Vite + Vue 3 + Tailwind
  jacory-space-backend/media-backend/ # FastAPI media parser backend
  docs/                               # project docs
  scripts/dev.sh                      # local service runner
```

## Runtime

```txt
frontend 3001 -> /api proxy -> backend 5001
```

```bash
bash scripts/dev.sh
bash scripts/dev.sh status
bash scripts/dev.sh stop media-backend
```

Runtime files:

```txt
.dev/                                      # local pids/logs
jacory-space-backend/media-backend/data/  # local user settings/cookies
jacory-space-backend/media-backend/downloads/
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
/              -> Home.vue
/tools         -> Tools.vue
/video-parser  -> VideoParser.vue
/blog          -> Blog.vue
/blog/:slug    -> BlogPost.vue
/about         -> About.vue
```

Shared style:

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

Blog index:

```txt
getAllPostMeta()
getPostBySlug(slug)
getPostsByCategory(category)
getPostsByTag(tag)
```

Required frontmatter:

```txt
title
description
date
category
index
```

## Markdown Parser

```txt
src/lib/markdown/index.js
src/lib/markdown/blocks.js
src/lib/markdown/inline.js
src/lib/markdown/blog-extensions.js
```

Responsibilities:

```txt
index.js           parseDocument()
blocks.js          headings, lists, tables, figures, callouts, code, hr
inline.js          strong, em, code, strike, mark, links, @link mention
blog-extensions.js frontmatter, link previews, TOC, figures
```

Link preview flow:

```txt
:::link / @link[...]
  -> scripts/link-previews.mjs
  -> src/content/link-previews/<slug>.json
  -> hydrateBlocks()
  -> MarkdownArticle.vue
```

Commands:

```bash
cd jacory-space-frontend
npm run lp -- <blog-slug>
npm run lp:all
```

## Media Backend

```txt
jacory-space-backend/media-backend/app/main.py
```

Main dependencies:

```txt
fastapi
yt-dlp
ffmpeg recommended for merge/download
SiliconFlow optional for outline
```

Request requirement:

```txt
x-client-id header
```

Local user data:

```txt
data/users/<client-id>/settings.json
data/users/<client-id>/cookies/<platform>.txt
```

Main backend roles:

```txt
normalize video input
detect platform
manage cookies
call yt-dlp
proxy thumbnails
download media
parse podcast targets
generate video outline
```

## Docs

```txt
docs/overview/      # overview, research, drafts
docs/features/      # PRD and feature scope
docs/reference/     # stable syntax/config reference
docs/architecture/  # system/module structure
docs/api/           # API contracts when needed
docs/operations/    # run/deploy/troubleshooting when needed
docs/archive/       # old docs
```
