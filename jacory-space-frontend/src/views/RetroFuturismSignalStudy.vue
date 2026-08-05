<template>
  <main class="signal-study relative isolate min-h-screen overflow-hidden bg-[#030405] text-[#edf0e8]">
    <div class="signal-stage relative min-h-screen" aria-labelledby="signal-caption">
      <div class="signal-letterbox signal-letterbox-top" aria-hidden="true" />
      <div class="signal-letterbox signal-letterbox-bottom" aria-hidden="true" />
      <div class="signal-noise" aria-hidden="true" />
      <div class="signal-vignette" aria-hidden="true" />
      <svg class="signal-filter-definitions" aria-hidden="true" focusable="false">
        <defs>
          <filter id="signal-display-texture-a" x="-16%" y="-16%" width="132%" height="132%" color-interpolation-filters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.72 0.16" numOctaves="1" seed="13" result="signalNoise" />
            <feDisplacementMap in="SourceGraphic" in2="signalNoise" scale="0.34" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="signal-display-texture-b" x="-16%" y="-16%" width="132%" height="132%" color-interpolation-filters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.66 0.19" numOctaves="1" seed="29" result="signalNoise" />
            <feDisplacementMap in="SourceGraphic" in2="signalNoise" scale="0.38" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="signal-display-texture-c" x="-16%" y="-16%" width="132%" height="132%" color-interpolation-filters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.78 0.13" numOctaves="1" seed="47" result="signalNoise" />
            <feDisplacementMap in="SourceGraphic" in2="signalNoise" scale="0.31" xChannelSelector="R" yChannelSelector="G" />
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
                  :class="{
                    'is-chinese-cell': isChineseCharacter(character.value),
                    'is-active': character.index === revealedCount && revealedCount < characters.length,
                    'is-revealed': character.index < revealedCount,
                    'is-placeholder': character.index > revealedCount,
                  }"
                >
                  <span
                    v-if="character.index < revealedCount"
                    class="signal-char"
                    :class="{ 'is-chinese': isChineseCharacter(character.value) }"
                    :data-char="character.value"
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

.signal-glyphs {
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

.signal-cell {
  position: relative;
  display: inline-block;
  width: 1em;
  height: 1.3em;
  line-height: 1.3em;
  vertical-align: top;
}

.signal-cell + .signal-cell {
  margin-left: 0.22em;
}

.signal-cell.is-chinese-cell + .signal-cell {
  margin-left: 0.3em;
}

.signal-cell.is-space {
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
    linear-gradient(104deg, rgba(214, 228, 221, 0.8), rgba(255, 255, 251, 0.98) 38%, rgba(202, 222, 217, 0.78) 74%, rgba(244, 246, 238, 0.95)),
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.16) 0 0.025em, rgba(61, 83, 80, 0.24) 0.04em 0.075em, transparent 0.09em 0.15em),
    radial-gradient(circle at 20% 26%, rgba(255, 255, 255, 0.62) 0 0.05em, transparent 0.11em),
    radial-gradient(circle at 72% 68%, rgba(75, 109, 105, 0.42) 0 0.045em, transparent 0.1em);
  background-size: 100% 100%, 100% 0.18em, 0.48em 0.42em, 0.57em 0.51em;
  background-blend-mode: normal, multiply, screen, multiply;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: url("#signal-display-texture-a") blur(0.029em) drop-shadow(0 0 0.22em rgba(237, 240, 232, 0.22));
}

.signal-char::before,
.signal-char::after {
  position: absolute;
  inset: 0;
  content: attr(data-char);
  pointer-events: none;
  font: inherit;
  letter-spacing: inherit;
  mix-blend-mode: screen;
}

.signal-char::before {
  color: rgba(93, 224, 214, 0.42);
  -webkit-text-fill-color: rgba(93, 224, 214, 0.42);
  filter: blur(0.043em);
  transform: translate(-0.041em, 0.006em);
}

.signal-char::after {
  color: rgba(235, 93, 113, 0.34);
  -webkit-text-fill-color: rgba(235, 93, 113, 0.34);
  filter: blur(0.05em);
  transform: translate(0.047em, -0.004em);
}

.signal-cell:nth-child(3n + 2) .signal-char,
.signal-cell:nth-child(3n + 2) .signal-placeholder,
.signal-cell:nth-child(3n + 2) .signal-caret {
  filter: url("#signal-display-texture-b") blur(0.031em) drop-shadow(0 0 0.2em rgba(237, 240, 232, 0.2));
}

.signal-cell:nth-child(3n) .signal-char,
.signal-cell:nth-child(3n) .signal-placeholder,
.signal-cell:nth-child(3n) .signal-caret {
  filter: url("#signal-display-texture-c") blur(0.027em) drop-shadow(0 0 0.24em rgba(237, 240, 232, 0.24));
}

.signal-cell:nth-child(3n + 2) .signal-char::before {
  opacity: 0.78;
  transform: translate(-0.03em, -0.002em);
}

.signal-cell:nth-child(3n + 2) .signal-char::after {
  opacity: 0.72;
  transform: translate(0.058em, 0.005em);
}

.signal-cell:nth-child(3n) .signal-char::before {
  opacity: 0.66;
  transform: translate(-0.052em, 0.004em);
}

.signal-cell:nth-child(3n) .signal-char::after {
  opacity: 0.82;
  transform: translate(0.036em, -0.007em);
}

.signal-char.is-chinese {
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
    linear-gradient(112deg, rgba(206, 223, 217, 0.8), rgba(255, 255, 253, 0.98) 42%, rgba(215, 227, 221, 0.76)),
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.22) 0 0.035em, rgba(68, 91, 87, 0.25) 0.055em 0.09em, transparent 0.11em 0.18em),
    radial-gradient(circle at 18% 26%, rgba(255, 255, 255, 0.82) 0 0.045em, transparent 0.09em),
    radial-gradient(circle at 76% 66%, rgba(72, 97, 93, 0.42) 0 0.04em, transparent 0.085em);
  background-size: 100% 100%, 100% 0.2em, 0.42em 0.39em, 0.5em 0.48em;
  background-blend-mode: normal, multiply, screen, multiply;
  box-shadow:
    -0.046em 0.004em rgba(93, 224, 214, 0.42),
    0.054em -0.003em rgba(235, 93, 113, 0.34),
    0 0 0.44em rgba(237, 240, 232, 0.25);
  filter: url("#signal-display-texture-a") blur(0.026em) drop-shadow(0 0 0.2em rgba(237, 240, 232, 0.18));
}

.signal-space {
  display: block;
  width: 0.5em;
  height: 0.92em;
  margin-top: 0.16em;
}

.signal-placeholder::before {
  position: absolute;
  inset: 0;
  content: "";
  opacity: 0.28;
  background:
    radial-gradient(circle at 22% 30%, rgba(255, 255, 255, 0.88) 0 0.035em, transparent 0.07em),
    radial-gradient(circle at 78% 66%, rgba(56, 85, 80, 0.58) 0 0.03em, transparent 0.065em),
    radial-gradient(circle at 52% 52%, rgba(255, 255, 255, 0.54) 0 0.025em, transparent 0.055em);
  background-size: 0.39em 0.36em, 0.52em 0.48em, 0.31em 0.29em;
  mix-blend-mode: soft-light;
}

.signal-placeholder::after {
  position: absolute;
  inset: 0;
  content: "";
  opacity: 0.26;
  background:
    repeating-linear-gradient(0deg, transparent 0 0.07em, rgba(46, 68, 65, 0.28) 0.085em 0.115em, transparent 0.14em 0.2em),
    linear-gradient(90deg, rgba(93, 224, 214, 0.14), transparent 24% 74%, rgba(235, 93, 113, 0.12));
  mix-blend-mode: multiply;
}

.signal-cell:nth-child(3n + 2) .signal-placeholder {
  background-position: 0 0, 0 0.04em, 0.07em 0.02em, 0.11em 0.06em;
}

.signal-cell:nth-child(3n) .signal-placeholder {
  background-position: 0 0, 0 0.09em, 0.13em 0.08em, 0.04em 0.12em;
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
  filter: url("#signal-display-texture-a") blur(0.024em) drop-shadow(0 0 0.16em rgba(237, 240, 232, 0.18));
  animation: signal-caret-blink 0.9s steps(1, end) infinite;
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
