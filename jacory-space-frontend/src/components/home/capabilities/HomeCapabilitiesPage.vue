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
      <HomeVisualDesignPoster ref="posterRoot" />
    </div>

    <h2 class="sr-only">Visual Design</h2>
    <div class="home-capability-photo-video-layer">
      <slot name="photo-video" />
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
import HomeVisualDesignPoster from './HomeVisualDesignPoster.vue'

gsap.registerPlugin(ScrollTrigger)

const emit = defineEmits(['header-ready'])
const posterRoot = ref(null)
const headerRoot = ref(null)
const trackRoot = ref(null)
const illustrationRoot = ref(null)
const visualTitleRoot = ref(null)
const designTitleRoot = ref(null)
const designFillTitleRoot = ref(null)
let visualDesignMedia
let visualDesignResizeObserver
let visualDesignResizeFrame = 0
let visualDesignTimeline
let rebuildVisualDesignTimeline
let resolveVisualDesignTimelineReady
let visualDesignTimelineReady = new Promise((resolve) => {
  resolveVisualDesignTimelineReady = resolve
})

function syncPosterElements() {
  const elements = posterRoot.value?.getVisualDesignElements?.()
  if (!elements) return false

  headerRoot.value = elements.header
  illustrationRoot.value = elements.illustration
  visualTitleRoot.value = elements.visualTitle
  designTitleRoot.value = elements.designTitle
  designFillTitleRoot.value = elements.designFillTitle

  return Boolean(
    headerRoot.value
    && illustrationRoot.value
    && visualTitleRoot.value
    && designTitleRoot.value
    && designFillTitleRoot.value
  )
}

function markVisualDesignTimelineReady() {
  resolveVisualDesignTimelineReady?.()
  resolveVisualDesignTimelineReady = undefined
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function resolveTypographyLockup() {
  if (!headerRoot.value || !visualTitleRoot.value || !designTitleRoot.value) return null

  const header = headerRoot.value
  const visualTitle = visualTitleRoot.value
  const designTitle = designTitleRoot.value
  const availableGap = Math.max(0, header.offsetHeight - visualTitle.offsetHeight - designTitle.offsetHeight)
  const lockupGap = clamp(
    Math.min(availableGap * 0.16, Math.min(visualTitle.offsetHeight, designTitle.offsetHeight) * 0.08),
    0,
    availableGap
  )
  const lockupHeight = visualTitle.offsetHeight + designTitle.offsetHeight + lockupGap
  const lockupTop = (header.offsetHeight - lockupHeight) / 2

  return {
    visual: {
      x: (header.offsetWidth - visualTitle.offsetWidth) / 2 - visualTitle.offsetLeft,
      y: lockupTop - visualTitle.offsetTop
    },
    design: {
      x: (header.offsetWidth - designTitle.offsetWidth) / 2 - designTitle.offsetLeft,
      y: lockupTop + visualTitle.offsetHeight + lockupGap - designTitle.offsetTop
    }
  }
}

async function prepareVisualDesignHandoff() {
  await visualDesignTimelineReady
  await nextTick()
  rebuildVisualDesignTimeline?.({ refreshImmediately: true })
}

defineExpose({ prepareVisualDesignHandoff })

onMounted(async () => {
  await nextTick()
  if (!syncPosterElements() || !trackRoot.value) {
    markVisualDesignTimelineReady()
    return
  }

  emit('header-ready', headerRoot.value)

  await document.fonts?.ready

  visualDesignMedia = gsap.matchMedia()
  visualDesignMedia.add('(prefers-reduced-motion: no-preference)', () => {
    const visualTitle = visualTitleRoot.value
    const illustration = illustrationRoot.value
    const designTitles = [designTitleRoot.value, designFillTitleRoot.value]
    const rebuildTimeline = ({ refreshImmediately = false } = {}) => {
      const lockup = resolveTypographyLockup()
      if (!lockup) return

      visualDesignTimeline?.scrollTrigger?.kill()
      visualDesignTimeline?.kill()

      const lockupHold = { value: 0 }
      const posterHold = { value: 0 }
      const holdScreens = Number.parseFloat(
        getComputedStyle(trackRoot.value).getPropertyValue('--home-capability-hold-screens')
      ) || 0
      const scrollDistance = trackRoot.value.offsetHeight - headerRoot.value.offsetHeight
      const holdDistance = headerRoot.value.offsetHeight * holdScreens
      // The entrance ends at timeline time 0.72. Reserve the final 0.6 screens
      // for the completed poster without stretching that entrance into the hold.
      const posterHoldDuration = holdDistance > 0
        ? 0.72 * holdDistance / Math.max(1, scrollDistance - holdDistance)
        : 0.28

      gsap.set([visualTitle, ...designTitles], { autoAlpha: 0, clipPath: 'none' })
      gsap.set(visualTitle, { ...lockup.visual, '--visual-fade': 0 })
      gsap.set(designTitles, lockup.design)
      gsap.set(designTitleRoot.value, { '--design-outline-opacity': 0 })
      gsap.set(illustration, { autoAlpha: 0, y: 14 })

      visualDesignTimeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'home-visual-design-entrance',
          trigger: trackRoot.value,
          start: 'top top+=64',
          end: () => `+=${Math.max(0, trackRoot.value.offsetHeight - headerRoot.value.offsetHeight)}`,
          scrub: true,
          invalidateOnRefresh: true
        }
      })
        .addLabel('lockup', 0.12)
        .to([visualTitle, ...designTitles], { autoAlpha: 1, duration: 0.12 }, 'lockup')
        .to(lockupHold, { value: 1, duration: 0.14 }, 'lockup+=0.12')
        .addLabel('recompose', 0.38)
        // The solid glyph is fully opaque here, so enabling its matching inner
        // edge is invisible. Keep that edge as the artwork reveals the interior.
        .set(designTitleRoot.value, { '--design-outline-opacity': 1 }, 'recompose')
        .to(visualTitle, { x: 0, y: 0, duration: 0.34 }, 'recompose')
        .fromTo(visualTitle,
          { '--visual-fade': 0 },
          { '--visual-fade': 1, duration: 0.34 },
          'recompose'
        )
        .to(designTitles, { x: 0, y: 0, duration: 0.34 }, 'recompose')
        .to(illustration, { autoAlpha: 1, y: 0, duration: 0.34 }, 'recompose')
        .addLabel('poster', 'recompose+=0.34')
        .to(posterHold, { value: 1, duration: posterHoldDuration }, 'poster')

      if (refreshImmediately) {
        ScrollTrigger.refresh()
        visualDesignTimeline.scrollTrigger?.update()
        return
      }

      window.requestAnimationFrame(() => ScrollTrigger.refresh())
    }
    const scheduleTimelineRebuild = () => {
      window.cancelAnimationFrame(visualDesignResizeFrame)
      visualDesignResizeFrame = window.requestAnimationFrame(() => {
        visualDesignResizeFrame = 0
        rebuildTimeline()
      })
    }

    rebuildTimeline()
    rebuildVisualDesignTimeline = rebuildTimeline
    markVisualDesignTimelineReady()
    visualDesignResizeObserver = new ResizeObserver(scheduleTimelineRebuild)
    visualDesignResizeObserver.observe(headerRoot.value)

    return () => {
      visualDesignResizeObserver?.disconnect()
      visualDesignResizeObserver = undefined
      window.cancelAnimationFrame(visualDesignResizeFrame)
      visualDesignResizeFrame = 0
      if (rebuildVisualDesignTimeline === rebuildTimeline) {
        rebuildVisualDesignTimeline = undefined
      }
      visualDesignTimeline?.scrollTrigger?.kill()
      visualDesignTimeline?.kill()
      visualDesignTimeline = undefined
      gsap.set([visualTitle, illustration, ...designTitles], { clearProps: 'all' })
    }
  })

  visualDesignMedia.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set(
      [visualTitleRoot.value, illustrationRoot.value, designTitleRoot.value, designFillTitleRoot.value],
      { clearProps: 'all' }
    )
    markVisualDesignTimelineReady()
  })
})

onBeforeUnmount(() => {
  visualDesignResizeObserver?.disconnect()
  window.cancelAnimationFrame(visualDesignResizeFrame)
  visualDesignMedia?.revert()
})
</script>

<style scoped>
.home-capabilities-page {
  --home-capability-hold-screens: 0;
  margin-top: calc(-1 * var(--home-transition-stage-height));
  background: #000;
}

.home-capabilities-track {
  height: calc(var(--home-transition-stage-height) * 2.4);
  position: relative;
  z-index: 30;
}

@media (prefers-reduced-motion: no-preference) {
  .home-capability-photo-video-layer,
  .home-capability-web-development-layer {
    height: calc(var(--home-transition-stage-height) * 2);
    margin-top: calc(-1 * var(--home-transition-stage-height));
    position: relative;
  }

  .home-capability-photo-video-layer {
    z-index: 20;
  }

  .home-capability-web-development-layer {
    z-index: 10;
  }
}

@media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
  .home-capabilities-page {
    --home-capability-hold-screens: 0.6;
  }

  .home-capabilities-track,
  .home-capability-photo-video-layer,
  .home-capability-web-development-layer {
    /* One screen for the handoff, one for the page, then a fully visible hold. */
    height: calc(var(--home-transition-stage-height) * (2 + var(--home-capability-hold-screens)));
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
