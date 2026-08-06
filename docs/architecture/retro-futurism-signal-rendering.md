# 复古信号文字页面技术说明

本文档记录 `/experiments/retro-futurism` 在当前源码中的实际渲染状态。参数、选择器和 SVG 节点均以页面实现为准；它不把历史试验、已删除诊断代码或对话中的未落地方案写成现状。

## 核对基线

| 项目 | 核对结果 |
| --- | --- |
| 核对源文件 | [`jacory-space-frontend/src/views/RetroFuturismSignalStudy.vue`](../../jacory-space-frontend/src/views/RetroFuturismSignalStudy.vue) |
| 核对分支 | `docs/retro-signal-rendering` |
| 源码 HEAD | `236261f823f83a99df333d081db750fde96e3f21` |
| 核对前工作区 | 干净；本说明是该提交上的文档更新，页面实现未改。 |
| 当前工作区 | 本说明文档更新后会处于未提交状态；页面代码仍对应上述 HEAD。 |

## 1. 当前实现概述

页面模拟一段文字被旧显示设备输出的过程：每一行先整体出现白色占位块，随后占位块逐格替换为真实字；当前格的下划线光标同步移动，最后一格完成后消失。

正式画面保留三层：

1. **灰白字符前景层**（`.signal-glyphs`，`z-index: 2`）：可读的真实文字、占位块、光标、稳定采样扰动、柔焦和白灰溢光。
2. **共享无色扩散层**（`.signal-chromatic-residual-glyphs`，`z-index: 1`）：名称保留自前期色散试验，但当前实际输出是两种等亮度中性灰的方向性扩散几何；它是已确认的柔化基线，不是完成的红青方案。
3. **共享中性介质层**（`.signal-medium-glyphs`，`z-index: 3`）：跨字符、跨行连续的中性颗粒、横向扫描变化与低频亮暗调制；用柔化后的内容 Alpha 裁切，再以 `soft-light` 合成。

两份共享克隆都复用 `textLayout`、`isLineStarted(line)`、`revealedCount` 和同一套真实字 / 当前格 / 后续格条件。因此真实文字、白色占位块与光标在三层中保持相同的几何、换行和动画状态。

> 当前设计状态：无色扩散基线与中性介质层已用于正式画面；红青通道色带仍待独立设计。不要把 `.signal-chromatic-residual-glyphs` 当前的中性灰输出误称为“已完成的红青色散”。

## 2. 当前层级与职责

### 灰白字符前景层

- `.signal-char`：真实灰白文字。多层背景经 `background-clip: text` 填入字形；A / B / C 采样滤镜、`blur()` 与 `drop-shadow()` 共同形成微弱显示采样与柔焦。
- `.signal-placeholder`：未出现字符的白色占位块。它有自身的亮度、横纹、颗粒、圆角、柔焦与白灰溢光。
- `.signal-caret`：附着在当前占位块下方的白色实心下划线；与所在字符格的 A / B / C 采样变体同步。
- `revealedCount`、`activeLineIndex`：决定格显示真实字、带光标的当前占位块，或普通占位块。

### 共享无色扩散层

- `.signal-chromatic-residual-glyphs` 是不带前景滤镜、阴影与局部纹理的白色 Alpha 克隆。
- 三个 `#signal-shared-chromatic-residual-*` 滤镜从整块 `SourceAlpha` 提取左右方向的外带与内带，再以不同亮度的中性灰输出。
- 该层位于 Core 后方，贡献的是方向性 Alpha 扩散与柔化观感；当前不承担红青颜色关系。

### 共享中性介质层

- `.signal-medium-glyphs` 是另一份同步的白色 Alpha 克隆。
- 三个 `#signal-shared-medium-*` 滤镜用**整块克隆坐标**生成颗粒、扫描变化与低频亮暗场，再限制到柔化后的字符内部 Alpha。
- 该层在前景上方，以 `opacity: 0.68` 与 `mix-blend-mode: soft-light` 作为低幅明暗调制，不输出完整白色字形。

### 有意保留的重叠

共享中性层负责连续介质；字符层仍保留极轻的单格横纹、颗粒与稳定亮度残差，以避免每一格完全均质。无色扩散层与 Core 的柔焦互相叠加是当前认可的基线，但后续红青设计不得修改这份无色层的几何、Alpha、形态扩张、柔化或响应式切换。

## 3. 当前完整参数表

### 布局、字体与动画

| 对象 | 位置 | 当前值 | 视觉作用 |
| --- | --- | --- | --- |
| 显示面 | `.signal-study` | `--signal-ink: #030405`；`--signal-paper: #edf0e8` | 近黑屏幕与灰白主体。 |
| 文本定位 | 三个文字层 | `top/left: 50%`；`transform: translate(-50%, -50%)` | 整个文本区域横纵居中；内部仍左对齐。 |
| 文本宽度 | 三个文字层 | `max-width: min(52.5rem, calc(100% - 2.5rem))` | 长行可保持单行，窄屏允许自然折行。 |
| 字号 | 三个文字层 | `text-lg` / `sm:text-xl` / `md:text-3xl` | 18px / 20px / 30px 三档响应式字号。 |
| 字符格 | `.signal-cell`、`.signal-medium-cell` | `width: 1em`；`height/line-height: 1.3em` | 三层使用相同的格尺寸与基线。 |
| 字距 | 相邻格 | 普通 `margin-left: .22em`；中文格后 `.3em` | 真实字、块、光标共用实际横向间隔。 |
| 普通行距 | `.signal-paragraph` | `row-gap: .38em` | 强制换行之间的间距。 |
| 段间距 | `.signal-paragraph + .signal-paragraph` | `margin-top: 1.6em` | 显著大于普通行距。 |
| 字体 | `.signal-study` | 日文优先 Hiragino / Yu Gothic / Noto Sans CJK JP；中文 `.is-chinese` 为 `Source Han Sans SC`、`font-weight: 400` | 中文与日文均避免现代网页黑体的过重观感。 |
| 首次等待 / 逐字 / 行停顿 | `beginReveal()` | `900ms` / `88ms` / `720ms` | 首行静默、行内替换节奏、行边界停顿。 |
| 光标闪烁 | `signal-caret-blink` | `.9s steps(1, end) infinite`；`opacity: 1 → .22` | 克制的显示器闪烁。 |
| 全局噪声漂移 | `signal-noise-drift` | `1.8s steps(2, end) infinite` | 极低强度的整屏噪点相位变化。 |

### 前景柔焦、溢光与稳定采样

| 对象 | A | B（默认） | C |
| --- | --- | --- | --- |
| 真实文字 `.signal-char` | `sampling-a`；`blur(.03em)`；`drop-shadow(0 0 .2em rgba(237,240,232,.14))` | `sampling-b`；`blur(.032em)`；`drop-shadow(0 0 .22em rgba(237,240,232,.15))` | `sampling-c`；`blur(.034em)`；`drop-shadow(0 0 .24em rgba(237,240,232,.16))` |
| 占位块 `.signal-placeholder` | `sampling-a`；`blur(.028em)`；`drop-shadow(0 0 .2em rgba(237,240,232,.12))` | `sampling-b`；`blur(.028em)`；`drop-shadow(0 0 .22em rgba(237,240,232,.14))` | `sampling-c`；`blur(.028em)`；`drop-shadow(0 0 .24em rgba(237,240,232,.16))` |
| 光标 `.signal-caret` | `sampling-a`；`blur(.024em)`；`drop-shadow(0 0 .14em rgba(237,240,232,.14))` | `sampling-b`；`blur(.024em)`；`drop-shadow(0 0 .16em rgba(237,240,232,.16))` | `sampling-c`；`blur(.024em)`；`drop-shadow(0 0 .18em rgba(237,240,232,.18))` |
| SVG 采样 | `baseFrequency=".72 .16"`；`seed="13"`；`scale=".34"` | `.66 .19`；`29`；`.38` | `.78 .13`；`47`；`.31` |

三个 `#signal-foreground-sampling-a/b/c` 都是 `feTurbulence → feDisplacementMap`，使用 `R/G` 通道，滤镜区域均为 `x="-16%" y="-16%" width="132%" height="132%"`。

占位块基础几何：`width: .9em`、`height: .98em`、`margin-top: .16em`、`border-radius: .12em`、`box-shadow: 0 0 .44em rgba(237,240,232,.18)`。光标基础几何：`.9em × .14em`、`margin-bottom: .16em`、`box-shadow: 0 0 .36em rgba(237,240,232,.22)`。

### 冻结的共享无色扩散层

三个滤镜均为 `primitiveUnits="userSpaceOnUse"`、`color-interpolation-filters="sRGB"`，滤镜区域均为 `x="-4%" y="-8%" width="108%" height="116%"`。`feOffset`、`feMorphology` 和 `feGaussianBlur` 的值因此是 SVG 用户坐标值，不是 `em`。

| 断点与滤镜 | 青向路径：`offset dx/dy`、`dilate x/y`、`erode x/y`、内带 `blur x/y` | 红向路径：`offset dx/dy`、`dilate x/y`、`erode x/y`、内带 `blur x/y` |
| --- | --- | --- |
| 默认 `#signal-shared-chromatic-residual-small` | `-.63 / -.108`；`.58 / .22`；`.36 / .075`；`.1 / .035` | `.72 / .108`；`.62 / .24`；`.4 / .08`；`.1 / .035` |
| `sm` `#signal-shared-chromatic-residual-medium` | `-.7 / -.12`；`.64 / .24`；`.4 / .085`；`.11 / .04` | `.8 / .12`；`.68 / .26`；`.44 / .095`；`.11 / .04` |
| `md` `#signal-shared-chromatic-residual-large` | `-1.05 / -.18`；`.9 / .34`；`.6 / .13`；`.16 / .055` | `1.2 / .18`；`.96 / .36`；`.66 / .14`；`.16 / .055` |

着色节点当前固定为：`cyanPaint` = `#d1d1d1`、`flood-opacity=".58"`；`redPaint` = `#8e8e8e`、`flood-opacity=".50"`。这些是等亮度中性色对照的正式柔化基线，不应被误读为青、红最终色值。

每档都使用 `chromaScanField`：`feTurbulence baseFrequency=".003 1.45"`、`numOctaves="1"`、`seed="167"`；其 Alpha 映射为 `tableValues=".66 1"`。它只调制内带，外带不经过该扫描调制。

### 共享中性介质层

| 位置 / 节点 | 当前值 | 作用 |
| --- | --- | --- |
| `.signal-medium-glyphs` | `z-index: 3`；`opacity: .68`；`mix-blend-mode: soft-light` | 把中性纹理作为低幅明暗调制叠在前景上。 |
| 滤镜区域 | `x="-2%" y="-3%" width="104%" height="106%"` | 为内部 Alpha 柔化与纹理留出有限边界。 |
| `grainField` | `fractalNoise`；`.42 .56`；`numOctaves="1"`；`seed="101"` | 连续颗粒源。 |
| `scanField` | `fractalNoise`；`.003 1.45`；`numOctaves="1"`；`seed="127"` | 跨文本块的横向扫描变化源。 |
| `rawMediumField` | `feComposite arithmetic`：`k1=0 k2=.5 k3=.5 k4=0` | 以等权方式合成颗粒与扫描场。 |
| `neutralMediumField` | RGB 线性映射：`slope=.16`、`intercept=.42` | 把纹理映射为围绕中性灰的低幅场，而非亮色覆绘。 |
| `illuminationField` | `fractalNoise`；`.018 .026`；`numOctaves="1"`；`seed="139"` | 低频亮暗变化源。 |
| `modulatedTextAlpha` | Alpha `tableValues=".88 1"` | 只小幅调制内容遮罩。 |
| 内容蒙版 | `erode` / `GaussianBlur` | 默认 `.52/.22` 与 `.34/.14`；sm `.58/.24` 与 `.38/.16`；md `.86/.36` 与 `.56/.24` | 让纹理退出最外轮廓并柔化内边界。 |

最终关系是 `neutralMediumField IN contentAlpha`。`contentAlpha` 来自柔化内部 Alpha 与低频 Alpha 的交集，因此纹理不会填充字间距、行间距或段落空白。

### 字符级残差与背景介质

- `.signal-char` 横纹：白 `rgba(255,255,255,.025)`、暗 `rgba(59,78,75,.035)`，`background-size: 100% .16em`。
- `.signal-placeholder` 横纹：白 `rgba(255,255,255,.025)`、暗 `rgba(66,88,84,.03)`，`background-size: 100% .17em`。
- `--cell-core-light`：全局格索引决定的 `.975`–`.990`；`--cell-line-offset`：`0`–`.12em`；径向颗粒位置由稳定的 `--cell-grain-x/y` 派生。
- `.signal-placeholder::before` 仅保留中性细节：`opacity: .06`、`mix-blend-mode: soft-light`，不含红青补偿。
- `.signal-noise`：`opacity: .045`、`mix-blend-mode: screen`；`.signal-vignette` 提供暗部与极弱冷暖斑驳；两条 `.signal-letterbox` 各占高度 `11%`。

## 4. A / B / C 稳定变体

`signalCellVariant(character)` 通过 `stableUnit(character.index, 14)` 将**全局字符格索引**稳定映射为 A、B 或 C，不按 DOM 顺序做 `A → B → C` 循环，也不读取字符内容、占位状态或运行时随机数。

`signalCellStyle(character)` 同样由全局索引生成亮度、横纹偏移与颗粒坐标。某个格从占位块变成真实字时，索引、变体与局部参数不变，因此不会在替换瞬间跳变。真实字、占位块与当前光标都继承所在 `.signal-cell` 的同一变体；两份共享克隆则使用同一文本状态，但不复制这些字符级前景样式。

## 5. 当前共享无色扩散层

`.signal-chromatic-residual-glyphs` 是整个文本块的无色 Alpha 克隆。其 `SourceAlpha` 同时包含：已显示文字、已启动行的后续占位块，以及当前占位块中的下划线光标。

每个响应式滤镜对两条方向路径采用相同的结构：

1. `SourceAlpha → feOffset` 得到左上与右下方向的 Alpha。
2. `offsetAlpha OUT SourceAlpha` 得到对应的外侧残差；随后 `feMorphology operator="dilate"` 扩展为外带。
3. `offsetAlpha IN SourceAlpha` 得到与原字形重叠的区域；`SourceAlpha → erode` 得到核心 Alpha；两者相减得到靠近边缘的内带。
4. 内带经过共享扫描 Alpha 与轻微 `feGaussianBlur`；外带不经该模糊。
5. 外带和内带分别以 `cyanPaint`、`redPaint` 着色后 `feMerge`。

当前两个 paint 都是中性灰，所以最终效果是“方向性无色扩散”。它保留了原色散试验的 Alpha 几何，但**不**输出青红色带。该层不输出 `SourceGraphic`、完整 `SourceAlpha` 或未裁切的完整偏移 Alpha。

后续红青方案应在不改变此层的前提下单独设计；禁止把它重新解释为已完成的最终色散。

## 6. 共享中性介质层的实现

`.signal-medium-glyphs` 以整块共享克隆作为滤镜输入，所以 `grainField`、`scanField` 和 `illuminationField` 的坐标跨字符、跨行连续；它们不会在每个字符格内重启。

处理链路如下：

```text
grainField + scanField
→ arithmetic 合成 rawMediumField
→ RGB 映射为 neutralMediumField

SourceAlpha
→ erode
→ GaussianBlur
→ IN 原始 SourceAlpha
→ IN 低频 illumination Alpha
→ contentAlpha

neutralMediumField IN contentAlpha
→ .signal-medium-glyphs 的 soft-light 合成
```

该层不输出 `SourceGraphic`、完整白色字形、红青颜色、位移或扩张型 glow。它能改变内容内部的中性明暗与质地，但不能填亮空白区域。

## 7. 动画与排版逻辑

`testParagraphs` 外层表示段落、内层表示强制换行。`Array.from()` 为每个可见字符建立全局 `index`；换行和段落空行不建格，所以不会出现白色占位块。

1. 页面挂载后，`beginReveal()` 重置 `revealedCount=0`、`activeLineIndex=0`，等待 `900ms`。
2. 当前行一开始，整行后续格同时显示白色占位块；尚未启动的行完全不可见。
3. 每 `88ms`，当前占位块同步替换为真实字，光标立即进入下一格下方。
4. 行尾完成后，等待 `720ms`；下一行整排占位块出现，再开始逐格替换。
5. 最后一格替换完成后，光标不再渲染，不移动到文本末尾。
6. `prefers-reduced-motion: reduce` 时直接显示全部文字并取消播放节奏。

当前页面不读取 `signal-diagnostic`、`signal-chroma` 或其他诊断查询参数；正常 URL 始终播放正式动画。

## 8. 参数调整指南

| 视觉目标 | 应调整的位置 | 影响与边界 |
| --- | --- | --- |
| 让 Core 更模糊或更清晰 | `.signal-char`、`.signal-placeholder`、`.signal-caret` 的 A/B/C `blur()` | 三档一起评估；只改一档会形成可见的随机清晰度差。 |
| 改白灰溢光范围 | 前景 `drop-shadow()`、占位块 / 光标 `box-shadow` | 过强会让笔画增粗、黏连相邻字符。 |
| 改字符采样破碎感 | `#signal-foreground-sampling-a/b/c` 的 `feDisplacementMap scale` | 当前 `.34 / .38 / .31`；提高会产生可见形变。 |
| 调共享中性横纹、颗粒 | `grainField`、`scanField`、`rawMediumField` 与 `neutralMediumField` | 连续纹理为主要来源；不要通过恢复较强的逐格纹理替代。 |
| 调中性层总体贡献 | `.signal-medium-glyphs { opacity }` | 它与纹理 RGB 映射共同决定可见度；一次只调一个主变量。 |
| 调低频亮暗不均 | `illuminationField` 与 `feFuncA tableValues=".88 1"` | 只能调制内容 Alpha；不能重新添加灰白覆层。 |
| 调无色扩散基线 | `#signal-shared-chromatic-residual-small/medium/large` 内的 offset、dilate、erode、内带 blur、paint 灰阶 | **当前冻结。** 它的改变会同时影响已有柔化观感，不能作为红青试验的调节入口。 |
| 设计红青色散 | 新的独立红青子输出，而非当前无色扩散层 | 当前没有已确认的最终红青参数；不要把灰阶 `feFlood` 改回彩色后直接视为完成。 |
| 调字符局部残差 | `stableUnit()`、`signalCellStyle()` 的固定 salt / 范围 | 必须以 `character.index` 为输入，不能随真实字 / 占位块状态变化。 |
| 调逐字和行间节奏 | `characterDelay`、`lineBoundaryPause` | 当前 `88ms / 720ms`；行停顿应显著长于逐字节奏。 |

## 9. 当前设计边界

- 不使用全屏强 VHS 故障、明显拖影、剧烈闪烁或强烈字符扭曲。
- 不让共享中性介质层输出完整、清晰的白色字形副本，或重新塑造前景外轮廓。
- 不重新引入逐字符、逐占位块或逐光标独立的红青补偿。
- 不把当前无色扩散基线误作最终红青效果；红青色带仍待独立设计并验证。
- 不让未来红青试验改动 Core、共享中性介质层，或当前已认可的无色扩散几何。
- 不让字符级中性纹理重新成为唯一主要质感来源。

## 10. 当前实现相关文件

| 文件 | 作用 |
| --- | --- |
| [`jacory-space-frontend/src/views/RetroFuturismSignalStudy.vue`](../../jacory-space-frontend/src/views/RetroFuturismSignalStudy.vue) | 页面模板、文本布局、逐字状态、三层 DOM、SVG 滤镜和全部视觉样式。 |
| [`jacory-space-frontend/src/assets/fonts/SourceHanSansSC-VF.ttf.woff2`](../../jacory-space-frontend/src/assets/fonts/SourceHanSansSC-VF.ttf.woff2) | 当前页面中文真实文字与共享克隆使用的本地 Source Han Sans SC 可变字体。 |

配套文档（不参与页面渲染）：[本说明](retro-futurism-signal-rendering.md)。
