<template>
  <div
    id="signal-caption"
    class="signal-luma-glyphs text-left font-sans text-lg font-semibold leading-relaxed tracking-normal sm:text-xl md:text-3xl"
    aria-hidden="true"
  >
    <svg class="signal-filter-definitions" aria-hidden="true" focusable="false">
      <defs>
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
      </defs>
    </svg>

    <div v-for="(paragraph, paragraphIndex) in textLayout" :key="paragraphIndex" class="signal-paragraph">
      <div v-for="(line, lineIndex) in paragraph" :key="lineIndex" class="signal-line">
        <template v-if="isLineStarted(line)">
          <span
            v-for="character in line.characters"
            :key="character.index"
            class="signal-luma-cell"
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
              class="signal-luma-char"
              :class="{ 'is-chinese': isChineseCharacter(character.value) }"
            >{{ character.value }}</span>
            <span v-else-if="character.index === revealedCount" class="signal-luma-placeholder is-active">
              <span class="signal-luma-caret" aria-hidden="true" />
            </span>
            <span v-else class="signal-luma-placeholder" />
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  textLayout: { type: Array, required: true },
  revealedCount: { type: Number, required: true },
  characters: { type: Array, required: true },
  isLineStarted: { type: Function, required: true },
  isChineseCharacter: { type: Function, required: true },
  signalCellStyle: { type: Function, required: true },
  signalCellVariant: { type: Function, required: true },
})
</script>

<style scoped>
.signal-luma-glyphs {
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
  z-index: 2;
}

.signal-filter-definitions {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
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

.signal-luma-cell {
  position: relative;
  display: inline-block;
  width: 1em;
  height: 1.3em;
  line-height: 1.3em;
  vertical-align: top;
}

.signal-luma-cell + .signal-luma-cell {
  margin-left: 0.22em;
}

.signal-luma-cell.is-chinese-cell + .signal-luma-cell {
  margin-left: 0.3em;
}

.signal-luma-cell.is-space {
  width: 0.5em;
}

.signal-luma-char,
.signal-luma-placeholder,
.signal-luma-caret {
  position: relative;
  display: block;
}

.signal-luma-char {
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

.signal-luma-cell.signal-variant-a .signal-luma-char {
  filter: url("#signal-foreground-sampling-a") blur(0.03em) drop-shadow(0 0 0.2em rgba(237, 240, 232, 0.14));
}

.signal-luma-cell.signal-variant-c .signal-luma-char {
  filter: url("#signal-foreground-sampling-c") blur(0.034em) drop-shadow(0 0 0.24em rgba(237, 240, 232, 0.16));
}

.signal-luma-char.is-chinese {
  font-family: "GNU Unifont CRT SC", sans-serif;
  font-weight: 400;
}

.signal-luma-placeholder {
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

.signal-luma-cell.signal-variant-a .signal-luma-placeholder {
  filter: url("#signal-foreground-sampling-a") blur(0.028em) drop-shadow(0 0 0.2em rgba(237, 240, 232, 0.12));
}

.signal-luma-cell.signal-variant-c .signal-luma-placeholder {
  filter: url("#signal-foreground-sampling-c") blur(0.028em) drop-shadow(0 0 0.24em rgba(237, 240, 232, 0.16));
}

.signal-space {
  display: block;
  width: 0.5em;
  height: 0.92em;
  margin-top: 0.16em;
}

.signal-luma-placeholder::before {
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

.signal-luma-caret {
  width: 0.9em;
  height: 0.14em;
  align-self: flex-end;
  margin-bottom: 0.16em;
  background: var(--signal-paper);
  box-shadow:
    0 0 0.36em rgba(237, 240, 232, 0.22);
  filter: url("#signal-foreground-sampling-b") blur(0.024em) drop-shadow(0 0 0.16em rgba(237, 240, 232, 0.16));
  animation: signal-caret-blink 0.9s steps(1, end) infinite;
}

.signal-luma-cell.signal-variant-a .signal-luma-caret {
  filter: url("#signal-foreground-sampling-a") blur(0.024em) drop-shadow(0 0 0.14em rgba(237, 240, 232, 0.14));
}

.signal-luma-cell.signal-variant-c .signal-luma-caret {
  filter: url("#signal-foreground-sampling-c") blur(0.024em) drop-shadow(0 0 0.18em rgba(237, 240, 232, 0.18));
}

.signal-luma-placeholder.is-active .signal-luma-caret {
  position: absolute;
  right: 0;
  bottom: -0.16em;
  left: 0;
  width: 100%;
  margin-bottom: 0;
}

.signal-luma-placeholder.is-active {
  overflow: visible;
}

.signal-space-active {
  position: relative;
}

.signal-space-active .signal-luma-caret {
  position: absolute;
  right: 0;
  bottom: -0.16em;
  left: 0;
  width: 100%;
  margin-bottom: 0;
}

@keyframes signal-caret-blink {
  0%, 45% { opacity: 1; }
  46%, 100% { opacity: 0.22; }
}

@media (prefers-reduced-motion: reduce) {
  .signal-luma-caret {
    animation: none;
  }
}
</style>
