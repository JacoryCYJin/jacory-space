<template>
  <div>
    <Navbar v-if="!isMinecraftSkinEditor" />
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'

const route = useRoute()
const isMinecraftSkinEditor = computed(() => route.path === '/tools/minecraft-skin-editor')
</script>
