<template>
  <span class="hidden" aria-hidden="true" />
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
