<template>
  <div class="footer-reveal" :style="revealStyle">
    <div ref="contentRef" class="footer-reveal__content">
      <slot />
      <div class="footer-reveal__extension" aria-hidden="true" />
    </div>
    <div class="footer-reveal__panel">
      <div class="footer-reveal__panel-content">
        <div class="footer-reveal__gridline" aria-hidden="true" />
        <div class="footer-reveal__header" aria-hidden="true" />
        <Footer ref="footerRef" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import Footer from './Footer.vue'

const footerRef = ref(null)
const contentRef = ref(null)
const footerBodyHeight = ref(0)
const footerDividerHeight = ref(0)
const footerRevealProgress = ref(1)
const FOOTER_REVEAL_MIN_BRIGHTNESS = 0.22
const FOOTER_REVEAL_MIN_SCALE = 0.94
let footerResizeObserver
let measureFrame
let revealFrame
let motionQuery

const revealStyle = computed(() => {
  const style = {}

  if (footerBodyHeight.value > 0) {
    style['--footer-reveal-body-height'] = `${footerBodyHeight.value}px`
  }

  if (footerDividerHeight.value > 0) {
    style['--footer-reveal-divider-height'] = `${footerDividerHeight.value}px`
  }

  const brightness = FOOTER_REVEAL_MIN_BRIGHTNESS + (
    1 - FOOTER_REVEAL_MIN_BRIGHTNESS
  ) * footerRevealProgress.value
  style['--footer-reveal-panel-brightness'] = brightness.toFixed(3)

  const scale = FOOTER_REVEAL_MIN_SCALE + (
    1 - FOOTER_REVEAL_MIN_SCALE
  ) * footerRevealProgress.value
  style['--footer-reveal-panel-scale'] = scale.toFixed(3)

  return Object.keys(style).length > 0 ? style : undefined
})

function footerElement() {
  return footerRef.value?.$el ?? footerRef.value
}

function measureFooterBody() {
  const footer = footerElement()
  if (!footer) return
  footerBodyHeight.value = footer.offsetHeight

  const footerRule = footer.querySelector('.footer-rule')
  if (footerRule) {
    footerDividerHeight.value = footerRule.offsetTop
  }

  updateFooterRevealProgress()
}

function scheduleFooterMeasure() {
  window.cancelAnimationFrame(measureFrame)
  measureFrame = window.requestAnimationFrame(measureFooterBody)
}

function updateFooterRevealProgress() {
  if (!contentRef.value || !motionQuery?.matches || footerBodyHeight.value <= 0) {
    footerRevealProgress.value = 1
    return
  }

  const contentBottom = contentRef.value.getBoundingClientRect().bottom
  const revealedHeight = Math.min(
    footerBodyHeight.value,
    Math.max(0, window.innerHeight - contentBottom)
  )
  footerRevealProgress.value = revealedHeight / footerBodyHeight.value
}

function scheduleFooterRevealProgress() {
  if (revealFrame) return

  revealFrame = window.requestAnimationFrame(() => {
    revealFrame = 0
    updateFooterRevealProgress()
  })
}

onMounted(async () => {
  await nextTick()
  motionQuery = window.matchMedia('(prefers-reduced-motion: no-preference)')
  scheduleFooterMeasure()

  const footer = footerElement()
  if (typeof ResizeObserver !== 'undefined' && footer) {
    footerResizeObserver = new ResizeObserver(scheduleFooterMeasure)
    footerResizeObserver.observe(footer)
  }

  document.fonts?.ready.then(scheduleFooterMeasure)
  window.addEventListener('resize', scheduleFooterMeasure)
  window.addEventListener('scroll', scheduleFooterRevealProgress, { passive: true })
  motionQuery.addEventListener('change', scheduleFooterRevealProgress)
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(measureFrame)
  window.cancelAnimationFrame(revealFrame)
  window.removeEventListener('resize', scheduleFooterMeasure)
  window.removeEventListener('scroll', scheduleFooterRevealProgress)
  motionQuery?.removeEventListener('change', scheduleFooterRevealProgress)
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
  filter: brightness(var(--footer-reveal-panel-brightness));
}

.footer-reveal__panel-content {
  position: relative;
  transform: scale(var(--footer-reveal-panel-scale));
  transform-origin: 50% 100%;
  will-change: transform;
}

.footer-reveal__gridline {
  display: none;
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

@media (min-width: 1024px) {
  .footer-reveal__gridline {
    --footer-grid-gap: 3rem;
    position: absolute;
    inset: 0 auto auto 0;
    display: grid;
    width: 100%;
    height: var(--footer-reveal-divider-height, 0px);
    padding-inline: var(--page-gutter);
    pointer-events: none;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: var(--footer-grid-gap);
  }

  .footer-reveal__gridline::before,
  .footer-reveal__gridline::after {
    width: 1px;
    height: 100%;
    content: "";
    background: color-mix(in srgb, var(--card) 24%, transparent);
    transform: translateX(calc(var(--footer-grid-gap) / 2));
  }

  .footer-reveal__gridline::before {
    grid-column: 1;
    justify-self: end;
  }

  .footer-reveal__gridline::after {
    grid-column: 2;
    justify-self: end;
  }
}

@media (min-width: 1280px) {
  .footer-reveal__gridline {
    --footer-grid-gap: 4rem;
  }
}

</style>
