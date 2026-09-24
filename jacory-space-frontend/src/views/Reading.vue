<template>
  <main class="grain min-h-screen bg-background pb-24 pt-28 text-foreground">
    <div class="page-gutter mx-auto max-w-screen-2xl">
      <header class="border-b border-line pb-10 md:pb-14">
        <div class="flex items-center justify-end gap-4">
          <span class="font-mono text-xs text-muted-foreground">{{ t('reading.status') }}</span>
        </div>
        <p class="mt-12 font-mono text-xs tracking-[0.18em] text-blue">READING / ARCHIVE</p>
        <h1 class="mt-5 text-5xl font-medium tracking-tight md:text-7xl">{{ t('reading.title') }}</h1>
        <div class="mt-6 flex flex-wrap items-end justify-between gap-6">
          <p class="text-base text-muted-foreground">{{ t('reading.description') }}</p>
          <p class="flex gap-6 font-mono text-xs text-muted-foreground">
            <span>{{ books.length.toString().padStart(2, '0') }} {{ t('reading.books') }}</span>
            <span>{{ total.toString().padStart(2, '0') }} {{ t('reading.excerpts') }}</span>
          </p>
        </div>
      </header>
      <div class="mt-6 flex gap-6 border-b border-line" role="group" :aria-label="t('reading.viewMode')">
        <button v-for="mode in ['time', 'books']" :key="mode" type="button" :aria-pressed="viewMode === mode" class="border-b py-3 text-sm transition-colors hover:text-blue" :class="viewMode === mode ? 'border-blue text-blue' : 'border-transparent text-muted-foreground'" @click="viewMode = mode">{{ t(mode === 'books' ? 'reading.byBook' : 'reading.byTime') }}</button>
      </div>
      <div class="grid gap-10 pt-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20 lg:pt-12">
        <aside class="min-w-0 self-start lg:sticky lg:top-24">
          <label for="reading-search" class="text-xs text-muted-foreground">{{ t('reading.search') }}</label>
          <div class="mt-3 flex items-center gap-2 border-b border-line pb-3 focus-within:border-blue">
            <Search :size="16" class="shrink-0 text-muted-foreground" aria-hidden="true" />
            <input id="reading-search" v-model="query" type="search" class="min-w-0 flex-1 bg-transparent text-sm outline-none" autocomplete="off" />
            <button v-if="query" type="button" :aria-label="t('reading.clear')" class="p-1 text-muted-foreground hover:text-blue" @click="query = ''"><X :size="16" aria-hidden="true" /></button>
          </div>
          <details ref="mobileIndex" class="mt-6 border-b border-line pb-4 lg:hidden">
            <summary class="cursor-pointer text-sm">{{ indexLabel }}</summary>
            <nav :aria-label="indexLabel" class="mt-4 flex flex-col gap-4">
              <a v-for="book in displayGroups" :key="book.slug" :href="'#book-' + book.slug" class="flex justify-between gap-3 text-sm hover:text-blue" @click="closeIndex"><span>{{ book.title }}</span><span class="font-mono text-xs">{{ book.excerpts.length }}</span></a>
            </nav>
          </details>
          <nav :aria-label="indexLabel" class="mt-10 hidden lg:block">
            <p class="mb-5 font-mono text-xs text-muted-foreground">{{ indexLabel }}</p>
            <a v-for="(book, index) in displayGroups" :key="book.slug" :href="'#book-' + book.slug" :aria-current="activeBook === book.slug ? 'location' : undefined" class="flex items-baseline gap-3 border-b border-line py-4 text-sm hover:text-blue" :class="activeBook === book.slug ? 'text-blue' : 'text-muted-foreground'">
              <span class="font-mono text-xs">{{ String(index + 1).padStart(2, '0') }}</span><span class="min-w-0 flex-1 break-words">{{ book.title }}</span><span class="font-mono text-xs">{{ book.excerpts.length }}</span>
            </a>
          </nav>
        </aside>
        <div class="min-w-0">
          <p v-if="!visibleBooks.length" role="status" class="py-16 text-muted-foreground">{{ t(books.length ? 'reading.noResults' : 'reading.empty') }}</p>
          <p class="sr-only" aria-live="polite">{{ visibleTotal }} {{ t('reading.excerpts') }}</p>
          <section v-for="book in displayGroups" :id="'book-' + book.slug" :key="book.slug" :data-book="book.slug" :aria-labelledby="'title-' + book.slug" class="mb-16 scroll-mt-24 border-b border-line pb-12 last:mb-0">
            <header>
              <p v-if="book.sample" class="mb-5 border-l border-blue pl-3 text-xs leading-relaxed text-muted-foreground">{{ t('reading.sample') }}</p>
              <h2 :id="'title-' + book.slug" class="break-words text-3xl font-medium tracking-tight md:text-4xl">{{ book.title }}</h2>
              <p v-if="book.author || book.edition" class="mt-4 text-sm text-muted-foreground">{{ [book.author, book.edition].filter(Boolean).join(' / ') }}</p>
            </header>
            <article v-for="excerpt in book.excerpts" :id="(excerpt.bookSlug || book.slug) + '-' + excerpt.id" :key="(excerpt.bookSlug || book.slug) + excerpt.id" class="mt-12 grid scroll-mt-24 gap-4 md:grid-cols-[2.5rem_minmax(0,1fr)] md:gap-6">
              <span class="pt-1 font-mono text-xs text-blue">{{ viewMode === 'time' ? excerpt.displayNumber : excerpt.id }}</span>
              <div class="min-w-0 max-w-[36rem]">
                <p v-if="viewMode === 'time'" class="mb-4 text-sm text-muted-foreground">{{ excerpt.bookTitle }}</p>
                <p v-if="viewMode === 'time' && excerpt.sample" class="mb-4 border-l border-blue pl-3 text-xs leading-relaxed text-muted-foreground">{{ t('reading.sample') }}</p>
                <blockquote class="space-y-5 break-words text-lg leading-relaxed" :class="/\p{Script=Han}/u.test(excerpt.text) ? 'font-reading' : ''">
                  <p v-for="(paragraph, i) in excerpt.text.split(/\n\s*\n/)" :key="i" class="whitespace-pre-line">{{ paragraph }}</p>
                </blockquote>
                <p class="mt-5 font-mono text-xs text-muted-foreground">{{ t('reading.date') }} <time :datetime="excerpt.recordedAt">{{ excerpt.date }}</time></p>
                <div v-if="excerpt.note" class="mt-6 border-l border-line pl-4 text-sm leading-relaxed text-muted-foreground">
                  <p class="mb-2 text-xs">{{ t('reading.note') }}</p><p class="whitespace-pre-line break-words">{{ excerpt.note }}</p>
                </div>
              </div>
            </article>
          </section>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Search, X } from 'lucide-vue-next'
import { books } from '../lib/reading/index.js'
import { filterBooks, groupExcerptsByDate } from '../lib/reading/parser.js'

const { t } = useI18n()
const query = ref('')
const viewMode = ref('time')
const indexLabel = computed(() => t(viewMode.value === 'books' ? 'reading.index' : 'reading.dateIndex'))
const mobileIndex = ref(null)
const visibleBooks = computed(() => filterBooks(books, query.value))
const displayGroups = computed(() => viewMode.value === 'books' ? visibleBooks.value : groupExcerptsByDate(visibleBooks.value))
const activeBook = ref(displayGroups.value[0]?.slug || '')
const total = books.reduce((count, book) => count + book.excerpts.length, 0)
const visibleTotal = computed(() => visibleBooks.value.reduce((count, book) => count + book.excerpts.length, 0))
let observer
let mounted = false
function closeIndex() { if (mobileIndex.value) mobileIndex.value.open = false }
async function observeBooks() {
  await nextTick()
  if (!mounted) return
  observer?.disconnect()
  observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) activeBook.value = entry.target.dataset.book
  }, { rootMargin: '-96px 0px -55% 0px' })
  document.querySelectorAll('[data-book]').forEach(el => observer.observe(el))
}
onMounted(() => { mounted = true; observeBooks() })
watch(displayGroups, () => { closeIndex(); activeBook.value = displayGroups.value[0]?.slug || ''; if (mounted) observeBooks() })
onBeforeUnmount(() => { mounted = false; observer?.disconnect() })
</script>
