# AGENTS.md

This is the personal website repository inside the local Jacory Space workspace.

Before working here, follow the workspace rules in `../AGENTS.md` and the shared rules under `../.agents/`.

## Repository

- `jacory-space-frontend/`: Vite + Vue 3 + Tailwind CSS personal website.
- `scripts/dev.sh`: local frontend development script.
- This repository no longer owns the Media Parser backend/runtime. Media Parser is introduced on the website, but the local software and Python media core live in `../media-parser/`.
- Website pages and public copy should keep three locales in sync: `zh-CN`, `en-US`, and `ja-JP`.

## Commands

在本仓库根目录执行；在工作区根目录则在动作前加 `site`：

```bash
bash scripts/dev.sh start [jacory-space-frontend]
bash scripts/dev.sh stop [jacory-space-frontend]
bash scripts/dev.sh restart [jacory-space-frontend]
bash scripts/dev.sh status [jacory-space-frontend]
bash scripts/dev.sh logs [jacory-space-frontend]
bash scripts/dev.sh list
bash scripts/dev.sh build
bash scripts/dev.sh --help
```

方括号表示可选参数，不要把方括号输入终端。未指定服务时操作本项目全部服务。
`build` 在前端目录执行原有 `npm run build`，不启动开发服务；不自动安装依赖。
脚本修改后执行 `bash -n scripts/dev.sh`，核验 list、status、logs、帮助和无效参数；不为命令解析验证而重启用户正在使用的服务。
前端代码的构建验证仍为 `cd jacory-space-frontend && npm run build`。

统一约定：正式动作使用 `start / stop / restart / status / logs / list`，`ls` 仅作 `list` 的别名。工作区入口为 `bash scripts/dev.sh <项目> <动作> [目标]`，子仓库入口省略项目名。`-h`、`--help`（包括动作后的帮助）只展示帮助，不启停服务；参数错误返回 2，查询到未运行状态仍返回 0。未知动作、未知目标、多余参数必须在操作前拒绝。旧的省略动作写法暂时兼容并输出迁移提示，帮助和示例只推荐正式写法。

## Git

- 本目录是独立仓库，遵循工作区 `git-rule`；以下口令发给 Agent，不在终端运行：
  - `site push`：验证、提交已确认任务的改动并推送任务分支；不创建 PR、不合并。
  - `site pr`：验证、提交、推送，创建或更新对应 PR，返回链接后停止；不合并、不切回 `main`。
  - `site merge`：验证、提交、推送，创建或复用对应 PR，squash merge 后切回 `main`，执行 `git pull origin main`。
- 一条口令包含所需前置步骤，无须依次发送 push、pr、merge。完整 merge 口令已授权合并，不在正常流程末尾重复询问；push 和 pr 不授权合并。
- 只处理已确认任务或用户指定范围，保留其他任务的工作区及暂存改动；核对待推送提交，不能把其他仓库或不明归属改动一并上传。能明确区分时直接按范围处理，无法判断时才澄清。
- 验证或后续步骤失败未解决前，不进入下一阶段；没有新改动不创建空提交。复用 PR 前核对仓库、源分支、目标分支；恢复流程时检查现状，避免重复提交或重复 PR。
- 批准修改文件不等于授权上传；`rules commit` 只在外层本地提交规则，不包含本仓库。版本、发布、标签及忽略规则保持不变，以 git-rule 和本仓库约束为准。
