<template>
  <span class="hidden" aria-hidden="true" />
</template>

<script setup>
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const route = useRoute()
let lenis
let motionQuery

gsap.registerPlugin(ScrollTrigger)

function updateScrollTrigger() {
  ScrollTrigger.update()
}

function tick(time) {
  lenis?.raf(time * 1000)
}

function startLenis() {
  if (lenis || motionQuery?.matches) return

  lenis = new Lenis({
    autoRaf: false,
    anchors: true,
    lerp: 0.085,
    smoothWheel: true,
    syncTouch: false,
  })

  lenis.on('scroll', updateScrollTrigger)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  ScrollTrigger.refresh()
}

function stopLenis() {
  if (!lenis) return

  gsap.ticker.remove(tick)
  lenis.off('scroll', updateScrollTrigger)
  lenis.destroy()
  lenis = undefined
  ScrollTrigger.refresh()
}

function handleMotionPreference() {
  if (motionQuery?.matches) {
    stopLenis()
    return
  }

  startLenis()
}

watch(
  () => route.path,
  (path, previousPath, onCleanup) => {
    if (path !== '/blog' || typeof window === 'undefined') return

    // Reset after the new page renders and native history restoration settles.
    const frame = window.requestAnimationFrame(() => {
      if (lenis) {
        lenis.resize()
        lenis.scrollTo(0, { immediate: true, force: true })
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }
    })
    onCleanup(() => window.cancelAnimationFrame(frame))
  },
  { flush: 'post' },
)

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  handleMotionPreference()
  motionQuery.addEventListener('change', handleMotionPreference)
})

onBeforeUnmount(() => {
  motionQuery?.removeEventListener('change', handleMotionPreference)
  stopLenis()
})
</script>
