<template>
  <main class="signal-study relative isolate min-h-screen overflow-hidden bg-[#030405] text-[#edf0e8]">
    <div class="signal-stage relative min-h-screen" aria-labelledby="signal-caption">
      <div class="signal-letterbox signal-letterbox-top" aria-hidden="true" />
      <div class="signal-letterbox signal-letterbox-bottom" aria-hidden="true" />
      <div class="signal-noise" aria-hidden="true" />
      <div class="signal-vignette" aria-hidden="true" />
      <svg class="signal-filter-definitions" aria-hidden="true" focusable="false">
        <defs>
          <filter id="signal-shared-medium" x="-2%" y="-3%" width="104%" height="106%" color-interpolation-filters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.42 0.56" numOctaves="1" seed="101" result="grainField" />
            <feTurbulence type="fractalNoise" baseFrequency="0.003 1.45" numOctaves="1" seed="127" result="scanField" />
            <feColorMatrix
              in="grainField"
              type="matrix"
              values="0.18 0.18 0.18 0 0.64
                      0.2 0.2 0.2 0 0.67
                      0.19 0.19 0.19 0 0.65
                      0 0 0 0 0.48"
              result="neutralGrain"
            />
            <feColorMatrix
              in="scanField"
              type="matrix"
              values="0.08 0.08 0.08 0 0.71
                      0.09 0.09 0.09 0 0.74
                      0.09 0.09 0.09 0 0.72
                      0 0 0 0 0.32"
              result="scanLines"
            />
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.026" numOctaves="1" seed="139" result="illuminationField" />
            <feColorMatrix in="illuminationField" type="luminanceToAlpha" result="illuminationLuma" />
            <feComponentTransfer in="illuminationLuma" result="modulatedTextAlpha">
              <feFuncA type="table" tableValues="0.88 1" />
            </feComponentTransfer>
            <feComposite in="SourceAlpha" in2="modulatedTextAlpha" operator="in" result="contentAlpha" />
            <feBlend in="neutralGrain" in2="scanLines" mode="screen" result="mediumField" />
            <feComposite in="mediumField" in2="contentAlpha" operator="in" />
          </filter>
          <filter id="signal-foreground-sampling-a" x="-16%" y="-16%" width="132%" height="132%" color-interpolation-filters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.72 0.16" numOctaves="1" seed="13" result="samplingNoise" />
            <feDisplacementMap in="SourceGraphic" in2="samplingNoise" scale="0.34" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="signal-foreground-sampling-b" x="-16%" y="-16%" width="132%" height="132%" color-interpolation-filters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.66 0.19" numOctaves="1" seed="29" result="samplingNoise" />
            <feDisplacementMap in="SourceGraphic" in2="samplingNoise" scale="0.38" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="signal-foreground-sampling-c" x="-16%" y="-16%" width="132%" height="132%" color-interpolation-filters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.78 0.13" numOctaves="1" seed="47" result="samplingNoise" />
            <feDisplacementMap in="SourceGraphic" in2="samplingNoise" scale="0.31" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="signal-shared-chromatic-residual-small" x="-4%" y="-8%" width="108%" height="116%" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feOffset in="SourceAlpha" dx="-0.63" dy="-0.108" result="cyanOffsetAlpha" />
            <feComposite in="cyanOffsetAlpha" in2="SourceAlpha" operator="out" result="cyanResidualAlpha" />
            <feMorphology in="cyanResidualAlpha" operator="dilate" radius="0.58 0.22" result="cyanBandAlpha" />
            <feFlood flood-color="#4ae8d7" flood-opacity="0.58" result="cyanPaint" />
            <feComposite in="cyanPaint" in2="cyanBandAlpha" operator="in" result="cyanResidual" />
            <feOffset in="SourceAlpha" dx="0.72" dy="0.108" result="redOffsetAlpha" />
            <feComposite in="redOffsetAlpha" in2="SourceAlpha" operator="out" result="redResidualAlpha" />
            <feMorphology in="redResidualAlpha" operator="dilate" radius="0.62 0.24" result="redBandAlpha" />
            <feFlood flood-color="#f4576f" flood-opacity="0.50" result="redPaint" />
            <feComposite in="redPaint" in2="redBandAlpha" operator="in" result="redResidual" />
            <feMerge>
              <feMergeNode in="cyanResidual" />
              <feMergeNode in="redResidual" />
            </feMerge>
          </filter>
          <filter id="signal-shared-chromatic-residual-medium" x="-4%" y="-8%" width="108%" height="116%" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feOffset in="SourceAlpha" dx="-0.7" dy="-0.12" result="cyanOffsetAlpha" />
            <feComposite in="cyanOffsetAlpha" in2="SourceAlpha" operator="out" result="cyanResidualAlpha" />
            <feMorphology in="cyanResidualAlpha" operator="dilate" radius="0.64 0.24" result="cyanBandAlpha" />
            <feFlood flood-color="#4ae8d7" flood-opacity="0.58" result="cyanPaint" />
            <feComposite in="cyanPaint" in2="cyanBandAlpha" operator="in" result="cyanResidual" />
            <feOffset in="SourceAlpha" dx="0.8" dy="0.12" result="redOffsetAlpha" />
            <feComposite in="redOffsetAlpha" in2="SourceAlpha" operator="out" result="redResidualAlpha" />
            <feMorphology in="redResidualAlpha" operator="dilate" radius="0.68 0.26" result="redBandAlpha" />
            <feFlood flood-color="#f4576f" flood-opacity="0.50" result="redPaint" />
            <feComposite in="redPaint" in2="redBandAlpha" operator="in" result="redResidual" />
            <feMerge>
              <feMergeNode in="cyanResidual" />
              <feMergeNode in="redResidual" />
            </feMerge>
          </filter>
          <filter id="signal-shared-chromatic-residual-large" x="-4%" y="-8%" width="108%" height="116%" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feOffset in="SourceAlpha" dx="-1.05" dy="-0.18" result="cyanOffsetAlpha" />
            <feComposite in="cyanOffsetAlpha" in2="SourceAlpha" operator="out" result="cyanResidualAlpha" />
            <feMorphology in="cyanResidualAlpha" operator="dilate" radius="0.90 0.34" result="cyanBandAlpha" />
            <feFlood flood-color="#4ae8d7" flood-opacity="0.58" result="cyanPaint" />
            <feComposite in="cyanPaint" in2="cyanBandAlpha" operator="in" result="cyanResidual" />
            <feOffset in="SourceAlpha" dx="1.2" dy="0.18" result="redOffsetAlpha" />
            <feComposite in="redOffsetAlpha" in2="SourceAlpha" operator="out" result="redResidualAlpha" />
            <feMorphology in="redResidualAlpha" operator="dilate" radius="0.96 0.36" result="redBandAlpha" />
            <feFlood flood-color="#f4576f" flood-opacity="0.50" result="redPaint" />
            <feComposite in="redPaint" in2="redBandAlpha" operator="in" result="redResidual" />
            <feMerge>
              <feMergeNode in="cyanResidual" />
              <feMergeNode in="redResidual" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <div class="signal-copy">
        <div
          id="signal-caption"
          class="signal-glyphs text-left font-sans text-lg font-semibold leading-relaxed tracking-normal sm:text-xl md:text-3xl"
          aria-hidden="true"
        >
          <div v-for="(paragraph, paragraphIndex) in textLayout" :key="paragraphIndex" class="signal-paragraph">
            <div v-for="(line, lineIndex) in paragraph" :key="lineIndex" class="signal-line">
              <template v-if="isLineStarted(line)">
                <span
                  v-for="character in line.characters"
                  :key="character.index"
                  class="signal-cell"
                  :style="signalCellStyle(character)"
                  :class="[signalCellVariant(character), {
                    'is-chinese-cell': isChineseCharacter(character.value),
                    'is-active': character.index === revealedCount && revealedCount < characters.length,
                    'is-revealed': character.index < revealedCount,
                    'is-placeholder': character.index > revealedCount,
                  }]"
                >
                  <span
                    v-if="character.index < revealedCount"
                    class="signal-char"
                    :class="{ 'is-chinese': isChineseCharacter(character.value) }"
                  >{{ character.value }}</span>
                  <span v-else-if="character.index === revealedCount" class="signal-placeholder is-active">
                    <span class="signal-caret" aria-hidden="true" />
                  </span>
                  <span v-else class="signal-placeholder" />
                </span>
              </template>
            </div>
          </div>
        </div>

        <div
          class="signal-chromatic-residual-glyphs text-left font-sans text-lg font-semibold leading-relaxed tracking-normal sm:text-xl md:text-3xl"
          aria-hidden="true"
        >
          <div v-for="(paragraph, paragraphIndex) in textLayout" :key="paragraphIndex" class="signal-paragraph">
            <div v-for="(line, lineIndex) in paragraph" :key="lineIndex" class="signal-line">
              <template v-if="isLineStarted(line)">
                <span
                  v-for="character in line.characters"
                  :key="character.index"
                  class="signal-medium-cell"
                  :class="{ 'is-chinese-cell': isChineseCharacter(character.value) }"
                >
                  <span
                    v-if="character.index < revealedCount"
                    class="signal-medium-char"
                    :class="{ 'is-chinese': isChineseCharacter(character.value) }"
                  >{{ character.value }}</span>
                  <span v-else-if="character.index === revealedCount" class="signal-medium-placeholder is-active">
                    <span class="signal-medium-caret" />
                  </span>
                  <span v-else class="signal-medium-placeholder" />
                </span>
              </template>
            </div>
          </div>
        </div>

        <div
          class="signal-medium-glyphs text-left font-sans text-lg font-semibold leading-relaxed tracking-normal sm:text-xl md:text-3xl"
          aria-hidden="true"
        >
          <div v-for="(paragraph, paragraphIndex) in textLayout" :key="paragraphIndex" class="signal-paragraph">
            <div v-for="(line, lineIndex) in paragraph" :key="lineIndex" class="signal-line">
              <template v-if="isLineStarted(line)">
                <span
                  v-for="character in line.characters"
                  :key="character.index"
                  class="signal-medium-cell"
                  :class="{ 'is-chinese-cell': isChineseCharacter(character.value) }"
                >
                  <span
                    v-if="character.index < revealedCount"
                    class="signal-medium-char"
                    :class="{ 'is-chinese': isChineseCharacter(character.value) }"
                  >{{ character.value }}</span>
                  <span v-else-if="character.index === revealedCount" class="signal-medium-placeholder is-active">
                    <span class="signal-medium-caret" />
                  </span>
                  <span v-else class="signal-medium-placeholder" />
                </span>
              </template>
            </div>
          </div>
        </div>

        <p class="sr-only" aria-live="polite">{{ testText }}</p>
      </div>
    </div>

    <p class="sr-only">{{ t('retroFuturism.signalLabel') }}</p>
  </main>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const testParagraphs = [
  [
    '当电子信号穿过沉默的屏幕与褪色的光',
    '老旧接口仍在保存尚未抵达的回应',
    '未来只是被重新命名的现在',
  ],
  [
    '在短暂失焦的光里',
    '某种联系尚未中断・・・・',
  ],
]

let characterIndex = 0
let lineIndex = 0
const textLayout = testParagraphs.map((paragraph) => paragraph.map((line) => {
  const characters = Array.from(line).map((value) => ({ value, index: characterIndex++ }))

  return {
    characters,
    startIndex: characters[0].index,
    sequenceIndex: lineIndex++,
  }
}))
const lines = textLayout.flat()
const characters = lines.flatMap((line) => line.characters)
const lineIndexByStart = new Map(lines.map((line) => [line.startIndex, line.sequenceIndex]))
const testText = testParagraphs.map((paragraph) => paragraph.join('\n')).join('\n\n')
const revealedCount = ref(0)
const activeLineIndex = ref(0)
const revealTimer = ref(null)

const isLineStarted = (line) => activeLineIndex.value >= line.sequenceIndex
const isChineseCharacter = (value) => locale.value.startsWith('zh') && /[\u3400-\u9fff\uf900-\ufaff]/u.test(value)
const stableUnit = (index, salt) => {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}
const signalCellVariant = (character) => {
  const variantIndex = Math.min(2, Math.floor(stableUnit(character.index, 14) * 3))
  return ['signal-variant-a', 'signal-variant-b', 'signal-variant-c'][variantIndex]
}
const signalCellStyle = (character) => {
  const index = character.index
  const lineOffset = stableUnit(index, 4) * 0.12
  const grainX = stableUnit(index, 5) * 0.18
  const grainY = stableUnit(index, 6) * 0.16
  const blockLineOffset = stableUnit(index, 13) * 0.1

  return {
    '--cell-core-light': (0.975 + stableUnit(index, 3) * 0.015).toFixed(3),
    '--cell-line-offset': `${lineOffset.toFixed(3)}em`,
    '--cell-grain-x': `${grainX.toFixed(3)}em`,
    '--cell-grain-y': `${grainY.toFixed(3)}em`,
    '--cell-grain-x-inverse': `${(-grainX).toFixed(3)}em`,
    '--cell-grain-y-inverse': `${(-grainY).toFixed(3)}em`,
    '--cell-block-cyan-x': `${(stableUnit(index, 11) * 0.07).toFixed(3)}em`,
    '--cell-block-red-x': `${(stableUnit(index, 12) * 0.07).toFixed(3)}em`,
    '--cell-block-line-offset': `${blockLineOffset.toFixed(3)}em`,
    '--cell-block-line-offset-red': `${(blockLineOffset * 0.7).toFixed(3)}em`,
  }
}

const clearRevealTimer = () => {
  if (revealTimer.value !== null) {
    window.clearTimeout(revealTimer.value)
    revealTimer.value = null
  }
}

const beginReveal = () => {
  clearRevealTimer()
  revealedCount.value = 0
  activeLineIndex.value = 0

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealedCount.value = characters.length
    activeLineIndex.value = lines.length - 1
    return
  }

  const characterDelay = 88
  const lineBoundaryPause = 720
  let nextIndex = 0
  const revealNext = (delay) => {
    if (nextIndex >= characters.length) return

    revealTimer.value = window.setTimeout(() => {
      revealedCount.value = nextIndex + 1
      nextIndex += 1

      if (nextIndex >= characters.length) return

      const nextLineIndex = lineIndexByStart.get(nextIndex)
      if (nextLineIndex !== undefined) {
        revealTimer.value = window.setTimeout(() => {
          activeLineIndex.value = nextLineIndex
          revealNext(characterDelay)
        }, lineBoundaryPause)
        return
      }

      revealNext(characterDelay)
    }, delay)
  }

  revealNext(900)
}

onMounted(beginReveal)
onBeforeUnmount(clearRevealTimer)
</script>

<style scoped>
@font-face {
  font-family: "Source Han Sans SC";
  src: url("../assets/fonts/SourceHanSansSC-VF.ttf.woff2") format("woff2");
  font-style: normal;
  font-weight: 200 900;
  font-display: swap;
}

.signal-study {
  --signal-paper: #edf0e8;
  --signal-cyan: rgba(93, 224, 214, 0.72);
  --signal-red: rgba(235, 93, 113, 0.66);
  --signal-ink: #030405;
  font-family: "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", "Noto Sans CJK JP", sans-serif;
}

.signal-stage {
  background:
    linear-gradient(180deg, rgba(10, 12, 13, 0.26) 0 17%, transparent 17% 85%, rgba(10, 12, 13, 0.32) 85% 100%),
    var(--signal-ink);
}

.signal-filter-definitions {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

.signal-copy {
  position: absolute;
  inset: 0;
  z-index: 10;
}

.signal-glyphs,
.signal-medium-glyphs,
.signal-chromatic-residual-glyphs {
  position: absolute;
  top: 50%;
  left: 50%;
  width: fit-content;
  max-width: min(52.5rem, calc(100% - 2.5rem));
  color: var(--signal-paper);
  transform: translate(-50%, -50%);
  line-height: 1.3;
  letter-spacing: 0;
  white-space: normal;
}

.signal-glyphs {
  z-index: 2;
}

.signal-chromatic-residual-glyphs {
  z-index: 1;
  overflow: visible;
  pointer-events: none;
  mix-blend-mode: normal;
  filter: url("#signal-shared-chromatic-residual-small");
}

@media (min-width: 640px) {
  .signal-chromatic-residual-glyphs {
    filter: url("#signal-shared-chromatic-residual-medium");
  }
}

@media (min-width: 768px) {
  .signal-chromatic-residual-glyphs {
    filter: url("#signal-shared-chromatic-residual-large");
  }
}

.signal-medium-glyphs {
  z-index: 3;
  visibility: hidden;
  pointer-events: none;
  opacity: 0.68;
  filter: url("#signal-shared-medium");
  mix-blend-mode: normal;
}

.signal-paragraph {
  display: grid;
  row-gap: 0.38em;
}

.signal-line {
  min-height: 1.3em;
  line-height: 1.3;
}

.signal-paragraph + .signal-paragraph {
  margin-top: 1.6em;
}

.signal-cell,
.signal-medium-cell {
  position: relative;
  display: inline-block;
  width: 1em;
  height: 1.3em;
  line-height: 1.3em;
  vertical-align: top;
}

.signal-cell + .signal-cell,
.signal-medium-cell + .signal-medium-cell {
  margin-left: 0.22em;
}

.signal-cell.is-chinese-cell + .signal-cell,
.signal-medium-cell.is-chinese-cell + .signal-medium-cell {
  margin-left: 0.3em;
}

.signal-cell.is-space,
.signal-medium-cell.is-space {
  width: 0.5em;
}

.signal-char,
.signal-placeholder,
.signal-caret {
  position: relative;
  display: block;
}

.signal-char {
  height: 1.3em;
  line-height: 1.3em;
  isolation: isolate;
  color: transparent;
  background:
    linear-gradient(104deg, rgba(214, 228, 221, var(--cell-core-light)), rgba(255, 255, 251, 0.98) 38%, rgba(202, 222, 217, 0.88) 74%, rgba(244, 246, 238, 0.95)),
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.025) 0 0.022em, rgba(59, 78, 75, 0.035) 0.042em 0.065em, transparent 0.088em 0.14em),
    radial-gradient(circle at 24% 32%, rgba(255, 255, 255, 0.06) 0 0.03em, transparent 0.072em),
    radial-gradient(circle at 74% 66%, rgba(64, 93, 88, 0.04) 0 0.026em, transparent 0.065em);
  background-position: 0 0, 0 var(--cell-line-offset), var(--cell-grain-x) var(--cell-grain-y), var(--cell-grain-x-inverse) var(--cell-grain-y-inverse);
  background-size: 100% 100%, 100% 0.16em, 0.44em 0.4em, 0.54em 0.5em;
  background-blend-mode: normal, multiply, soft-light, multiply;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: url("#signal-foreground-sampling-b") blur(0.032em) drop-shadow(0 0 0.22em rgba(237, 240, 232, 0.15));
}

.signal-cell.signal-variant-a .signal-char {
  filter: url("#signal-foreground-sampling-a") blur(0.03em) drop-shadow(0 0 0.2em rgba(237, 240, 232, 0.14));
}

.signal-cell.signal-variant-c .signal-char {
  filter: url("#signal-foreground-sampling-c") blur(0.034em) drop-shadow(0 0 0.24em rgba(237, 240, 232, 0.16));
}

.signal-char.is-chinese {
  font-family: "Source Han Sans SC", sans-serif;
  font-weight: 400;
}

.signal-medium-char,
.signal-medium-placeholder,
.signal-medium-caret {
  position: relative;
  display: block;
  color: #fff;
  background: #fff;
}

.signal-medium-char {
  height: 1.3em;
  line-height: 1.3em;
  background: none;
}

.signal-medium-char.is-chinese {
  font-family: "Source Han Sans SC", sans-serif;
  font-weight: 400;
}

.signal-placeholder {
  width: 0.9em;
  height: 0.98em;
  margin-top: 0.16em;
  overflow: hidden;
  border-radius: 0.12em;
  background:
    linear-gradient(112deg, rgba(206, 223, 217, var(--cell-core-light)), rgba(255, 255, 253, 0.98) 42%, rgba(215, 227, 221, 0.84)),
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.025) 0 0.025em, rgba(66, 88, 84, 0.03) 0.045em 0.07em, transparent 0.09em 0.15em),
    radial-gradient(circle at 25% 30%, rgba(255, 255, 255, 0.05) 0 0.028em, transparent 0.065em);
  background-position: 0 0, 0 var(--cell-line-offset), var(--cell-grain-x) var(--cell-grain-y);
  background-size: 100% 100%, 100% 0.17em, 0.42em 0.39em;
  background-blend-mode: normal, multiply, soft-light;
  box-shadow: 0 0 0.44em rgba(237, 240, 232, 0.18);
  filter: url("#signal-foreground-sampling-b") blur(0.028em) drop-shadow(0 0 0.22em rgba(237, 240, 232, 0.14));
}

.signal-cell.signal-variant-a .signal-placeholder {
  filter: url("#signal-foreground-sampling-a") blur(0.028em) drop-shadow(0 0 0.2em rgba(237, 240, 232, 0.12));
}

.signal-cell.signal-variant-c .signal-placeholder {
  filter: url("#signal-foreground-sampling-c") blur(0.028em) drop-shadow(0 0 0.24em rgba(237, 240, 232, 0.16));
}

.signal-medium-placeholder {
  width: 0.9em;
  height: 0.98em;
  margin-top: 0.16em;
  border-radius: 0.12em;
}

.signal-space {
  display: block;
  width: 0.5em;
  height: 0.92em;
  margin-top: 0.16em;
}

.signal-placeholder::after {
  position: absolute;
  inset: 0;
  content: "";
  opacity: 0.18;
  background:
    linear-gradient(90deg, rgba(74, 232, 215, 0.22), transparent),
    linear-gradient(270deg, rgba(244, 87, 111, 0.2), transparent);
  background-position: var(--cell-block-cyan-x) var(--cell-block-line-offset), calc(100% - var(--cell-block-red-x)) var(--cell-block-line-offset-red);
  background-repeat: no-repeat, no-repeat;
  background-size: 40% 0.15em, 40% 0.15em;
  -webkit-mask-image: repeating-linear-gradient(0deg, transparent 0 0.035em, rgba(0, 0, 0, 0.9) 0.055em 0.13em, transparent 0.155em 0.2em);
  -webkit-mask-repeat: repeat;
  mask-image: repeating-linear-gradient(0deg, transparent 0 0.035em, rgba(0, 0, 0, 0.9) 0.055em 0.13em, transparent 0.155em 0.2em);
  mask-repeat: repeat;
  mix-blend-mode: multiply;
}

.signal-placeholder::before {
  position: absolute;
  inset: 0;
  content: "";
  opacity: 0.06;
  background:
    radial-gradient(circle at 22% 30%, rgba(255, 255, 255, 0.72) 0 0.03em, transparent 0.07em),
    radial-gradient(circle at 76% 66%, rgba(56, 85, 80, 0.38) 0 0.028em, transparent 0.065em),
    repeating-linear-gradient(0deg, transparent 0 0.06em, rgba(244, 246, 238, 0.035) 0.075em 0.095em, transparent 0.12em 0.18em);
  background-position: var(--cell-grain-x) var(--cell-grain-y), var(--cell-grain-x-inverse) var(--cell-grain-y-inverse), 0 var(--cell-block-line-offset);
  background-size: 0.39em 0.36em, 0.52em 0.48em, 100% 0.2em;
  mix-blend-mode: soft-light;
}

.signal-caret {
  width: 0.9em;
  height: 0.14em;
  align-self: flex-end;
  margin-bottom: 0.16em;
  background: var(--signal-paper);
  box-shadow:
    -0.046em 0 rgba(93, 224, 214, 0.38),
    0.052em 0 rgba(235, 93, 113, 0.31),
    0 0 0.36em rgba(237, 240, 232, 0.22);
  filter: url("#signal-foreground-sampling-b") blur(0.024em) drop-shadow(0 0 0.16em rgba(237, 240, 232, 0.16));
  animation: signal-caret-blink 0.9s steps(1, end) infinite;
}

.signal-cell.signal-variant-a .signal-caret {
  filter: url("#signal-foreground-sampling-a") blur(0.024em) drop-shadow(0 0 0.14em rgba(237, 240, 232, 0.14));
}

.signal-cell.signal-variant-c .signal-caret {
  filter: url("#signal-foreground-sampling-c") blur(0.024em) drop-shadow(0 0 0.18em rgba(237, 240, 232, 0.18));
}

.signal-medium-caret {
  width: 0.9em;
  height: 0.14em;
  align-self: flex-end;
  margin-bottom: 0.16em;
}

.signal-placeholder.is-active .signal-caret {
  position: absolute;
  right: 0;
  bottom: -0.16em;
  left: 0;
  width: 100%;
  margin-bottom: 0;
}

.signal-placeholder.is-active {
  overflow: visible;
}

.signal-medium-placeholder.is-active {
  overflow: visible;
}

.signal-medium-placeholder.is-active .signal-medium-caret {
  position: absolute;
  right: 0;
  bottom: -0.16em;
  left: 0;
  width: 100%;
  margin-bottom: 0;
}

.signal-space-active {
  position: relative;
}

.signal-space-active .signal-caret {
  position: absolute;
  right: 0;
  bottom: -0.16em;
  left: 0;
  width: 100%;
  margin-bottom: 0;
}

.signal-noise,
.signal-vignette,
.signal-letterbox {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.signal-noise {
  z-index: 20;
  opacity: 0.045;
  mix-blend-mode: screen;
  background-image:
    repeating-linear-gradient(0deg, transparent 0, transparent 0.25rem, rgba(237, 240, 232, 0.05) 0.3rem, transparent 0.38rem),
    radial-gradient(rgba(237, 240, 232, 0.32) 0.4px, transparent 0.62px),
    radial-gradient(rgba(237, 240, 232, 0.18) 0.4px, transparent 0.72px);
  background-size: auto, 7px 9px, 11px 13px;
  animation: signal-noise-drift 1.8s steps(2, end) infinite;
}

.signal-vignette {
  z-index: 21;
  background:
    radial-gradient(circle at 18% 38%, rgba(74, 84, 82, 0.024), transparent 19%),
    radial-gradient(circle at 78% 61%, rgba(108, 71, 78, 0.018), transparent 21%),
    radial-gradient(ellipse at center, transparent 48%, rgba(0, 0, 0, 0.36) 100%);
}

.signal-letterbox {
  z-index: 1;
  height: 11%;
  inset-inline: 0;
  background: rgba(0, 0, 0, 0.16);
}

.signal-letterbox-top {
  top: 0;
  bottom: auto;
}

.signal-letterbox-bottom {
  top: auto;
  bottom: 0;
}

@keyframes signal-caret-blink {
  0%, 45% { opacity: 1; }
  46%, 100% { opacity: 0.22; }
}

@keyframes signal-noise-drift {
  0% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(-0.1%, 0.25%, 0); }
  100% { transform: translate3d(0.1%, -0.2%, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .signal-caret,
  .signal-noise {
    animation: none;
  }
}
</style>
