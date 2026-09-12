<template>
  <div
    ref="loaderRoot"
    class="fixed inset-0 z-[80] grid min-h-screen place-items-center overflow-hidden bg-background"
    role="status"
    aria-label="Loading Jacory Space"
  >
    <svg
      class="home-loading-identity__geometry home-loading-identity__geometry--desktop"
      viewBox="0 0 2048 1261"
      aria-hidden="true"
    >
      <g class="home-loading-identity__stroke home-loading-identity__dividers">
        <line x1="1264.83" y1="0" x2="1264.83" y2="1261" />
        <line x1="1264.83" y1="779.341" x2="2044.17" y2="779.341" />
        <line x1="1562.511" y1="779.341" x2="1562.511" y2="1261" />
        <line x1="1264.83" y1="963.318" x2="1562.511" y2="963.318" />
        <line x1="1448.807" y1="779.341" x2="1448.807" y2="963.318" />
        <line x1="1448.807" y1="893.045" x2="1562.511" y2="893.045" />
        <line x1="1492.238" y1="893.045" x2="1492.238" y2="963.318" />
        <line x1="1448.807" y1="919.887" x2="1492.238" y2="919.887" />
      </g>

      <g class="home-loading-identity__stroke home-loading-identity__spiral">
        <path d="M 3.83 1261 A 1261 1261 0 0 1 1264.83 0" />
        <path d="M 1264.83 0 A 779.341 779.341 0 0 1 2044.17 779.341" />
        <path d="M 2044.17 779.341 A 481.659 481.659 0 0 1 1562.511 1261" />
        <path d="M 1562.511 1261 A 297.682 297.682 0 0 1 1264.83 963.318" />
        <path d="M 1264.83 963.318 A 183.977 183.977 0 0 1 1448.807 779.341" />
        <path d="M 1448.807 779.341 A 113.704 113.704 0 0 1 1562.511 893.045" />
        <path d="M 1562.511 893.045 A 70.273 70.273 0 0 1 1492.238 963.318" />
        <path d="M 1492.238 963.318 A 43.431 43.431 0 0 1 1448.807 919.887" />
      </g>
    </svg>

    <svg
      class="home-loading-identity__geometry home-loading-identity__geometry--mobile"
      viewBox="0 0 430 932"
      aria-hidden="true"
    >
      <g class="home-loading-identity__stroke home-loading-identity__dividers">
        <line x1="-73.004" y1="576.008" x2="503.004" y2="576.008" />
        <line x1="147.012" y1="576.008" x2="147.012" y2="932" />
        <line x1="-73.004" y1="711.985" x2="147.012" y2="711.985" />
        <line x1="62.973" y1="576.008" x2="62.973" y2="711.985" />
        <line x1="62.973" y1="660.046" x2="147.012" y2="660.046" />
        <line x1="95.073" y1="660.046" x2="95.073" y2="711.985" />
      </g>

      <g class="home-loading-identity__stroke home-loading-identity__spiral">
        <path d="M -73.004 576.008 A 576.008 576.008 0 0 1 503.004 0" />
        <path d="M 503.004 576.008 A 355.992 355.992 0 0 1 147.012 932" />
        <path d="M 147.012 932 A 220.015 220.015 0 0 1 -73.004 711.985" />
        <path d="M -73.004 711.985 A 135.977 135.977 0 0 1 62.973 576.008" />
        <path d="M 62.973 576.008 A 84.038 84.038 0 0 1 147.012 660.046" />
        <path d="M 147.012 660.046 A 51.939 51.939 0 0 1 95.073 711.985" />
      </g>
    </svg>

    <div
      class="home-loading-identity__scene text-foreground"
      aria-hidden="true"
      v-html="identityArtwork"
    />

    <span
      aria-hidden="true"
      class="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-sans text-3xl font-black leading-none tracking-[-0.04em] tabular-nums text-foreground"
    >
      {{ counter }}
    </span>

    <HomeLoadingCrtEffect />

    <span class="sr-only" aria-live="polite">Loading {{ counter }} percent</span>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { gsap } from 'gsap'
import { decodeHomeImage, useHomeLoadingTask } from '../../../composables/useHomeReadiness'
import identityArtworkSource from '../../../assets/home-loading/home-loading-identity.svg?raw'
import jacoryOAvatarUrl from '../../../assets/home-loading/jacory-o-avatar.png'
import HomeLoadingCrtEffect from './HomeLoadingCrtEffect.vue'

const emit = defineEmits(['complete'])
const props = defineProps({
  homeReady: Boolean,
  progress: { type: Number, default: 0 },
  failed: Boolean
})
const artworkTask = useHomeLoadingTask('loading-avatar')
const loaderRoot = ref(null)
const counter = ref('000')
const identityArtwork = identityArtworkSource.replace('__JACORY_O_SCULPTURE_URL__', jacoryOAvatarUrl)

const INTRO_DURATION = 3.9
const PREPARE_PROGRESS = 99
const EXIT_DURATION = 0.36

let introTimeline
let exitTween
let progressFrame = 0
let previousProgressTime = 0
let displayedProgress = 0
let isUnmounted = false
let completed = false
let visualProgressComplete = false
let reducedMotion = false
const updateCounter = (value) => {
  counter.value = String(Math.round(value)).padStart(3, '0')
}

const markPerformance = (name) => {
  if (import.meta.env.DEV && typeof performance !== 'undefined') {
    performance.mark(`home-loader:${name}`)
  }
}

const waitForIdentityArtwork = () => {
  const image = new Image()
  image.decoding = 'async'
  image.src = jacoryOAvatarUrl
  return decodeHomeImage(image)
}

const completeLoading = () => {
  if (isUnmounted || completed) return

  completed = true
  if (progressFrame) window.cancelAnimationFrame(progressFrame)
  progressFrame = 0
  updateCounter(100)
  introTimeline?.progress(1)
  markPerformance('complete')
  exitTween = gsap.to(loaderRoot.value, {
    autoAlpha: 0,
    duration: reducedMotion ? 0 : EXIT_DURATION,
    ease: 'power3.inOut',
    pointerEvents: 'none',
    onComplete: () => emit('complete')
  })
}

const tryCompleteLoading = () => {
  if (isUnmounted || completed || !visualProgressComplete || !props.homeReady || props.failed) return
  completeLoading()
}

const advanceProgress = (timestamp) => {
  if (isUnmounted || completed) return

  // Limit each step too, so returning from a suspended tab cannot skip the intro.
  const elapsed = Math.min(0.1, Math.max(0, (timestamp - previousProgressTime) / 1000))
  previousProgressTime = timestamp
  const target = Math.min(PREPARE_PROGRESS, Math.max(0, props.progress))
  displayedProgress = Math.min(target, displayedProgress + elapsed * PREPARE_PROGRESS / INTRO_DURATION)
  updateCounter(Math.floor(displayedProgress))
  introTimeline?.progress(displayedProgress / PREPARE_PROGRESS)
  visualProgressComplete = displayedProgress >= PREPARE_PROGRESS
  tryCompleteLoading()

  if (!completed) progressFrame = window.requestAnimationFrame(advanceProgress)
}

watch(() => props.progress, (progress) => {
  if (reducedMotion && !completed) updateCounter(Math.min(PREPARE_PROGRESS, Math.floor(progress)))
}, { immediate: true })
watch(() => [props.homeReady, props.failed], tryCompleteLoading)

onMounted(() => {
  const root = loaderRoot.value
  if (!root) return

  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const iFull = root.querySelector('.identity-i-full')
  const iHalves = root.querySelector('.identity-i-halves')
  const iLeft = root.querySelector('.identity-i-left')
  const iRight = root.querySelector('.identity-i-right')
  const mFull = root.querySelector('.identity-m-full')
  const mHalves = root.querySelector('.identity-m-halves')
  const mLeft = root.querySelector('.identity-m-left')
  const mRight = root.querySelector('.identity-m-right')
  const name = root.querySelector('.identity-name')
  const iRevealMask = root.querySelector('.identity-i-reveal-mask')
  const mRevealMask = root.querySelector('.identity-m-reveal-mask')
  const nameRevealMask = root.querySelector('.identity-name-reveal-mask')
  const activeGeometry = root.querySelector(
    window.matchMedia('(max-width: 767px)').matches
      ? '.home-loading-identity__geometry--mobile'
      : '.home-loading-identity__geometry--desktop'
  )
  const dividers = gsap.utils.toArray(activeGeometry?.querySelectorAll('.home-loading-identity__dividers line') ?? [])
  const spiral = gsap.utils.toArray(activeGeometry?.querySelectorAll('.home-loading-identity__spiral path') ?? [])
  const strokes = [...dividers, ...spiral]

  strokes.forEach((stroke) => {
    const length = stroke.getTotalLength()
    gsap.set(stroke, {
      strokeDasharray: length,
      strokeDashoffset: length,
      visibility: 'visible'
    })
  })

  gsap.set([iHalves, mHalves], { autoAlpha: 0 })
  gsap.set([iLeft, iRight, mLeft, mRight], { x: 0 })
  gsap.set([iRevealMask, mRevealMask, nameRevealMask], {
    scaleX: 0,
    svgOrigin: '900 350'
  })
  gsap.set([iFull, mFull, name], { autoAlpha: 1 })

  introTimeline = gsap.timeline({
    paused: true,
    defaults: { ease: 'power3.out' }
  })

  introTimeline
        .addLabel('iIn', 0)
        .to(iRevealMask, { scaleX: 1, duration: 0.68 }, 'iIn')
        .addLabel('iSplit', '+=0.28')
        .set(iFull, { autoAlpha: 0 }, 'iSplit')
        .set(iHalves, { autoAlpha: 1 }, 'iSplit')
        .to(iLeft, { x: -113, duration: 0.78, ease: 'power3.inOut' }, 'iSplit')
        .to(iRight, { x: 113, duration: 0.78, ease: 'power3.inOut' }, 'iSplit')
        .addLabel('mIn', INTRO_DURATION * 0.33)
        .to(mRevealMask, { scaleX: 1, duration: 0.78, ease: 'power3.inOut' }, 'mIn')
        .addLabel('mSplit', 'mIn+=0.78')
        .set(mFull, { autoAlpha: 0 }, 'mSplit')
        .set(mHalves, { autoAlpha: 1 }, 'mSplit')
        .to(iLeft, { x: -574.145, duration: 0.82, ease: 'power3.inOut' }, 'mSplit')
        .to(iRight, { x: 574.145, duration: 0.82, ease: 'power3.inOut' }, 'mSplit')
        .to(mLeft, { x: -461.145, duration: 0.82, ease: 'power3.inOut' }, 'mSplit')
        .to(mRight, { x: 461.145, duration: 0.82, ease: 'power3.inOut' }, 'mSplit')
        .addLabel('nameIn', INTRO_DURATION * 0.66)
        .to(nameRevealMask, { scaleX: 1, duration: 0.82, ease: 'power3.inOut' }, 'nameIn')

  const introDuration = INTRO_DURATION
  const strokeDuration = 0.78
  const strokeStep = dividers.length > 1
    ? (introDuration - strokeDuration) / (dividers.length - 1)
    : 0

  dividers.forEach((divider, index) => {
    const stepStart = index * strokeStep

    introTimeline
      .to(divider, {
        strokeDashoffset: 0,
        duration: 0.72
      }, stepStart)
      .to(spiral[index], {
        strokeDashoffset: 0,
        duration: strokeDuration
      }, stepStart)
  })

  introTimeline.progress(0)
  previousProgressTime = performance.now()
  markPerformance('start')
  if (reducedMotion) {
    introTimeline.progress(1)
    updateCounter(Math.min(PREPARE_PROGRESS, Math.floor(props.progress)))
    visualProgressComplete = true
    tryCompleteLoading()
  } else {
    progressFrame = window.requestAnimationFrame(advanceProgress)
  }
  void artworkTask.run(waitForIdentityArtwork)
})

onBeforeUnmount(() => {
  isUnmounted = true
  if (progressFrame) window.cancelAnimationFrame(progressFrame)
  introTimeline?.kill()
  exitTween?.kill()
})
</script>

<style scoped>
.home-loading-identity__scene {
  position: relative;
  z-index: 10;
  width: min(96vw, 110rem);
}

.home-loading-identity__geometry {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  color: var(--line-strong);
}

.home-loading-identity__geometry--mobile {
  display: none;
}

.home-loading-identity__stroke {
  fill: none;
  stroke: currentColor;
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.home-loading-identity__stroke > * {
  visibility: hidden;
}

.home-loading-identity__dividers {
  opacity: 0.46;
}

.home-loading-identity__spiral {
  opacity: 0.58;
}

.home-loading-identity__scene :deep(.home-loading-identity__svg) {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

@media (max-width: 767px) {
  .home-loading-identity__geometry--desktop {
    display: none;
  }

  .home-loading-identity__geometry--mobile {
    display: block;
  }
}
</style>
