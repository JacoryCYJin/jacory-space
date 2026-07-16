<template>
  <main class="grain min-h-screen bg-background text-foreground">
    <section class="page-gutter pb-8 pt-20 md:pb-10 md:pt-32">
      <div class="page-frame">
        <section class="grid gap-8 pb-10 md:pb-12 lg:gap-x-12 lg:gap-y-0 lg:grid-cols-[minmax(0,0.78fr)_minmax(560px,1.22fr)] lg:items-center">
          <div class="min-w-0 lg:row-start-1">
            <p class="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-blue">
              <span class="h-2 w-2 rounded-full bg-blue" aria-hidden="true"></span>
              {{ t('mediaParserSoftware.kicker') }}
            </p>

            <h1 class="mt-8 max-w-3xl text-5xl font-medium leading-none tracking-tight text-foreground md:mt-12 md:text-7xl">
              {{ t('mediaParserSoftware.titleLead') }}
              <span class="italic text-blue">{{ t('mediaParserSoftware.titleAccent') }}</span>
            </h1>

            <div class="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:mt-7">
              <p>{{ t('mediaParserSoftware.descriptionLead') }}</p>
            </div>
            <div class="mt-8 grid grid-cols-2 gap-x-6 gap-y-0">
              <article
                v-for="module in modules"
                :key="module.title"
                class="flex gap-3 py-5"
              >
                <component :is="module.icon" class="h-6 w-6 shrink-0 text-muted-foreground md:h-5 md:w-5" :stroke-width="1.6" />
                <div class="min-w-0">
                  <h2 class="text-base font-medium tracking-tight text-foreground">{{ module.title }}</h2>
                  <p class="mt-1 text-sm leading-relaxed text-muted-foreground">{{ module.description }}</p>
                </div>
              </article>
            </div>

          </div>

          <figure class="relative isolate lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:flex lg:items-center">
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

          <div class="min-w-0 lg:col-start-1 lg:row-start-2">
            <div class="mt-4 grid grid-cols-2 gap-x-3 gap-y-8 md:mt-6 md:gap-x-6 md:gap-y-10">
              <a
                class="inline-flex h-12 min-w-0 w-full items-center justify-center gap-3 border border-blue px-3 font-mono text-xs uppercase tracking-[0.16em] text-blue transition-colors hover:bg-card md:px-4"
                href="https://github.com/JacoryCYJin/media-parser/releases/tag/v0.2.5"
                target="_blank"
                rel="noreferrer"
              >
                <Download class="h-4 w-4" />
                {{ t('mediaParserSoftware.actions.releases') }}
              </a>
              <a
                class="inline-flex h-12 min-w-0 w-full items-center justify-center gap-3 border border-line px-3 font-mono text-xs uppercase tracking-[0.16em] text-foreground transition-colors hover:border-line-strong hover:bg-card hover:text-blue md:px-4"
                href="https://github.com/JacoryCYJin/media-parser"
                target="_blank"
                rel="noreferrer"
              >
                <Github class="h-4 w-4" />
                {{ t('mediaParserSoftware.actions.github') }}
              </a>
              <dl class="col-span-2 grid grid-cols-2 gap-x-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground md:gap-x-6">
              <div v-for="item in metaItems" :key="item.key" class="flex min-w-0 flex-wrap gap-x-2">
                <dt>{{ item.key }}</dt>
                <dd class="text-foreground">{{ item.value }}</dd>
              </div>
              </dl>
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
import { Clapperboard, Download, FileText, Github, Podcast, Tags } from 'lucide-vue-next'
import screenshotSrc from '../assets/tools/media-parser-desktop.png'
import watermarkSrc from '../assets/tools/video-parser-watermark.png'

const { t } = useI18n()

const metaItems = computed(() => [
  { key: 'macOS', value: 'v0.2.5' },
  { key: t('mediaParserSoftware.meta.type'), value: t('mediaParserSoftware.meta.typeValue') }
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
    icon: Tags
  }
])

</script>
