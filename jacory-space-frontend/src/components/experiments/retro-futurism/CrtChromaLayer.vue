<template>
  <div class="signal-chroma-glyphs" aria-hidden="true" />
</template>

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
  z-index: 0;
  pointer-events: none;
}
</style>
