<template>
  <section
    ref="trackRoot"
    data-home-transition-target
    class="home-transition-track relative z-30 bg-background [--navbar-height:4rem]"
    :class="identityVisible ? 'visible' : 'invisible'"
  >
    <div
      ref="stageRoot"
      class="home-identity-stage"
    >
      <div class="home-identity-layer">
        <HomeDotMatrixField
          :scatter-progress="0"
          :dissolve-progress="dissolveProgress"
          :terminal-progress="terminalProgress"
          @ready="emit('ready')"
        />
      </div>

      <div class="sr-only">
        <p>JACORY</p>
        <p>Identity running. A Creator. I guess. Awaiting input. Model: My Brain High.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HomeDotMatrixField from './HomeDotMatrixField.vue'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  identityVisible: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['ready'])

const trackRoot = ref(null)
const stageRoot = ref(null)
const scatterProgress = ref(0)
const dissolveProgress = ref(0)
const terminalProgress = ref(0)
const TERMINAL_INPUT_END_PROGRESS = 0.3
const SCATTER_START_PROGRESS = 0.5
const DISSOLVE_START_PROGRESS = 0.5
const IDENTITY_SCROLL_DISTANCE = 2.5

let resizeObserver
let motionQuery
let measurementFrame = 0
let terminalMotion
let terminalTimeline
let stopIdentityWatch
let identityScrollStart = null

function updateScatterProgress() {
  if (!stageRoot.value || !motionQuery?.matches || identityScrollStart === null) {
    scatterProgress.value = 0
    return
  }

  const stageHeight = stageRoot.value.getBoundingClientRect().height
  if (stageHeight <= 0) return

  const rawProgress = Math.min(1, Math.max(
    0,
    (window.scrollY - identityScrollStart) / (stageHeight * IDENTITY_SCROLL_DISTANCE)
  ))
  scatterProgress.value = Math.min(
    1,
    Math.max(0, (rawProgress - SCATTER_START_PROGRESS) / (1 - SCATTER_START_PROGRESS))
  )
}

function updateDissolveProgress() {
  if (!stageRoot.value || !motionQuery?.matches || identityScrollStart === null) {
    dissolveProgress.value = 0
    return
  }

  const stageHeight = stageRoot.value.getBoundingClientRect().height
  if (stageHeight <= 0) return

  const rawProgress = Math.min(1, Math.max(
    0,
    (window.scrollY - identityScrollStart) / (stageHeight * IDENTITY_SCROLL_DISTANCE)
  ))
  dissolveProgress.value = Math.min(
    1,
    Math.max(0, (rawProgress - DISSOLVE_START_PROGRESS) / (1 - DISSOLVE_START_PROGRESS))
  )
}

function resetIdentityMotion() {
  terminalTimeline?.kill()
  terminalTimeline = undefined
  identityScrollStart = null
  terminalProgress.value = 0
  scatterProgress.value = 0
  dissolveProgress.value = 0
}

function startIdentityMotion() {
  if (!stageRoot.value || identityScrollStart !== null) return

  const stageHeight = stageRoot.value.getBoundingClientRect().height
  if (stageHeight <= 0) return

  identityScrollStart = window.scrollY
  const typingState = { value: 0 }
  const inputDistance = Math.max(
    1,
    stageHeight * IDENTITY_SCROLL_DISTANCE * TERMINAL_INPUT_END_PROGRESS
  )

  terminalTimeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      id: 'home-terminal-input',
      trigger: stageRoot.value,
      start: identityScrollStart,
      end: identityScrollStart + inputDistance,
      scrub: true,
      invalidateOnRefresh: true
    }
  })

  terminalTimeline.to(typingState, {
    value: 1,
    duration: 1,
    onUpdate: () => {
      terminalProgress.value = typingState.value
    }
  })

  scheduleMeasurement()
  window.requestAnimationFrame(() => ScrollTrigger.refresh())
}

function scheduleMeasurement() {
  if (measurementFrame) return

  measurementFrame = window.requestAnimationFrame(() => {
    measurementFrame = 0
    updateScatterProgress()
    updateDissolveProgress()
  })
}

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: no-preference)')
  resizeObserver = new ResizeObserver(scheduleMeasurement)

  if (trackRoot.value) resizeObserver.observe(trackRoot.value)
  if (stageRoot.value) resizeObserver.observe(stageRoot.value)

  window.addEventListener('scroll', scheduleMeasurement, { passive: true })
  window.addEventListener('resize', scheduleMeasurement)
  motionQuery.addEventListener('change', scheduleMeasurement)
  scheduleMeasurement()

  terminalMotion = gsap.matchMedia()
  terminalMotion.add('(prefers-reduced-motion: no-preference)', () => {
    stopIdentityWatch = watch(
      () => props.identityVisible,
      (visible) => {
        if (visible) startIdentityMotion()
        else resetIdentityMotion()
      },
      { immediate: true }
    )

    return () => {
      stopIdentityWatch?.()
      stopIdentityWatch = undefined
      resetIdentityMotion()
    }
  })
  terminalMotion.add('(prefers-reduced-motion: reduce)', () => {
    resetIdentityMotion()
    terminalProgress.value = 1
  })

  window.requestAnimationFrame(() => ScrollTrigger.refresh())
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scheduleMeasurement)
  window.removeEventListener('resize', scheduleMeasurement)
  motionQuery?.removeEventListener('change', scheduleMeasurement)
  resizeObserver?.disconnect()
  terminalMotion?.revert()

  if (measurementFrame) window.cancelAnimationFrame(measurementFrame)
})
</script>

<style scoped>
.home-transition-track {
  --identity-stage-height: calc(100svh - var(--navbar-height));
  height: var(--identity-stage-height);
}

.home-identity-stage {
  position: relative;
  height: var(--identity-stage-height);
  overflow: hidden;
}

.home-identity-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.home-identity-layer {
  z-index: 1;
}

@media (prefers-reduced-motion: no-preference) {
  .home-transition-track {
    height: calc(var(--identity-stage-height) * 3.5);
    margin-top: calc(-1 * var(--identity-stage-height));
  }

  .home-identity-stage {
    position: sticky;
    top: var(--navbar-height);
  }
}
</style>
