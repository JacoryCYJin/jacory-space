<template>
  <div class="footer-reveal" :style="revealStyle">
    <div class="footer-reveal__content">
      <slot />
      <div class="footer-reveal__extension" aria-hidden="true" />
    </div>
    <div class="footer-reveal__panel">
      <div class="footer-reveal__header" aria-hidden="true" />
      <Footer ref="footerRef" />
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import Footer from './Footer.vue'

const footerRef = ref(null)
const footerBodyHeight = ref(0)
let footerResizeObserver
let measureFrame

const revealStyle = computed(() => (
  footerBodyHeight.value > 0
    ? { '--footer-reveal-body-height': `${footerBodyHeight.value}px` }
    : undefined
))

function footerElement() {
  return footerRef.value?.$el ?? footerRef.value
}

function measureFooterBody() {
  const footer = footerElement()
  if (!footer) return
  footerBodyHeight.value = Math.ceil(footer.getBoundingClientRect().height)
}

function scheduleFooterMeasure() {
  window.cancelAnimationFrame(measureFrame)
  measureFrame = window.requestAnimationFrame(measureFooterBody)
}

onMounted(async () => {
  await nextTick()
  scheduleFooterMeasure()

  const footer = footerElement()
  if (typeof ResizeObserver !== 'undefined' && footer) {
    footerResizeObserver = new ResizeObserver(scheduleFooterMeasure)
    footerResizeObserver.observe(footer)
  }

  document.fonts?.ready.then(scheduleFooterMeasure)
  window.addEventListener('resize', scheduleFooterMeasure)
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(measureFrame)
  window.removeEventListener('resize', scheduleFooterMeasure)
  footerResizeObserver?.disconnect()
})
</script>

<style scoped>
.footer-reveal {
  --footer-reveal-body-height: 22rem;
  --footer-reveal-overlap-height: clamp(1.25rem, 2.25vw, 3.5rem);
  --footer-reveal-notch-width: clamp(2rem, 4vw, 5rem);
  position: relative;
  isolation: isolate;
  padding-bottom: var(--footer-reveal-body-height);
}

.footer-reveal__content {
  position: relative;
  z-index: 1;
}

.footer-reveal__extension {
  height: var(--footer-reveal-overlap-height);
  background: var(--background);
  clip-path: polygon(
    0 0,
    100% 0,
    calc(100% - var(--footer-reveal-notch-width)) 100%,
    var(--footer-reveal-notch-width) 100%
  );
}

.footer-reveal__panel {
  position: fixed;
  inset: auto 0 0;
  z-index: 0;
  width: 100%;
  margin: 0;
  background: var(--ink);
}

.footer-reveal__header {
  height: var(--footer-reveal-overlap-height);
  background: var(--ink);
}

@media (min-width: 768px) {
  .footer-reveal {
    --footer-reveal-body-height: 20rem;
  }
}

</style>
