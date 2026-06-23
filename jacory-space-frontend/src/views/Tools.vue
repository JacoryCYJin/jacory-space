<template>
  <main ref="pageRoot" class="grain min-h-screen bg-background pt-[var(--navbar-height)] [--navbar-height:4rem]">
    <div class="grid w-full grid-cols-[minmax(0,1fr)] border-line lg:grid-cols-[360px_minmax(0,1fr)] lg:px-4 xl:grid-cols-[372px_minmax(0,1fr)] xl:px-8 2xl:grid-cols-[380px_minmax(0,1fr)] 2xl:px-20">
      <aside class="self-start border-b border-line px-8 pb-14 pt-5 lg:sticky lg:top-[var(--navbar-height)] lg:flex lg:h-[calc(100svh-var(--navbar-height))] lg:flex-col lg:border-b-0 lg:border-r lg:px-[2.35rem] lg:pb-6 lg:pt-5 xl:px-10 2xl:px-12">
        <section data-tools-enter class="sidebar-hero-section">
          <div class="grid gap-8 lg:gap-4 xl:gap-6">
            <div class="grid gap-10 lg:gap-4 xl:gap-7">
              <p class="font-mono text-xs tracking-[0.18em] text-blue">{{ t('tools.interfaceIndex.kicker') }}</p>
              <h1 class="font-sans text-5xl font-medium leading-[0.98] tracking-tight text-foreground md:text-[4.15rem] lg:text-[3.55rem] xl:text-[4.15rem]">
                Interface
                <span class="block italic text-blue">Index</span>
              </h1>
            </div>
            <div class="grid max-w-[25rem] text-[15px] leading-[1.72] text-muted-foreground">
              <p>{{ t('tools.interfaceIndex.description') }}</p>
            </div>
          </div>
        </section>

        <section data-tools-enter class="sidebar-index-section" :aria-label="t('tools.interfaceIndex.categoriesAria')">
          <nav class="space-y-1 pb-[var(--sidebar-border-gap)] pt-3 lg:space-y-0 lg:pt-1 xl:space-y-1 xl:pt-2">
            <button
              v-for="panel in categoryPanels"
              :key="panel.id"
              type="button"
              class="sidebar-index-item group"
              :class="activeFilter === panel.id ? 'text-blue' : 'text-foreground hover:text-blue'"
              @click="setFilter(panel.id)"
            >
              <span class="grid grid-cols-[1rem_minmax(0,1fr)_2ch] items-baseline gap-x-4">
                <span
                  class="mt-[0.08rem] h-1.5 w-1.5 rounded-full bg-blue transition-opacity duration-300 ease-premium"
                  :class="activeFilter === panel.id ? 'opacity-100' : 'opacity-45 group-hover:opacity-80'"
                  aria-hidden="true"
                />
                <span class="font-mono text-sm font-semibold uppercase tracking-[0.2em]">{{ panel.label }}</span>
                <span class="justify-self-end font-mono text-sm tabular-nums tracking-[0.12em]">{{ panel.count }}</span>
              </span>
              <span class="mt-[var(--sidebar-copy-gap)] block max-w-[18rem] pl-8 font-mono text-xs leading-relaxed tracking-[0.08em] text-muted-foreground">
                {{ panel.description }}
              </span>
            </button>
          </nav>

          <div class="border-t border-line pt-[var(--sidebar-border-gap)]">
            <div class="sidebar-index-item">
              <p class="font-mono text-sm uppercase leading-none tracking-[0.16em] text-muted-foreground">{{ t('tools.interfaceIndex.lastUpdateLabel') }}</p>
              <p class="mt-[var(--sidebar-update-gap)] font-mono text-sm uppercase leading-none tracking-[0.16em] text-foreground">
                {{ lastUpdate }}
              </p>
            </div>
          </div>
        </section>
      </aside>

      <section class="flex min-w-0 flex-col px-6 pb-12 pt-16 md:px-9 md:pt-20 lg:h-[calc(100svh-var(--navbar-height))] lg:px-10 lg:pb-10 lg:pt-12 xl:px-11 2xl:px-12">
        <div data-tools-enter class="min-h-0 flex-1">
          <LayeredSpatialIndex
            :projects="projects"
            :active-filter="activeFilter"
            @select="handleSelect"
          />
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import LayeredSpatialIndex from '../components/tools/LayeredSpatialIndex.vue'

gsap.registerPlugin(CustomEase)

const { t } = useI18n()
const pageRoot = ref(null)
const activeFilter = ref('all')
const selectedProject = ref(null)
let toolsContext = null

const projects = [
  {
    id: '001', no: '001', title: 'Video Parser', layer: 'TOOLS', category: 'tool', status: 'live',
    pos: [-7.0, -1.6], description: '解析 Bilibili、YouTube 等平台视频，提取字幕、总结大纲、生成结构化笔记。',
    stack: ['Vue', 'Express', 'yt-dlp'], version: 'v1.0.0', updated: '2026.06.20', href: '/video-parser'
  },
  {
    id: '002', no: '002', title: 'Hairline Grid', layer: 'TOOLS', category: 'tool', status: 'wip',
    pos: [-1.2, 1.4], description: '生成可见的细线网格，用于界面排版、排版标尺与视觉参考。',
    stack: ['CSS', 'SVG'], version: 'v0.2.0', updated: '2026.06.18', href: '/tools'
  },
  {
    id: '003', no: '003', title: 'Cool Palette', layer: 'TOOLS', category: 'tool', status: 'wip',
    pos: [3.8, -1.2], description: '从一个冷色种子值导出完整的色彩系统，并提供 OKLCH 对比校验。',
    stack: ['OKLCH', 'Color System'], version: 'v0.3.1', updated: '2026.06.17', href: '/tools'
  },
  {
    id: '004', no: '004', title: 'Interface Kit', layer: 'TOOLS', category: 'tool', status: 'wip',
    pos: [7.4, 1.5], description: '常用界面结构与组件片段集合，面向快速搭建与复用。',
    stack: ['Vue', 'Components'], version: 'v0.1.0', updated: '2026.06.10', href: '/tools'
  },
  {
    id: '005', no: '005', title: 'Jacory Space', layer: 'WORKS', category: 'work', status: 'live',
    pos: [-6.8, 0.8], description: '个人数字空间与操作系统，整合工具、博客与实验。',
    stack: ['Vue', 'GSAP', 'Design System'], version: 'v1.5.0', updated: '2026.06.15', href: '/'
  },
  {
    id: '006', no: '006', title: 'Portfolio System', layer: 'WORKS', category: 'work', status: 'wip',
    pos: [-0.6, -1.5], description: '作品结构、项目叙事与展示索引系统。',
    stack: ['Vue', 'Content Model'], version: 'v0.2.0', updated: '2026.06.08', href: '/tools'
  },
  {
    id: '007', no: '007', title: 'Design System', layer: 'WORKS', category: 'work', status: 'live',
    pos: [6.2, 1.1], description: '冷白界面系统、技术标签、细线结构与动效规范。',
    stack: ['Tailwind', 'Tokens'], version: 'v1.1.0', updated: '2026.06.06', href: '/tools'
  },
  {
    id: '008', no: '008', title: 'Mono Index', layer: 'EXPERIMENTS', category: 'experiment', status: 'beta',
    pos: [-6.0, -1.2], description: '把任意列表转成等宽索引系统，支持编号、层级与检索。',
    stack: ['TypeScript', 'Algorithm'], version: 'v0.4.0', updated: '2026.06.12', href: '/tools'
  },
  {
    id: '009', no: '009', title: 'Reveal Timing', layer: 'EXPERIMENTS', category: 'experiment', status: 'beta',
    pos: [1.2, 1.4], description: '可视化缓动曲线与滚动揭示节奏，预览 600–900ms 动效区间。',
    stack: ['GSAP', 'Motion'], version: 'v0.3.0', updated: '2026.06.03', href: '/tools'
  }
]

function pad2(value) {
  return String(value).padStart(2, '0')
}

function categoryCount(category) {
  return projects.filter((project) => project.category === category).length
}

const categoryPanels = computed(() => [
  {
    id: 'all',
    label: t('tools.interfaceIndex.filters.all'),
    description: t('tools.interfaceIndex.categoryDescriptions.all'),
    count: pad2(projects.length)
  },
  {
    id: 'tool',
    label: t('tools.interfaceIndex.filters.tools'),
    description: t('tools.interfaceIndex.categoryDescriptions.tools'),
    count: pad2(categoryCount('tool'))
  },
  {
    id: 'work',
    label: t('tools.interfaceIndex.filters.works'),
    description: t('tools.interfaceIndex.categoryDescriptions.works'),
    count: pad2(categoryCount('work'))
  },
  {
    id: 'experiment',
    label: t('tools.interfaceIndex.filters.experiments'),
    description: t('tools.interfaceIndex.categoryDescriptions.experiments'),
    count: pad2(categoryCount('experiment'))
  }
])

const lastUpdate = computed(() => projects.map((project) => project.updated).sort().at(-1))

function setFilter(id) {
  activeFilter.value = id
  selectedProject.value = null
}

function handleSelect(project) {
  selectedProject.value = project
}

onMounted(async () => {
  const root = pageRoot.value
  if (!root) return

  await nextTick()

  const enterEase = CustomEase.create('tools-interface-enter', '0.16,1,0.3,1')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  toolsContext = gsap.context(() => {
    const enterItems = gsap.utils.toArray('[data-tools-enter]', root)

    if (reducedMotion.matches) {
      gsap.set(enterItems, { clearProps: 'all', autoAlpha: 1, y: 0 })
      return
    }

    gsap.set(enterItems, { autoAlpha: 0, y: 14 })
    gsap.to(enterItems, {
      autoAlpha: 1,
      y: 0,
      duration: 0.82,
      ease: enterEase,
      stagger: 0.055,
      clearProps: 'opacity,visibility,transform'
    })
  }, root)
})

onBeforeUnmount(() => {
  toolsContext?.revert()
})
</script>

<style scoped>
.sidebar-hero-section {
  @apply border-b border-line py-10 lg:shrink-0 lg:pb-5 lg:pt-5 xl:pb-7 xl:pt-8;
}

.sidebar-index-section {
  --sidebar-border-gap: 1.5rem;
  --sidebar-copy-gap: 1rem;
  --sidebar-update-gap: 1.5rem;

  @apply border-b-0 py-10 lg:min-h-0 lg:flex-1 lg:py-3 xl:py-5;
}

@media (min-width: 1024px) {
  .sidebar-index-section {
    --sidebar-border-gap: 0.75rem;
  }
}

@media (min-width: 1280px) {
  .sidebar-index-section {
    --sidebar-border-gap: 1.25rem;
  }
}

.sidebar-index-item {
  @apply block w-full py-6 text-left transition-colors duration-300 ease-premium lg:py-2.5 xl:py-2.5;
}
</style>
