<template>
  <div class="min-h-screen bg-white py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <section class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-[#f7f8f3] text-[#556123] rounded-full text-sm font-medium mb-5">
          <BookOpen class="h-4 w-4" />
          <span>{{ t('blog.badge') }}</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{{ t('blog.title') }}</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          {{ t('blog.subtitle') }}
        </p>
      </section>

      <section class="grid lg:grid-cols-[1fr_280px] gap-8">
        <div class="space-y-5">
          <article
            v-for="post in posts"
            :key="post.title"
            class="bg-white rounded-2xl border border-gray-200 p-6 hover:border-[#d6ddbe] hover:shadow-sm transition-all"
          >
            <div class="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
              <span class="inline-flex items-center gap-1">
                <CalendarDays class="h-4 w-4" />
                {{ post.date }}
              </span>
              <span class="inline-flex items-center gap-1">
                <Clock3 class="h-4 w-4" />
                {{ post.readingTime }}
              </span>
            </div>

            <h2 class="text-2xl font-bold text-gray-900 mb-3">{{ post.title }}</h2>
            <p class="text-gray-600 leading-7 mb-5">{{ post.summary }}</p>

            <div class="flex flex-wrap items-center justify-between gap-4">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in post.tags"
                  :key="tag"
                  class="inline-flex items-center gap-1 px-3 py-1 bg-[#f6f2e8] text-[#964a19] rounded-full text-xs font-medium"
                >
                  <Tags class="h-3.5 w-3.5" />
                  {{ tag }}
                </span>
              </div>
              <span class="inline-flex items-center gap-1 text-[#6b7a2e] font-medium">
                {{ t('blog.readMore') }}
                <ArrowRight class="h-4 w-4" />
              </span>
            </div>
          </article>
        </div>

        <aside class="space-y-5">
          <div class="rounded-2xl border border-gray-200 p-6 bg-[#fbfaf7]">
            <div class="flex items-center gap-2 text-gray-900 font-bold mb-4">
              <Search class="h-5 w-5 text-[#6b7a2e]" />
              <span>{{ t('blog.directionTitle') }}</span>
            </div>
            <div class="space-y-3">
              <div
                v-for="category in categories"
                :key="category.name"
                class="flex items-center justify-between text-sm"
              >
                <span class="text-gray-600">{{ category.name }}</span>
                <span class="text-[#b75e22] font-semibold">{{ category.count }}</span>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-[#d8dfc0] p-6 bg-[#f7f8f3]">
            <div class="flex items-center gap-2 text-[#445122] font-bold mb-3">
              <FileText class="h-5 w-5" />
              <span>{{ t('blog.writingPlanTitle') }}</span>
            </div>
            <p class="text-sm text-gray-600 leading-6">
              {{ t('blog.writingPlanDescription') }}
            </p>
          </div>
        </aside>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowRight, BookOpen, CalendarDays, Clock3, FileText, Search, Tags } from 'lucide-vue-next'

const { t, tm } = useI18n()

const posts = computed(() => [
  {
    title: t('blog.posts.site.title'),
    date: '2026-06-12',
    readingTime: t('blog.posts.site.readingTime'),
    summary: t('blog.posts.site.summary'),
    tags: tm('blog.posts.site.tags')
  },
  {
    title: t('blog.posts.parser.title'),
    date: '2026-06-10',
    readingTime: t('blog.posts.parser.readingTime'),
    summary: t('blog.posts.parser.summary'),
    tags: tm('blog.posts.parser.tags')
  },
  {
    title: t('blog.posts.workflow.title'),
    date: '2026-06-08',
    readingTime: t('blog.posts.workflow.readingTime'),
    summary: t('blog.posts.workflow.summary'),
    tags: tm('blog.posts.workflow.tags')
  },
  {
    title: t('blog.posts.writing.title'),
    date: '2026-06-06',
    readingTime: t('blog.posts.writing.readingTime'),
    summary: t('blog.posts.writing.summary'),
    tags: tm('blog.posts.writing.tags')
  }
])

const categories = computed(() => [
  { name: t('blog.categories.project'), count: 2 },
  { name: t('blog.categories.development'), count: 2 },
  { name: t('blog.categories.workflow'), count: 1 },
  { name: t('blog.categories.life'), count: 1 }
])
</script>
