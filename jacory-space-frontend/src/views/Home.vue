<template>
  <div class="min-h-screen bg-white">
    <!-- Hero section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center">
        <h1 class="text-5xl font-bold text-gray-900 mb-6">
          {{ t('home.title') }}
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          {{ t('home.subtitle') }}
        </p>
        <div class="flex justify-center gap-4">
          <router-link
            to="/video-parser"
            class="px-6 py-3 bg-[#6b7a2e] text-white rounded-lg font-semibold hover:bg-[#556123] transition-colors"
          >
            {{ t('home.actions.videoParser') }}
          </router-link>
          <router-link
            to="/about"
            class="px-6 py-3 bg-white text-[#6b7a2e] border-2 border-[#6b7a2e] rounded-lg font-semibold hover:bg-[#f6f2e8] transition-colors"
          >
            {{ t('home.actions.about') }}
          </router-link>
        </div>
      </div>

      <!-- Tool cards -->
      <div class="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="bg-white rounded-xl border border-gray-200 p-6 hover:border-[#d6ddbe] transition-colors">
          <div class="mb-4 text-[#b75e22]">
            <Clapperboard class="h-10 w-10" />
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">{{ t('home.cards.video.title') }}</h3>
          <p class="text-gray-600 mb-4">
            {{ t('home.cards.video.description') }}
          </p>
          <router-link
            to="/video-parser"
            class="inline-flex items-center gap-1 text-[#6b7a2e] font-medium hover:text-[#556123]"
          >
            <span>{{ t('home.cards.video.action') }}</span>
            <ArrowRight class="h-4 w-4" />
          </router-link>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6 hover:border-[#d6ddbe] transition-colors">
          <div class="mb-4 text-[#6b7a2e]">
            <FileText class="h-10 w-10" />
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">{{ t('home.cards.blog.title') }}</h3>
          <p class="text-gray-600 mb-4">
            {{ t('home.cards.blog.description') }}
          </p>
          <router-link
            to="/blog"
            class="inline-flex items-center gap-1 text-[#6b7a2e] font-medium hover:text-[#556123]"
          >
            <span>{{ t('home.cards.blog.action') }}</span>
            <ArrowRight class="h-4 w-4" />
          </router-link>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6 hover:border-[#d6ddbe] transition-colors opacity-80">
          <div class="mb-4 text-[#6b7a2e]">
            <Wrench class="h-10 w-10" />
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">{{ t('home.cards.tools.title') }}</h3>
          <p class="text-gray-600 mb-4">
            {{ t('home.cards.tools.description') }}
          </p>
          <span class="text-gray-400 font-medium">{{ t('home.cards.tools.status') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ArrowRight, Clapperboard, FileText, Wrench } from 'lucide-vue-next'

const { t } = useI18n()
</script>
