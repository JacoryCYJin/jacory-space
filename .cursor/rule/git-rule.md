# Git Rule

## Goal
保持分支和提交信息简洁统一。

## Branch Naming
- 允许前缀：`feature/`、`fix/`、`chore/`
- 格式：`<type>/<short-kebab-desc>`
- 示例：
  - `feature/video-downloader-settings`
  - `fix/bilibili-parse-timeout`
  - `chore/update-readme`

## Commit Message
- 只写一行。
- 类型使用小写英文：`feat`、`fix`。
- 描述使用中文。
- 默认格式：
  - `feat: 中文描述`
  - `fix: 中文描述`
- 示例：
  - `feat: 新增下载目录系统弹窗选择`
  - `fix: 修复哔哩哔哩解析失败`

## Workflow
- 每完成一个功能，提供：
  1. 推荐分支名
  2. 一行 commit 信息（中文）
- 如果不确定用 `feat` 还是 `fix`：
  - 新增能力或功能改进用 `feat`
  - 修复异常或错误用 `fix`
