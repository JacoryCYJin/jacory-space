<template>
  <FooterReveal>
    <main ref="homeRoot" class="grain relative w-full bg-background [--navbar-height:4rem] [--home-transition-stage-height:calc(100svh-4rem)]">
      <HomeLoadingIdentity
        :hero-ready="heroSceneReady"
        :dot-matrix-ready="dotMatrixReady"
        @complete="handleLoadingComplete"
      />

      <HomeWhoAmI
        :active="loadingComplete"
        @ready="handleHeroSceneReady"
        @takeover-change="handleTakeoverChange"
      />
      <HomeJacoryReveal
        :identity-visible="transitionReady"
        @matrix-progress="handleMatrixProgress"
        @handoff-change="handleHandoffChange"
      />
      <HomeCapabilitiesPage @header-ready="handleCapabilitiesHeaderReady" />
      <div
        ref="sharedDotLayer"
        data-home-shared-dot-layer
        class="home-shared-dot-layer pointer-events-none"
        :class="[
          transitionReady && !(blackoutComplete && handoffActive) ? 'is-visible' : 'is-hidden',
          handoffActive ? 'is-capabilities' : 'is-jacory'
        ]"
        :style="sharedDotLayerStyle"
        aria-hidden="true"
      >
        <HomeDotMatrixField
          :blackout-progress="matrixState.blackoutProgress"
          :dissolve-progress="matrixState.dissolveProgress"
          :terminal-progress="matrixState.terminalProgress"
          @ready="handleDotMatrixReady"
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
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import FooterReveal from '../components/FooterReveal.vue'
import HomeLoadingIdentity from '../components/home/loading/HomeLoadingIdentity.vue'
import HomeWhoAmI from '../components/home/who-am-i/HomeWhoAmI.vue'
import HomeJacoryReveal from '../components/home/jacory-reveal/HomeJacoryReveal.vue'
import HomeCapabilitiesPage from '../components/home/capabilities/HomeCapabilitiesPage.vue'
import HomeDotMatrixField from '../components/home/jacory-reveal/HomeDotMatrixField.vue'

const transitionReady = ref(false)
const heroSceneReady = ref(false)
const dotMatrixReady = ref(false)
const loadingComplete = ref(false)
const homeRoot = ref(null)
const capabilitiesHeader = ref(null)
const handoffActive = ref(false)
const capabilityLayerBounds = ref(null)
const matrixState = ref({ terminalProgress: 0, dissolveProgress: 0, blackoutProgress: 0 })
let geometryObserver

const NAVBAR_HEIGHT = 64
const blackoutComplete = computed(() => matrixState.value.blackoutProgress >= 0.999)

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
  }

  handoffActive.value = isActive
}

const handleHeroSceneReady = () => {
  heroSceneReady.value = true
  if (import.meta.env.DEV) performance.mark('home-loader:hero-ready')
}

const handleDotMatrixReady = () => {
  dotMatrixReady.value = true
  if (import.meta.env.DEV) performance.mark('home-loader:dot-matrix-ready')
}

onMounted(() => {
  transitionReady.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

onBeforeUnmount(() => {
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
