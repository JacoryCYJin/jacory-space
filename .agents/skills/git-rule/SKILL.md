---
name: git-rule
description: "MUST use before any git branch, commit, push, PR, merge, checkout, or status workflow in this repository. Jacory Space Git rules require task branches before code commits, Chinese one-line conventional commit messages, immediate push after requested commits, exclusion of local runtime data, and no PR merge unless the user explicitly asks."
---

# git-rule

## Branch Naming

- Do not commit code changes directly on `main`; create or use a task branch first.
- Branch format: `<type>/<short-kebab-desc>`.
- Use the full branch prefix names below; do not use `feat/` as a branch prefix.
- Common prefixes:
  - `feature/`: new features or meaningful capability improvements.
  - `fix/`: bug, exception, or regression fixes.
  - `chore/`: scripts, config, dependencies, or tooling maintenance.
  - `docs/`: documentation-only changes.
- Examples:
  - `feature/browser-cookie-mode`
  - `fix/bilibili-parse-timeout`
  - `chore/dev-script`
  - `docs/agent-rules`

## Commit Message

- Use a single-line commit message.
- Format: `<type>: 中文描述`.
- Common types: `feat`, `fix`, `chore`, `docs`.
- Examples:
  - `feat: 支持浏览器 Cookie 模式`
  - `fix: 修复哔哩哔哩解析失败`
  - `chore: 新增开发服务脚本`
  - `docs: 补充 Agent 协作规范`

## Workflow

- Run `git status` before committing.
- Do not commit local runtime data, downloads, or personal documents.
- Keep `jacory-space-backend/video-backend/data/users/`, `jacory-space-backend/video-backend/downloads/`, and `.dev/` out of commits unless the user explicitly says otherwise.
- Treat user requests like “提交”, “提交这个分支”, “commit”, or “submit this branch” as **commit + push** by default.
- Only stop after a local commit when the user explicitly says “只提交”, “只本地提交”, “不要 push”, or equivalent.
- After every successful commit that is meant for a branch workflow, immediately run `git push -u origin HEAD`; do not end the turn between commit and push unless push fails or the user explicitly forbids pushing.
- Treat “pr” and “pr open” as **commit + push + create PR**. Return the PR link and do not merge.
- Treat “pr合” and “pr merge” as **commit + push + create PR + squash merge + switch back to `main` + `git pull origin main`**.
- When creating a PR, summarize the main changes and validation.
- If opening a PR is requested, push first with `git push -u origin HEAD`, then create the PR and return the PR link for user review.
- Do not auto-merge PRs. Only run `gh pr merge` when the user explicitly says to merge now.
- When merging a PR after explicit user approval, use GitHub squash merge by default to keep `main` linear and preserve GitHub's default squash commit title format: `<type>: 中文描述 (#PR号)`. Do not use a normal merge commit unless the user explicitly asks for it.
- After a PR is merged, switch back to `main` and run `git pull origin main`.
