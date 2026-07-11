<template>
  <main class="grain min-h-screen bg-background text-foreground">
    <section class="page-gutter pb-20 pt-28 md:pt-32">
      <div class="page-frame">
        <header class="border-b border-line pb-10">
          <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div>
              <p class="font-mono text-xs uppercase tracking-[0.18em] text-blue">
                {{ t('mediaParserSoftware.kicker') }}
              </p>
              <h1 class="mt-6 max-w-4xl text-5xl font-medium leading-none tracking-tight text-foreground md:text-7xl">
                {{ t('mediaParserSoftware.titleLead') }}
                <span class="italic text-blue">{{ t('mediaParserSoftware.titleAccent') }}</span>
              </h1>
              <p class="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {{ t('mediaParserSoftware.description') }}
              </p>
            </div>

            <dl class="grid gap-4 border-l border-line pl-6 font-mono text-xs uppercase tracking-[0.16em]">
              <div v-for="item in metaItems" :key="item.key" class="grid gap-1">
                <dt class="text-muted-foreground">{{ item.key }}</dt>
                <dd class="text-foreground">{{ item.value }}</dd>
              </div>
            </dl>
          </div>
        </header>

        <section class="grid gap-10 border-b border-line py-10 lg:grid-cols-[180px_minmax(0,1fr)]">
          <div>
            <p class="font-mono text-xs uppercase tracking-[0.18em] text-blue">01</p>
            <p class="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-blue">
              {{ t('mediaParserSoftware.sections.release') }}
            </p>
          </div>

          <div class="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <h2 class="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                {{ t('mediaParserSoftware.releaseTitle') }}
              </h2>
              <p class="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {{ t('mediaParserSoftware.releaseDescription') }}
              </p>
            </div>

            <div class="flex flex-wrap gap-3">
              <a
                class="inline-flex h-11 items-center gap-3 border border-line px-5 font-mono text-xs uppercase tracking-[0.16em] text-blue transition-colors hover:border-line-strong hover:bg-card"
                href="https://github.com/JacoryCYJin/media-parser/releases"
                target="_blank"
                rel="noreferrer"
              >
                <Download class="h-4 w-4" />
                {{ t('mediaParserSoftware.actions.releases') }}
              </a>
              <a
                class="inline-flex h-11 items-center gap-3 border border-line px-5 font-mono text-xs uppercase tracking-[0.16em] text-foreground transition-colors hover:border-line-strong hover:bg-card hover:text-blue"
                href="https://github.com/JacoryCYJin/media-parser"
                target="_blank"
                rel="noreferrer"
              >
                <Github class="h-4 w-4" />
                {{ t('mediaParserSoftware.actions.github') }}
              </a>
            </div>
          </div>
        </section>

        <section class="grid gap-10 border-b border-line py-10 lg:grid-cols-[180px_minmax(0,1fr)]">
          <div>
            <p class="font-mono text-xs uppercase tracking-[0.18em] text-blue">02</p>
            <p class="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-blue">
              {{ t('mediaParserSoftware.sections.modules') }}
            </p>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <article
              v-for="module in modules"
              :key="module.title"
              class="border border-line bg-card p-5"
            >
              <component :is="module.icon" class="h-5 w-5 text-blue" :stroke-width="1.7" />
              <h2 class="mt-5 text-xl font-medium tracking-tight text-foreground">{{ module.title }}</h2>
              <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{{ module.description }}</p>
            </article>
          </div>
        </section>

        <section class="grid gap-10 py-10 lg:grid-cols-[180px_minmax(0,1fr)]">
          <div>
            <p class="font-mono text-xs uppercase tracking-[0.18em] text-blue">03</p>
            <p class="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-blue">
              {{ t('mediaParserSoftware.sections.local') }}
            </p>
          </div>

          <div class="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
            <p class="max-w-xl text-sm leading-relaxed text-muted-foreground">
              {{ t('mediaParserSoftware.localDescription') }}
            </p>
            <div class="grid gap-3">
              <div
                v-for="item in localStack"
                :key="item"
                class="flex items-center justify-between border-b border-line py-3 font-mono text-xs uppercase tracking-[0.14em]"
              >
                <span class="text-muted-foreground">{{ item }}</span>
                <span class="text-blue">LOCAL</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Clapperboard, Download, FileText, Github, Podcast } from 'lucide-vue-next'

const { t } = useI18n()

const metaItems = computed(() => [
  { key: t('mediaParserSoftware.meta.type'), value: t('mediaParserSoftware.meta.typeValue') },
  { key: t('mediaParserSoftware.meta.runtime'), value: 'Electron / Vue / Python' },
  { key: t('mediaParserSoftware.meta.status'), value: t('mediaParserSoftware.meta.statusValue') }
])

const modules = computed(() => [
  {
    title: t('mediaParserSoftware.modules.video.title'),
    description: t('mediaParserSoftware.modules.video.description'),
    icon: Clapperboard
  },
  {
    title: t('mediaParserSoftware.modules.podcast.title'),
    description: t('mediaParserSoftware.modules.podcast.description'),
    icon: Podcast
  },
  {
    title: t('mediaParserSoftware.modules.transcript.title'),
    description: t('mediaParserSoftware.modules.transcript.description'),
    icon: FileText
  },
  {
    title: t('mediaParserSoftware.modules.release.title'),
    description: t('mediaParserSoftware.modules.release.description'),
    icon: Github
  }
])

const localStack = ['yt-dlp', 'FFmpeg', 'faster-whisper', 'local downloads', 'desktop release']
</script>
