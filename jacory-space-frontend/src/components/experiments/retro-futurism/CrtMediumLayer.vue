<template>
  <div
    ref="scanRoot"
    class="signal-medium-glyphs text-left font-sans text-lg font-semibold leading-relaxed tracking-normal sm:text-xl md:text-3xl"
    aria-hidden="true"
  >
    <svg class="signal-filter-definitions" aria-hidden="true" focusable="false">
      <defs>
        <filter id="signal-shared-medium-small" x="-2%" y="-3%" width="104%" height="106%" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.42 0.56" numOctaves="1" seed="101" result="grainField" />
          <feComponentTransfer in="grainField" result="neutralMediumField">
            <feFuncR type="linear" slope="0.16" intercept="0.42" />
            <feFuncG type="linear" slope="0.16" intercept="0.42" />
            <feFuncB type="linear" slope="0.16" intercept="0.42" />
          </feComponentTransfer>
          <feImage :href="scanGateHref" x="0" :y="localScanPhaseY" width="1" :height="scanPitch" preserveAspectRatio="none" result="scanTile" />
          <feTile in="scanTile" result="scanField" />
          <feComposite in="neutralMediumField" in2="scanField" operator="arithmetic" k1="0" k2="1" k3="0.032" k4="-0.020" result="scanAlignedMediumField" />
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.026" numOctaves="1" seed="139" result="illuminationField" />
          <feColorMatrix in="illuminationField" type="luminanceToAlpha" result="illuminationLuma" />
          <feComponentTransfer in="illuminationLuma" result="modulatedTextAlpha">
            <feFuncA type="table" tableValues="0.88 1" />
          </feComponentTransfer>
          <feMorphology in="SourceAlpha" operator="erode" radius="0.52 0.22" result="erodedContentAlpha" />
          <feGaussianBlur in="erodedContentAlpha" stdDeviation="0.34 0.14" result="softenedInteriorAlpha" />
          <feComposite in="softenedInteriorAlpha" in2="SourceAlpha" operator="in" result="interiorContentAlpha" />
          <feComposite in="interiorContentAlpha" in2="modulatedTextAlpha" operator="in" result="contentAlpha" />
          <feComposite in="scanAlignedMediumField" in2="contentAlpha" operator="in" />
        </filter>
        <filter id="signal-shared-medium-medium" x="-2%" y="-3%" width="104%" height="106%" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.42 0.56" numOctaves="1" seed="101" result="grainField" />
          <feComponentTransfer in="grainField" result="neutralMediumField">
            <feFuncR type="linear" slope="0.16" intercept="0.42" />
            <feFuncG type="linear" slope="0.16" intercept="0.42" />
            <feFuncB type="linear" slope="0.16" intercept="0.42" />
          </feComponentTransfer>
          <feImage :href="scanGateHref" x="0" :y="localScanPhaseY" width="1" :height="scanPitch" preserveAspectRatio="none" result="scanTile" />
          <feTile in="scanTile" result="scanField" />
          <feComposite in="neutralMediumField" in2="scanField" operator="arithmetic" k1="0" k2="1" k3="0.032" k4="-0.020" result="scanAlignedMediumField" />
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.026" numOctaves="1" seed="139" result="illuminationField" />
          <feColorMatrix in="illuminationField" type="luminanceToAlpha" result="illuminationLuma" />
          <feComponentTransfer in="illuminationLuma" result="modulatedTextAlpha">
            <feFuncA type="table" tableValues="0.88 1" />
          </feComponentTransfer>
          <feMorphology in="SourceAlpha" operator="erode" radius="0.58 0.24" result="erodedContentAlpha" />
          <feGaussianBlur in="erodedContentAlpha" stdDeviation="0.38 0.16" result="softenedInteriorAlpha" />
          <feComposite in="softenedInteriorAlpha" in2="SourceAlpha" operator="in" result="interiorContentAlpha" />
          <feComposite in="interiorContentAlpha" in2="modulatedTextAlpha" operator="in" result="contentAlpha" />
          <feComposite in="scanAlignedMediumField" in2="contentAlpha" operator="in" />
        </filter>
        <filter id="signal-shared-medium-large" x="-2%" y="-3%" width="104%" height="106%" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.42 0.56" numOctaves="1" seed="101" result="grainField" />
          <feComponentTransfer in="grainField" result="neutralMediumField">
            <feFuncR type="linear" slope="0.16" intercept="0.42" />
            <feFuncG type="linear" slope="0.16" intercept="0.42" />
            <feFuncB type="linear" slope="0.16" intercept="0.42" />
          </feComponentTransfer>
          <feImage :href="scanGateHref" x="0" :y="localScanPhaseY" width="1" :height="scanPitch" preserveAspectRatio="none" result="scanTile" />
          <feTile in="scanTile" result="scanField" />
          <feComposite in="neutralMediumField" in2="scanField" operator="arithmetic" k1="0" k2="1" k3="0.032" k4="-0.020" result="scanAlignedMediumField" />
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.026" numOctaves="1" seed="139" result="illuminationField" />
          <feColorMatrix in="illuminationField" type="luminanceToAlpha" result="illuminationLuma" />
          <feComponentTransfer in="illuminationLuma" result="modulatedTextAlpha">
            <feFuncA type="table" tableValues="0.88 1" />
          </feComponentTransfer>
          <feMorphology in="SourceAlpha" operator="erode" radius="0.86 0.36" result="erodedContentAlpha" />
          <feGaussianBlur in="erodedContentAlpha" stdDeviation="0.56 0.24" result="softenedInteriorAlpha" />
          <feComposite in="softenedInteriorAlpha" in2="SourceAlpha" operator="in" result="interiorContentAlpha" />
          <feComposite in="interiorContentAlpha" in2="modulatedTextAlpha" operator="in" result="contentAlpha" />
          <feComposite in="scanAlignedMediumField" in2="contentAlpha" operator="in" />
        </filter>
      </defs>
    </svg>

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
</template>

<script setup>
import { ref } from 'vue'

const scanRoot = ref(null)

defineProps({
  textLayout: { type: Array, required: true },
  revealedCount: { type: Number, required: true },
  isLineStarted: { type: Function, required: true },
  isChineseCharacter: { type: Function, required: true },
  scanGateHref: { type: String, required: true },
  scanPitch: { type: Number, required: true },
  localScanPhaseY: { type: Number, required: true },
})

defineExpose({ scanRoot })
</script>

<style scoped>
.signal-medium-glyphs {
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
  z-index: 3;
  pointer-events: none;
  opacity: 0.68;
  filter: url("#signal-shared-medium-small");
  mix-blend-mode: soft-light;
}

.signal-filter-definitions {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

@media (min-width: 640px) {
  .signal-medium-glyphs {
    filter: url("#signal-shared-medium-medium");
  }
}

@media (min-width: 768px) {
  .signal-medium-glyphs {
    filter: url("#signal-shared-medium-large");
  }
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

.signal-medium-cell {
  position: relative;
  display: inline-block;
  width: 1em;
  height: 1.3em;
  line-height: 1.3em;
  vertical-align: top;
}

.signal-medium-cell + .signal-medium-cell {
  margin-left: 0.22em;
}

.signal-medium-cell.is-chinese-cell + .signal-medium-cell {
  margin-left: 0.3em;
}

.signal-medium-cell.is-space {
  width: 0.5em;
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

.signal-medium-placeholder {
  width: 0.9em;
  height: 0.98em;
  margin-top: 0.16em;
  border-radius: 0.12em;
}

.signal-medium-caret {
  width: 0.9em;
  height: 0.14em;
  align-self: flex-end;
  margin-bottom: 0.16em;
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
</style>
