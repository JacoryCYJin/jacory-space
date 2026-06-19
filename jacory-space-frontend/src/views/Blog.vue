<template>
  <main ref="pageRoot" class="grain min-h-screen bg-background">
    <section class="px-5 pt-28 md:px-8 md:pt-36">
      <div class="mx-auto max-w-screen-xl">
        <div class="reveal blog-reveal flex items-center justify-between border-b border-line pb-4">
          <span class="font-mono text-xs tracking-[0.16em] text-blue">01 — Journal</span>
          <span class="tech">14 entries / archive open</span>
        </div>

        <div class="reveal blog-reveal" style="transition-delay: 80ms">
          <h1
            class="mt-10 max-w-4xl text-balance font-sans text-5xl font-medium leading-[0.98] tracking-tight text-foreground md:text-7xl"
          >
            Field<span class="italic text-blue"> Notes</span>
          </h1>
          <p class="mt-6 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
            关于界面、系统与时间的记录。不追求频率,只追求每一篇都值得被归档。
          </p>
        </div>
      </div>
    </section>

    <section class="px-5 py-20 md:px-8 md:py-28">
      <div class="mx-auto max-w-screen-xl">
        <div class="reveal blog-reveal">
          <RouterLink
            to="/blog"
            class="group grid gap-8 border-y border-line py-10 lg:grid-cols-12 lg:gap-10"
          >
            <div class="flex items-start justify-between lg:col-span-4 lg:flex-col lg:gap-6">
              <span class="font-mono text-xs text-blue">{{ lead.no }}</span>
              <div class="text-right lg:text-left">
                <span class="tech block">{{ lead.cat }}</span>
                <span class="tech block">{{ lead.date }} / {{ lead.read }}</span>
              </div>
            </div>

            <div class="lg:col-span-8">
              <h2
                class="text-balance font-sans text-3xl font-medium leading-tight tracking-tight text-foreground transition-transform duration-500 ease-out group-hover:translate-x-1 md:text-4xl"
              >
                {{ lead.title }}
              </h2>
              <p class="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
                {{ lead.excerpt }}
              </p>
              <span
                class="mt-6 inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-foreground transition-colors group-hover:text-blue"
              >
                Read entry
                <span class="transition-transform duration-500 ease-out group-hover:translate-x-1">↗</span>
              </span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="px-5 pb-28 md:px-8">
      <div class="mx-auto max-w-screen-xl">
        <div class="reveal blog-reveal mb-4 flex items-center justify-between">
          <span class="tech">Archive — All Entries</span>
          <span class="tech">↓ scroll</span>
        </div>

        <ul class="border-t border-line">
          <li
            v-for="(entry, index) in entries"
            :key="entry.no"
            class="reveal blog-reveal"
            :style="{ transitionDelay: `${index * 60}ms` }"
          >
            <RouterLink
              to="/blog"
              class="group grid grid-cols-12 items-center gap-2 border-b border-line py-6 transition-colors duration-300 hover:bg-card"
            >
              <span class="col-span-3 font-mono text-xs text-blue md:col-span-2">
                {{ entry.no }}
              </span>
              <span
                class="col-span-9 text-balance text-base font-medium tracking-tight text-foreground transition-transform duration-300 group-hover:translate-x-1 md:col-span-6 md:text-lg"
              >
                {{ entry.title }}
              </span>
              <span class="tech col-span-6 mt-1 md:col-span-2 md:mt-0">
                {{ entry.cat }}
              </span>
              <span
                class="col-span-5 mt-1 text-right font-mono text-[11px] tracking-[0.12em] text-muted-foreground md:col-span-1 md:mt-0"
              >
                {{ entry.date }}
              </span>
              <span
                class="col-span-1 text-right font-mono text-sm text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue"
              >
                ↗
              </span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </section>

    <footer class="border-t border-line px-5 py-12 md:px-8">
      <div class="mx-auto max-w-screen-xl">
        <div class="reveal blog-reveal flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="font-sans text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              End of index<span class="text-blue">.</span>
            </p>
            <p class="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              这套系统就绪后,下一步才是具体的页面:写作、工具、作品集——都将活在这套冷白的语言里。
            </p>
          </div>

          <dl class="grid grid-cols-2 gap-x-10 gap-y-3 font-mono text-xs">
            <div v-for="item in footerMeta" :key="item.key" class="flex flex-col gap-1">
              <dt class="tracking-[0.14em] text-muted-foreground">{{ item.key }}</dt>
              <dd class="text-foreground">{{ item.value }}</dd>
            </div>
          </dl>
        </div>

        <div class="mt-12 flex items-center justify-between border-t border-line pt-5">
          <span class="tech">© MMXXVI</span>
          <span class="tech">39.9°N — 116.4°E</span>
        </div>
      </div>
    </footer>
  </main>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const pageRoot = ref(null)
let revealObserver

const lead = {
  no: '№ 014',
  title: '关于冷白:为什么我把整个数字空间建立在留白之上',
  excerpt:
    '暖色让人放松,冷色让人专注。一个数字档案不需要被取悦,它需要被信任——于是我移除了所有米色、所有阴影、所有圆角,只留下细线与编号。',
  cat: 'Essay',
  date: '2026.06',
  read: '8 min'
}

const entries = [
  {
    no: '№ 013',
    title: '细线作为结构:hairline 是怎样取代卡片的',
    cat: 'Method',
    date: '2026.05',
    read: '6 min'
  },
  {
    no: '№ 012',
    title: '等宽字体里的秩序感——编号、坐标与索引',
    cat: 'Type',
    date: '2026.05',
    read: '5 min'
  },
  {
    no: '№ 011',
    title: '滚动揭示的节奏:600ms 与一条缓动曲线',
    cat: 'Motion',
    date: '2026.04',
    read: '7 min'
  },
  {
    no: '№ 010',
    title: '把个人网站当作操作系统来设计',
    cat: 'Essay',
    date: '2026.03',
    read: '11 min'
  },
  {
    no: '№ 009',
    title: '蚀刻噪点:让纯净的界面有触感',
    cat: 'Texture',
    date: '2026.02',
    read: '4 min'
  },
  {
    no: '№ 008',
    title: '隐藏层:悬停才出现的第二层信息',
    cat: 'Interaction',
    date: '2026.01',
    read: '6 min'
  }
]

const footerMeta = [
  { key: 'System', value: 'Personal OS / v.01' },
  { key: 'Surface', value: 'Cool White' },
  { key: 'Accent', value: 'Cool Blue' },
  { key: 'Status', value: 'Foundation' }
]

onMounted(() => {
  const revealItems = pageRoot.value?.querySelectorAll('.blog-reveal') ?? []

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-in'))
    return
  }

  revealObserver = new IntersectionObserver(
    (items) => {
      items.forEach((item) => {
        if (item.isIntersecting) {
          item.target.classList.add('is-in')
          revealObserver.unobserve(item.target)
        }
      })
    },
    { threshold: 0.14 }
  )

  revealItems.forEach((item) => revealObserver.observe(item))
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
})
</script>
