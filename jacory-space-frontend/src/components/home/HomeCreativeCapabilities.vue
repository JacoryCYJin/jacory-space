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
      <section class="home-creative-entry-surface" aria-label="Creative capabilities">
        <div class="grid h-full w-full grid-rows-[auto_1fr_auto] p-5 md:p-8">
          <div class="flex justify-between gap-4 font-mono text-xs tracking-[0.1em] text-muted-foreground">
            <span>02 / CREATIVE CAPABILITIES</span>
            <span>IDEA → FORM</span>
          </div>

          <h2
            class="flex flex-col self-center font-display text-[clamp(4.5rem,13vw,13rem)] font-normal leading-[0.78] tracking-[-0.06em] text-foreground"
            aria-label="Ideas into form"
          >
            <span>IDEAS</span>
            <span class="self-center">INTO</span>
            <span class="self-end">FORM</span>
          </h2>

          <ol class="grid grid-cols-2 border-t border-line-strong font-mono text-xs tracking-[0.08em] text-foreground md:grid-cols-4">
            <li class="flex gap-3 pt-3 pr-2"><span class="text-blue">01</span><span>IDENTITY SYSTEMS</span></li>
            <li class="flex gap-3 border-l border-line pt-3 pl-3 pr-2"><span class="text-blue">02</span><span>DIGITAL EXPERIENCES</span></li>
            <li class="flex gap-3 pt-3 pr-2 md:border-l md:border-line md:pl-3"><span class="text-blue">03</span><span>WORDS &amp; NARRATIVES</span></li>
            <li class="flex gap-3 border-l border-line pt-3 pl-3"><span class="text-blue">04</span><span>CREATIVE DIRECTION</span></li>
          </ol>
        </div>
      </section>

      <div class="home-identity-layer">
        <slot
          name="identity"
          :scatter-progress="scatterProgress"
        />
      </div>

      <div class="sr-only">
        <p>JACORY</p>
        <p>A Creator, Self-Proclaimed</p>
      </div>
    </div>
  </section>

  <section data-home-creative-capabilities class="home-creative-content-flow grid min-h-[calc(100svh-var(--navbar-height))] items-end bg-background p-5 md:p-8">
    <div class="grid w-full max-w-3xl gap-6 border-t border-line-strong pt-4">
      <p class="font-mono text-xs tracking-[0.1em] text-muted-foreground">CAPABILITY INDEX / 02</p>
      <p class="font-display text-[clamp(2rem,4vw,4.5rem)] font-normal leading-[0.95] tracking-[-0.045em] text-foreground">
        Building the systems, screens, stories and direction that help an idea become tangible.
      </p>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps({
  identityVisible: {
    type: Boolean,
    default: false
  }
})

const trackRoot = ref(null)
const stageRoot = ref(null)
const scatterProgress = ref(0)
const SCATTER_START_PROGRESS = 0.4

let resizeObserver
let motionQuery
let measurementFrame = 0

function updateScatterProgress() {
  if (!trackRoot.value || !stageRoot.value || !motionQuery?.matches) {
    scatterProgress.value = 0
    return
  }

  const stageHeight = stageRoot.value.getBoundingClientRect().height
  if (stageHeight <= 0) return

  const stageTop = window.innerHeight - stageHeight
  const trackTop = trackRoot.value.getBoundingClientRect().top
  const rawProgress = Math.min(1, Math.max(0, (stageTop - trackTop) / stageHeight))
  scatterProgress.value = Math.min(
    1,
    Math.max(0, (rawProgress - SCATTER_START_PROGRESS) / (1 - SCATTER_START_PROGRESS))
  )
}

function scheduleMeasurement() {
  if (measurementFrame) return

  measurementFrame = window.requestAnimationFrame(() => {
    measurementFrame = 0
    updateScatterProgress()
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
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scheduleMeasurement)
  window.removeEventListener('resize', scheduleMeasurement)
  motionQuery?.removeEventListener('change', scheduleMeasurement)
  resizeObserver?.disconnect()

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

.home-identity-layer,
.home-creative-entry-surface {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.home-identity-layer {
  z-index: 1;
}

.home-creative-entry-surface {
  display: none;
  background: var(--background);
}

@media (prefers-reduced-motion: no-preference) {
  .home-transition-track {
    height: calc(var(--identity-stage-height) + var(--identity-stage-height));
    margin-top: calc(-1 * var(--identity-stage-height));
  }

  .home-identity-stage {
    position: sticky;
    top: var(--navbar-height);
  }

  .home-creative-entry-surface {
    display: block;
  }
}
</style>
