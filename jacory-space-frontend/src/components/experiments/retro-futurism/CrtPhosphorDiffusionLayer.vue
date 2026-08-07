<template>
  <div
    class="signal-phosphor-diffusion-glyphs text-left font-sans text-lg font-semibold leading-relaxed tracking-normal sm:text-xl md:text-3xl"
    aria-hidden="true"
  >
    <svg class="signal-filter-definitions" aria-hidden="true" focusable="false">
      <defs>
        <filter id="signal-phosphor-diffusion-small" x="-4%" y="-8%" width="108%" height="116%" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feOffset in="SourceAlpha" dx="-0.63" dy="-0.108" result="leadingOffsetAlpha" />
          <feComposite in="leadingOffsetAlpha" in2="SourceAlpha" operator="out" result="leadingResidualAlpha" />
          <feMorphology in="leadingResidualAlpha" operator="dilate" radius="0.58 0.22" result="leadingOuterBandAlpha" />
          <feComposite in="leadingOffsetAlpha" in2="SourceAlpha" operator="in" result="leadingOverlapAlpha" />
          <feMorphology in="SourceAlpha" operator="erode" radius="0.36 0.075" result="leadingCoreAlpha" />
          <feComposite in="leadingOverlapAlpha" in2="leadingCoreAlpha" operator="out" result="leadingInnerBandAlpha" />
          <feFlood flood-color="#d1d1d1" flood-opacity="0.58" result="leadingPaint" />
          <feComposite in="leadingPaint" in2="leadingOuterBandAlpha" operator="in" result="leadingOuterBand" />
          <feOffset in="SourceAlpha" dx="0.72" dy="0.108" result="trailingOffsetAlpha" />
          <feComposite in="trailingOffsetAlpha" in2="SourceAlpha" operator="out" result="trailingResidualAlpha" />
          <feMorphology in="trailingResidualAlpha" operator="dilate" radius="0.62 0.24" result="trailingOuterBandAlpha" />
          <feComposite in="trailingOffsetAlpha" in2="SourceAlpha" operator="in" result="trailingOverlapAlpha" />
          <feMorphology in="SourceAlpha" operator="erode" radius="0.4 0.08" result="trailingCoreAlpha" />
          <feComposite in="trailingOverlapAlpha" in2="trailingCoreAlpha" operator="out" result="trailingInnerBandAlpha" />
          <feTurbulence type="fractalNoise" baseFrequency="0.003 1.45" numOctaves="1" seed="167" result="phosphorScanField" />
          <feColorMatrix in="phosphorScanField" type="luminanceToAlpha" result="phosphorScanLuma" />
          <feComponentTransfer in="phosphorScanLuma" result="phosphorScanAlpha">
            <feFuncA type="table" tableValues="0.66 1" />
          </feComponentTransfer>
          <feComposite in="leadingInnerBandAlpha" in2="phosphorScanAlpha" operator="in" result="leadingScannedInnerBandAlpha" />
          <feGaussianBlur in="leadingScannedInnerBandAlpha" stdDeviation="0.1 0.035" result="leadingSoftInnerBandAlpha" />
          <feComposite in="leadingPaint" in2="leadingSoftInnerBandAlpha" operator="in" result="leadingInnerBand" />
          <feFlood flood-color="#8e8e8e" flood-opacity="0.50" result="trailingPaint" />
          <feComposite in="trailingPaint" in2="trailingOuterBandAlpha" operator="in" result="trailingOuterBand" />
          <feComposite in="trailingInnerBandAlpha" in2="phosphorScanAlpha" operator="in" result="trailingScannedInnerBandAlpha" />
          <feGaussianBlur in="trailingScannedInnerBandAlpha" stdDeviation="0.1 0.035" result="trailingSoftInnerBandAlpha" />
          <feComposite in="trailingPaint" in2="trailingSoftInnerBandAlpha" operator="in" result="trailingInnerBand" />
          <feMerge>
            <feMergeNode in="leadingOuterBand" />
            <feMergeNode in="leadingInnerBand" />
            <feMergeNode in="trailingOuterBand" />
            <feMergeNode in="trailingInnerBand" />
          </feMerge>
        </filter>
        <filter id="signal-phosphor-diffusion-medium" x="-4%" y="-8%" width="108%" height="116%" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feOffset in="SourceAlpha" dx="-0.7" dy="-0.12" result="leadingOffsetAlpha" />
          <feComposite in="leadingOffsetAlpha" in2="SourceAlpha" operator="out" result="leadingResidualAlpha" />
          <feMorphology in="leadingResidualAlpha" operator="dilate" radius="0.64 0.24" result="leadingOuterBandAlpha" />
          <feComposite in="leadingOffsetAlpha" in2="SourceAlpha" operator="in" result="leadingOverlapAlpha" />
          <feMorphology in="SourceAlpha" operator="erode" radius="0.4 0.085" result="leadingCoreAlpha" />
          <feComposite in="leadingOverlapAlpha" in2="leadingCoreAlpha" operator="out" result="leadingInnerBandAlpha" />
          <feFlood flood-color="#d1d1d1" flood-opacity="0.58" result="leadingPaint" />
          <feComposite in="leadingPaint" in2="leadingOuterBandAlpha" operator="in" result="leadingOuterBand" />
          <feOffset in="SourceAlpha" dx="0.8" dy="0.12" result="trailingOffsetAlpha" />
          <feComposite in="trailingOffsetAlpha" in2="SourceAlpha" operator="out" result="trailingResidualAlpha" />
          <feMorphology in="trailingResidualAlpha" operator="dilate" radius="0.68 0.26" result="trailingOuterBandAlpha" />
          <feComposite in="trailingOffsetAlpha" in2="SourceAlpha" operator="in" result="trailingOverlapAlpha" />
          <feMorphology in="SourceAlpha" operator="erode" radius="0.44 0.095" result="trailingCoreAlpha" />
          <feComposite in="trailingOverlapAlpha" in2="trailingCoreAlpha" operator="out" result="trailingInnerBandAlpha" />
          <feTurbulence type="fractalNoise" baseFrequency="0.003 1.45" numOctaves="1" seed="167" result="phosphorScanField" />
          <feColorMatrix in="phosphorScanField" type="luminanceToAlpha" result="phosphorScanLuma" />
          <feComponentTransfer in="phosphorScanLuma" result="phosphorScanAlpha">
            <feFuncA type="table" tableValues="0.66 1" />
          </feComponentTransfer>
          <feComposite in="leadingInnerBandAlpha" in2="phosphorScanAlpha" operator="in" result="leadingScannedInnerBandAlpha" />
          <feGaussianBlur in="leadingScannedInnerBandAlpha" stdDeviation="0.11 0.04" result="leadingSoftInnerBandAlpha" />
          <feComposite in="leadingPaint" in2="leadingSoftInnerBandAlpha" operator="in" result="leadingInnerBand" />
          <feFlood flood-color="#8e8e8e" flood-opacity="0.50" result="trailingPaint" />
          <feComposite in="trailingPaint" in2="trailingOuterBandAlpha" operator="in" result="trailingOuterBand" />
          <feComposite in="trailingInnerBandAlpha" in2="phosphorScanAlpha" operator="in" result="trailingScannedInnerBandAlpha" />
          <feGaussianBlur in="trailingScannedInnerBandAlpha" stdDeviation="0.11 0.04" result="trailingSoftInnerBandAlpha" />
          <feComposite in="trailingPaint" in2="trailingSoftInnerBandAlpha" operator="in" result="trailingInnerBand" />
          <feMerge>
            <feMergeNode in="leadingOuterBand" />
            <feMergeNode in="leadingInnerBand" />
            <feMergeNode in="trailingOuterBand" />
            <feMergeNode in="trailingInnerBand" />
          </feMerge>
        </filter>
        <filter id="signal-phosphor-diffusion-large" x="-4%" y="-8%" width="108%" height="116%" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feOffset in="SourceAlpha" dx="-1.05" dy="-0.18" result="leadingOffsetAlpha" />
          <feComposite in="leadingOffsetAlpha" in2="SourceAlpha" operator="out" result="leadingResidualAlpha" />
          <feMorphology in="leadingResidualAlpha" operator="dilate" radius="0.90 0.34" result="leadingOuterBandAlpha" />
          <feComposite in="leadingOffsetAlpha" in2="SourceAlpha" operator="in" result="leadingOverlapAlpha" />
          <feMorphology in="SourceAlpha" operator="erode" radius="0.6 0.13" result="leadingCoreAlpha" />
          <feComposite in="leadingOverlapAlpha" in2="leadingCoreAlpha" operator="out" result="leadingInnerBandAlpha" />
          <feFlood flood-color="#d1d1d1" flood-opacity="0.58" result="leadingPaint" />
          <feComposite in="leadingPaint" in2="leadingOuterBandAlpha" operator="in" result="leadingOuterBand" />
          <feOffset in="SourceAlpha" dx="1.2" dy="0.18" result="trailingOffsetAlpha" />
          <feComposite in="trailingOffsetAlpha" in2="SourceAlpha" operator="out" result="trailingResidualAlpha" />
          <feMorphology in="trailingResidualAlpha" operator="dilate" radius="0.96 0.36" result="trailingOuterBandAlpha" />
          <feComposite in="trailingOffsetAlpha" in2="SourceAlpha" operator="in" result="trailingOverlapAlpha" />
          <feMorphology in="SourceAlpha" operator="erode" radius="0.66 0.14" result="trailingCoreAlpha" />
          <feComposite in="trailingOverlapAlpha" in2="trailingCoreAlpha" operator="out" result="trailingInnerBandAlpha" />
          <feTurbulence type="fractalNoise" baseFrequency="0.003 1.45" numOctaves="1" seed="167" result="phosphorScanField" />
          <feColorMatrix in="phosphorScanField" type="luminanceToAlpha" result="phosphorScanLuma" />
          <feComponentTransfer in="phosphorScanLuma" result="phosphorScanAlpha">
            <feFuncA type="table" tableValues="0.66 1" />
          </feComponentTransfer>
          <feComposite in="leadingInnerBandAlpha" in2="phosphorScanAlpha" operator="in" result="leadingScannedInnerBandAlpha" />
          <feGaussianBlur in="leadingScannedInnerBandAlpha" stdDeviation="0.16 0.055" result="leadingSoftInnerBandAlpha" />
          <feComposite in="leadingPaint" in2="leadingSoftInnerBandAlpha" operator="in" result="leadingInnerBand" />
          <feFlood flood-color="#8e8e8e" flood-opacity="0.50" result="trailingPaint" />
          <feComposite in="trailingPaint" in2="trailingOuterBandAlpha" operator="in" result="trailingOuterBand" />
          <feComposite in="trailingInnerBandAlpha" in2="phosphorScanAlpha" operator="in" result="trailingScannedInnerBandAlpha" />
          <feGaussianBlur in="trailingScannedInnerBandAlpha" stdDeviation="0.16 0.055" result="trailingSoftInnerBandAlpha" />
          <feComposite in="trailingPaint" in2="trailingSoftInnerBandAlpha" operator="in" result="trailingInnerBand" />
          <feMerge>
            <feMergeNode in="leadingOuterBand" />
            <feMergeNode in="leadingInnerBand" />
            <feMergeNode in="trailingOuterBand" />
            <feMergeNode in="trailingInnerBand" />
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
            class="signal-phosphor-cell"
            :class="{ 'is-chinese-cell': isChineseCharacter(character.value) }"
          >
            <span
              v-if="character.index < revealedCount"
              class="signal-phosphor-char"
              :class="{ 'is-chinese': isChineseCharacter(character.value) }"
            >{{ character.value }}</span>
            <span v-else-if="character.index === revealedCount" class="signal-phosphor-placeholder is-active">
              <span class="signal-phosphor-caret" />
            </span>
            <span v-else class="signal-phosphor-placeholder" />
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
  isLineStarted: { type: Function, required: true },
  isChineseCharacter: { type: Function, required: true },
})
</script>

<style scoped>
.signal-phosphor-diffusion-glyphs {
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
  z-index: 1;
  overflow: visible;
  pointer-events: none;
  mix-blend-mode: normal;
  filter: url("#signal-phosphor-diffusion-small");
}

.signal-filter-definitions {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

@media (min-width: 640px) {
  .signal-phosphor-diffusion-glyphs {
    filter: url("#signal-phosphor-diffusion-medium");
  }
}

@media (min-width: 768px) {
  .signal-phosphor-diffusion-glyphs {
    filter: url("#signal-phosphor-diffusion-large");
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

.signal-phosphor-cell {
  position: relative;
  display: inline-block;
  width: 1em;
  height: 1.3em;
  line-height: 1.3em;
  vertical-align: top;
}

.signal-phosphor-cell + .signal-phosphor-cell {
  margin-left: 0.22em;
}

.signal-phosphor-cell.is-chinese-cell + .signal-phosphor-cell {
  margin-left: 0.3em;
}

.signal-phosphor-cell.is-space {
  width: 0.5em;
}

.signal-phosphor-char,
.signal-phosphor-placeholder,
.signal-phosphor-caret {
  position: relative;
  display: block;
  color: #fff;
  background: #fff;
}

.signal-phosphor-char {
  height: 1.3em;
  line-height: 1.3em;
  background: none;
}

.signal-phosphor-char.is-chinese {
  font-family: "Source Han Sans SC", sans-serif;
  font-weight: 400;
}

.signal-phosphor-placeholder {
  width: 0.9em;
  height: 0.98em;
  margin-top: 0.16em;
  border-radius: 0.12em;
}

.signal-phosphor-caret {
  width: 0.9em;
  height: 0.14em;
  align-self: flex-end;
  margin-bottom: 0.16em;
}

.signal-phosphor-placeholder.is-active {
  overflow: visible;
}

.signal-phosphor-placeholder.is-active .signal-phosphor-caret {
  position: absolute;
  right: 0;
  bottom: -0.16em;
  left: 0;
  width: 100%;
  margin-bottom: 0;
}
</style>
