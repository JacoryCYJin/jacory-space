# AGENTS.md

This is the personal website repository inside the local Jacory Space workspace.

Before working here, follow the workspace rules in `../AGENTS.md` and the shared rules under `../.agents/`.

## Repository

- `jacory-space-frontend/`: Vite + Vue 3 + Tailwind CSS personal website.
- `scripts/dev.sh`: local frontend development script.
- This repository no longer owns the Media Parser backend/runtime. Media Parser is introduced on the website, but the local software and Python media core live in `../media-parser/`.
- Website pages and public copy should keep three locales in sync: `zh-CN`, `en-US`, and `ja-JP`.

## Commands

```bash
bash scripts/dev.sh status
bash -n scripts/dev.sh && bash scripts/dev.sh ls
cd jacory-space-frontend && npm run build
```
