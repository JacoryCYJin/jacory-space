<template>
  <main ref="pageRoot" class="grain min-h-screen bg-background">
    <section class="px-5 pt-28 md:px-8 md:pt-36">
      <div class="mx-auto max-w-screen-xl">
        <div data-tools-enter class="flex items-center justify-between border-b border-line pb-4">
          <span class="font-mono text-xs tracking-[0.16em] text-blue">01 — Lab</span>
          <span class="tech">06 tools / 01 live</span>
        </div>

        <div data-tools-enter>
          <h1
            class="mt-10 max-w-4xl text-balance font-sans text-5xl font-medium leading-[0.98] tracking-tight text-foreground md:text-7xl"
          >
            Interface<span class="italic text-blue"> Tools</span>
          </h1>
          <p class="mt-6 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
            自建的小工具与实验。视频解析、界面工具与系统组件都从这里进入。
          </p>
        </div>
      </div>
    </section>

    <section class="px-5 py-20 md:px-8 md:py-28">
      <div class="mx-auto max-w-screen-xl">
        <div data-tools-enter class="mb-4 flex items-center justify-between">
          <span class="tech">Registry — All Tools</span>
          <span class="tech">grid / 12-col</span>
        </div>

        <div class="tools-registry grid sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="tool in tools"
            :key="tool.no"
            data-tools-enter
            class="tools-registry-item"
          >
            <RouterLink
              :to="tool.href"
              class="group flex h-full min-h-64 flex-col justify-between bg-background p-6 transition-colors duration-300 hover:bg-card"
            >
              <div class="flex items-start justify-between">
                <span class="font-mono text-xs text-blue">№ {{ tool.no }}</span>
                <span
                  class="font-mono text-[11px] tracking-[0.16em]"
                  :class="statusClass[tool.status]"
                >
                  ● {{ tool.status }}
                </span>
              </div>

              <div class="mt-10">
                <h2
                  class="font-sans text-2xl font-medium tracking-tight text-foreground transition-transform duration-300 group-hover:translate-x-1"
                >
                  {{ tool.name }}
                </h2>
                <p class="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {{ tool.desc }}
                </p>
              </div>

              <div class="mt-8 flex items-center justify-between border-t border-line pt-4">
                <span class="tech">{{ tool.tag }}</span>
                <span
                  class="font-mono text-[11px] tracking-[0.12em] text-muted-foreground transition-all duration-300 group-hover:text-blue"
                >
                  {{ tool.ver }} ↗
                </span>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="px-5 pb-28 md:px-8">
      <div class="mx-auto max-w-screen-xl">
        <div data-tools-enter class="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-6">
          <span class="tech">Legend</span>
          <span
            v-for="legend in legends"
            :key="legend.status"
            class="flex items-center gap-2"
          >
            <span
              class="font-mono text-[11px] tracking-[0.16em]"
              :class="statusClass[legend.status]"
            >
              ● {{ legend.status }}
            </span>
            <span class="text-xs text-muted-foreground">{{ legend.label }}</span>
          </span>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)

const pageRoot = ref(null)
let toolsContext

const tools = [
  {
    no: '001',
    name: 'Video Parser',
    desc: '解析 Bilibili、YouTube 等多平台视频,选择清晰度并下载到指定目录。',
    status: 'LIVE',
    tag: 'Utility',
    ver: 'v1.0',
    href: '/video-parser'
  },
  {
    no: '002',
    name: 'Hairline Grid',
    desc: '生成可见细线的 12 列基线网格,导出为 CSS 变量与 SVG 叠层。',
    status: 'WIP',
    tag: 'Layout',
    ver: 'v0.2',
    href: '/tools'
  },
  {
    no: '003',
    name: 'Cool Palette',
    desc: '从一个冷色种子推导出克制色彩系统,带 OKLCH 对比校验。',
    status: 'WIP',
    tag: 'Color',
    ver: 'v0.1',
    href: '/tools'
  },
  {
    no: '004',
    name: 'Mono Index',
    desc: '把任意列表转成等宽编号索引,让编号、类目与坐标自动对齐。',
    status: 'BETA',
    tag: 'Type',
    ver: 'v0.4',
    href: '/tools'
  },
  {
    no: '005',
    name: 'Reveal Timing',
    desc: '可视化缓动曲线与滚动揭示节奏,预览 600–900ms 区间。',
    status: 'BETA',
    tag: 'Motion',
    ver: 'v0.3',
    href: '/tools'
  },
  {
    no: '006',
    name: 'Coord Stamp',
    desc: '为页面生成经纬度与时间戳水印,给数字档案一个坐标。',
    status: 'ARCHIVED',
    tag: 'Utility',
    ver: 'v1.0',
    href: '/tools'
  }
]

const legends = [
  { status: 'LIVE', label: '已上线' },
  { status: 'BETA', label: '测试中' },
  { status: 'WIP', label: '开发中' },
  { status: 'ARCHIVED', label: '已归档' }
]

const statusClass = {
  LIVE: 'text-blue',
  BETA: 'text-foreground',
  WIP: 'text-muted-foreground',
  ARCHIVED: 'text-muted-foreground/60'
}

onMounted(() => {
  const root = pageRoot.value
  if (!root) return

  const enterEase = CustomEase.create('tools-enter', '0.16,1,0.3,1')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  toolsContext = gsap.context(() => {
    const enterItems = gsap.utils.toArray('[data-tools-enter]', root)

    if (reducedMotion.matches) {
      gsap.set(enterItems, {
        clearProps: 'all',
        autoAlpha: 1,
        y: 0
      })
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
.tools-registry-item {
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  border-left: 1px solid var(--line);
}

.tools-registry-item:first-child {
  border-top: 1px solid var(--line);
}

@media (min-width: 640px) {
  .tools-registry-item {
    border-top: 0;
    border-right: 0;
  }

  .tools-registry-item:nth-child(-n + 2) {
    border-top: 1px solid var(--line);
  }

  .tools-registry-item:nth-child(2n) {
    border-right: 1px solid var(--line);
  }
}

@media (min-width: 1024px) {
  .tools-registry-item {
    border-right: 0;
  }

  .tools-registry-item:nth-child(-n + 3) {
    border-top: 1px solid var(--line);
  }

  .tools-registry-item:nth-child(2n) {
    border-right: 0;
  }

  .tools-registry-item:nth-child(3n) {
    border-right: 1px solid var(--line);
  }
}
</style>
