<template>
  <nav class="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <Clapperboard class="h-7 w-7 text-[#b75e22]" />
            <span class="text-xl font-bold text-gray-900">Jacory Space</span>
          </router-link>
        </div>

        <div class="hidden md:flex items-center space-x-8">
          <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">{{ t('nav.home') }}</router-link>
          <router-link to="/video-parser" class="nav-link" :class="{ active: $route.path === '/video-parser' }">{{ t('nav.videoParser') }}</router-link>
          <router-link to="/blog" class="nav-link" :class="{ active: $route.path === '/blog' }">{{ t('nav.blog') }}</router-link>
          <router-link to="/about" class="nav-link" :class="{ active: $route.path === '/about' }">{{ t('nav.about') }}</router-link>
          <LanguageSwitcher />
        </div>

        <div class="md:hidden">
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-[#5a533f] hover:text-gray-900 focus:outline-none">
            <Menu v-if="!mobileMenuOpen" class="h-6 w-6" />
            <X v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-200">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link to="/" class="mobile-nav-link" @click="mobileMenuOpen = false">{{ t('nav.home') }}</router-link>
        <router-link to="/video-parser" class="mobile-nav-link" @click="mobileMenuOpen = false">{{ t('nav.videoParser') }}</router-link>
        <router-link to="/blog" class="mobile-nav-link" @click="mobileMenuOpen = false">{{ t('nav.blog') }}</router-link>
        <router-link to="/about" class="mobile-nav-link" @click="mobileMenuOpen = false">{{ t('nav.about') }}</router-link>
        <div class="px-3 pt-2">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Clapperboard, Menu, X } from 'lucide-vue-next'
import LanguageSwitcher from './LanguageSwitcher.vue'

const mobileMenuOpen = ref(false)
const { t } = useI18n()
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
