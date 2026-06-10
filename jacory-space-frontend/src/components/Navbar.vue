<template>
  <nav class="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <span class="text-2xl">🎬</span>
            <span class="text-xl font-bold text-gray-900">Jacory Space</span>
          </router-link>
        </div>

        <div class="hidden md:flex items-center space-x-8">
          <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">首页</router-link>
          <router-link to="/video-parser" class="nav-link" :class="{ active: $route.path === '/video-parser' }">视频解析</router-link>
          <router-link to="/colors" class="nav-link" :class="{ active: $route.path === '/colors' }">配色</router-link>
          <router-link to="/about" class="nav-link" :class="{ active: $route.path === '/about' }">关于我</router-link>
        </div>

        <div class="md:hidden">
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-[#5a533f] hover:text-gray-900 focus:outline-none">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-200">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link to="/" class="mobile-nav-link" @click="mobileMenuOpen = false">首页</router-link>
        <router-link to="/video-parser" class="mobile-nav-link" @click="mobileMenuOpen = false">视频解析</router-link>
        <router-link to="/colors" class="mobile-nav-link" @click="mobileMenuOpen = false">配色</router-link>
        <router-link to="/about" class="mobile-nav-link" @click="mobileMenuOpen = false">关于我</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
const mobileMenuOpen = ref(false)
</script>

<style scoped>
.nav-link {
  @apply text-gray-600 hover:text-[#6b7a2e] font-medium transition-colors;
}

.nav-link.active {
  @apply text-[#b75e22];
}

.mobile-nav-link {
  @apply block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-[#6b7a2e] hover:bg-[#f7f8f3] transition-colors;
}
</style>
