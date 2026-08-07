<template>
  <div
    ref="scanRoot"
    class="signal-chroma-glyphs text-left font-sans text-lg font-semibold leading-relaxed tracking-normal sm:text-xl md:text-3xl"
    aria-hidden="true"
  >
    <svg class="signal-filter-definitions" aria-hidden="true" focusable="false">
      <defs>
        <filter id="signal-chroma-shared-scan" x="-16%" y="-16%" width="132%" height="132%" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feImage :href="scanGateHref" x="0" :y="localScanPhaseY" width="1" :height="scanPitch" preserveAspectRatio="none" result="scanTile" />
          <feTile in="scanTile" result="scanField" />
          <feColorMatrix in="scanField" type="luminanceToAlpha" result="scanGate" />
          <feComposite in="SourceAlpha" in2="scanGate" operator="in" result="scannedAlpha" />

          <feOffset in="scannedAlpha" dx="-3" dy="0" result="cyanDelayedAlpha" />
          <feGaussianBlur in="cyanDelayedAlpha" stdDeviation="0.86 0" result="cyanSoftAlpha" />
          <feComposite in="cyanSoftAlpha" in2="SourceAlpha" operator="in" result="cyanInBandAlpha" />
          <feFlood flood-color="#4ae8d7" flood-opacity="0.22" result="cyanPaint" />
          <feComposite in="cyanPaint" in2="cyanInBandAlpha" operator="in" result="cyanChroma" />

          <feOffset in="scannedAlpha" dx="3.4" dy="0" result="redDelayedAlpha" />
          <feGaussianBlur in="redDelayedAlpha" stdDeviation="0.96 0" result="redSoftAlpha" />
          <feComposite in="redSoftAlpha" in2="SourceAlpha" operator="in" result="redInBandAlpha" />
          <feFlood flood-color="#f4576f" flood-opacity="0.20" result="redPaint" />
          <feComposite in="redPaint" in2="redInBandAlpha" operator="in" result="redChroma" />

          <feMerge>
            <feMergeNode in="cyanChroma" />
            <feMergeNode in="redChroma" />
          </feMerge>
        </filter>
      </defs>
    </svg>

    <div v-for="(paragraph, paragraphIndex) in textLayout" :key="paragraphIndex" class="signal-paragraph">
      <div v-for="(line, lineIndex) in paragraph" :key="lineIndex" class="signal-line">
        <template v-if="isLineStarted(line)">
          <span
            v-for="character in line.characters"
            :key="character.index"
            class="signal-chroma-cell"
            :class="{ 'is-chinese-cell': isChineseCharacter(character.value) }"
          >
            <span
              v-if="character.index < revealedCount"
              class="signal-chroma-char"
              :class="{ 'is-chinese': isChineseCharacter(character.value) }"
            >{{ character.value }}</span>
            <span v-else-if="character.index === revealedCount && revealedCount < characters.length" class="signal-chroma-placeholder is-active">
              <span class="signal-chroma-caret" />
            </span>
            <span v-else class="signal-chroma-placeholder" />
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
  characters: { type: Array, required: true },
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
.signal-chroma-glyphs {
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
  filter: url("#signal-chroma-shared-scan");
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

.signal-chroma-cell {
  position: relative;
  display: inline-block;
  width: 1em;
  height: 1.3em;
  line-height: 1.3em;
  vertical-align: top;
}

.signal-chroma-cell + .signal-chroma-cell {
  margin-left: 0.22em;
}

.signal-chroma-cell.is-chinese-cell + .signal-chroma-cell {
  margin-left: 0.3em;
}

.signal-chroma-cell.is-space {
  width: 0.5em;
}

.signal-chroma-char,
.signal-chroma-placeholder,
.signal-chroma-caret {
  position: relative;
  display: block;
  color: #fff;
  background: #fff;
}

.signal-chroma-char {
  height: 1.3em;
  line-height: 1.3em;
  background: none;
}

.signal-chroma-char.is-chinese {
  font-family: "Source Han Sans SC", sans-serif;
  font-weight: 400;
}

.signal-chroma-placeholder {
  width: 0.9em;
  height: 0.98em;
  margin-top: 0.16em;
  border-radius: 0.12em;
}

.signal-chroma-caret {
  width: 0.9em;
  height: 0.14em;
  align-self: flex-end;
  margin-bottom: 0.16em;
}

.signal-chroma-placeholder.is-active {
  overflow: visible;
}

.signal-chroma-placeholder.is-active .signal-chroma-caret {
  position: absolute;
  right: 0;
  bottom: -0.16em;
  left: 0;
  width: 100%;
  margin-bottom: 0;
}
</style>
