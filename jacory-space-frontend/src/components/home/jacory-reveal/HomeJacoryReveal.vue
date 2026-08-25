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

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  identityVisible: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['matrix-progress', 'handoff-change'])

const trackRoot = ref(null)
const stageRoot = ref(null)
const dissolveProgress = ref(0)
const terminalProgress = ref(0)
const blackoutProgress = ref(0)
const TERMINAL_INPUT_END_PROGRESS = 0.375
const DISSOLVE_START_PROGRESS = 0.5
const IDENTITY_SCROLL_DISTANCE = 2.5
const NAVBAR_HEIGHT = 64

let resizeObserver
let motionQuery
let measurementFrame = 0
let terminalMotion
let terminalTimeline
let stopIdentityWatch
let identityScrollStart = null
let handoffActive = false

function clampProgress(value) {
  return Math.min(1, Math.max(0, value))
}

function emitMatrixProgress() {
  emit('matrix-progress', {
    terminalProgress: terminalProgress.value,
    dissolveProgress: dissolveProgress.value,
    blackoutProgress: blackoutProgress.value
  })
}

function setHandoffActive(isActive) {
  if (handoffActive === isActive) return

  handoffActive = isActive
  emit('handoff-change', isActive)
}

function updateDissolveProgress() {
  if (!stageRoot.value || !motionQuery?.matches || identityScrollStart === null) {
    dissolveProgress.value = 0
    blackoutProgress.value = 0
    setHandoffActive(false)
    emitMatrixProgress()
    return
  }

  const stageHeight = stageRoot.value.getBoundingClientRect().height
  if (stageHeight <= 0) return

  const stageHasReleased = stageRoot.value.getBoundingClientRect().top < NAVBAR_HEIGHT
  if (stageHasReleased) {
    dissolveProgress.value = 1
    blackoutProgress.value = 1
    setHandoffActive(true)
    emitMatrixProgress()
    return
  }

  const rawProgress = clampProgress(
    (window.scrollY - identityScrollStart) / (stageHeight * IDENTITY_SCROLL_DISTANCE)
  )
  dissolveProgress.value = clampProgress(
    (rawProgress - DISSOLVE_START_PROGRESS) / (1 - DISSOLVE_START_PROGRESS)
  )
  blackoutProgress.value = clampProgress(
    (rawProgress - TERMINAL_INPUT_END_PROGRESS)
      / (DISSOLVE_START_PROGRESS - TERMINAL_INPUT_END_PROGRESS)
  )
  setHandoffActive(false)
  emitMatrixProgress()
}

function resetIdentityMotion() {
  terminalTimeline?.kill()
  terminalTimeline = undefined
  identityScrollStart = null
  terminalProgress.value = 0
  dissolveProgress.value = 0
  blackoutProgress.value = 0
  setHandoffActive(false)
  emitMatrixProgress()
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
      emitMatrixProgress()
    }
  })

  scheduleMeasurement()
  window.requestAnimationFrame(() => ScrollTrigger.refresh())
}

function scheduleMeasurement() {
  if (measurementFrame) return

  measurementFrame = window.requestAnimationFrame(() => {
    measurementFrame = 0
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
    dissolveProgress.value = 1
    blackoutProgress.value = 1
    emitMatrixProgress()
    setHandoffActive(true)
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
