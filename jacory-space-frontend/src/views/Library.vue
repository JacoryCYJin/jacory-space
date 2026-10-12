<template>
  <FooterReveal>
    <main ref="pageRoot" class="grain min-h-screen bg-background">
    <section class="page-gutter pt-20 md:pt-24">
      <div class="page-frame">
        <header class="grid gap-3 pb-2 md:gap-12 md:pb-4 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,34rem)] lg:items-stretch lg:gap-16">
          <div data-library-enter>
            <p class="tech mb-5 text-xs text-blue">02 — {{ t('library.kicker') }}</p>
            <div class="flex items-start justify-between gap-4 md:block">
            <h1 class="min-w-0 max-w-3xl font-sans text-4xl font-medium leading-[0.95] tracking-tight text-foreground min-[380px]:text-5xl md:text-7xl">
              {{ t('library.titleLead') }}<span class="italic text-blue">{{ t('library.titleAccent') }}</span>
            </h1>
            <dl class="grid w-24 shrink-0 gap-2 font-mono text-xs md:hidden">
              <div class="flex items-baseline justify-between gap-2"><dt class="text-muted-foreground">{{ t('library.assetsLabel') }}</dt><dd class="text-foreground">{{ libraryEntries.length }}</dd></div>
              <div class="flex items-baseline justify-between gap-2"><dt class="text-muted-foreground">{{ t('library.promptsLabel') }}</dt><dd class="text-foreground">{{ promptCount }}</dd></div>
              <div class="flex items-baseline justify-between gap-2"><dt class="text-muted-foreground">{{ t('library.skillsLabel') }}</dt><dd class="text-foreground">{{ skillCount }}</dd></div>
            </dl>
            </div>
            <p class="mt-6 text-sm leading-7 text-muted-foreground">{{ t('library.description') }}</p>
          </div>

          <div data-library-enter class="hidden md:block lg:flex lg:items-center lg:justify-self-end lg:w-full lg:max-w-md">
            <div class="grid w-full grid-cols-3 divide-x divide-line lg:py-2">
              <div class="flex items-baseline justify-between gap-2 pr-3 md:block md:pr-5 lg:flex lg:flex-col lg:items-start lg:gap-3"><p class="tech text-xs text-muted-foreground max-md:tracking-normal">{{ t('library.assetsLabel') }}</p><p class="font-mono text-xl text-foreground md:mt-4 md:text-3xl lg:mt-0 lg:text-5xl lg:leading-none">{{ libraryEntries.length }}</p></div>
              <div class="flex items-baseline justify-between gap-2 px-3 md:block md:px-5 lg:flex lg:flex-col lg:items-start lg:gap-3"><p class="tech text-xs text-muted-foreground max-md:tracking-normal">{{ t('library.promptsLabel') }}</p><p class="font-mono text-xl text-foreground md:mt-4 md:text-3xl lg:mt-0 lg:text-5xl lg:leading-none">{{ promptCount }}</p></div>
              <div class="flex items-baseline justify-between gap-2 pl-3 md:block md:pl-5 lg:flex lg:flex-col lg:items-start lg:gap-3"><p class="tech text-xs text-muted-foreground max-md:tracking-normal">{{ t('library.skillsLabel') }}</p><p class="font-mono text-xl text-foreground md:mt-4 md:text-3xl lg:mt-0 lg:text-5xl lg:leading-none">{{ skillCount }}</p></div>
            </div>
          </div>
        </header>
      </div>
    </section>

    <section class="page-gutter pb-6 pt-2 md:pb-8 md:pt-4">
      <div class="page-frame grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[18rem_minmax(0,1fr)] xl:gap-20">
        <aside class="border-line pb-0 md:border-b md:pb-10 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
          <div data-library-enter class="flex items-start justify-between gap-4 md:hidden">
            <div class="flex min-h-11 min-w-0 flex-1 items-center gap-2 border-b border-line text-muted-foreground">
              <Search :size="16" stroke-width="1.5" class="shrink-0" aria-hidden="true" />
              <label class="min-w-0 flex-1">
                <span class="sr-only">{{ t('library.searchLabel') }}</span>
                <input v-model="query" type="search" :placeholder="t('library.searchPlaceholder')" class="w-full bg-transparent font-mono text-sm tracking-[0.06em] text-foreground outline-none placeholder:text-haze">
              </label>
              <span class="shrink-0 font-mono text-xs text-haze">{{ String(filteredEntries.length).padStart(2, '0') }} / {{ String(libraryEntries.length).padStart(2, '0') }}</span>
            </div>
            <button
              type="button"
              class="inline-flex min-h-11 min-w-0 max-w-[45%] items-center justify-end gap-2 font-mono text-xs text-muted-foreground"
              :aria-expanded="filtersExpanded"
              aria-controls="library-filters"
              @click="filtersExpanded = !filtersExpanded"
            >
              <span class="inline-flex items-center gap-2">
                {{ t(filtersExpanded ? 'library.collapseFilters' : 'library.expandFilters') }}
                <ChevronDown :size="14" stroke-width="1.5" :class="filtersExpanded ? 'rotate-180' : ''" aria-hidden="true" />
              </span>
              <span class="inline-flex min-w-0 flex-wrap items-center justify-end gap-1 text-blue">
                {{ filters.find((filter) => filter.id === activeType)?.label }}
                <span v-if="selectedTags.length">· {{ t('library.selectedTagsCount', { count: selectedTags.length }) }}</span>
              </span>
            </button>
          </div>
          <div id="library-filters" class="mt-5 md:mt-0 md:block" :class="filtersExpanded ? 'block pb-3 md:pb-0' : 'hidden'">
          <div data-library-enter class="flex items-center justify-between gap-3 md:block">
            <p class="tech max-w-16 shrink-0 text-xs max-md:tracking-normal md:mb-5 md:max-w-none">{{ t('library.browseLabel') }}</p>
            <nav :aria-label="t('library.filterAria')" class="flex min-w-0 items-center gap-2 md:grid md:grid-cols-1 md:gap-1">
              <button
                v-for="filter in filters"
                :key="filter.id"
                type="button"
                class="flex min-h-11 shrink-0 items-center justify-between gap-1 whitespace-nowrap border-b text-left font-mono text-xs uppercase tracking-normal transition-colors duration-300 hover:text-blue md:gap-2 md:py-4 md:text-sm md:tracking-[0.12em]"
                :class="[activeType === filter.id ? 'border-blue text-blue md:border-line' : 'border-line text-muted-foreground', filter.id === 'skill' ? 'md:border-b-0' : '']"
                :aria-pressed="activeType === filter.id"
                @click="activeType = filter.id"
              >
                <span>{{ filter.label }}</span>
                <span>{{ filter.count }}</span>
              </button>
            </nav>
          </div>

          <div data-library-enter class="mt-3 md:mt-6">
            <div class="flex min-h-11 items-center justify-between gap-4 md:mb-3 md:min-h-0">
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
          </div>
        </aside>

        <section class="min-w-0 pt-1 md:pt-10 lg:pt-0">
          <div data-library-enter class="hidden items-center gap-3 border-b border-line pb-5 text-muted-foreground md:flex">
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

          <div v-if="filteredEntries.length" :class="viewMode === 'list' ? 'divide-y divide-line' : 'grid gap-x-12 gap-y-5 md:gap-y-0 lg:grid-cols-2'">
            <article
              v-for="(entry, index) in filteredEntries"
              :key="entry.id"
              data-library-entry
              class="group"
              :class="[
                viewMode === 'list' ? 'py-5 first:pt-5 md:py-6 md:first:pt-6' : 'border-t border-line pt-4 md:flex md:flex-col md:py-6',
                viewMode === 'grid' && index === 0 ? 'border-t-0' : '',
                viewMode === 'grid' && index === 1 ? 'lg:border-t-0' : '',
              ]"
            >
              <div class="min-w-0" :class="viewMode === 'grid' ? 'md:flex md:flex-1 md:flex-col' : ''">
                <div class="flex items-start justify-between gap-3 md:gap-4">
                <router-link :to="'/library/' + entry.id" class="inline-flex max-w-full items-baseline gap-2 font-sans text-lg font-medium tracking-tight text-foreground transition-colors duration-300 group-hover:text-blue md:items-center md:gap-3 md:text-2xl" :class="viewMode === 'list' ? 'md:text-3xl' : ''">
                  <span class="min-w-0">{{ t(entry.titleKey) }}</span>
                  <ArrowUpRight :size="18" stroke-width="1.5" class="hidden shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block" aria-hidden="true" />
                </router-link>
                <p class="tech max-w-[35%] shrink-0 pt-1 text-right text-xs text-blue">{{ entryTypeLabel(entry) }}</p>
                </div>
                <p class="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:mt-3 md:leading-7">{{ t(entry.descriptionKey) }}</p>
                <div class="mt-3 flex items-start justify-between gap-4" :class="viewMode === 'grid' ? 'md:mt-auto md:pt-5' : 'md:mt-5'">
                <div class="flex min-w-0 flex-1 flex-wrap gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.1em] text-haze">
                  <span v-for="tag in entry.tags" :key="tag"># {{ tagLabel(tag) }}</span>
                </div>
                  <button v-if="canCopyEntry(entry)" type="button" class="inline-flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-foreground transition-colors hover:text-blue" @click="copyEntry(entry)">
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
  </FooterReveal>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { useI18n } from 'vue-i18n'
import { ArrowUpRight, ChevronDown, Copy, Folder, List, Search } from 'lucide-vue-next'
import FooterReveal from '../components/FooterReveal.vue'
import StatusToast from '../components/StatusToast.vue'
import { libraryEntries } from '@library-index'

const { t } = useI18n()
const pageRoot = ref(null)
const activeType = ref('all')
const selectedTags = ref([])
const filtersExpanded = ref(false)
const query = ref('')
const viewMode = ref('grid')
const toast = reactive({ visible: false, message: '', type: 'success' })
let toastTimer
let motionMedia
let revealObserver
let entryTargets = []
let entriesInteracted = false

gsap.registerPlugin(CustomEase)

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
  }).sort((a, b) => b.updated.localeCompare(a.updated))
})

function tagLabel(tag) {
  return t('library.tags.' + tag)
}

function entryTypeLabel(entry) {
  if (entry.type === 'skill' && entry.sourceType === 'external') return t('interface.library.external')
  return entry.type === 'skill' ? t('interface.library.skill') : t('interface.library.prompt')
}

function canCopyEntry(entry) {
  return entry.type === 'prompt' || (entry.type === 'skill' && entry.sourceType === 'original')
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

// A result change ends pending entry reveals so reused and new rows stay visible.
watch([filteredEntries, viewMode], () => {
  entriesInteracted = true
  const targets = [...entryTargets, ...(pageRoot.value?.querySelectorAll('[data-library-entry]') || [])]
  targets.forEach((item) => revealObserver?.unobserve(item))
  gsap.killTweensOf(targets)
  gsap.set(targets, { clearProps: 'opacity,visibility,transform' })
}, { flush: 'post' })

onMounted(() => {
  const root = pageRoot.value
  if (!root) return

  const ease = CustomEase.create('library-enter', '0.16,1,0.3,1')
  motionMedia = gsap.matchMedia()
  motionMedia.add('(prefers-reduced-motion: no-preference)', (context) => {
    const sections = [...root.querySelectorAll('[data-library-enter]')]
    entryTargets = entriesInteracted ? [] : [...root.querySelectorAll('[data-library-entry]')]
    const targets = [...sections, ...entryTargets]
    const pending = new Set(targets)
    const inViewport = (item) => {
      const rect = item.getBoundingClientRect()
      return rect.top < window.innerHeight && rect.bottom > 0
    }

    context.add('reveal', (items, initial = false) => {
      items.forEach((item, index) => {
        if (!pending.delete(item)) return
        revealObserver?.unobserve(item)
        gsap.to(item, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease,
          delay: initial ? (sections.includes(item) ? 0.08 + sections.indexOf(item) * 0.05 : 0.3 + index * 0.04) : index * 0.04,
          clearProps: 'opacity,visibility,transform',
        })
      })
    })

    gsap.set(targets, { autoAlpha: 0, y: 14 })
    context.reveal(targets.filter(inViewport), true)

    if ('IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver((items) => {
        context.reveal(items.filter((item) => item.isIntersecting).map((item) => item.target))
      }, { threshold: 0.08 })
      pending.forEach((item) => revealObserver.observe(item))
    } else {
      context.reveal([...pending])
    }

    return () => {
      revealObserver?.disconnect()
      revealObserver = null
    }
  }, root)
})

onBeforeUnmount(() => {
  clearTimeout(toastTimer)
  motionMedia?.revert()
})
</script>
