<template>
  <main ref="pageRoot" class="grain min-h-screen bg-background">
    <section class="page-gutter pt-20 md:pt-24">
      <div class="page-frame">
        <header class="border-b border-line pb-8 md:pb-12 lg:pb-16">
          <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,28rem)] lg:items-end lg:gap-16">
            <div data-library-enter>
              <p class="tech mb-5 text-xs text-blue">03 — {{ t('library.kicker') }}</p>
              <h1 class="max-w-3xl font-sans text-5xl font-medium leading-[0.95] tracking-tight text-foreground md:text-7xl">
                {{ t('library.titleLead') }}<span class="italic text-blue">{{ t('library.titleAccent') }}</span>
              </h1>
            </div>
            <p data-library-enter class="max-w-md text-sm leading-7 text-muted-foreground lg:justify-self-end">
              {{ t('library.description') }}
            </p>
          </div>
        </header>
      </div>
    </section>

    <section class="page-gutter pb-20 pt-12 md:pb-28 md:pt-16">
      <div class="page-frame">
        <div class="grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[18rem_minmax(0,1fr)] xl:gap-20">
          <aside class="border-b border-line py-6 lg:border-b-0 lg:border-r lg:py-8 lg:pr-8">
            <div class="mb-7 flex items-center justify-between">
              <span class="tech text-xs">{{ t('library.indexLabel') }}</span>
              <span class="font-mono text-xs text-muted-foreground">{{ String(filteredEntries.length).padStart(2, '0') }} / {{ String(libraryEntries.length).padStart(2, '0') }}</span>
            </div>
            <nav :aria-label="t('library.filterAria')" class="grid gap-1">
              <button
                v-for="filter in filters"
                :key="filter.id"
                type="button"
                class="flex items-center justify-between border-b border-line py-3 text-left font-mono text-sm uppercase tracking-[0.12em] transition-colors duration-300 hover:text-blue"
                :class="activeType === filter.id ? 'text-blue' : 'text-muted-foreground'"
                @click="activeType = filter.id"
              >
                <span>{{ filter.label }}</span>
                <span>{{ filter.count }}</span>
              </button>
            </nav>
          </aside>

          <section class="min-w-0 py-6 lg:py-8">
            <div class="mb-6 flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-center md:justify-between">
              <label class="flex min-w-0 items-center gap-3 text-muted-foreground">
                <Search :size="16" stroke-width="1.5" aria-hidden="true" />
                <span class="sr-only">{{ t('library.searchLabel') }}</span>
                <input v-model="query" type="search" :placeholder="t('library.searchPlaceholder')" class="w-full bg-transparent font-mono text-sm tracking-[0.06em] text-foreground outline-none placeholder:text-haze md:w-72">
              </label>
              <span class="tech text-xs">{{ t('library.updatedLabel') }} {{ latestUpdate }}</span>
            </div>

            <div v-if="filteredEntries.length" class="divide-y divide-line">
              <article v-for="entry in filteredEntries" :key="entry.id" class="group grid gap-5 py-6 first:pt-2 md:grid-cols-[4rem_minmax(0,1fr)_auto] md:gap-6 md:py-8">
                <div class="flex items-start justify-between md:block">
                  <span class="font-mono text-xs text-haze">{{ entry.no }}</span>
                  <span class="tech text-xs text-blue md:mt-7 md:block">{{ entry.type === 'skill' ? 'SKILL' : 'PROMPT' }}</span>
                </div>
                <div class="min-w-0">
                  <router-link :to="'/library/' + entry.id" class="inline-flex items-center gap-2 font-sans text-2xl font-medium tracking-tight text-foreground transition-colors duration-300 group-hover:text-blue md:text-3xl">
                    {{ t(entry.titleKey) }}
                    <ArrowUpRight :size="18" stroke-width="1.5" class="opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
                  </router-link>
                  <p class="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{{ t(entry.descriptionKey) }}</p>
                  <div class="mt-4 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.1em] text-haze">
                    <span v-for="tag in entry.tags" :key="tag">{{ tag }}</span>
                    <span>{{ entry.platform }}</span>
                  </div>
                </div>
                <div class="flex items-end justify-between gap-6 md:block md:text-right">
                  <span class="tech text-xs">{{ entry.version }}</span>
                  <button type="button" class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-foreground transition-colors hover:text-blue" @click="copyEntry(entry)">
                    <Copy :size="14" stroke-width="1.5" aria-hidden="true" />
                    {{ t('library.copy') }}
                  </button>
                </div>
              </article>
            </div>
            <div v-else class="border-y border-line py-16 text-center">
              <p class="font-mono text-sm uppercase tracking-[0.12em] text-muted-foreground">{{ t('library.empty') }}</p>
            </div>
          </section>
        </div>
      </div>
    </section>
    <StatusToast :visible="toast.visible" :message="toast.message" :type="toast.type" />
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowUpRight, Copy, Search } from 'lucide-vue-next'
import StatusToast from '../components/StatusToast.vue'
import { libraryEntries } from '../content/library.js'

const { t } = useI18n()
const pageRoot = ref(null)
const activeType = ref('all')
const query = ref('')
const toast = reactive({ visible: false, message: '', type: 'success' })
let toastTimer

const filters = computed(() => [
  { id: 'all', label: t('library.filters.all'), count: String(libraryEntries.length).padStart(2, '0') },
  { id: 'prompt', label: t('library.filters.prompts'), count: String(libraryEntries.filter((entry) => entry.type === 'prompt').length).padStart(2, '0') },
  { id: 'skill', label: t('library.filters.skills'), count: String(libraryEntries.filter((entry) => entry.type === 'skill').length).padStart(2, '0') },
])

const filteredEntries = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase()
  return libraryEntries.filter((entry) => {
    const matchesType = activeType.value === 'all' || entry.type === activeType.value
    const searchable = (t(entry.titleKey) + ' ' + t(entry.descriptionKey) + ' ' + entry.tags.join(' ') + ' ' + entry.platform).toLowerCase()
    return matchesType && (!normalizedQuery || searchable.includes(normalizedQuery))
  })
})

const latestUpdate = computed(() => libraryEntries.map((entry) => entry.updated).sort().at(-1))

function showToast(message, type = 'success') {
  toast.visible = true
  toast.message = message
  toast.type = type
  clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => { toast.visible = false }, 2200)
}

async function copyEntry(entry) {
  try {
    await navigator.clipboard.writeText(t('library.details.' + entry.detailKey + '.content'))
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
