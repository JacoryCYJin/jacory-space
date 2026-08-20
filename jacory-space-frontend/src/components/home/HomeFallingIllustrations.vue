<template>
  <div
    ref="fieldRoot"
    class="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-0"
    aria-hidden="true"
  >
    <div ref="fieldLayer" class="absolute inset-0">
      <img
        v-for="(slot, index) in renderedParticleSlots"
        :key="slot.id"
        :src="illustrationAssets[slot.initialAssetIndex].src"
        alt=""
        class="home-falling-illustration absolute left-0 top-0 block aspect-square select-none object-contain grayscale"
        draggable="false"
        decoding="async"
        :fetchpriority="index < 2 ? 'high' : 'auto'"
      />
    </div>

    <div class="absolute inset-0 z-[1]">
      <img
        v-for="index in TRAIL_POOL_SIZE"
        :key="`cursor-trail-${index}`"
        alt=""
        class="home-cursor-trail invisible absolute left-0 top-0 block aspect-square select-none object-contain"
        draggable="false"
        decoding="async"
      />
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  }
})

const illustrationModules = import.meta.glob('../../assets/home-falling/*.png', {
  eager: true,
  import: 'default',
  query: '?url'
})

const allIllustrationAssets = Object.entries(illustrationModules).map(([path, src]) => ({
  id: path.split('/').pop().replace(/\.png$/i, ''),
  src
}))

function shuffleIllustrations(assets, previousLastId = null) {
  const shuffled = [...assets]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const current = shuffled[index]
    shuffled[index] = shuffled[randomIndex]
    shuffled[randomIndex] = current
  }

  if (previousLastId && shuffled.length > 1 && shuffled[0].id === previousLastId) {
    const swapIndex = 1 + Math.floor(Math.random() * (shuffled.length - 1))
    const first = shuffled[0]
    shuffled[0] = shuffled[swapIndex]
    shuffled[swapIndex] = first
  }

  return shuffled
}

let illustrationAssets = shuffleIllustrations(allIllustrationAssets)

const particleSlots = [
  {
    id: 'outer-left',
    initialAssetIndex: 0,
    desktopX: 0.06,
    mobileX: 0.05,
    initialProgress: 0.16,
    staticY: 0.46,
    speed: 25,
    drift: 32,
    driftFrequency: 0.28,
    driftPhase: 0.6,
    rotation: -10,
    rotationSpeed: 3.2,
    opacity: 0.82
  },
  {
    id: 'outer-right',
    initialAssetIndex: 1,
    desktopX: 0.92,
    mobileX: 0.92,
    initialProgress: 0.43,
    staticY: 0.68,
    speed: 31,
    drift: 40,
    driftFrequency: 0.34,
    driftPhase: 2.4,
    rotation: 14,
    rotationSpeed: -4.8,
    opacity: 0.78
  },
  {
    id: 'inner-left',
    initialAssetIndex: 2,
    desktopX: 0.25,
    mobileX: 0.34,
    initialProgress: 0.72,
    staticY: 0.72,
    speed: 23,
    drift: 26,
    driftFrequency: 0.24,
    driftPhase: 4.5,
    rotation: -16,
    rotationSpeed: 2.6,
    opacity: 0.68
  },
  {
    id: 'inner-right',
    initialAssetIndex: 3,
    desktopX: 0.76,
    mobileX: 0.76,
    initialProgress: 0.25,
    staticY: 0.42,
    speed: 29,
    drift: 30,
    driftFrequency: 0.3,
    driftPhase: 5.2,
    rotation: 9,
    rotationSpeed: -3.8,
    opacity: 0.66
  },
  {
    id: 'center-left',
    initialAssetIndex: 4,
    desktopX: 0.43,
    mobileX: 0.43,
    initialProgress: 0.54,
    staticY: 0.55,
    speed: 21,
    drift: 22,
    driftFrequency: 0.22,
    driftPhase: 1.8,
    rotation: -6,
    rotationSpeed: 2.2,
    opacity: 0.58
  },
  {
    id: 'center-right',
    initialAssetIndex: 5,
    desktopX: 0.61,
    mobileX: 0.61,
    initialProgress: 0.84,
    staticY: 0.74,
    speed: 27,
    drift: 24,
    driftFrequency: 0.26,
    driftPhase: 3.7,
    rotation: 12,
    rotationSpeed: -3,
    opacity: 0.62
  }
]

const renderedParticleSlots = particleSlots.slice(
  0,
  Math.min(particleSlots.length, illustrationAssets.length)
)
const DESKTOP_PARTICLE_COUNT = renderedParticleSlots.length
const MOBILE_PARTICLE_COUNT = Math.min(3, renderedParticleSlots.length)
const TRAIL_POOL_SIZE = 12
const TRAIL_SPACING = 64
const MAX_TRAIL_STEPS_PER_EVENT = 3

const fieldRoot = ref(null)
const fieldLayer = ref(null)
let particles = []
let trailItems = []
let motionMedia
let activeTween
let stopActiveWatch
let tickerActive = false
let resizeFrame = 0
let elapsed = 0
let reducedMotion = false
let nextAssetIndex = 0
let preloadedImages = []
let trailAssets = shuffleIllustrations(allIllustrationAssets)
let nextTrailAssetIndex = 0
let nextTrailItemIndex = 0
let lastTrailPoint = null

function clamp01(value) {
  return gsap.utils.clamp(0, 1, value)
}

function opacityAtProgress(progress) {
  if (progress < 0.07) return progress / 0.07
  if (progress > 0.9) return (1 - progress) / 0.1
  return 1
}

function setParticleTransform(particle, progress) {
  const fade = clamp01(opacityAtProgress(progress))
  const drift = reducedMotion
    ? 0
    : Math.sin(elapsed * particle.config.driftFrequency + particle.config.driftPhase)
      * particle.config.drift

  particle.setX(particle.baseX + drift)
  particle.setY(particle.y)
  particle.setRotation(particle.rotation)
  particle.setOpacity(particle.config.opacity * fade)
}

function setParticleAsset(particle, assetIndex) {
  const asset = illustrationAssets[assetIndex]
  if (!asset) return

  particle.assetIndex = assetIndex
  particle.element.src = asset.src
}

function resetAssetRotation(activeCount) {
  particles.forEach((particle, index) => {
    setParticleAsset(particle, particle.config.initialAssetIndex)
    particle.rotation = particle.config.rotation
    particle.element.hidden = index >= activeCount
  })
  nextAssetIndex = Math.min(activeCount, illustrationAssets.length)
}

function advanceParticleAsset(particle) {
  if (!illustrationAssets.length) return

  if (nextAssetIndex >= illustrationAssets.length) {
    const previousLastId = illustrationAssets[illustrationAssets.length - 1].id
    illustrationAssets = shuffleIllustrations(allIllustrationAssets, previousLastId)
    nextAssetIndex = 0
  }

  setParticleAsset(particle, nextAssetIndex)
  nextAssetIndex += 1
}

function preloadIllustrations() {
  if (preloadedImages.length) return

  preloadedImages = illustrationAssets.map((asset) => {
    const image = new Image()
    image.decoding = 'async'
    image.src = asset.src
    return image
  })
}

function takeNextTrailAsset() {
  if (!trailAssets.length) return null

  if (nextTrailAssetIndex >= trailAssets.length) {
    const previousLastId = trailAssets[trailAssets.length - 1].id
    trailAssets = shuffleIllustrations(allIllustrationAssets, previousLastId)
    nextTrailAssetIndex = 0
  }

  const asset = trailAssets[nextTrailAssetIndex]
  nextTrailAssetIndex += 1
  return asset
}

function clearMouseTrail() {
  lastTrailPoint = null

  trailItems.forEach((item) => {
    item.tween?.kill()
    item.tween = null
    gsap.set(item.element, { autoAlpha: 0 })
  })
}

function spawnMouseTrail(x, y) {
  const item = trailItems[nextTrailItemIndex]
  const asset = takeNextTrailAsset()
  if (!item || !asset) return

  nextTrailItemIndex = (nextTrailItemIndex + 1) % trailItems.length
  item.tween?.kill()
  item.element.src = asset.src

  const startRotation = Math.round(Math.random() * 20 - 10)
  const offsetX = Math.round(Math.random() * 20 - 10)
  const offsetY = Math.round(Math.random() * 12 + 12)
  const rotationDelta = Math.round(Math.random() * 16 - 8)

  gsap.set(item.element, {
    x,
    y,
    xPercent: -50,
    yPercent: -50,
    scale: 0.82,
    rotation: startRotation,
    autoAlpha: 0.9
  })

  item.tween = gsap.to(item.element, {
    x: x + offsetX,
    y: y + offsetY,
    scale: 1,
    rotation: startRotation + rotationDelta,
    autoAlpha: 0,
    duration: 0.82,
    ease: 'power2.out',
    overwrite: true,
    onComplete: () => {
      item.tween = null
    }
  })
}

function handleTrailPointerMove(event, root, emitTrail) {
  if (!props.active || (event.pointerType && event.pointerType !== 'mouse')) return

  const bounds = root.getBoundingClientRect()
  const point = {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top
  }

  if (
    point.x < 0
    || point.x > bounds.width
    || point.y < 0
    || point.y > bounds.height
  ) {
    clearMouseTrail()
    return
  }

  if (!lastTrailPoint) {
    lastTrailPoint = point
    emitTrail(point.x, point.y)
    return
  }

  const distance = Math.hypot(
    point.x - lastTrailPoint.x,
    point.y - lastTrailPoint.y
  )
  if (distance < TRAIL_SPACING) return

  const steps = Math.min(
    Math.floor(distance / TRAIL_SPACING),
    MAX_TRAIL_STEPS_PER_EVENT
  )

  for (let index = 1; index <= steps; index += 1) {
    const progress = index / steps
    emitTrail(
      lastTrailPoint.x + (point.x - lastTrailPoint.x) * progress,
      lastTrailPoint.y + (point.y - lastTrailPoint.y) * progress
    )
  }

  lastTrailPoint = point
}

function layoutParticles({ isDesktop, preserveProgress = true }) {
  const root = fieldRoot.value
  if (!root) return

  const width = root.clientWidth
  const height = root.clientHeight
  const activeCount = isDesktop ? DESKTOP_PARTICLE_COUNT : MOBILE_PARTICLE_COUNT

  particles.forEach((particle, index) => {
    const isActive = index < activeCount
    particle.element.hidden = !isActive
    if (!isActive) return

    const previousProgress = particle.distance > 0
      ? clamp01((particle.y - particle.startY) / particle.distance)
      : particle.config.initialProgress
    const size = particle.element.offsetWidth
    const anchor = isDesktop ? particle.config.desktopX : particle.config.mobileX

    particle.startY = -size * 1.12
    particle.endY = height + size * 0.14
    particle.distance = particle.endY - particle.startY
    particle.baseX = width * anchor - size * 0.5
    particle.y = particle.startY + particle.distance * (
      preserveProgress ? previousProgress : particle.config.initialProgress
    )
    setParticleTransform(
      particle,
      clamp01((particle.y - particle.startY) / particle.distance)
    )
  })
}

function setStaticComposition(isDesktop) {
  const root = fieldRoot.value
  if (!root) return

  const width = root.clientWidth
  const height = root.clientHeight

  particles.forEach((particle, index) => {
    const isActive = index < 2
    particle.element.hidden = !isActive
    if (!isActive) return

    const size = particle.element.offsetWidth
    const anchor = isDesktop ? particle.config.desktopX : particle.config.mobileX

    particle.baseX = width * anchor - size * 0.5
    particle.y = height * particle.config.staticY - size * 0.5
    particle.rotation = particle.config.rotation
    particle.setX(particle.baseX)
    particle.setY(particle.y)
    particle.setRotation(particle.rotation)
    particle.setOpacity(particle.config.opacity)
  })
}

function updateParticles(_time, deltaTime) {
  if (!props.active || reducedMotion) return

  const delta = Math.min(Math.max(deltaTime / 1000, 0), 0.05)
  elapsed += delta

  particles.forEach((particle) => {
    if (particle.element.hidden) return

    particle.y += particle.config.speed * delta
    particle.rotation += particle.config.rotationSpeed * delta

    if (particle.y > particle.endY) {
      particle.y = particle.startY
      particle.rotation += 26
      advanceParticleAsset(particle)
    }

    const progress = clamp01((particle.y - particle.startY) / particle.distance)
    setParticleTransform(particle, progress)
  })
}

function startTicker() {
  if (tickerActive) return
  tickerActive = true
  gsap.ticker.add(updateParticles)
}

function stopTicker() {
  if (!tickerActive) return
  tickerActive = false
  gsap.ticker.remove(updateParticles)
}

function scheduleLayout(isDesktop) {
  if (resizeFrame) window.cancelAnimationFrame(resizeFrame)
  resizeFrame = window.requestAnimationFrame(() => {
    resizeFrame = 0
    if (reducedMotion) setStaticComposition(isDesktop)
    else layoutParticles({ isDesktop })
  })
}

onMounted(() => {
  const root = fieldRoot.value
  const layer = fieldLayer.value
  if (!root || !layer) return

  particles = Array.from(root.querySelectorAll('.home-falling-illustration')).map(
    (element, index) => ({
      config: particleSlots[index],
      element,
      setX: gsap.quickSetter(element, 'x', 'px'),
      setY: gsap.quickSetter(element, 'y', 'px'),
      setRotation: gsap.quickSetter(element, 'rotation', 'deg'),
      setOpacity: gsap.quickSetter(element, 'opacity'),
      baseX: 0,
      startY: 0,
      endY: 0,
      distance: 0,
      y: 0,
      rotation: particleSlots[index].rotation,
      assetIndex: particleSlots[index].initialAssetIndex
    })
  )
  trailItems = Array.from(root.querySelectorAll('.home-cursor-trail')).map(
    (element) => ({ element, tween: null })
  )

  motionMedia = gsap.matchMedia()
  motionMedia.add(
    {
      isDesktop: '(min-width: 768px)',
      hasFinePointer: '(hover: hover) and (pointer: fine)',
      reduceMotion: '(prefers-reduced-motion: reduce)'
    },
    (context) => {
      const { isDesktop, hasFinePointer, reduceMotion } = context.conditions
      reducedMotion = reduceMotion
      const activeCount = isDesktop ? DESKTOP_PARTICLE_COUNT : MOBILE_PARTICLE_COUNT
      const heroSection = root.closest('[data-home-hero-section]')
      resetAssetRotation(activeCount)

      if (reduceMotion) {
        stopTicker()
        setStaticComposition(isDesktop)
      } else {
        layoutParticles({ isDesktop, preserveProgress: false })
        startTicker()

        if (heroSection) {
          gsap.timeline({
            scrollTrigger: {
              trigger: heroSection,
              start: 'top top+=64',
              end: () => `+=${Math.max(heroSection.offsetHeight * 2.2, 1200)}`,
              scrub: true,
              invalidateOnRefresh: true
            }
          })
            .to({}, { duration: 0.18 })
            .to(layer, { opacity: 0.45, duration: 0.17, ease: 'none' })
            .to(layer, { opacity: 0, duration: 0.13, ease: 'none' })
            .to({}, { duration: 0.52 })
        }
      }

      let handlePointerMove
      if (isDesktop && hasFinePointer && !reduceMotion && heroSection) {
        context.add('emitMouseTrail', (x, y) => spawnMouseTrail(x, y))
        handlePointerMove = (event) => {
          handleTrailPointerMove(event, root, context.emitMouseTrail)
        }
        heroSection.addEventListener('pointermove', handlePointerMove, { passive: true })
        heroSection.addEventListener('pointerleave', clearMouseTrail)
      }

      const handleResize = () => scheduleLayout(isDesktop)
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        if (handlePointerMove && heroSection) {
          heroSection.removeEventListener('pointermove', handlePointerMove)
          heroSection.removeEventListener('pointerleave', clearMouseTrail)
        }
        clearMouseTrail()
        stopTicker()
      }
    },
    root
  )

  stopActiveWatch = watch(
    () => props.active,
    (isActive) => {
      activeTween?.kill()
      if (!isActive) {
        clearMouseTrail()
        gsap.set(root, { autoAlpha: 0 })
        return
      }

      preloadIllustrations()

      activeTween = gsap.to(root, {
        autoAlpha: 1,
        duration: reducedMotion ? 0 : 0.72,
        ease: 'power2.out',
        overwrite: 'auto'
      })
    },
    { immediate: true }
  )
})

onBeforeUnmount(() => {
  stopActiveWatch?.()
  activeTween?.kill()
  motionMedia?.revert()
  stopTicker()
  clearMouseTrail()
  trailItems = []
  preloadedImages = []
  if (resizeFrame) window.cancelAnimationFrame(resizeFrame)
})
</script>

<style scoped>
.home-falling-illustration {
  width: 10rem;
  height: auto;
  transform-origin: 50% 50%;
  will-change: transform, opacity;
}

.home-cursor-trail {
  width: clamp(5rem, 6vw, 7rem);
  height: auto;
  transform-origin: 50% 50%;
  will-change: transform, opacity;
}

@media (min-width: 768px) {
  .home-falling-illustration {
    width: clamp(10rem, 11vw, 19rem);
  }
}
</style>
