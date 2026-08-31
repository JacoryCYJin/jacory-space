# 首页 Motion Design Handoff 修复

## 目的与范围

本文记录首页从 JACORY 黑幕交接到 Motion Design sticky 海报时，ScrollTrigger 初始测量不稳定的问题、定位过程和最终修复协议。

本次只修复交接时序，不改变以下既有设计：

- JACORY 黑化和 blackout/handoff 判定；
- Capabilities 的 sticky / track 结构与滚动距离；
- `MOTION`、人物、`DESIGN` 的动画编排、最终尺寸、位置、颜色和层级；
- 最终层级关系：`DESIGN > 图片 > MOTION`。

## 相关模块与职责

| 模块 | 责任 |
| --- | --- |
| `HomeJacoryReveal.vue` | 在 JACORY stage 释放后发出 `handoff-change`，标记黑幕交接开始。 |
| `Home.vue` | 维护 `handoffActive`、黑幕 veil 与共享点阵层；决定何时从 JACORY 的全屏黑幕切到 Capabilities 区域。 |
| `HomeCapabilitiesPage.vue` | 建立 Motion Design sticky 区域、计算 typography lockup、创建及重建 GSAP timeline / ScrollTrigger。 |
| `SmoothScroll.vue` | 将 Lenis 滚动更新通知给 ScrollTrigger。 |

Motion Design 的 track 高度为 `2.4 × stage height`，header 高度为 `1 × stage height`，因此动画可用的 sticky 距离为：

```text
track height - header height = 1.4 × stage height
```

## 原始流程

修复前，Capabilities 在组件挂载、字体就绪后立即创建本地 timeline：

```text
组件挂载
→ document.fonts.ready
→ 读取文字和 header 几何
→ 创建 ScrollTrigger
→ requestAnimationFrame(refresh)
```

JACORY 黑幕完成时，`Home.vue` 会将 `handoffActive` 切为 `true`。该状态会隐藏全屏 blackout veil，并将共享层切到 Capabilities 坐标系。

正常情况下，Motion Design 应经历：

```text
FULL BLACK
→ typography lockup
→ typography recomposition + 人物同步建立
→ 完整静态海报
```

## 异常现象

在不打开开发者工具时，Motion Design 并非按完整 sticky 区间推进，而是在很短的滚动距离内直接进入最终海报。

打开 F12 后，浏览器发生 viewport resize；随后动画又恢复为完整滚动过程。这说明 F12 不是“开启动画”，而是意外触发了某个重新测量路径。

## 运行时证据

以下数据在不打开 F12 的页面中，通过书签脚本采集。

### 环境排除

| 项目 | 实际值 | 结论 |
| --- | --- | --- |
| viewport | `1378 × 902` | 已进入 `sm` 和 `md` 断点，不是窄屏基础构图。 |
| devicePixelRatio | `2` | 正常 Retina 像素比。 |
| `prefers-reduced-motion` | `false` | 不是无动画降级分支。 |

### 几何与状态采样

| 采样 | `scrollY` | track top | track / header 高度 | 三层样式 |
| --- | ---: | ---: | --- | --- |
| 刚进入黑场后的第一帧 | `4039` | `-36px` | `2011px / 838px` | `MOTION`、`DESIGN`、人物均为 `opacity: 0`，并保持各自开场 transform。 |
| 向下约滚动 `189px` 后 | `4228` | `-225px` | `2011px / 838px` | 三层已经全部为 `opacity: 1`、`transform: 0`，即最终海报。 |

当前几何的理论有效区间为：

```text
2011px - 838px = 1173px
```

因此，`189px` 内完成所有动画并不符合设计的时间线占比。问题不是 timeline 不存在：第一帧已经证明它正确写入了开场状态；问题是初次交接后的本地 trigger 使用了过短的有效测量区间。

## 排除与失败尝试

### 响应式断点不是根因

早期内屏采样曾处于较窄 viewport，导致 Motion Design 使用基础图片构图。后来在 `1378px`、`md: true` 的运行时仍复现了短距离跳终态，因此响应式分支会影响构图，但不是本问题的根因。

### 单独 refresh 不足

`ScrollTrigger.refresh()` 能重新计算现有 trigger，但没有稳定复现 F12 后的效果。F12 实际还会使 header 的 `ResizeObserver` 调用 `scheduleTimelineRebuild()`：

```text
ResizeObserver
→ rebuildTimeline()
→ kill 旧 timeline / trigger
→ 写入开场状态
→ 创建新 timeline / trigger
→ refresh
```

因此，只 refresh 不能等价于 F12 的完整校正路径。

### 黑幕撤掉后重建会闪现

曾尝试在 `handoffActive = true` 后重建 timeline。此时 blackout veil 已从 `is-visible` 切换为 `is-hidden`，用户会看到：

```text
旧最终海报
→ GSAP 写入开场状态
→ 动画开场
```

这会产生“最终海报闪一下，再回到动画开场”的错误视觉。

## 根因

Motion Design 的本地 ScrollTrigger 需要在最终的 handoff 几何下重新建立，而此前的创建时机早于黑幕交接完成。

根因不是单一的 CSS breakpoint、动效偏好或图片尺寸，而是两个时序约束没有被明确表达：

1. 初次创建后的 trigger 区间不能保证已对应最终 handoff 几何；
2. 重建必须在黑幕仍覆盖画面时完成，不能在 `handoffActive` 已撤掉黑幕之后执行。

## 最终修复协议

### 1. 子组件公开可等待的准备方法

`HomeCapabilitiesPage.vue` 维护 `motionDesignTimelineReady` Promise，并通过 `defineExpose()` 提供：

```js
prepareMotionDesignHandoff()
```

该方法按顺序执行：

```text
等待 document.fonts.ready 与 timeline 初始化
→ 等待当前 Vue DOM 更新
→ rebuildTimeline({ refreshImmediately: true })
→ ScrollTrigger.refresh()
→ 本地 trigger.update()
→ Promise resolve
```

普通动效分支会在首次 `rebuildTimeline()` 完成后标记 timeline ready。reduced-motion 分支也显式标记 ready，避免黑幕交接永远等待一个不会创建的动画 timeline。

### 2. 父级在黑幕下等待准备完成

`Home.vue` 为 `HomeCapabilitiesPage` 保存组件 ref。`handleHandoffChange(true)` 的顺序为：

```text
JACORY 发出 handoff-change
→ Home.vue nextTick()
→ syncCapabilitiesGeometry()
→ await capabilitiesPage.prepareMotionDesignHandoff()
→ handoffActive = true
→ blackout veil 撤掉
```

关键约束：`prepareMotionDesignHandoff()` 不会仅记录 pending 就提前返回。若字体或 timeline 尚未就绪，Promise 会继续等待；父级不会提前执行 `handoffActive = true`。

### 3. 为什么不再闪现

重建 timeline 时，GSAP 会先清理旧 trigger，再写入文字和人物的开场状态。现在这一过程发生在 blackout veil 仍然覆盖屏幕的阶段；待 refresh 完成后才解除黑幕，用户只能看到正确开场状态后的连续动画。

## 修复后的预期行为

```text
JACORY 完成黑化
→ 黑幕保持
→ Motion Design timeline 在黑幕下完成重建和 refresh
→ 黑幕撤掉
→ lockup 开场状态
→ 完整 sticky 区间内的排版重构与人物建立
→ 最终静态海报
```

预期结果：

- 不需要打开 F12 或人为触发 viewport resize；
- 不会在约 `189px` 内直接跳到最终海报；
- 不会出现最终海报闪现后回到开场；
- 黑幕、sticky 距离、海报构图和最终层级保持原有设计。

## 维护与验证清单

后续若修改首页交接或 Motion Design，必须确认：

- [ ] 不绕过 `prepareMotionDesignHandoff()` 直接撤掉 blackout veil；
- [ ] 若调整 track/header 高度，重新确认 `end` 函数仍为 `track height - header height`；
- [ ] 若增加字体、图片或其他影响几何的异步资源，确保 `motionDesignTimelineReady` 仍在实际可测量后 resolve；
- [ ] reduced-motion 分支仍能完成 handoff，不会等待动画 timeline；
- [ ] 在不打开 F12 的情况下，从 JACORY 黑幕进入 Motion Design；
- [ ] 观察开场、重构和最终静态海报均分布在完整 sticky 区间；
- [ ] 确认没有最终海报闪现；
- [ ] 运行 `cd jacory-space-frontend && npm run build`。
