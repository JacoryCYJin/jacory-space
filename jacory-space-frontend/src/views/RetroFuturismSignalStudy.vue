<template>
  <main class="signal-study relative isolate min-h-screen overflow-hidden bg-[#030405] text-[#edf0e8]">
    <div class="signal-stage relative min-h-screen" aria-labelledby="signal-caption">
      <div class="signal-letterbox signal-letterbox-top" aria-hidden="true" />
      <div class="signal-letterbox signal-letterbox-bottom" aria-hidden="true" />
      <div class="signal-noise" aria-hidden="true" />
      <div class="signal-vignette" aria-hidden="true" />

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
                    'is-active': character.index === revealedCount && revealedCount < characters.length,
                    'is-revealed': character.index < revealedCount,
                    'is-placeholder': character.index > revealedCount,
                  }"
                >
                  <span v-if="character.index < revealedCount" class="signal-char" :data-char="character.value">{{ character.value }}</span>
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

const { t } = useI18n()
const testParagraphs = [
  [
    '企業のネットが星を覆い、電子や光が駆け巡っても',
    '国家や民族が消えてなくなる程',
    '情報化されていない近未来',
  ],
  [
    'アジアの一角に横たわる',
    '奇妙な企業集合体国・・・・・・',
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

.signal-cell.is-space {
  width: 0.5em;
}

.signal-char,
.signal-placeholder,
.signal-caret {
  position: relative;
  display: block;
  filter: blur(0.028em);
}

.signal-char {
  height: 1.3em;
  line-height: 1.3em;
  color: var(--signal-paper);
  text-shadow:
    -0.06em 0 rgba(93, 224, 214, 0.64),
    0.06em 0 rgba(235, 93, 113, 0.56),
    0 0 0.48em rgba(237, 240, 232, 0.27);
}

.signal-placeholder {
  width: 0.9em;
  height: 0.98em;
  margin-top: 0.16em;
  overflow: hidden;
  border-radius: 0.12em;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(218, 226, 220, 0.88)),
    repeating-linear-gradient(0deg, rgba(43, 47, 47, 0.18) 0, rgba(43, 47, 47, 0.18) 0.06em, transparent 0.06em, transparent 0.16em);
  background-blend-mode: normal, multiply;
  box-shadow:
    -0.06em 0 rgba(93, 224, 214, 0.58),
    0.06em 0 rgba(235, 93, 113, 0.5),
    0 0 0.5em rgba(237, 240, 232, 0.29);
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
  opacity: 0.32;
  background:
    radial-gradient(circle at 22% 30%, rgba(255, 255, 255, 0.85) 0 0.04em, transparent 0.07em),
    radial-gradient(circle at 78% 66%, rgba(72, 88, 85, 0.5) 0 0.035em, transparent 0.07em);
  mix-blend-mode: multiply;
}

.signal-placeholder::after {
  position: absolute;
  inset: 0;
  content: "";
  opacity: 0.2;
  background: repeating-linear-gradient(90deg, transparent 0, transparent 0.18em, rgba(93, 224, 214, 0.35) 0.2em, transparent 0.23em);
  mix-blend-mode: multiply;
}

.signal-caret {
  width: 0.9em;
  height: 0.14em;
  align-self: flex-end;
  margin-bottom: 0.16em;
  background: var(--signal-paper);
  box-shadow:
    -0.06em 0 rgba(93, 224, 214, 0.48),
    0.06em 0 rgba(235, 93, 113, 0.42),
    0 0 0.38em rgba(237, 240, 232, 0.24);
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
