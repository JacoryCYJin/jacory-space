<template>
  <div
    ref="loaderRoot"
    class="fixed inset-0 z-[80] grid min-h-screen place-items-center overflow-hidden bg-background"
    role="status"
    aria-label="Loading Jacory Space"
  >
    <div class="flex items-center justify-center">
      <span
        ref="mark"
        aria-hidden="true"
        class="home-loading-mark relative block"
      >
        <span aria-hidden="true" class="home-loading-mark__cap home-loading-mark__cap--top bg-foreground" />
        <span aria-hidden="true" class="home-loading-mark__stem bg-foreground" />
        <span aria-hidden="true" class="home-loading-mark__cap home-loading-mark__cap--bottom bg-foreground" />
      </span>
    </div>

    <span
      aria-hidden="true"
      class="absolute bottom-8 left-1/2 -translate-x-1/2 font-sans text-3xl font-black leading-none tracking-[-0.04em] tabular-nums text-foreground"
    >
      {{ counter }}
    </span>

    <span class="sr-only" aria-live="polite">Loading {{ counter }} percent</span>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'

const emit = defineEmits(['complete'])
const loaderRoot = ref(null)
const mark = ref(null)
const counter = ref('000')

const COUNTER_DURATION = 2.4
const EXIT_DURATION = 0.72

let loaderContext
let rotationTween
let counterTween
let exitTween
let exitFrame
let holdTimer
let cancelPageLoadWait
let isUnmounted = false
let pageReady = false
let counterReady = false
let completed = false

const updateCounter = (value) => {
  counter.value = String(Math.round(value)).padStart(3, '0')
}

const waitForPageReady = () => {
  const pageLoad = document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise((resolve) => {
        const handleLoad = () => {
          cancelPageLoadWait = undefined
          resolve()
        }

        cancelPageLoadWait = () => window.removeEventListener('load', handleLoad)
        window.addEventListener('load', handleLoad, { once: true })
      })

  const fontsReady = document.fonts?.ready ?? Promise.resolve()

  return Promise.all([pageLoad, fontsReady])
}

const completeLoading = () => {
  if (isUnmounted || completed || !pageReady || !counterReady) return

  completed = true
  updateCounter(100)
  holdTimer = window.setTimeout(() => {
    if (isUnmounted) return

    exitTween = gsap.to(loaderRoot.value, {
      autoAlpha: 0,
      duration: EXIT_DURATION,
      ease: 'power3.inOut',
      pointerEvents: 'none',
      onComplete: () => emit('complete')
    })
  }, 180)
}

onMounted(() => {
  const root = loaderRoot.value
  if (!root) return

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  loaderContext = gsap.context(() => {
    if (reducedMotionQuery.matches) {
      updateCounter(100)
      pageReady = true
      counterReady = true
      gsap.set(root, { display: 'none' })
      exitFrame = window.requestAnimationFrame(() => emit('complete'))
      return
    }

    rotationTween = gsap.to(mark.value, {
      rotation: '180_cw',
      duration: 0.6,
      ease: 'none',
      repeat: -1,
      repeatDelay: 0.3,
      transformOrigin: 'center center'
    })

    const progress = { value: 0 }
    counterTween = gsap.to(progress, {
      value: 100,
      duration: COUNTER_DURATION,
      ease: 'none',
      onUpdate: () => updateCounter(progress.value),
      onComplete: () => {
        counterReady = true
        completeLoading()
      }
    })

    void waitForPageReady().then(() => {
      if (isUnmounted) return
      pageReady = true
      completeLoading()
    })
  }, root)
})

onBeforeUnmount(() => {
  isUnmounted = true
  cancelPageLoadWait?.()
  if (holdTimer !== undefined) window.clearTimeout(holdTimer)
  if (exitFrame !== undefined) window.cancelAnimationFrame(exitFrame)
  rotationTween?.kill()
  counterTween?.kill()
  exitTween?.kill()
  loaderContext?.revert()
})
</script>

<style scoped>
.home-loading-mark {
  width: clamp(5rem, 9vw, 8rem);
  height: clamp(12rem, 22vw, 20rem);
  transform-origin: center;
}

.home-loading-mark__cap,
.home-loading-mark__stem {
  position: absolute;
  left: 50%;
  display: block;
  transform: translateX(-50%);
}

.home-loading-mark__cap {
  width: 100%;
  height: clamp(1.8rem, 3vw, 2.6rem);
}

.home-loading-mark__cap--top {
  top: 0;
}

.home-loading-mark__cap--bottom {
  bottom: 0;
}

.home-loading-mark__stem {
  top: clamp(1.8rem, 3vw, 2.6rem);
  bottom: clamp(1.8rem, 3vw, 2.6rem);
  width: clamp(2rem, 3.5vw, 3rem);
}
</style>
