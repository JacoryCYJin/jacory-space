<template>
  <main ref="pageRoot" class="grain min-h-screen bg-background">
    <section class="page-gutter pt-20 md:pt-24">
      <div class="page-frame">
        <header class="grid gap-12 border-b border-line pb-10 md:pb-14 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,34rem)] lg:items-end lg:gap-16">
          <div data-library-enter>
            <p class="tech mb-5 text-xs text-blue">03 — {{ t('library.kicker') }}</p>
            <h1 class="max-w-3xl font-sans text-5xl font-medium leading-[0.95] tracking-tight text-foreground md:text-7xl">
              {{ t('library.titleLead') }}<span class="italic text-blue">{{ t('library.titleAccent') }}</span>
            </h1>
            <p class="mt-6 max-w-md text-sm leading-7 text-muted-foreground">{{ t('library.description') }}</p>
          </div>

          <div data-library-enter class="lg:justify-self-end lg:w-full">
            <div class="grid grid-cols-3 divide-x divide-line border-b border-line pb-6">
              <div class="pr-5"><p class="tech text-xs text-muted-foreground">{{ t('library.assetsLabel') }}</p><p class="mt-4 font-mono text-3xl text-foreground">{{ libraryEntries.length }}</p></div>
              <div class="px-5"><p class="tech text-xs text-muted-foreground">{{ t('library.promptsLabel') }}</p><p class="mt-4 font-mono text-3xl text-foreground">{{ promptCount }}</p></div>
              <div class="pl-5"><p class="tech text-xs text-muted-foreground">{{ t('library.skillsLabel') }}</p><p class="mt-4 font-mono text-3xl text-foreground">{{ skillCount }}</p></div>
            </div>
            <div class="mt-6 flex items-center justify-between">
              <span class="tech text-xs text-muted-foreground">{{ t('library.updatedLabel') }}</span>
              <span class="font-mono text-sm text-blue">{{ latestUpdate }}</span>
            </div>
          </div>
        </header>
      </div>
    </section>

    <section class="page-gutter pb-20 pt-12 md:pb-28 md:pt-16">
      <div class="page-frame grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[18rem_minmax(0,1fr)] xl:gap-20">
        <aside class="border-b border-line pb-10 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
          <div>
            <p class="tech mb-5 text-xs">{{ t('library.browseLabel') }}</p>
            <nav :aria-label="t('library.filterAria')" class="grid gap-1">
              <button
                v-for="filter in filters"
                :key="filter.id"
                type="button"
                class="flex items-center justify-between py-4 text-left font-mono text-sm uppercase tracking-[0.12em] transition-colors duration-300 hover:text-blue"
                :class="[activeType === filter.id ? 'text-blue' : 'text-muted-foreground', filter.id === 'skill' ? '' : 'border-b border-line']"
                @click="activeType = filter.id"
              >
                <span>{{ filter.label }}</span>
                <span>{{ filter.count }}</span>
              </button>
            </nav>
          </div>

          <div class="mt-12 border-t border-line pt-8">
            <div class="mb-5 flex items-center justify-between gap-4">
              <p class="tech text-xs">{{ t('library.tagsLabel') }}</p>
              <button v-if="selectedTags.length > 0" type="button" class="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-blue" @click="selectedTags = []">
                {{ t('library.clearTags') }}
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in tags"
                :key="tag"
                type="button"
                class="border px-3 py-2 font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-300 hover:border-blue hover:text-blue"
                :class="selectedTags.includes(tag) ? 'border-blue text-blue' : 'border-line text-muted-foreground'"
                @click="toggleTag(tag)"
              >
                {{ tagLabel(tag) }}
              </button>
            </div>
          </div>
        </aside>

        <section class="min-w-0 pt-10 lg:pt-0">
          <div class="flex items-center gap-3 border-b border-line pb-5 text-muted-foreground">
            <Search :size="16" stroke-width="1.5" aria-hidden="true" />
            <label class="min-w-0 flex-1">
              <span class="sr-only">{{ t('library.searchLabel') }}</span>
              <input v-model="query" type="search" :placeholder="t('library.searchPlaceholder')" class="w-full bg-transparent font-mono text-sm tracking-[0.06em] text-foreground outline-none placeholder:text-haze">
            </label>
            <button
              type="button"
              class="inline-flex size-8 shrink-0 items-center justify-center border border-line text-muted-foreground transition-colors duration-300 hover:border-blue hover:text-blue"
              :aria-label="viewMode === 'grid' ? t('library.switchToList') : t('library.switchToGrid')"
              :title="viewMode === 'grid' ? t('library.switchToList') : t('library.switchToGrid')"
              @click="viewMode = viewMode === 'grid' ? 'list' : 'grid'"
            >
              <List v-if="viewMode === 'grid'" :size="15" stroke-width="1.5" aria-hidden="true" />
              <Folder v-else :size="15" stroke-width="1.5" aria-hidden="true" />
            </button>
            <span class="font-mono text-xs text-haze">{{ String(filteredEntries.length).padStart(2, '0') }} / {{ String(libraryEntries.length).padStart(2, '0') }}</span>
          </div>

          <div v-if="filteredEntries.length" :class="viewMode === 'list' ? 'divide-y divide-line' : 'grid gap-x-12 gap-y-16 lg:grid-cols-2'">
            <article
              v-for="(entry, index) in filteredEntries"
              :key="entry.id"
              class="group"
              :class="[
                viewMode === 'list' ? 'grid gap-6 py-8 first:pt-8 md:grid-cols-[6rem_minmax(0,1fr)_10rem] md:gap-8 md:py-10' : 'flex min-h-64 flex-col gap-7 border-t border-line pt-4',
                viewMode === 'grid' && index === 0 ? 'border-t-0' : '',
                viewMode === 'grid' && index === 1 ? 'lg:border-t-0' : '',
              ]"
            >
              <div :class="viewMode === 'list' ? 'flex items-start justify-between md:block' : 'flex items-start justify-between'">
                <span class="font-mono text-2xl text-blue">{{ entry.no }}</span>
                <span class="tech text-xs text-blue" :class="viewMode === 'list' ? 'md:mt-8 md:block' : ''">{{ entry.type === 'skill' ? 'SKILL' : 'PROMPT' }}</span>
              </div>
              <div class="min-w-0">
                <router-link :to="'/library/' + entry.id" class="inline-flex items-center gap-3 font-sans text-2xl font-medium tracking-tight text-foreground transition-colors duration-300 group-hover:text-blue" :class="viewMode === 'list' ? 'md:text-3xl' : ''">
                  {{ t(entry.titleKey) }}
                  <ArrowUpRight :size="18" stroke-width="1.5" class="opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
                </router-link>
                <p class="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{{ t(entry.descriptionKey) }}</p>
                <div class="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.1em] text-haze">
                  <span v-for="tag in entry.tags" :key="tag"># {{ tagLabel(tag) }}</span>
                </div>
              </div>
              <div class="flex items-end justify-between gap-5" :class="viewMode === 'list' ? 'md:flex-col md:items-end md:justify-between md:text-right' : 'mt-auto pt-8'">
                <div class="font-mono text-xs leading-6 text-muted-foreground"><p>{{ entry.version }}</p><p>{{ t('library.updatedLabel') }} {{ entry.updated }}</p></div>
                <div class="flex items-center gap-4">
                  <button type="button" class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-foreground transition-colors hover:text-blue" @click="copyEntry(entry)">
                    <Copy :size="14" stroke-width="1.5" aria-hidden="true" />
                    {{ t('library.copy') }}
                  </button>
                </div>
              </div>
            </article>
          </div>
          <div v-else class="border-b border-line py-16 text-center">
            <p class="font-mono text-sm uppercase tracking-[0.12em] text-muted-foreground">{{ t('library.empty') }}</p>
          </div>
        </section>
      </div>
    </section>
    <StatusToast :visible="toast.visible" :message="toast.message" :type="toast.type" />
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowUpRight, Copy, Folder, List, Search } from 'lucide-vue-next'
import StatusToast from '../components/StatusToast.vue'
import { libraryEntries } from '@library-index'

const { t } = useI18n()
const pageRoot = ref(null)
const activeType = ref('all')
const selectedTags = ref([])
const query = ref('')
const viewMode = ref('grid')
const toast = reactive({ visible: false, message: '', type: 'success' })
let toastTimer

const promptCount = computed(() => libraryEntries.filter((entry) => entry.type === 'prompt').length)
const skillCount = computed(() => libraryEntries.filter((entry) => entry.type === 'skill').length)
const tags = computed(() => [...new Set(libraryEntries.flatMap((entry) => entry.tags))])
const filters = computed(() => [
  { id: 'all', label: t('library.filters.all'), count: String(libraryEntries.length).padStart(2, '0') },
  { id: 'prompt', label: t('library.filters.prompts'), count: String(promptCount.value).padStart(2, '0') },
  { id: 'skill', label: t('library.filters.skills'), count: String(skillCount.value).padStart(2, '0') },
])

const filteredEntries = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase()
  return libraryEntries.filter((entry) => {
    const matchesType = activeType.value === 'all' || entry.type === activeType.value
    const matchesTags = selectedTags.value.every((tag) => entry.tags.includes(tag))
    const searchable = (t(entry.titleKey) + ' ' + t(entry.descriptionKey) + ' ' + entry.tags.map(tagLabel).join(' ')).toLowerCase()
    return matchesType && matchesTags && (!normalizedQuery || searchable.includes(normalizedQuery))
  })
})

const latestUpdate = computed(() => libraryEntries.map((entry) => entry.updated).sort().at(-1))

function tagLabel(tag) {
  return t('library.tags.' + tag)
}

function toggleTag(tag) {
  selectedTags.value = selectedTags.value.includes(tag)
    ? selectedTags.value.filter((item) => item !== tag)
    : [...selectedTags.value, tag]
}

function showToast(message, type = 'success') {
  toast.visible = true
  toast.message = message
  toast.type = type
  clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => { toast.visible = false }, 2200)
}

async function copyEntry(entry) {
  try {
    await navigator.clipboard.writeText(entry.content)
    showToast(t('library.copySuccess'))
  } catch {
    showToast(t('library.copyError'), 'error')
  }
}

onMounted(() => {
  const items = pageRoot.value?.querySelectorAll('[data-library-enter]') || []
  items.forEach((item, index) => {
    item.style.opacity = '0'
    item.style.transform = 'translateY(14px)'
    window.setTimeout(() => {
      item.style.transition = 'opacity 700ms var(--ease-premium), transform 700ms var(--ease-premium)'
      item.style.opacity = '1'
      item.style.transform = 'translateY(0)'
    }, 80 + index * 80)
  })
})

onBeforeUnmount(() => clearTimeout(toastTimer))
</script>
