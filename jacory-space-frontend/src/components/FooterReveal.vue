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
  position: relative;
  height: calc(var(--footer-reveal-overlap-height) + 1px);
  margin-top: -1px;
  overflow: hidden;
  background: var(--background);
  clip-path: polygon(
    0 -1px,
    100% -1px,
    calc(100% - var(--footer-reveal-notch-width)) 100%,
    var(--footer-reveal-notch-width) 100%
  );
}

.footer-reveal__extension::after {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: "";
  opacity: 0.04;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
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
