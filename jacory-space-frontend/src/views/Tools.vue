<template>
  <main ref="pageRoot" class="grain min-h-screen bg-background pt-[var(--navbar-height)] [--navbar-height:4rem]">
    <div class="tools-shell mx-auto grid w-full border-line">
      <aside class="tools-sidebar border-line lg:sticky lg:top-[var(--navbar-height)] lg:h-[calc(100vh-var(--navbar-height))] lg:border-r">
        <section data-tools-enter class="sidebar-section">
          <div class="grid gap-10">
            <div class="grid gap-12">
              <p class="font-mono text-xs tracking-[0.18em] text-blue">{{ t('tools.interfaceIndex.kicker') }}</p>
              <h1 class="font-sans text-5xl font-medium leading-[0.98] tracking-tight text-foreground md:text-[4.15rem]">
                Interface
                <span class="block italic text-blue">Index</span>
              </h1>
            </div>
            <div class="grid max-w-[25rem] text-[15px] leading-[1.72] text-muted-foreground">
              <p>{{ t('tools.interfaceIndex.description') }}</p>
            </div>
          </div>
        </section>

        <section data-tools-enter class="sidebar-section" :aria-label="t('tools.interfaceIndex.categoriesAria')">
          <nav class="sidebar-row-stack">
            <div
              v-for="filter in sidebarFilters"
              :key="filter.id"
              role="button"
              tabindex="0"
              class="sidebar-row group text-left transition-colors duration-300"
              :class="activeFilter === filter.id ? 'text-blue' : 'text-foreground hover:text-blue'"
              @click="activeFilter = filter.id"
              @keydown.enter.prevent="activeFilter = filter.id"
              @keydown.space.prevent="activeFilter = filter.id"
            >
              <span>{{ filter.label }}</span>
              <span class="sidebar-count">
                {{ filter.count }}
                <span
                  class="sidebar-active-dot"
                  :class="activeFilter === filter.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'"
                  aria-hidden="true"
                />
              </span>
            </div>
          </nav>
        </section>

        <section data-tools-enter class="sidebar-section">
          <p class="sidebar-section-label">{{ t('tools.interfaceIndex.summaryLabel') }}</p>
          <div class="sidebar-row-stack sidebar-row-list">
            <div v-for="item in summaryRows" :key="item.label" class="sidebar-row">
              <span>{{ item.label }}</span>
              <span class="sidebar-count">{{ item.value }}</span>
            </div>
          </div>
        </section>

        <section data-tools-enter class="sidebar-section sidebar-section-last">
          <p class="sidebar-section-label">{{ t('tools.interfaceIndex.lastUpdateLabel') }}</p>
          <div class="sidebar-row-stack sidebar-row-list">
            <div class="sidebar-row sidebar-date-row">
              <span>{{ lastUpdate }}</span>
              <span aria-hidden="true"></span>
            </div>
          </div>
        </section>
      </aside>

      <section class="min-w-0 px-6 pb-28 pt-16 md:px-9 md:pt-20 lg:px-10 lg:pt-20 2xl:px-12">
        <div data-tools-enter class="flex items-center justify-between gap-6">
          <span class="tech">Interface Map</span>
          <span class="tech">{{ filteredEntries.length }} entries / {{ visibleClusterCount }} clusters</span>
        </div>

        <section
          data-tools-enter
          class="interface-map relative mt-7 border-y border-line"
          aria-label="Interface spatial project map"
          @mouseleave="setHoveredEntry(null)"
        >
          <canvas
            ref="mapCanvas"
            class="block h-full w-full"
            @pointermove="handleMapPointerMove"
            @pointerleave="handleMapPointerLeave"
            @click="handleMapClick"
          />

          <div class="pointer-events-none absolute inset-0">
            <span class="map-axis-label left-3 top-1/2 -translate-y-1/2">−X</span>
            <span class="map-axis-label right-3 top-1/2 -translate-y-1/2">−X</span>
            <span class="map-axis-label left-1/2 top-3 -translate-x-1/2">Y</span>
            <span class="map-axis-label bottom-3 left-1/2 -translate-x-1/2">−Y</span>

            <span
              v-for="cluster in clusters"
              :key="cluster.id"
              class="absolute font-mono text-xs uppercase tracking-[0.17em] transition-opacity duration-300"
              :class="clusterActive(cluster.id) ? 'text-blue opacity-100' : 'text-muted-foreground opacity-45'"
              :style="mapLabelStyle(cluster.labelPosition)"
            >
              {{ cluster.label }}
            </span>

            <span
              v-for="entry in mapEntries"
              :key="entry.id"
              class="absolute hidden max-w-[12rem] whitespace-nowrap font-mono text-[11px] tracking-[0.04em] transition-all duration-300 md:block"
              :class="entryLabelClass(entry)"
              :style="mapLabelStyle(entry.labelPosition)"
            >
              {{ entry.title }}
            </span>
          </div>
        </section>

        <section data-tools-enter class="mt-12">
          <div class="flex items-center justify-between gap-6">
            <span class="tech">Project Registry</span>
            <span class="tech">{{ filteredEntries.length }} entries</span>
          </div>

          <div class="mt-5 overflow-x-auto border-t border-line">
            <table class="tools-registry w-full min-w-[1120px] table-fixed border-collapse">
              <colgroup>
                <col class="registry-col-no" />
                <col class="registry-col-type" />
                <col class="registry-col-title" />
                <col class="registry-col-status" />
                <col class="registry-col-stack" />
                <col class="registry-col-version" />
                <col class="registry-col-updated" />
                <col class="registry-col-action" />
              </colgroup>
              <thead>
                <tr class="border-b border-line">
                  <th class="registry-head">№</th>
                  <th class="registry-head">Type</th>
                  <th class="registry-head">Title / Description</th>
                  <th class="registry-head">Status</th>
                  <th class="registry-head">Stack</th>
                  <th class="registry-head">Version</th>
                  <th class="registry-head">Updated</th>
                  <th class="registry-head"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="entry in filteredEntries"
                  :key="entry.id"
                  class="group border-b border-line transition-colors duration-300"
                  :class="registryRowClass(entry)"
                  @mouseenter="setHoveredEntry(entry.id)"
                  @mouseleave="setHoveredEntry(null)"
                >
                  <td class="registry-cell font-mono text-xs text-blue">№ {{ entry.id }}</td>
                  <td class="registry-cell">
                    <span class="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground">
                      {{ typeLabel(entry.type) }}
                    </span>
                  </td>
                  <td class="registry-cell">
                    <RouterLink :to="entry.href" class="block">
                      <span class="block text-base font-medium tracking-tight text-foreground transition-colors duration-300 group-hover:text-blue">
                        {{ entry.title }}
                      </span>
                      <span class="mt-2 block max-w-[54rem] text-[13px] leading-relaxed text-muted-foreground">
                        {{ entry.description }}
                      </span>
                    </RouterLink>
                  </td>
                  <td class="registry-cell">
                    <span class="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]">
                      <span
                        class="h-1.5 w-1.5 rounded-full"
                        :class="entry.status === 'live' ? 'bg-blue' : 'bg-muted-foreground'"
                        aria-hidden="true"
                      />
                      <span :class="entry.status === 'live' ? 'text-blue' : 'text-muted-foreground'">
                        {{ statusLabel(entry.status) }}
                      </span>
                    </span>
                  </td>
                  <td class="registry-cell text-xs text-muted-foreground">{{ entry.stack.join(' / ') }}</td>
                  <td class="registry-cell font-mono text-[11px] text-muted-foreground">{{ entry.version }}</td>
                  <td class="registry-cell font-mono text-[11px] text-muted-foreground">{{ entry.updated }}</td>
                  <td class="registry-cell text-right">
                    <RouterLink
                      :to="entry.href"
                      class="inline-block font-mono text-sm text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue"
                      :aria-label="`Open ${entry.title}`"
                    >
                      ↗
                    </RouterLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="mt-6 text-center font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            — {{ filteredEntries.length }} entries in view —
          </p>
        </section>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)

const router = useRouter()
const { t } = useI18n()
const pageRoot = ref(null)
const mapCanvas = ref(null)
const activeFilter = ref('all')
const hoveredEntryId = ref(null)
let toolsContext
let mapState

const entries = [
  {
    id: '001',
    title: 'Video Parser',
    type: 'tool',
    status: 'live',
    description: '解析 Bilibili、YouTube 等平台视频，提取字幕、总结大纲、生成思维导图与结构化笔记。',
    stack: ['Vue', 'Express', 'yt-dlp'],
    version: 'v1.0.0',
    updated: '2026.06.20',
    href: '/video-parser',
    cluster: 'tools',
    map: { x: -4.95, y: 1.72 },
    label: { x: -4.78, y: 2.38 }
  },
  {
    id: '002',
    title: 'Hairline Grid',
    type: 'experiment',
    status: 'wip',
    description: '生成可见的细线网格，用于界面排版、排版标尺与视觉参考。',
    stack: ['CSS', 'SVG'],
    version: 'v0.2.0',
    updated: '2026.06.18',
    href: '/tools',
    cluster: 'experiments',
    map: { x: -3.86, y: 0.92 },
    label: { x: -2.64, y: 1.22 }
  },
  {
    id: '003',
    title: 'Cool Palette',
    type: 'tool',
    status: 'wip',
    description: '从一个冷色种子值导出完整的色彩系统，并提供 OKLCH 对比校验。',
    stack: ['OKLCH', 'Color System'],
    version: 'v0.3.1',
    updated: '2026.06.17',
    href: '/tools',
    cluster: 'tools',
    map: { x: -6.25, y: 1.08 },
    label: { x: -7.25, y: 1.48 }
  },
  {
    id: '004',
    title: 'Jacory Space',
    type: 'work',
    status: 'live',
    description: '个人数字空间与操作系统，整合工具、博客与实验。',
    stack: ['Vue', 'GSAP', 'Design System'],
    version: 'v1.5.0',
    updated: '2026.06.15',
    href: '/',
    cluster: 'works',
    map: { x: 3.24, y: 1.55 },
    label: { x: 3.48, y: 1.64 }
  },
  {
    id: '005',
    title: 'Mono Index',
    type: 'experiment',
    status: 'beta',
    description: '把任意列表转成等宽索引系统，支持编号、层级与检索。',
    stack: ['TypeScript', 'Algorithm'],
    version: 'v0.4.0',
    updated: '2026.06.12',
    href: '/tools',
    cluster: 'experiments',
    map: { x: -0.62, y: -0.88 },
    label: { x: -0.28, y: -0.78 }
  },
  {
    id: '006',
    title: 'Interface Kit',
    type: 'tool',
    status: 'wip',
    description: '常用界面结构与组件片段集合，面向快速搭建与复用。',
    stack: ['Vue', 'Components'],
    version: 'v0.1.0',
    updated: '2026.06.10',
    href: '/tools',
    cluster: 'tools',
    map: { x: -4.92, y: 0.0 },
    label: { x: -4.68, y: -0.24 }
  },
  {
    id: '007',
    title: 'Portfolio System',
    type: 'work',
    status: 'wip',
    description: '作品结构、项目叙事与展示索引系统。',
    stack: ['Vue', 'Content Model'],
    version: 'v0.2.0',
    updated: '2026.06.08',
    href: '/tools',
    cluster: 'works',
    map: { x: 4.38, y: 0.86 },
    label: { x: 4.62, y: 0.86 }
  },
  {
    id: '008',
    title: 'Design System',
    type: 'work',
    status: 'live',
    description: '冷白界面系统、技术标签、细线结构与动效规范。',
    stack: ['Tailwind', 'Tokens'],
    version: 'v1.1.0',
    updated: '2026.06.06',
    href: '/tools',
    cluster: 'works',
    map: { x: 2.55, y: 0.16 },
    label: { x: 2.74, y: -0.06 }
  },
  {
    id: '009',
    title: 'Reveal Timing',
    type: 'experiment',
    status: 'beta',
    description: '可视化缓动曲线与滚动揭示节奏，预览 600–900ms 动效区间。',
    stack: ['GSAP', 'Motion'],
    version: 'v0.3.0',
    updated: '2026.06.03',
    href: '/tools',
    cluster: 'experiments',
    map: { x: -0.18, y: -1.66 },
    label: { x: 0.16, y: -1.68 }
  },
  {
    id: '010',
    title: 'Old Playground',
    type: 'experiment',
    status: 'archived',
    description: '早期界面试验集合，作为暂不维护的历史记录保留。',
    stack: ['CSS', 'Prototype'],
    version: 'v0.1.0',
    updated: '2026.05.28',
    href: '/tools',
    cluster: 'archived',
    map: { x: 6.25, y: -1.38 },
    label: { x: 6.55, y: -1.4 }
  }
]

const clusters = [
  { id: 'tools', label: 'Tools', labelPosition: { x: -6.75, y: 2.66 } },
  { id: 'works', label: 'Works', labelPosition: { x: 3.42, y: 2.42 } },
  { id: 'experiments', label: 'Experiments', labelPosition: { x: -1.92, y: -1.96 } },
  { id: 'archived', label: 'Archived', labelPosition: { x: 6.18, y: -0.78 } }
]

const connections = [
  ['001', '002'],
  ['001', '003'],
  ['001', '006'],
  ['002', '003'],
  ['003', '006'],
  ['004', '007'],
  ['004', '008'],
  ['007', '008'],
  ['005', '009']
]

const typeNames = {
  tool: 'TOOL',
  work: 'WORK',
  experiment: 'EXPERIMENT'
}

const statusNames = {
  live: 'LIVE',
  wip: 'WIP',
  beta: 'BETA',
  archived: 'ARCHIVED'
}

const filteredEntries = computed(() => {
  if (activeFilter.value === 'all') return entries
  if (activeFilter.value === 'archived') return entries.filter((entry) => entry.status === 'archived')
  return entries.filter((entry) => entry.type === activeFilter.value)
})

const mapEntries = computed(() =>
  entries.map((entry) => ({
    ...entry,
    labelPosition: entry.label
  }))
)

const sidebarFilters = computed(() => [
  { id: 'all', label: t('tools.interfaceIndex.filters.all'), count: '10' },
  { id: 'tool', label: t('tools.interfaceIndex.filters.tools'), count: '04' },
  { id: 'work', label: t('tools.interfaceIndex.filters.works'), count: '03' },
  { id: 'experiment', label: t('tools.interfaceIndex.filters.experiments'), count: '02' },
  { id: 'archived', label: t('tools.interfaceIndex.filters.archived'), count: '01' }
])

const summaryRows = computed(() => [
  { label: t('tools.interfaceIndex.summary.entries'), value: '10' },
  { label: t('tools.interfaceIndex.summary.live'), value: '03' },
  { label: t('tools.interfaceIndex.summary.wipBeta'), value: '04' },
  { label: t('tools.interfaceIndex.summary.archived'), value: '01' }
])

const lastUpdate = computed(() =>
  entries
    .map((entry) => entry.updated)
    .sort()
    .at(-1)
)

const visibleClusterCount = computed(() => new Set(filteredEntries.value.map((entry) => entry.cluster)).size)

function typeLabel(type) {
  return typeNames[type] ?? type.toUpperCase()
}

function statusLabel(status) {
  return statusNames[status] ?? status.toUpperCase()
}

function entryMatchesFilter(entry) {
  if (activeFilter.value === 'all') return true
  if (activeFilter.value === 'archived') return entry.status === 'archived'
  return entry.type === activeFilter.value
}

function clusterActive(clusterId) {
  return filteredEntries.value.some((entry) => entry.cluster === clusterId)
}

function setHoveredEntry(id) {
  hoveredEntryId.value = id
}

function registryRowClass(entry) {
  if (hoveredEntryId.value === entry.id) return 'bg-card'
  return 'hover:bg-card'
}

function entryLabelClass(entry) {
  if (hoveredEntryId.value === entry.id) return 'text-blue opacity-100'
  if (entryMatchesFilter(entry)) return 'text-foreground opacity-85'
  return 'text-muted-foreground opacity-30'
}

function mapLabelStyle(position) {
  return {
    left: `${50 + position.x * 4.8}%`,
    top: `${50 - position.y * 8.4}%`
  }
}

function getCssColor(name) {
  const root = document.documentElement
  return getComputedStyle(root).getPropertyValue(name).trim()
}

function linearToSrgb(channel) {
  const value = Math.max(0, Math.min(1, channel))
  return value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055
}

function oklchToRgb(style) {
  const match = style.match(/oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*\)/)
  if (!match) return null

  const l = match[1].endsWith('%') ? Number.parseFloat(match[1]) / 100 : Number.parseFloat(match[1])
  const c = Number.parseFloat(match[2])
  const h = (Number.parseFloat(match[3]) * Math.PI) / 180
  const a = Math.cos(h) * c
  const b = Math.sin(h) * c
  const lPrime = l + 0.3963377774 * a + 0.2158037573 * b
  const mPrime = l - 0.1055613458 * a - 0.0638541728 * b
  const sPrime = l - 0.0894841775 * a - 1.291485548 * b
  const lmsL = lPrime ** 3
  const lmsM = mPrime ** 3
  const lmsS = sPrime ** 3

  return {
    r: linearToSrgb(4.0767416621 * lmsL - 3.3077115913 * lmsM + 0.2309699292 * lmsS),
    g: linearToSrgb(-1.2684380046 * lmsL + 2.6097574011 * lmsM - 0.3413193965 * lmsS),
    b: linearToSrgb(-0.0041960863 * lmsL - 0.7034186147 * lmsM + 1.707614701 * lmsS)
  }
}

function colorToThree(name) {
  const style = getCssColor(name)
  const rgb = oklchToRgb(style)

  if (rgb) {
    return new THREE.Color(rgb.r, rgb.g, rgb.b)
  }

  return new THREE.Color(style)
}

function createCircleNode(entry, colors) {
  const geometry = entry.status === 'archived' ? new THREE.RingGeometry(0.105, 0.158, 44) : new THREE.CircleGeometry(0.13, 44)
  const material = new THREE.MeshBasicMaterial({
    color: entry.status === 'archived' ? colors.muted : colors.ink,
    transparent: true,
    opacity: entry.status === 'archived' ? 0.42 : 0.96,
    side: THREE.DoubleSide
  })
  return new THREE.Mesh(geometry, material)
}

function createSquareNode(entry, colors) {
  const geometry = new THREE.PlaneGeometry(0.22, 0.22)
  const material = new THREE.MeshBasicMaterial({
    color: entry.status === 'archived' ? colors.muted : colors.ink,
    transparent: true,
    opacity: entry.status === 'archived' ? 0.42 : 0.96,
    side: THREE.DoubleSide
  })
  return new THREE.Mesh(geometry, material)
}

function createCrossNode(entry, colors) {
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-0.15, 0, 0),
    new THREE.Vector3(0.15, 0, 0),
    new THREE.Vector3(0, -0.15, 0),
    new THREE.Vector3(0, 0.15, 0)
  ])
  const material = new THREE.LineBasicMaterial({
    color: entry.status === 'archived' ? colors.muted : colors.ink,
    transparent: true,
    opacity: entry.status === 'archived' ? 0.42 : 0.96
  })
  return new THREE.LineSegments(geometry, material)
}

function createNode(entry, colors) {
  if (entry.status === 'archived') return createCircleNode(entry, colors)
  if (entry.type === 'work') return createSquareNode(entry, colors)
  if (entry.type === 'experiment') return createCrossNode(entry, colors)
  return createCircleNode(entry, colors)
}

function createLine(points, color, opacity = 0.45) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity })
  return new THREE.Line(geometry, material)
}

function createDotField(colors) {
  const vertices = []

  for (let x = -8; x <= 8; x += 0.5) {
    for (let y = -2.8; y <= 2.8; y += 0.5) {
      vertices.push(x, y, -0.08)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  const material = new THREE.PointsMaterial({
    color: colors.lineStrong,
    size: 0.012,
    transparent: true,
    opacity: 0.22,
    sizeAttenuation: false
  })

  return new THREE.Points(geometry, material)
}

function createClusterRing(x, y, radius, colors) {
  const points = []
  for (let i = 0; i <= 96; i += 1) {
    const angle = (i / 96) * Math.PI * 2
    points.push(new THREE.Vector3(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, -0.02))
  }

  return createLine(points, colors.blueSoft, 0.22)
}

function resizeMap() {
  if (!mapState?.renderer || !mapCanvas.value) return
  const canvas = mapCanvas.value
  const rect = canvas.getBoundingClientRect()
  const width = Math.max(1, rect.width)
  const height = Math.max(1, rect.height)
  const aspect = width / height
  const frustum = 7.4

  mapState.camera.left = (-frustum * aspect) / 2
  mapState.camera.right = (frustum * aspect) / 2
  mapState.camera.top = frustum / 2
  mapState.camera.bottom = -frustum / 2
  mapState.camera.updateProjectionMatrix()
  mapState.renderer.setSize(width, height, false)
}

function updateMapState() {
  if (!mapState) return
  const filteredIds = new Set(filteredEntries.value.map((entry) => entry.id))
  const hoveredId = hoveredEntryId.value

  mapState.nodes.forEach(({ entry, object, baseScale }) => {
    const matches = filteredIds.has(entry.id)
    const hovered = hoveredId === entry.id
    const color = hovered || matches ? mapState.colors.blue : mapState.colors.muted
    const opacity = hovered ? 1 : matches ? (entry.status === 'archived' ? 0.56 : 0.96) : 0.2
    const scale = hovered ? baseScale * 1.35 : matches ? baseScale : baseScale * 0.86

    object.visible = true
    object.material.color.copy(color)
    object.material.opacity = opacity
    object.scale.setScalar(scale)
  })

  mapState.lines.forEach(({ line, ids }) => {
    const activeLine = ids.every((id) => filteredIds.has(id))
    line.material.opacity = activeLine ? 0.46 : 0.12
    line.material.color.copy(activeLine ? mapState.colors.blueSoft : mapState.colors.lineStrong)
  })
}

function initMap() {
  if (!mapCanvas.value || mapState) return

  const canvas = mapCanvas.value
  const colors = {
    background: colorToThree('--background'),
    ink: colorToThree('--foreground'),
    muted: colorToThree('--muted-foreground'),
    line: colorToThree('--line'),
    lineStrong: colorToThree('--line-strong'),
    blue: colorToThree('--blue'),
    blueSoft: colorToThree('--blue-soft')
  }
  const scene = new THREE.Scene()
  scene.background = colors.background
  const camera = new THREE.OrthographicCamera(-8, 8, 4, -4, 0.1, 100)
  camera.position.set(0, 0, 10)
  camera.lookAt(0, 0, 0)
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const raycaster = new THREE.Raycaster()
  raycaster.params.Line.threshold = 0.16
  const pointer = new THREE.Vector2()
  const nodes = []
  const lines = []
  const nodeObjects = []
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  scene.add(createDotField(colors))

  for (let x = -8; x <= 8; x += 1) {
    const opacity = x === 0 ? 0.42 : 0.1
    scene.add(createLine([new THREE.Vector3(x, -2.95, -0.04), new THREE.Vector3(x, 2.95, -0.04)], colors.line, opacity))
  }
  for (let y = -3; y <= 3; y += 1) {
    const opacity = y === 0 ? 0.42 : 0.1
    scene.add(createLine([new THREE.Vector3(-8.5, y, -0.04), new THREE.Vector3(8.5, y, -0.04)], colors.line, opacity))
  }

  scene.add(createClusterRing(-5.0, 0.95, 1.18, colors))
  scene.add(createClusterRing(3.3, 0.85, 1.08, colors))
  scene.add(createClusterRing(-0.38, -1.28, 0.82, colors))
  scene.add(createClusterRing(6.25, -1.38, 0.48, colors))

  const byId = new Map(entries.map((entry) => [entry.id, entry]))
  connections.forEach(([fromId, toId]) => {
    const from = byId.get(fromId)
    const to = byId.get(toId)
    if (!from || !to) return

    const line = createLine(
      [new THREE.Vector3(from.map.x, from.map.y, -0.01), new THREE.Vector3(to.map.x, to.map.y, -0.01)],
      colors.blueSoft,
      0.42
    )
    line.userData.ids = [fromId, toId]
    lines.push({ line, ids: [fromId, toId] })
    scene.add(line)
  })

  entries.forEach((entry) => {
    const object = createNode(entry, colors)
    object.position.set(entry.map.x, entry.map.y, 0.04)
    object.userData.entry = entry
    object.userData.baseY = entry.map.y
    nodes.push({ entry, object, baseScale: 1 })
    nodeObjects.push(object)
    scene.add(object)
  })

  mapState = {
    scene,
    camera,
    renderer,
    raycaster,
    pointer,
    nodes,
    lines,
    nodeObjects,
    colors,
    reducedMotion,
    frame: 0,
    animationId: 0
  }

  resizeMap()
  updateMapState()
  renderMap()
  window.addEventListener('resize', resizeMap)
}

function renderMap() {
  if (!mapState) return

  if (!mapState.reducedMotion) {
    mapState.frame += 0.01
    mapState.nodes.forEach(({ entry, object }) => {
      object.position.y = entry.map.y + Math.sin(mapState.frame + Number(entry.id) * 0.55) * 0.018
    })
  }

  mapState.renderer.render(mapState.scene, mapState.camera)
  mapState.animationId = window.requestAnimationFrame(renderMap)
}

function mapHitTest(event) {
  if (!mapState || !mapCanvas.value) return null
  const rect = mapCanvas.value.getBoundingClientRect()
  mapState.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mapState.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  mapState.raycaster.setFromCamera(mapState.pointer, mapState.camera)
  const hits = mapState.raycaster.intersectObjects(mapState.nodeObjects, false)
  return hits[0]?.object?.userData.entry ?? null
}

function handleMapPointerMove(event) {
  const entry = mapHitTest(event)
  setHoveredEntry(entry?.id ?? null)
  if (mapCanvas.value) {
    mapCanvas.value.style.cursor = entry ? 'pointer' : 'default'
  }
}

function handleMapPointerLeave() {
  setHoveredEntry(null)
  if (mapCanvas.value) mapCanvas.value.style.cursor = 'default'
}

function handleMapClick(event) {
  const entry = mapHitTest(event)
  if (!entry) return
  router.push(entry.href)
}

function disposeMap() {
  if (!mapState) return
  window.removeEventListener('resize', resizeMap)
  window.cancelAnimationFrame(mapState.animationId)
  mapState.scene.traverse((object) => {
    object.geometry?.dispose()
    if (Array.isArray(object.material)) {
      object.material.forEach((material) => material.dispose())
    } else {
      object.material?.dispose()
    }
  })
  mapState.renderer.dispose()
  mapState = null
}

onMounted(async () => {
  const root = pageRoot.value
  if (!root) return

  await nextTick()
  initMap()

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

watch([activeFilter, hoveredEntryId], () => {
  updateMapState()
})

onBeforeUnmount(() => {
  toolsContext?.revert()
  disposeMap()
})
</script>

<style scoped>
.tools-shell {
  grid-template-columns: minmax(0, 1fr);
}

.tools-sidebar {
  align-self: start;
  --sidebar-x: 2rem;
  --sidebar-line-gap: 2.5rem;
  --sidebar-section-gap: 1.3rem;
  --sidebar-row-height: 2.4rem;
  padding: 1.25rem var(--sidebar-x) 3.5rem;
}

.sidebar-section {
  border-bottom: 1px solid var(--line);
  padding-block: var(--sidebar-line-gap);
}

.sidebar-section-last {
  border-bottom: 0;
}

.sidebar-row {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 2ch;
  align-items: center;
  height: var(--sidebar-row-height);
  column-gap: 1.5rem;
  font-family: theme("fontFamily.mono");
  @apply text-sm;
  letter-spacing: 0.16em;
  line-height: 1;
  text-transform: uppercase;
}

.sidebar-count {
  position: relative;
  justify-self: end;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.12em;
}

.sidebar-active-dot {
  position: absolute;
  top: 50%;
  right: -1.25rem;
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  background: var(--blue);
  transform: translateY(-50%);
  transition: opacity 300ms var(--ease-premium);
}

.sidebar-section-label {
  font-family: theme("fontFamily.mono");
  @apply text-sm;
  letter-spacing: 0.16em;
  line-height: 1;
  text-transform: uppercase;
  color: var(--muted-foreground);
}

.sidebar-row-stack {
  display: grid;
  gap: 0;
  grid-auto-rows: var(--sidebar-row-height);
}

.sidebar-row-list {
  margin-top: var(--sidebar-section-gap);
}

.interface-map {
  height: clamp(410px, 31vw, 520px);
}

.map-axis-label {
  position: absolute;
  font-family: theme("fontFamily.mono");
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
  color: var(--muted-foreground);
  opacity: 0.72;
}

.registry-head {
  padding: 0.95rem 1.3rem;
  text-align: left;
  font-family: theme("fontFamily.mono");
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted-foreground);
}

.registry-cell {
  padding: 1.35rem 1.3rem;
  vertical-align: middle;
}

.tools-registry tbody tr {
  min-height: 5.25rem;
}

.registry-col-no {
  width: 7%;
}

.registry-col-type {
  width: 9%;
}

.registry-col-title {
  width: 43%;
}

.registry-col-status {
  width: 9%;
}

.registry-col-stack {
  width: 14%;
}

.registry-col-version {
  width: 7%;
}

.registry-col-updated {
  width: 9%;
}

.registry-col-action {
  width: 2%;
}

@media (max-width: 1023px) {
  .tools-sidebar {
    position: relative;
    height: auto;
    border-bottom: 1px solid var(--line);
  }
}

@media (min-width: 1024px) {
  .tools-shell {
    grid-template-columns: 360px minmax(0, 1fr);
  }

  .tools-sidebar {
    --sidebar-x: 2.35rem;
  }
}

@media (min-width: 1536px) {
  .tools-shell {
    grid-template-columns: 380px minmax(0, 1fr);
  }

  .tools-sidebar {
    --sidebar-x: 3rem;
  }
}

@media (max-width: 767px) {
  .interface-map {
    height: 380px;
  }

  .registry-head,
  .registry-cell {
    padding-right: 1rem;
    padding-left: 1rem;
  }
}
</style>
