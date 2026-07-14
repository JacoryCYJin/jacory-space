<template>
  <main class="grain min-h-screen bg-background text-foreground">
    <section class="page-gutter pb-8 md:pb-10 pt-28 md:pt-32">
      <div class="page-frame">
        <section class="grid gap-12 border-b border-line pb-10 md:pb-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(560px,1.22fr)] lg:items-center">
          <div>
            <p class="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-blue">
              <span class="h-2 w-2 rounded-full bg-blue" aria-hidden="true"></span>
              {{ t('mediaParserSoftware.kicker') }}
            </p>

            <h1 class="mt-12 max-w-3xl text-5xl font-medium leading-none tracking-tight text-foreground md:text-7xl">
              {{ t('mediaParserSoftware.titleLead') }}
              <span class="italic text-blue">{{ t('mediaParserSoftware.titleAccent') }}</span>
            </h1>

            <p class="mt-7 max-w-xl text-2xl leading-snug tracking-tight text-foreground">
              {{ t('mediaParserSoftware.tagline') }}
            </p>
            <div class="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground">
              <p>{{ t('mediaParserSoftware.descriptionLead') }}</p>
              <ul class="mt-5 grid gap-3">
                <li
                  v-for="point in descriptionPoints"
                  :key="point.title"
                  class="grid grid-cols-[0.45rem_minmax(0,1fr)] gap-3"
                >
                  <span class="mt-[0.7em] h-1.5 w-1.5 rounded-full bg-blue" aria-hidden="true"></span>
                  <span>
                    <span class="block text-foreground">{{ point.title }}</span>
                    <span class="block">{{ point.description }}</span>
                  </span>
                </li>
              </ul>
            </div>

            <div class="mt-12 flex flex-wrap gap-10">
              <a
                class="inline-flex h-12 items-center gap-3 border border-blue px-6 font-mono text-xs uppercase tracking-[0.16em] text-blue transition-colors hover:bg-card"
                href="https://github.com/JacoryCYJin/media-parser/releases/tag/v0.2.5"
                target="_blank"
                rel="noreferrer"
              >
                <Download class="h-4 w-4" />
                {{ t('mediaParserSoftware.actions.releases') }}
              </a>
              <a
                class="inline-flex h-12 items-center gap-3 border border-line px-6 font-mono text-xs uppercase tracking-[0.16em] text-foreground transition-colors hover:border-line-strong hover:bg-card hover:text-blue"
                href="https://github.com/JacoryCYJin/media-parser"
                target="_blank"
                rel="noreferrer"
              >
                <Github class="h-4 w-4" />
                {{ t('mediaParserSoftware.actions.github') }}
              </a>
            </div>

            <dl class="mt-10 grid gap-4 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground sm:grid-cols-2">
              <div v-for="item in metaItems" :key="item.key" class="flex gap-2">
                <dt>{{ item.key }}</dt>
                <dd class="text-foreground">{{ item.value }}</dd>
              </div>
            </dl>
          </div>

          <figure class="relative isolate lg:flex lg:items-center">
            <img
              :src="watermarkSrc"
              alt=""
              aria-hidden="true"
              class="pointer-events-none absolute left-[-50%] top-[-20%] z-0 hidden w-[110%] max-w-none select-none opacity-[0.14] mix-blend-multiply lg:block"
            >
            <img
              :src="screenshotSrc"
              :alt="t('mediaParserSoftware.screenshot.alt')"
              class="relative z-10 block max-h-[80vh] w-full object-contain"
            >
          </figure>
        </section>

        <section class="grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.42fr)]">
          <div>
            <div class="grid gap-6 md:grid-cols-4">
              <article
                v-for="module in modules"
                :key="module.title"
                class="border-r border-line pr-6 last:border-r-0"
              >
                <component :is="module.icon" class="h-6 w-6 text-muted-foreground" :stroke-width="1.6" />
                <h2 class="mt-6 text-lg font-medium tracking-tight text-foreground">{{ module.title }}</h2>
                <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{{ module.description }}</p>
              </article>
            </div>
          </div>

          <aside class="border-l border-line pl-8">
            <div class="grid">
              <a
                v-for="(link, index) in releaseLinks"
                :key="link.label"
                class="group flex items-center gap-5 py-5"
                :class="{ 'border-b border-line': index === 0 }"
                :href="link.href"
                target="_blank"
                rel="noreferrer"
              >
                <component :is="link.icon" class="h-7 w-7 shrink-0 text-foreground" :stroke-width="1.7" />
                <span class="min-w-0 flex-1">
                  <span class="block text-base font-medium tracking-tight text-foreground">{{ link.label }}</span>
                  <span class="mt-1 block truncate font-mono text-xs text-muted-foreground">{{ link.urlLabel }}</span>
                </span>
                <ArrowRight class="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-blue" />
              </a>
            </div>
          </aside>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowRight, Clapperboard, Download, FileText, Github, Podcast, Tags } from 'lucide-vue-next'
import screenshotSrc from '../assets/tools/media-parser-desktop.png'
import watermarkSrc from '../assets/tools/video-parser-watermark.png'

const { t } = useI18n()

const metaItems = computed(() => [
  { key: 'macOS', value: 'v0.2.5' },
  { key: t('mediaParserSoftware.meta.type'), value: t('mediaParserSoftware.meta.typeValue') }
])

const descriptionPoints = computed(() => [
  {
    title: t('mediaParserSoftware.descriptionPoints.sources.title'),
    description: t('mediaParserSoftware.descriptionPoints.sources.description')
  },
  {
    title: t('mediaParserSoftware.descriptionPoints.download.title'),
    description: t('mediaParserSoftware.descriptionPoints.download.description')
  },
  {
    title: t('mediaParserSoftware.descriptionPoints.notes.title'),
    description: t('mediaParserSoftware.descriptionPoints.notes.description')
  }
])

const modules = computed(() => [
  {
    title: t('mediaParserSoftware.modules.video.title'),
    short: t('mediaParserSoftware.modules.video.short'),
    description: t('mediaParserSoftware.modules.video.description'),
    icon: Clapperboard
  },
  {
    title: t('mediaParserSoftware.modules.podcast.title'),
    short: t('mediaParserSoftware.modules.podcast.short'),
    description: t('mediaParserSoftware.modules.podcast.description'),
    icon: Podcast
  },
  {
    title: t('mediaParserSoftware.modules.transcript.title'),
    short: t('mediaParserSoftware.modules.transcript.short'),
    description: t('mediaParserSoftware.modules.transcript.description'),
    icon: FileText
  },
  {
    title: t('mediaParserSoftware.modules.release.title'),
    short: t('mediaParserSoftware.modules.release.short'),
    description: t('mediaParserSoftware.modules.release.description'),
    icon: Tags
  }
])

const releaseLinks = computed(() => [
  {
    label: t('mediaParserSoftware.releaseLinks.github'),
    urlLabel: 'github.com/JacoryCYJin/media-parser',
    href: 'https://github.com/JacoryCYJin/media-parser',
    icon: Github
  },
  {
    label: t('mediaParserSoftware.releaseLinks.releases'),
    urlLabel: 'github.com/JacoryCYJin/media-parser/releases/tag/v0.2.5',
    href: 'https://github.com/JacoryCYJin/media-parser/releases/tag/v0.2.5',
    icon: Tags
  }
])

</script>
