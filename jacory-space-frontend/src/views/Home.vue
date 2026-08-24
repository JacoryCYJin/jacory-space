<template>
  <FooterReveal>
    <main class="grain w-full bg-background">
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
        @ready="handleDotMatrixReady"
      />
      <HomeCapabilitiesPage />
    </main>
  </FooterReveal>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import FooterReveal from '../components/FooterReveal.vue'
import HomeLoadingIdentity from '../components/home/loading/HomeLoadingIdentity.vue'
import HomeWhoAmI from '../components/home/who-am-i/HomeWhoAmI.vue'
import HomeJacoryReveal from '../components/home/jacory-reveal/HomeJacoryReveal.vue'
import HomeCapabilitiesPage from '../components/home/capabilities/HomeCapabilitiesPage.vue'

const transitionReady = ref(false)
const heroSceneReady = ref(false)
const dotMatrixReady = ref(false)
const loadingComplete = ref(false)

const handleLoadingComplete = () => {
  loadingComplete.value = true
}

const handleTakeoverChange = (isComplete) => {
  transitionReady.value = isComplete
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
</script>
