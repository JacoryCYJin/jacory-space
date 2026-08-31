# 首页 Motion Design Handoff 修复

## 现象

Motion Design 在不打开开发者工具时，滚动动画会在极短距离内直接进入最终海报；打开 F12 后触发 viewport resize，动画才恢复正常。

## 定位证据

- 实际 sticky 有效距离约为 `1173px`。
- 未校正时，仅滚动约 `189px`，文字和人物就从开场状态直接变为最终状态。
- F12 不只是触发 `ScrollTrigger.refresh()`，还会通过 header 的 `ResizeObserver` 执行 `rebuildTimeline()`，随后再 refresh。

## 根因

首次交接时，本地 Motion Design ScrollTrigger 的测量区间未在最终 handoff 几何下创建。单独 refresh 无法稳定复现 resize 后的校正效果；在黑幕撤掉后重建又会暴露“最终海报闪现后回到开场”的中间状态。

## 修复

1. `Home.vue` 在现有黑幕 handoff 中持有 Capabilities 组件引用。
2. 黑幕仍覆盖时，父级等待 `prepareMotionDesignHandoff()` 完成。
3. `HomeCapabilitiesPage.vue` 等待字体和 timeline 就绪，再重建本地 timeline 并同步 refresh。
4. 只有开场状态和正确的 trigger 区间已写入后，父级才设置 `handoffActive = true` 撤掉黑幕。

## 结果

- Motion Design 不再依赖 F12 / viewport resize 才能正确触发。
- 滚动进度使用完整 sticky 区间，不会短距离直接跳到最终海报。
- 重建过程保持在黑幕下，不再出现最终海报闪现。
