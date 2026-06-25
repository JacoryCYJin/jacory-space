<template>
  <header class="fixed inset-x-0 top-0 z-50">
    <div
      class="relative flex h-16 items-center justify-between px-5 transition-colors duration-500 md:px-8"
      :class="scrolled ? 'border-b border-line bg-background backdrop-blur-md' : 'border-b border-transparent'"
    >
      <router-link to="/" class="group flex items-center gap-3" @click="mobileMenuOpen = false">
        <img :src="jacoryLogo" alt="" class="h-6 w-6 shrink-0 object-contain" />
        <span class="font-mono text-sm tracking-[0.14em] text-foreground transition-colors group-hover:text-blue">
          Jacory Space
        </span>
        <span class="tech hidden text-xs sm:inline">Personal OS / v.01</span>
      </router-link>

      <nav
        aria-label="Primary"
        class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex"
      >
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="group flex items-center gap-2.5"
          :aria-current="isActive(link.to) ? 'page' : undefined"
        >
          <span
            class="font-mono text-[11px] tracking-[0.14em] transition-colors duration-300"
            :class="isActive(link.to) ? 'text-blue' : 'text-muted-foreground opacity-60'"
          >
            {{ link.index }}
          </span>
          <span class="relative font-mono text-sm tracking-[0.1em] uppercase">
            <span
              class="transition-colors duration-300"
              :class="isActive(link.to) ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'"
            >
              {{ link.label }}
            </span>
            <span
              class="absolute -bottom-1 left-0 h-px bg-blue transition-all duration-300 ease-out"
              :class="isActive(link.to) ? 'w-full' : 'w-0 group-hover:w-full'"
            />
          </span>
        </router-link>
      </nav>

      <div class="hidden items-center gap-5 md:flex">
        <div class="text-right">
          <span class="tech block text-xs">39.9°N — 116.4°E</span>
        </div>
        <LanguageSwitcher />
      </div>

      <button
        type="button"
        class="flex items-center gap-2 md:hidden"
        :aria-expanded="mobileMenuOpen"
        :aria-label="mobileMenuOpen ? '关闭菜单' : '打开菜单'"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <span class="tech text-xs">{{ mobileMenuOpen ? 'Close' : 'Menu' }}</span>
        <span class="relative block h-3 w-4">
          <span
            class="absolute left-0 block h-px w-full bg-foreground transition-all duration-300"
            :class="mobileMenuOpen ? 'top-1/2 rotate-45' : 'top-0'"
          />
          <span
            class="absolute bottom-0 left-0 block h-px w-full bg-foreground transition-all duration-300"
            :class="mobileMenuOpen ? 'bottom-1/2 -rotate-45' : ''"
          />
        </span>
      </button>

      <div class="absolute inset-x-0 bottom-0 h-px bg-transparent">
        <div
          class="h-px origin-left bg-blue transition-transform duration-150 ease-out"
          :style="{ transform: `scaleX(${scrollProgress})` }"
        />
      </div>
    </div>

    <div
      class="overflow-hidden border-b border-line bg-background backdrop-blur-md transition-[max-height,opacity] duration-500 ease-out md:hidden"
      :class="mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'"
    >
      <nav aria-label="Mobile" class="flex flex-col px-5 py-2">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-baseline justify-between border-b border-line py-4 last:border-b-0"
          :aria-current="isActive(link.to) ? 'page' : undefined"
          @click="mobileMenuOpen = false"
        >
          <span class="flex items-baseline gap-3">
            <span
              class="font-mono text-[11px] tracking-[0.14em]"
              :class="isActive(link.to) ? 'text-blue' : 'text-muted-foreground opacity-60'"
            >
              {{ link.index }}
            </span>
            <span
              class="font-mono text-base tracking-[0.08em] uppercase"
              :class="isActive(link.to) ? 'text-foreground' : 'text-muted-foreground'"
            >
              {{ link.label }}
            </span>
          </span>
          <span
            class="h-px transition-all"
            :class="isActive(link.to) ? 'w-8 bg-blue' : 'w-4 bg-line-strong'"
          />
        </router-link>
        <div class="flex items-center justify-between py-4">
          <span class="tech text-xs">Locale</span>
          <LanguageSwitcher />
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import jacoryLogo from '../assets/jacory-logo.png'
import LanguageSwitcher from './LanguageSwitcher.vue'

const mobileMenuOpen = ref(false)
const scrolled = ref(false)
const scrollProgress = ref(0)
const route = useRoute()
const { t } = useI18n()

const navLinks = computed(() => [
  { to: '/', index: '00', label: t('nav.home') },
  { to: '/tools', index: '01', label: t('nav.tools') },
  { to: '/blog', index: '02', label: t('nav.blog') },
  { to: '/about', index: '03', label: t('nav.about') },
])

const isActive = (path) => (path === '/' ? route.path === '/' : route.path.startsWith(path))

const updateScrollState = () => {
  const root = document.documentElement
  const max = root.scrollHeight - root.clientHeight
  scrollProgress.value = max > 0 ? root.scrollTop / max : 0
  scrolled.value = root.scrollTop > 8
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollState)
})

watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false
    updateScrollState()
  },
)
</script>
