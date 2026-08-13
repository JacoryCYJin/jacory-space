<template>
  <div
    ref="loaderRoot"
    class="fixed inset-0 z-[80] grid min-h-screen place-items-center overflow-hidden bg-background"
    role="status"
    aria-label="Loading Jacory Space"
  >
    <div
      class="home-loading-identity__scene text-foreground"
      aria-hidden="true"
      v-html="identityArtwork"
    />

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
import identityArtwork from '../assets/home-loading-identity.svg?raw'

const emit = defineEmits(['complete'])
const loaderRoot = ref(null)
const counter = ref('000')

const COUNTER_DURATION = 2.4
const EXIT_DURATION = 0.72

let loaderMedia
let identityTimeline
let counterTween
let exitTween
let exitFrame
let holdTimer
let cancelPageLoadWait
let isUnmounted = false
let pageReady = false
let counterReady = false
let identityReady = false
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
  if (isUnmounted || completed || !pageReady || !counterReady || !identityReady) return

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

  loaderMedia = gsap.matchMedia()
  loaderMedia.add(
    {
      reduceMotion: '(prefers-reduced-motion: reduce)',
      allowMotion: '(prefers-reduced-motion: no-preference)'
    },
    (context) => {
      if (context.conditions.reduceMotion) {
        updateCounter(100)
        pageReady = true
        counterReady = true
        identityReady = true
        gsap.set(root, { display: 'none' })
        exitFrame = window.requestAnimationFrame(() => emit('complete'))
        return
      }

      const iFull = root.querySelector('.identity-i-full')
      const iHalves = root.querySelector('.identity-i-halves')
      const iLeft = root.querySelector('.identity-i-left')
      const iRight = root.querySelector('.identity-i-right')
      const mFull = root.querySelector('.identity-m-full')
      const mHalves = root.querySelector('.identity-m-halves')
      const mLeft = root.querySelector('.identity-m-left')
      const mRight = root.querySelector('.identity-m-right')
      const name = root.querySelector('.identity-name')

      gsap.set([iFull, iHalves, mFull, mHalves, name], { autoAlpha: 0 })
      gsap.set([iLeft, iRight, mLeft, mRight], { x: 0 })
      gsap.set([iFull, mFull, name], { y: 12, transformOrigin: 'center center' })

      identityTimeline = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          identityReady = true
          completeLoading()
        }
      })

      identityTimeline
        .addLabel('iIn', 0)
        .to(iFull, { autoAlpha: 1, y: 0, duration: 0.68 }, 'iIn')
        .addLabel('iSplit', '+=0.28')
        .set(iFull, { autoAlpha: 0 }, 'iSplit')
        .set(iHalves, { autoAlpha: 1 }, 'iSplit')
        .to(iLeft, { x: -180, duration: 0.78, ease: 'power3.inOut' }, 'iSplit')
        .to(iRight, { x: 180, duration: 0.78, ease: 'power3.inOut' }, 'iSplit')
        .addLabel('mIn', '>-0.1')
        .to(mFull, { autoAlpha: 1, y: 0, duration: 0.64 }, 'mIn')
        .addLabel('mSplit', '+=0.26')
        .set(mFull, { autoAlpha: 0 }, 'mSplit')
        .set(mHalves, { autoAlpha: 1 }, 'mSplit')
        .to(iLeft, { x: -800, duration: 0.82, ease: 'power3.inOut' }, 'mSplit')
        .to(iRight, { x: 800, duration: 0.82, ease: 'power3.inOut' }, 'mSplit')
        .to(mLeft, { x: -640, duration: 0.82, ease: 'power3.inOut' }, 'mSplit')
        .to(mRight, { x: 640, duration: 0.82, ease: 'power3.inOut' }, 'mSplit')
        .addLabel('nameIn', '>-0.12')
        .to(name, { autoAlpha: 1, y: 0, duration: 0.66 }, 'nameIn')

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

      identityTimeline.play(0)

      void waitForPageReady().then(() => {
        if (isUnmounted) return
        pageReady = true
        completeLoading()
      })
    },
    root
  )
})

onBeforeUnmount(() => {
  isUnmounted = true
  cancelPageLoadWait?.()
  if (holdTimer !== undefined) window.clearTimeout(holdTimer)
  if (exitFrame !== undefined) window.cancelAnimationFrame(exitFrame)
  identityTimeline?.kill()
  counterTween?.kill()
  exitTween?.kill()
  loaderMedia?.revert()
})
</script>

<style scoped>
.home-loading-identity__scene {
  width: min(96vw, 110rem);
}

.home-loading-identity__scene :deep(.home-loading-identity__svg) {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}
</style>
