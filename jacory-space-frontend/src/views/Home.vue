<template>
  <FooterReveal style="--footer-reveal-extension-background: var(--home-development-background)">
    <main ref="homeRoot" class="grain relative w-full bg-background [--navbar-height:4rem] [--home-transition-stage-height:calc(100svh-4rem)]">
      <HomeLoadingIdentity
        :home-ready="homePrepared"
        :progress="readiness.progress.value"
        :failed="readiness.failed.value || preparationFailed"
        @complete="handleLoadingComplete"
      />

      <HomeWhoAmI
        :active="loadingComplete"
        @ready="handleHeroSceneReady"
        @error="heroTask.reject"
        @takeover-change="handleTakeoverChange"
      />
      <HomeJacoryReveal
        :identity-visible="transitionReady"
        @matrix-progress="handleMatrixProgress"
        @handoff-change="handleHandoffChange"
      />
      <HomeCapabilitiesPage
        ref="capabilitiesPage"
        @header-ready="handleCapabilitiesHeaderReady"
      >
        <template #photo-video>
          <HomePhotoVideoPage />
        </template>
        <template #web-development>
          <HomeWebDevelopmentPage />
        </template>
      </HomeCapabilitiesPage>
      <div
        ref="sharedDotLayer"
        data-home-shared-dot-layer
        class="home-shared-dot-layer pointer-events-none"
        :class="[
          isDotMatrixActive ? 'is-visible' : 'is-hidden',
          handoffActive ? 'is-capabilities' : 'is-jacory'
        ]"
        :style="sharedDotLayerStyle"
        aria-hidden="true"
      >
        <HomeDotMatrixField
          :active="isDotMatrixActive"
          :blackout-progress="matrixState.blackoutProgress"
          :dissolve-progress="matrixState.dissolveProgress"
          :terminal-progress="matrixState.terminalProgress"
          @ready="handleDotMatrixReady"
          @error="dotMatrixTask.reject"
        />
      </div>
      <div
        data-home-blackout-veil
        class="home-blackout-veil pointer-events-none"
        :class="[
          blackoutComplete && !handoffActive ? 'is-visible' : 'is-hidden',
          handoffActive ? 'is-capabilities' : 'is-jacory'
        ]"
        :style="blackoutVeilStyle"
        aria-hidden="true"
      />
    </main>
  </FooterReveal>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { decodeHomeImage, loadHomeFonts, useHomeReadiness } from '../composables/useHomeReadiness'
import FooterReveal from '../components/FooterReveal.vue'
import HomeLoadingIdentity from '../components/home/loading/HomeLoadingIdentity.vue'
import HomeWhoAmI from '../components/home/who-am-i/HomeWhoAmI.vue'
import HomeJacoryReveal from '../components/home/jacory-reveal/HomeJacoryReveal.vue'
import HomeCapabilitiesPage from '../components/home/capabilities/HomeCapabilitiesPage.vue'
import HomePhotoVideoPage from '../components/home/capabilities/HomePhotoVideoPage.vue'
import HomeWebDevelopmentPage from '../components/home/capabilities/HomeWebDevelopmentPage.vue'
import HomeDotMatrixField from '../components/home/jacory-reveal/HomeDotMatrixField.vue'

const transitionReady = ref(false)
const readiness = useHomeReadiness()
const heroTask = readiness.register('hero-scene')
const dotMatrixTask = readiness.register('dot-matrix-scene')
const homePrepared = ref(false)
const preparationFailed = ref(false)
const loadingComplete = ref(false)
const homeRoot = ref(null)
const capabilitiesPage = ref(null)
const capabilitiesHeader = ref(null)
const handoffActive = ref(false)
const capabilityLayerBounds = ref(null)
const matrixState = ref({ terminalProgress: 0, dissolveProgress: 0, blackoutProgress: 0 })
let geometryObserver
let disposed = false

const NAVBAR_HEIGHT = 64
const blackoutComplete = computed(() => matrixState.value.blackoutProgress >= 0.999)
const isDotMatrixActive = computed(
  () => transitionReady.value && !(blackoutComplete.value && handoffActive.value)
)

const sharedDotLayerStyle = computed(() => {
  if (!handoffActive.value || !capabilityLayerBounds.value) return {}

  const { height, left, top, width } = capabilityLayerBounds.value
  return {
    height: `${height}px`,
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`
  }
})

const blackoutVeilStyle = computed(() => {
  if (!handoffActive.value || !capabilityLayerBounds.value) return {}

  const { height, left, top, width } = capabilityLayerBounds.value
  return {
    height: `${height + NAVBAR_HEIGHT}px`,
    left: `${left}px`,
    top: `${top - NAVBAR_HEIGHT}px`,
    width: `${width}px`
  }
})

const handleLoadingComplete = () => {
  loadingComplete.value = true
}

const handleTakeoverChange = (isComplete) => {
  transitionReady.value = isComplete
}

const handleMatrixProgress = (nextState) => {
  matrixState.value = nextState
}

const syncCapabilitiesGeometry = () => {
  if (!homeRoot.value || !capabilitiesHeader.value) return

  const homeRect = homeRoot.value.getBoundingClientRect()
  const headerRect = capabilitiesHeader.value.getBoundingClientRect()
  capabilityLayerBounds.value = {
    height: headerRect.height,
    left: headerRect.left - homeRect.left,
    top: headerRect.top - homeRect.top,
    width: headerRect.width
  }
}

const handleCapabilitiesHeaderReady = (element) => {
  capabilitiesHeader.value = element
  geometryObserver?.disconnect()
  geometryObserver = new ResizeObserver(syncCapabilitiesGeometry)
  geometryObserver.observe(element)
  if (homeRoot.value) geometryObserver.observe(homeRoot.value)
  syncCapabilitiesGeometry()
}

const handleHandoffChange = async (isActive) => {
  if (isActive) {
    await nextTick()
    syncCapabilitiesGeometry()
    await capabilitiesPage.value.prepareVisualDesignHandoff()
  }

  handoffActive.value = isActive
}

const handleHeroSceneReady = () => {
  heroTask.resolve()
  if (import.meta.env.DEV) performance.mark('home-loader:hero-ready')
}

const handleDotMatrixReady = () => {
  dotMatrixTask.resolve()
  if (import.meta.env.DEV) performance.mark('home-loader:dot-matrix-ready')
}

watch(readiness.ready, async (ready) => {
  if (!ready || disposed) return
  try {
    await nextTick()
    await capabilitiesPage.value.prepareVisualDesignHandoff()
    if (disposed) return
    ScrollTrigger.refresh()
    syncCapabilitiesGeometry()
    homePrepared.value = true
  } catch (error) {
    if (disposed) return
    preparationFailed.value = true
    console.error('[HomeReadiness] Final homepage layout failed', error)
  }
})

onMounted(async () => {
  transitionReady.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // Child mount hooks select this visit's photos. Wait for those images to enter
  // the DOM before sealing the inventory, including the shared navbar/footer.
  await nextTick()
  if (disposed) return
  const appRoot = homeRoot.value.closest('#app')
  void readiness.register('homepage-fonts').run(() => loadHomeFonts(appRoot))
  appRoot.querySelectorAll('img').forEach((image, index) => {
    void readiness.register(`homepage-image-${index}`).run(() => decodeHomeImage(image))
  })
  readiness.seal()
})

onBeforeUnmount(() => {
  disposed = true
  geometryObserver?.disconnect()
})
</script>

<style scoped>
.home-shared-dot-layer {
  z-index: 30;
}

.home-shared-dot-layer.is-hidden {
  visibility: hidden;
}

.home-shared-dot-layer.is-visible {
  visibility: visible;
}

.home-shared-dot-layer.is-jacory {
  position: fixed;
  inset: var(--navbar-height, 4rem) 0 auto;
  height: var(--home-transition-stage-height);
}

.home-shared-dot-layer.is-capabilities {
  position: absolute;
}

.home-blackout-veil {
  z-index: 60;
  background: #000;
}

.home-blackout-veil.is-hidden {
  visibility: hidden;
}

.home-blackout-veil.is-visible {
  visibility: visible;
}

.home-blackout-veil.is-jacory {
  position: fixed;
  inset: 0;
}

.home-blackout-veil.is-capabilities {
  position: absolute;
}
</style>
