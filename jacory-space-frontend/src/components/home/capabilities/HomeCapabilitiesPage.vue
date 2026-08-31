<template>
  <section
    data-home-capabilities-page
    class="home-capabilities-page relative z-30"
    aria-label="Creative capabilities"
  >
    <div
      ref="trackRoot"
      data-home-capabilities-track
      class="home-capabilities-track"
    >
      <HomeMotionDesignPoster ref="posterRoot" />
    </div>

    <h2 class="sr-only">Motion Design</h2>
    <div class="home-capability-video-creation-layer">
      <slot name="video-creation" />
    </div>
    <div class="home-capability-web-development-layer">
      <slot name="web-development" />
    </div>
  </section>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HomeMotionDesignPoster from './HomeMotionDesignPoster.vue'

gsap.registerPlugin(ScrollTrigger)

const emit = defineEmits(['header-ready'])
const posterRoot = ref(null)
const headerRoot = ref(null)
const trackRoot = ref(null)
const illustrationRoot = ref(null)
const motionTitleRoot = ref(null)
const designTitleRoot = ref(null)
let motionDesignMedia
let motionDesignResizeObserver
let motionDesignResizeFrame = 0
let motionDesignTimeline
let rebuildMotionDesignTimeline
let resolveMotionDesignTimelineReady
let motionDesignTimelineReady = new Promise((resolve) => {
  resolveMotionDesignTimelineReady = resolve
})

function syncPosterElements() {
  const elements = posterRoot.value?.getMotionDesignElements?.()
  if (!elements) return false

  headerRoot.value = elements.header
  illustrationRoot.value = elements.illustration
  motionTitleRoot.value = elements.motionTitle
  designTitleRoot.value = elements.designTitle

  return Boolean(
    headerRoot.value
    && illustrationRoot.value
    && motionTitleRoot.value
    && designTitleRoot.value
  )
}

function markMotionDesignTimelineReady() {
  resolveMotionDesignTimelineReady?.()
  resolveMotionDesignTimelineReady = undefined
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function resolveTypographyLockup() {
  if (!headerRoot.value || !motionTitleRoot.value || !designTitleRoot.value) return null

  const header = headerRoot.value
  const motionTitle = motionTitleRoot.value
  const designTitle = designTitleRoot.value
  const availableGap = Math.max(0, header.offsetHeight - motionTitle.offsetHeight - designTitle.offsetHeight)
  const lockupGap = clamp(
    Math.min(availableGap * 0.16, Math.min(motionTitle.offsetHeight, designTitle.offsetHeight) * 0.08),
    0,
    availableGap
  )
  const lockupHeight = motionTitle.offsetHeight + designTitle.offsetHeight + lockupGap
  const lockupTop = (header.offsetHeight - lockupHeight) / 2

  return {
    motion: {
      x: (header.offsetWidth - motionTitle.offsetWidth) / 2 - motionTitle.offsetLeft,
      y: lockupTop - motionTitle.offsetTop
    },
    design: {
      x: (header.offsetWidth - designTitle.offsetWidth) / 2 - designTitle.offsetLeft,
      y: lockupTop + motionTitle.offsetHeight + lockupGap - designTitle.offsetTop
    }
  }
}

async function prepareMotionDesignHandoff() {
  await motionDesignTimelineReady
  await nextTick()
  rebuildMotionDesignTimeline?.({ refreshImmediately: true })
}

defineExpose({ prepareMotionDesignHandoff })

onMounted(async () => {
  await nextTick()
  if (!syncPosterElements() || !trackRoot.value) {
    markMotionDesignTimelineReady()
    return
  }

  emit('header-ready', headerRoot.value)

  await document.fonts?.ready

  motionDesignMedia = gsap.matchMedia()
  motionDesignMedia.add('(prefers-reduced-motion: no-preference)', () => {
    const motionTitle = motionTitleRoot.value
    const illustration = illustrationRoot.value
    const designTitle = designTitleRoot.value
    const rebuildTimeline = ({ refreshImmediately = false } = {}) => {
      const lockup = resolveTypographyLockup()
      if (!lockup) return

      motionDesignTimeline?.scrollTrigger?.kill()
      motionDesignTimeline?.kill()

      const lockupHold = { value: 0 }
      const posterHold = { value: 0 }

      gsap.set([motionTitle, designTitle], { autoAlpha: 0, clipPath: 'none' })
      gsap.set(motionTitle, lockup.motion)
      gsap.set(designTitle, lockup.design)
      gsap.set(illustration, { autoAlpha: 0, y: 14 })

      motionDesignTimeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'home-motion-design-entrance',
          trigger: trackRoot.value,
          start: 'top top+=64',
          end: () => `+=${Math.max(0, trackRoot.value.offsetHeight - headerRoot.value.offsetHeight)}`,
          scrub: true,
          invalidateOnRefresh: true
        }
      })
        .addLabel('lockup', 0.12)
        .to([motionTitle, designTitle], { autoAlpha: 1, duration: 0.12 }, 'lockup')
        .to(lockupHold, { value: 1, duration: 0.14 }, 'lockup+=0.12')
        .addLabel('recompose', 0.38)
        .to(motionTitle, { x: 0, y: 0, duration: 0.34 }, 'recompose')
        .to(designTitle, { x: 0, y: 0, duration: 0.34 }, 'recompose')
        .to(illustration, { autoAlpha: 1, y: 0, duration: 0.34 }, 'recompose')
        .addLabel('poster', 'recompose+=0.34')
        .to(posterHold, { value: 1, duration: 0.28 }, 'poster')

      if (refreshImmediately) {
        ScrollTrigger.refresh()
        motionDesignTimeline.scrollTrigger?.update()
        return
      }

      window.requestAnimationFrame(() => ScrollTrigger.refresh())
    }
    const scheduleTimelineRebuild = () => {
      window.cancelAnimationFrame(motionDesignResizeFrame)
      motionDesignResizeFrame = window.requestAnimationFrame(() => {
        motionDesignResizeFrame = 0
        rebuildTimeline()
      })
    }

    rebuildTimeline()
    rebuildMotionDesignTimeline = rebuildTimeline
    markMotionDesignTimelineReady()
    motionDesignResizeObserver = new ResizeObserver(scheduleTimelineRebuild)
    motionDesignResizeObserver.observe(headerRoot.value)

    return () => {
      motionDesignResizeObserver?.disconnect()
      motionDesignResizeObserver = undefined
      window.cancelAnimationFrame(motionDesignResizeFrame)
      motionDesignResizeFrame = 0
      if (rebuildMotionDesignTimeline === rebuildTimeline) {
        rebuildMotionDesignTimeline = undefined
      }
      motionDesignTimeline?.scrollTrigger?.kill()
      motionDesignTimeline?.kill()
      motionDesignTimeline = undefined
      gsap.set([motionTitle, illustration, designTitle], { clearProps: 'all' })
    }
  })

  motionDesignMedia.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set(
      [motionTitleRoot.value, illustrationRoot.value, designTitleRoot.value],
      { clearProps: 'all' }
    )
    markMotionDesignTimelineReady()
  })
})

onBeforeUnmount(() => {
  motionDesignResizeObserver?.disconnect()
  window.cancelAnimationFrame(motionDesignResizeFrame)
  motionDesignMedia?.revert()
})
</script>

<style scoped>
.home-capabilities-page {
  margin-top: calc(-1 * var(--home-transition-stage-height));
  background: #000;
}

.home-capabilities-track {
  height: calc(var(--home-transition-stage-height) * 2.4);
  position: relative;
  z-index: 30;
}

@media (prefers-reduced-motion: no-preference) {
  .home-capability-video-creation-layer,
  .home-capability-web-development-layer {
    height: calc(var(--home-transition-stage-height) * 2);
    margin-top: calc(-1 * var(--home-transition-stage-height));
    position: relative;
  }

  .home-capability-video-creation-layer {
    z-index: 20;
  }

  .home-capability-web-development-layer {
    z-index: 10;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-capabilities-page {
    margin-top: 0;
  }

  .home-capabilities-track {
    height: var(--home-transition-stage-height);
  }

}
</style>
