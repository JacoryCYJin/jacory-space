<template>
  <div class="min-h-screen bg-white text-[#1a1a1a]">
    <!-- Hero -->
    <header class="max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
      <p ref="heroTag" class="text-sm font-medium tracking-[0.3em] uppercase text-gray-400 mb-4">
        Color System
      </p>
      <h1 ref="heroTitle" class="text-4xl md:text-6xl font-bold tracking-tight mb-5">
        精选配色
      </h1>
      <p ref="heroDesc" class="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
        「纯白底 #FFFFFF」方案（前 8 套，均来自真实站点或设计系统并附参考链接），下方保留白 / 米白底及其他 Awwwards、Dribbble 参考配色。点击任意色块即可复制 HEX 色值。
      </p>
    </header>

    <!-- Palettes -->
    <main class="max-w-6xl mx-auto px-6 pb-28 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <section
        v-for="(palette, i) in palettes"
        :key="palette.id"
        :ref="el => setCardRef(el, i)"
        class="palette-card rounded-3xl border p-5 shadow-sm hover:shadow-md transition-shadow"
        :class="palette.recommended ? 'border-gray-900' : 'border-gray-100'"
      >
        <div class="flex items-start justify-between gap-2 mb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono text-gray-300">{{ String(i + 1).padStart(2, '0') }}</span>
              <h2 class="text-base font-semibold tracking-tight leading-tight">{{ palette.name }}</h2>
              <span
                v-if="palette.recommended"
                class="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-900 text-white"
              >推荐</span>
            </div>
            <p class="text-xs text-gray-500 mt-1 leading-relaxed">{{ palette.desc }}</p>
          </div>
          <span class="shrink-0 text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">{{ palette.mood }}</span>
        </div>

        <!-- Swatches -->
        <div class="grid grid-cols-6 gap-1.5 mb-5">
          <button
            v-for="color in palette.colors"
            :key="color.hex"
            @click="copy(color.hex)"
            :title="`${color.name} ${color.hex}`"
            class="group relative rounded-lg overflow-hidden aspect-square border border-gray-100 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow"
          >
            <span class="block w-full h-full" :style="{ backgroundColor: color.hex }"></span>
            <span
              class="absolute inset-0 flex items-center justify-center text-[9px] font-medium text-white bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {{ copied === color.hex ? '✓' : '复制' }}
            </span>
          </button>
        </div>
        <div class="flex flex-wrap gap-x-3 gap-y-0.5 mb-5">
          <span
            v-for="color in palette.colors"
            :key="color.hex + '-hex'"
            class="text-[10px] font-mono text-gray-400 uppercase"
          >{{ color.hex }}</span>
        </div>

        <!-- Mini UI preview -->
        <div
          class="rounded-2xl p-4"
          :style="{ backgroundColor: palette.surface }"
        >
          <div class="flex items-center justify-between mb-3">
            <span
              class="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full"
              :style="{ backgroundColor: palette.accent + '22', color: palette.accent }"
            >New</span>
            <div class="flex gap-1">
              <span class="h-4 w-4 rounded" :style="{ backgroundColor: palette.primary }"></span>
              <span class="h-4 w-4 rounded" :style="{ backgroundColor: palette.accent }"></span>
            </div>
          </div>
          <div class="h-1.5 w-2/3 rounded-full mb-1.5" :style="{ backgroundColor: palette.muted + '55' }"></div>
          <div class="h-1.5 w-full rounded-full mb-4" :style="{ backgroundColor: palette.muted + '33' }"></div>
          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
              :style="{ backgroundColor: palette.primary }"
            >主按钮</button>
            <button
              class="px-3 py-1.5 rounded-lg text-xs font-semibold border"
              :style="{ borderColor: palette.primary, color: palette.primary }"
            >次按钮</button>
          </div>
        </div>

        <!-- Reference link -->
        <a
          v-if="palette.ref"
          :href="palette.ref"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-4 flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-900 transition-colors group/ref"
        >
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5M10.172 13.828a4 4 0 010-5.656l3-3a4 4 0 015.656 5.656l-1.5 1.5" />
          </svg>
          <span class="truncate group-hover/ref:underline">参考：{{ palette.refLabel }}</span>
        </a>
      </section>
    </main>

    <!-- copy toast -->
    <transition name="fade">
      <div
        v-if="copied"
        class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-sm px-4 py-2 rounded-full shadow-lg z-50"
      >
        已复制 {{ copied }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const heroTag = ref(null)
const heroTitle = ref(null)
const heroDesc = ref(null)
const cardRefs = ref([])
const copied = ref('')
let copyTimer = null
let ctx = null

const setCardRef = (el, i) => {
  if (el) cardRefs.value[i] = el
}

const palettes = [
  {
    id: 'white-blue',
    name: 'Clean White · 纯白 + 蓝',
    desc: '纯白底配专业蓝，可读性与信任感最强的极简组合，SaaS / 工具站默认之选。博客 + 工具首推。',
    mood: 'Pure White · Best',
    recommended: true,
    ref: 'https://colorhero.io/blog/minimalist-color-palettes-clean-landing-pages',
    refLabel: 'Colorhero · Clean White + Blue',
    primary: '#2563EB',
    accent: '#2563EB',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    muted: '#6B7280',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Blue', hex: '#2563EB' },
      { name: 'Ink', hex: '#1A1A1A' },
      { name: 'Gray', hex: '#6B7280' },
      { name: 'Soft White', hex: '#FAFAFA' },
      { name: 'Border', hex: '#E5E7EB' }
    ]
  },
  {
    id: 'mono-accent',
    name: 'Monochrome + Accent · 纯白 + 单蓝',
    desc: '中性灰阶 + 单一鲜蓝强调，层级清晰、克制现代。出自极简配色指南，含完整 token。',
    mood: 'Pure White · Clean',
    ref: 'https://colorfyi.com/blog/minimalist-color-palettes/',
    refLabel: 'ColorFYI · Monochrome + Accent',
    primary: '#2563EB',
    accent: '#2563EB',
    surface: '#FFFFFF',
    text: '#171717',
    muted: '#404040',
    colors: [
      { name: 'Background', hex: '#FFFFFF' },
      { name: 'Surface', hex: '#F5F5F5' },
      { name: 'Border', hex: '#E5E5E5' },
      { name: 'Body', hex: '#404040' },
      { name: 'Heading', hex: '#171717' },
      { name: 'Accent', hex: '#2563EB' }
    ]
  },
  {
    id: 'blanc-noir',
    name: 'Blanc et Noir · 纯白 + 纯黑 + 信号红',
    desc: '纯白纯黑靠排版说话，仅在关键 CTA 用一抹信号红。极致克制、永不过时。',
    mood: 'Pure White · Bold',
    ref: 'https://colorfyi.com/blog/minimalist-color-palettes/',
    refLabel: 'ColorFYI · Blanc et Noir',
    primary: '#000000',
    accent: '#FF4500',
    surface: '#FFFFFF',
    text: '#000000',
    muted: '#6B7280',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Signal Red', hex: '#FF4500' },
      { name: 'Gray', hex: '#6B7280' },
      { name: 'Light Gray', hex: '#E5E5E5' },
      { name: 'Soft White', hex: '#F5F5F5' }
    ]
  },
  {
    id: 'som',
    name: 'SŌM · 纯白 + 红橙',
    desc: 'Awwwards 当日最佳：纯白底仅配一抹高能红橙 #FF3A1F，干净、聚焦、有冲击力。',
    mood: 'Awwwards · SOTD',
    ref: 'https://www.awwwards.com/sites/som',
    refLabel: 'Awwwards · SŌM',
    primary: '#FF3A1F',
    accent: '#FF3A1F',
    surface: '#FFFFFF',
    text: '#111111',
    muted: '#6B7280',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Red-Orange', hex: '#FF3A1F' },
      { name: 'Ink', hex: '#111111' },
      { name: 'Gray', hex: '#6B7280' },
      { name: 'Light Gray', hex: '#E5E5E5' },
      { name: 'Soft White', hex: '#F7F7F7' }
    ]
  },
  {
    id: 'p10',
    name: 'Pesquera Diez · 纯白 + 亮黄',
    desc: 'Awwwards 当日最佳：纯白配大胆亮黄 #F3E700，黑白排版 + 黄色点睛，年轻有态度。',
    mood: 'Awwwards · SOTD',
    ref: 'https://www.awwwards.com/sites/pesquera-diez-p10',
    refLabel: 'Awwwards · Pesquera Diez (P10)',
    primary: '#111111',
    accent: '#F3E700',
    surface: '#FFFFFF',
    text: '#111111',
    muted: '#6B7280',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Bold Yellow', hex: '#F3E700' },
      { name: 'Black', hex: '#111111' },
      { name: 'Gray', hex: '#6B7280' },
      { name: 'Light Gray', hex: '#E5E5E5' },
      { name: 'Soft White', hex: '#FAFAFA' }
    ]
  },
  {
    id: 'pentagram',
    name: 'Pentagram · 纯白 + 黑 + 红',
    desc: '传奇设计公司 Pentagram 官网（Awwwards 当日最佳）：纯白 + 纯黑 + 标志性红 #D14836。',
    mood: 'Awwwards · SOTD',
    ref: 'https://www.awwwards.com/sites/pentagram',
    refLabel: 'Awwwards · Pentagram',
    primary: '#000000',
    accent: '#D14836',
    surface: '#FFFFFF',
    text: '#000000',
    muted: '#6B7280',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Pentagram Red', hex: '#D14836' },
      { name: 'Gray', hex: '#6B7280' },
      { name: 'Light Gray', hex: '#E5E5E5' },
      { name: 'Soft White', hex: '#F5F5F5' }
    ]
  },
  {
    id: 'ashley-brooke',
    name: 'Ashley Brooke · 纯白 + 近黑',
    desc: 'Awwwards 当日最佳：纯白底配带一丝暖意的近黑 #131410，编辑气质、极简纯净。',
    mood: 'Awwwards · SOTD',
    ref: 'https://www.awwwards.com/sites/ashley-brooke',
    refLabel: 'Awwwards · Ashley Brooke',
    primary: '#131410',
    accent: '#131410',
    surface: '#FFFFFF',
    text: '#131410',
    muted: '#6B6B66',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Near Black', hex: '#131410' },
      { name: 'Gray', hex: '#6B6B66' },
      { name: 'Light Gray', hex: '#E5E5E3' },
      { name: 'Soft White', hex: '#F7F7F5' },
      { name: 'Border', hex: '#DDDDD9' }
    ]
  },
  {
    id: 'silent-house',
    name: 'Silent House · 纯白 + 纯黑',
    desc: 'Awwwards 当日最佳：最纯粹的纯白 + 纯黑双色，靠留白与排版取胜，极致干净。',
    mood: 'Awwwards · SOTD',
    ref: 'https://www.awwwards.com/sites/silent-house',
    refLabel: 'Awwwards · Silent House',
    primary: '#000000',
    accent: '#000000',
    surface: '#FFFFFF',
    text: '#000000',
    muted: '#6B7280',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Gray', hex: '#6B7280' },
      { name: 'Light Gray', hex: '#E5E5E5' },
      { name: 'Soft White', hex: '#F5F5F5' },
      { name: 'Border', hex: '#DDDDDD' }
    ]
  },
  {
    id: 'lovable-cream',
    name: 'Cream Humanist · 奶油 + 炭黑 + 蓝',
    desc: '奶油纸张底 + 炭黑文字 + 一抹环形蓝做交互，人文温暖、阅读极佳。博客 + 工具首选。',
    mood: 'Off-White · Cream',
    ref: 'https://designmd.app/en/library/lovable-cream-humanist',
    refLabel: 'DESIGN.md · Lovable Cream Humanist',
    primary: '#1C1C1C',
    accent: '#3B82F6',
    surface: '#F7F4ED',
    text: '#1C1C1C',
    muted: '#5F5F5D',
    colors: [
      { name: 'Creme', hex: '#F7F4ED' },
      { name: 'Charcoal', hex: '#1C1C1C' },
      { name: 'Off-White', hex: '#FCFBF8' },
      { name: 'Border', hex: '#ECEAE4' },
      { name: 'Muted', hex: '#5F5F5D' },
      { name: 'Ring Blue', hex: '#3B82F6' }
    ]
  },
  {
    id: 'warm-navy',
    name: 'Warm Neutral · 暖米 + 海军蓝',
    desc: '暖米沙底配深海军蓝，精致、人文、专业。出自极简落地页配色指南。',
    mood: 'Off-White · Refined',
    ref: 'https://colorhero.io/blog/minimalist-color-palettes-clean-landing-pages',
    refLabel: 'Colorhero · Warm Neutral + Navy',
    primary: '#1E3A5F',
    accent: '#1E3A5F',
    surface: '#F5F0EB',
    text: '#2C2416',
    muted: '#8B8178',
    colors: [
      { name: 'Warm Beige', hex: '#F5F0EB' },
      { name: 'Sand', hex: '#FAF7F2' },
      { name: 'Navy', hex: '#1E3A5F' },
      { name: 'Brown', hex: '#2C2416' },
      { name: 'Warm Gray', hex: '#8B8178' },
      { name: 'Border', hex: '#E7E0D7' }
    ]
  },
  {
    id: 'granola',
    name: 'Granola · 暖奶油 + 高亮黄',
    desc: '暖奶油画布 + 荧光笔高亮黄强调，亲切、有产品感。来自 Granola 营销设计系统。',
    mood: 'Off-White · Friendly',
    ref: 'https://www.shadcn.io/design/granola',
    refLabel: 'shadcn · Granola 设计系统',
    primary: '#1B1B17',
    accent: '#FEBE29',
    surface: '#F7F7F2',
    text: '#1B1B17',
    muted: '#8A8A80',
    colors: [
      { name: 'Cream Canvas', hex: '#F7F7F2' },
      { name: 'Surface', hex: '#EAEBE5' },
      { name: 'Highlight Yellow', hex: '#FEBE29' },
      { name: 'Ink', hex: '#1B1B17' },
      { name: 'Gray', hex: '#8A8A80' },
      { name: 'White', hex: '#FFFFFF' }
    ]
  },
  {
    id: 'tan-green',
    name: 'Tan + Green · 米白 + 墨绿',
    desc: '极淡米白底配妆感裸棕与互补墨绿，温柔自然、有亲和力。Gatto Web 2025 配色。',
    mood: 'Off-White · Natural',
    ref: 'https://hookagency.com/blog/website-color-schemes/',
    refLabel: 'Hook Agency · Gatto Web Tan + Green',
    primary: '#266150',
    accent: '#DDAF94',
    surface: '#FDF8F5',
    text: '#4F4846',
    muted: '#9A8E84',
    colors: [
      { name: 'Off White', hex: '#FDF8F5' },
      { name: 'Makeup Tan', hex: '#DDAF94' },
      { name: 'Blush', hex: '#E8CEBF' },
      { name: 'Green', hex: '#266150' },
      { name: 'Dark Highlight', hex: '#4F4846' },
      { name: 'Stone', hex: '#9A8E84' }
    ]
  },
  {
    id: 'kvs-studio',
    name: 'KVS Studio · 暖白 + 烈橙',
    desc: 'Awwwards 当日最佳：极简暖白底，仅用一抹烈橙 #FF5500 点睛，干净又有冲击力。',
    mood: 'Awwwards · SOTD',
    ref: 'https://www.awwwards.com/sites/kvs-studio',
    refLabel: 'Awwwards · KVS Studio',
    primary: '#FF5500',
    accent: '#FF5500',
    surface: '#F5F2EC',
    text: '#161616',
    muted: '#7A7568',
    colors: [
      { name: 'Off-White', hex: '#F5F2EC' },
      { name: 'Orange', hex: '#FF5500' },
      { name: 'Ink', hex: '#161616' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Gray', hex: '#7A7568' },
      { name: 'Border', hex: '#E8E4DD' }
    ]
  },
  {
    id: 'kookie',
    name: 'KOOKIE · 浅灰白 + 极黑',
    desc: 'Awwwards 荣誉提名：浅灰白 #EBEBEB 配极黑 #141414，强对比、克制、有质感。',
    mood: 'Awwwards · HM',
    ref: 'https://www.awwwards.com/sites/kookie',
    refLabel: 'Awwwards · KOOKIE',
    primary: '#141414',
    accent: '#141414',
    surface: '#EBEBEB',
    text: '#141414',
    muted: '#6E6E6E',
    colors: [
      { name: 'Light Grey', hex: '#EBEBEB' },
      { name: 'Near Black', hex: '#141414' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Gray', hex: '#6E6E6E' },
      { name: 'Light Gray', hex: '#C9C9C9' },
      { name: 'Border', hex: '#DCDCDC' }
    ]
  },
  {
    id: 'douglus',
    name: 'Douglus · 暖白纸 + 墨黑',
    desc: 'Awwwards 荣誉提名：带一丝暖意的极浅白 #FEFFF8 配墨黑，靠排版与留白撑场。',
    mood: 'Awwwards · HM',
    ref: 'https://www.awwwards.com/sites/douglus-creative-developer',
    refLabel: 'Awwwards · Douglus',
    primary: '#161616',
    accent: '#161616',
    surface: '#FEFFF8',
    text: '#161616',
    muted: '#6F6F66',
    colors: [
      { name: 'Warm White', hex: '#FEFFF8' },
      { name: 'Ink', hex: '#161616' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Gray', hex: '#6F6F66' },
      { name: 'Light', hex: '#D6D6CE' },
      { name: 'Border', hex: '#ECEDE2' }
    ]
  },
  {
    id: 'shruti',
    name: 'Portfolio by Shruti · 中性白 + 黑',
    desc: 'Awwwards 荣誉提名：中性偏冷的 #FAFAFA 配纯黑，极简纯净、轻盈现代。',
    mood: 'Awwwards · HM',
    ref: 'https://www.awwwards.com/sites/portfolio-by-shruti',
    refLabel: 'Awwwards · Portfolio by Shruti',
    primary: '#111111',
    accent: '#111111',
    surface: '#FAFAFA',
    text: '#111111',
    muted: '#6B7280',
    colors: [
      { name: 'Off-White', hex: '#FAFAFA' },
      { name: 'Black', hex: '#111111' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Gray', hex: '#6B7280' },
      { name: 'Light Gray', hex: '#D4D4D4' },
      { name: 'Border', hex: '#E5E5E5' }
    ]
  },
  {
    id: 'relace',
    name: 'Canvas Cream · 奶油 + 金菊',
    desc: '“白色大理石上的建筑蓝图”——奶油底配里科尔煤黑，单一金菊黄做强调。高级、克制、阅读友好，博客 + 工具首选。',
    mood: 'Editorial',
    ref: 'https://styles.refero.design/style/9623a699-230d-4ee2-a174-8209e1e9ef16',
    refLabel: 'Refero · Relace 设计系统',
    primary: '#191918',
    accent: '#FCAA2D',
    surface: '#FFFEF2',
    text: '#000000',
    muted: '#BAB9B0',
    colors: [
      { name: 'Canvas Cream', hex: '#FFFEF2' },
      { name: 'Ink Black', hex: '#000000' },
      { name: 'Rich Coal', hex: '#191918' },
      { name: 'Pale Stone', hex: '#EDECE0' },
      { name: 'Warm Gray', hex: '#BAB9B0' },
      { name: 'Goldenrod', hex: '#FCAA2D' }
    ]
  },
  {
    id: 'juan-mora',
    name: 'Juan Mora · 蜜桃 + 电光蓝',
    desc: 'Awwwards 当日最佳作品集双色方案：柔和蜜桃打底，电光蓝做强烈点睛，年轻、高级、有冲击力。',
    mood: 'Awwwards · SOTD',
    ref: 'https://www.awwwards.com/sites/juan-mora-1',
    refLabel: 'Awwwards · Juan Mora（SOTD）',
    primary: '#2E54FE',
    accent: '#FFBC95',
    surface: '#FFF3EA',
    text: '#0E1116',
    muted: '#6B7280',
    colors: [
      { name: 'Electric Blue', hex: '#2E54FE' },
      { name: 'Peach', hex: '#FFBC95' },
      { name: 'Peach Soft', hex: '#FFF3EA' },
      { name: 'Ink', hex: '#0E1116' },
      { name: 'Gray', hex: '#6B7280' },
      { name: 'White', hex: '#FFFFFF' }
    ]
  },
  {
    id: 'worlds',
    name: 'Where Worlds · 森绿 + 暖橙',
    desc: 'Awwwards 当日最佳：深森林绿配暖琥珀橙，沉稳又有温度，自然系里最出彩的一组。',
    mood: 'Awwwards · SOTD',
    ref: 'https://www.awwwards.com/sites/where-worlds-take-shape',
    refLabel: 'Awwwards · Where Worlds Take Shape',
    primary: '#1F3D2B',
    accent: '#F2A65A',
    surface: '#F4F1E9',
    text: '#16241B',
    muted: '#6E7A6B',
    colors: [
      { name: 'Forest', hex: '#1F3D2B' },
      { name: 'Amber', hex: '#F2A65A' },
      { name: 'Cream', hex: '#F4F1E9' },
      { name: 'Pine', hex: '#16241B' },
      { name: 'Moss', hex: '#6E7A6B' },
      { name: 'White', hex: '#FFFFFF' }
    ]
  },
  {
    id: 'jasmine',
    name: 'Jasmine · 编辑黑 + 暖纸',
    desc: 'Awwwards 当日最佳编辑风作品集：纯黑配暖灰纸张色，极简、文气、永不过时。',
    mood: 'Awwwards · SOTD',
    ref: 'https://www.awwwards.com/sites/jasmine-gunarto',
    refLabel: 'Awwwards · Jasmine Gunarto',
    primary: '#111111',
    accent: '#57534E',
    surface: '#EBEAE4',
    text: '#111111',
    muted: '#6E6C64',
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Paper', hex: '#EBEAE4' },
      { name: 'Ink', hex: '#111111' },
      { name: 'Stone', hex: '#C9C7BD' },
      { name: 'Taupe', hex: '#57534E' },
      { name: 'White', hex: '#FFFFFF' }
    ]
  },
  {
    id: 'dribbble',
    name: 'Dribbble · 粉色活力',
    desc: 'Dribbble 官方品牌色：极夜深紫黑 + 标志性 Dribbble 粉，活泼、有辨识度，适合点睛 CTA。',
    mood: 'Dribbble · Brand',
    ref: 'https://dribbble.com',
    refLabel: 'Dribbble 品牌色',
    primary: '#0D0C22',
    accent: '#EA4C89',
    surface: '#FFF1F6',
    text: '#0D0C22',
    muted: '#6E6D7A',
    colors: [
      { name: 'Stormy Night', hex: '#0D0C22' },
      { name: 'Dribbble Pink', hex: '#EA4C89' },
      { name: 'Pink Soft', hex: '#FFF1F6' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Gray', hex: '#6E6D7A' },
      { name: 'Border', hex: '#EAEAEA' }
    ]
  },
  {
    id: 'dylan',
    name: '©Design by Dylan · 极简黑白',
    desc: 'Awwwards 当日最佳：近黑 #161616 配柔白 #F1F1F1，纯粹黑白、靠排版与留白取胜。',
    mood: 'Awwwards · SOTD',
    ref: 'https://www.awwwards.com/sites/c-design-by-dylan',
    refLabel: 'Awwwards · ©Design by Dylan',
    primary: '#161616',
    accent: '#161616',
    surface: '#F1F1F1',
    text: '#161616',
    muted: '#6B6B6B',
    colors: [
      { name: 'Near Black', hex: '#161616' },
      { name: 'Off White', hex: '#F1F1F1' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Gray', hex: '#6B6B6B' },
      { name: 'Light Gray', hex: '#C4C4C4' },
      { name: 'Border', hex: '#E2E2E2' }
    ]
  },
  {
    id: 'statement',
    name: 'Statement · 赛博黄',
    desc: 'Dribbble 流行的“作品集宣言”配色：黑白打底，赛博黄做唯一高对比强调，自信、有态度。',
    mood: 'Bold · Statement',
    ref: 'https://elementor.com/blog/website-color-schemes-guide/',
    refLabel: 'Elementor · Statement Palette',
    primary: '#101010',
    accent: '#FFD300',
    surface: '#F8F8F8',
    text: '#101010',
    muted: '#808080',
    colors: [
      { name: 'Black', hex: '#101010' },
      { name: 'Cyber Yellow', hex: '#FFD300' },
      { name: 'White', hex: '#F8F8F8' },
      { name: 'Gray', hex: '#D1D1D1' },
      { name: 'Medium Gray', hex: '#808080' },
      { name: 'Border', hex: '#E5E5E5' }
    ]
  },
  {
    id: 'mood-mode',
    name: 'Mood Mode · 暗调电光青',
    desc: '2026 “Mood Mode” 暗色趋势：避开纯黑的炭灰底，电光青做霓虹点缀，蓝色按钮压阵，科技酷感拉满。',
    mood: 'Dark · Trend',
    ref: 'https://www.loungelizard.com/blog/web-design-color-trends/',
    refLabel: 'Lounge Lizard · Mood Mode',
    primary: '#2563EB',
    accent: '#40E0FF',
    surface: '#0B0D10',
    text: '#E9EEF5',
    muted: '#8A93A0',
    colors: [
      { name: 'Charcoal', hex: '#0B0D10' },
      { name: 'Surface', hex: '#151A21' },
      { name: 'Border', hex: '#273140' },
      { name: 'Text', hex: '#E9EEF5' },
      { name: 'Electric Cyan', hex: '#40E0FF' },
      { name: 'Blue', hex: '#2563EB' }
    ]
  }
]

const copy = async (hex) => {
  try {
    await navigator.clipboard.writeText(hex)
  } catch (e) {
    const ta = document.createElement('textarea')
    ta.value = hex
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  copied.value = hex
  clearTimeout(copyTimer)
  copyTimer = setTimeout(() => (copied.value = ''), 1500)
}

onMounted(async () => {
  await nextTick()
  ctx = gsap.context(() => {
    gsap.from([heroTag.value, heroTitle.value, heroDesc.value], {
      y: 30,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.12
    })

    cardRefs.value.forEach((card) => {
      if (!card) return
      gsap.from(card, {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%'
        }
      })
    })
  })
})

onBeforeUnmount(() => {
  clearTimeout(copyTimer)
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
