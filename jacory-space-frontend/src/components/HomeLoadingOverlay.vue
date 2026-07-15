<template>
  <div ref="loaderRoot" class="home-loader" role="status" aria-label="Loading">
    <svg class="home-loader__geometry home-loader__geometry--desktop" viewBox="0 0 2048 1261" aria-hidden="true">
      <g class="home-loader__stroke home-loader__dividers">
        <line x1="1264.83" y1="0" x2="1264.83" y2="1261" />
        <line x1="1264.83" y1="779.341" x2="2044.17" y2="779.341" />
        <line x1="1562.511" y1="779.341" x2="1562.511" y2="1261" />
        <line x1="1264.83" y1="963.318" x2="1562.511" y2="963.318" />
        <line x1="1448.807" y1="779.341" x2="1448.807" y2="963.318" />
        <line x1="1448.807" y1="893.045" x2="1562.511" y2="893.045" />
        <line x1="1492.238" y1="893.045" x2="1492.238" y2="963.318" />
        <line x1="1448.807" y1="919.887" x2="1492.238" y2="919.887" />
      </g>

      <g class="home-loader__stroke home-loader__spiral">
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

    <svg class="home-loader__geometry home-loader__geometry--mobile" viewBox="0 0 430 932" aria-hidden="true">
      <g class="home-loader__stroke home-loader__dividers">
        <line x1="-73.004" y1="576.008" x2="503.004" y2="576.008" />
        <line x1="147.012" y1="576.008" x2="147.012" y2="932" />
        <line x1="-73.004" y1="711.985" x2="147.012" y2="711.985" />
        <line x1="62.973" y1="576.008" x2="62.973" y2="711.985" />
        <line x1="62.973" y1="660.046" x2="147.012" y2="660.046" />
        <line x1="95.073" y1="660.046" x2="95.073" y2="711.985" />
      </g>

      <g class="home-loader__stroke home-loader__spiral">
        <path d="M -73.004 576.008 A 576.008 576.008 0 0 1 503.004 0" />
        <path d="M 503.004 576.008 A 355.992 355.992 0 0 1 147.012 932" />
        <path d="M 147.012 932 A 220.015 220.015 0 0 1 -73.004 711.985" />
        <path d="M -73.004 711.985 A 135.977 135.977 0 0 1 62.973 576.008" />
        <path d="M 62.973 576.008 A 84.038 84.038 0 0 1 147.012 660.046" />
        <path d="M 147.012 660.046 A 51.939 51.939 0 0 1 95.073 711.985" />
      </g>
    </svg>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)

const emit = defineEmits(['complete'])
const loaderRoot = ref(null)
const MIN_LOADING_DURATION = 4.8
const LOADER_EXIT_DURATION = 0.72
let loaderContext
let reducedMotionQuery

onMounted(() => {
  const loader = loaderRoot.value
  if (!loader) return

  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const loaderEase = CustomEase.create('home-loader', '0.16,1,0.3,1')

  loaderContext = gsap.context(() => {
    if (reducedMotionQuery.matches) {
      gsap.set(loader, { display: 'none' })
      window.setTimeout(() => emit('complete'), 0)
      return
    }

    const mobileQuery = window.matchMedia('(max-width: 767px)')
    const activeGeometry = loader.querySelector(mobileQuery.matches ? '.home-loader__geometry--mobile' : '.home-loader__geometry--desktop')
    const dividers = gsap.utils.toArray(activeGeometry?.querySelectorAll('.home-loader__dividers line') ?? [])
    const spiral = gsap.utils.toArray(activeGeometry?.querySelectorAll('.home-loader__spiral path') ?? [])
    const strokes = [...dividers, ...spiral]

    strokes.forEach((stroke) => {
      const length = stroke.getTotalLength()
      gsap.set(stroke, {
        strokeDasharray: length,
        strokeDashoffset: length
      })
    })

    const timeline = gsap.timeline({ defaults: { ease: loaderEase } })

    dividers.forEach((divider, index) => {
      const stepStart = index * 0.4

      timeline
        .to(divider, {
          strokeDashoffset: 0,
          duration: 0.72
        }, stepStart)
        .to(spiral[index], {
          strokeDashoffset: 0,
          duration: 0.78
        }, stepStart)
    })

    timeline
      .to(loader, {
        autoAlpha: 0,
        duration: LOADER_EXIT_DURATION,
        pointerEvents: 'none',
        onComplete: () => emit('complete')
      }, MIN_LOADING_DURATION - LOADER_EXIT_DURATION)
  }, loader)
})

onBeforeUnmount(() => {
  loaderContext?.revert()
})
</script>

<style scoped>
.home-loader {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: var(--background);
}

.home-loader__geometry {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  color: var(--line-strong);
}

.home-loader__geometry--mobile {
  display: none;
}

.home-loader__stroke {
  fill: none;
  stroke: currentColor;
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.home-loader__dividers {
  opacity: 0.46;
}

.home-loader__spiral {
  opacity: 0.58;
}

@media (max-width: 767px) {
  .home-loader__geometry--desktop {
    display: none;
  }

  .home-loader__geometry--mobile {
    display: block;
  }
}
</style>
