<template>
  <section
    class="relative hidden h-full min-h-[560px] md:block lg:min-h-0"
    aria-label="Layered spatial project index"
  >
    <canvas
      ref="canvasEl"
      class="invisible block h-full w-full opacity-0"
      @pointermove="handlePointerMove"
      @pointerleave="handlePointerLeave"
      @click="handleCanvasClick"
    />

    <div ref="overlayEl" class="pointer-events-none absolute inset-0 overflow-hidden">
      <svg class="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <g ref="railOverlayEl">
          <line ref="railLineEl" x1="0" y1="0" x2="0" y2="0" class="stroke-line-strong" stroke-width="1" stroke-opacity="0.68" />
          <line ref="railConnAEl" x1="0" y1="0" x2="0" y2="0" class="stroke-line-strong" stroke-width="1" stroke-opacity="0.68" />
          <line ref="railConnBEl" x1="0" y1="0" x2="0" y2="0" class="stroke-line-strong" stroke-width="1" stroke-opacity="0.68" />
          <circle ref="railNodeAEl" cx="0" cy="0" r="3" class="stroke-line-strong fill-background" stroke-width="1.1" stroke-opacity="0.85" />
          <circle ref="railNodeBEl" cx="0" cy="0" r="3" class="stroke-line-strong fill-background" stroke-width="1.1" stroke-opacity="0.85" />
        </g>
        <g
          ref="targetOverlayEl"
          fill="none"
          stroke="var(--line-strong)"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <div
        v-for="layer in layerMeta"
        :key="'layer-' + layer.id"
        :ref="(el) => setLayerEl(layer.id, el)"
        class="spatial-anchor"
      >
        <svg class="spatial-rail-node pointer-events-none absolute left-0 top-0 overflow-visible text-blue" aria-hidden="true">
          <line x1="6" y1="0" x2="12" y2="0" stroke="currentColor" stroke-width="1" stroke-opacity="0.7" />
          <circle cx="0" cy="0" r="5" stroke="currentColor" stroke-width="1.7" class="fill-background" />
        </svg>
        <div class="spatial-layer-label flex flex-col items-start gap-[0.2rem] text-left">
          <span
            :ref="(el) => setLayerMotionEl(layer.id, el)"
            class="flex flex-col items-start gap-[0.2rem]"
          >
            <span class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-blue">{{ layer.id }}</span>
            <span class="font-mono text-xs tracking-[0.16em] text-muted-foreground">{{ layer.count }}</span>
          </span>
        </div>
      </div>

      <div
        v-for="project in projects"
        :key="'entry-' + project.id"
        :ref="(el) => setEntryEl(project.id, el)"
        class="spatial-anchor"
      >
        <div
          class="spatial-entry pointer-events-auto inline-flex cursor-pointer items-baseline gap-[0.4rem] whitespace-nowrap"
          @pointerenter="setHoveredProject(project)"
          @pointerleave="scheduleHoverClear"
          @click="emit('select', project)"
        >
          <span
            :ref="(el) => setEntryMotionEl(project.id, el)"
            class="inline-flex items-baseline gap-[0.4rem]"
          >
            <span class="font-mono text-xs tracking-[0.06em] text-blue">{{ project.no }}</span>
            <span
              class="font-mono text-sm tracking-[0.01em] transition-colors duration-300 ease-premium"
              :class="hoveredId === project.id ? 'text-blue' : 'text-foreground'"
            >{{ project.title }}</span>
          </span>
        </div>
      </div>
    </div>

    <div
      v-show="hoveredProject"
      ref="previewPositionEl"
      class="pointer-events-none absolute left-0 top-0 z-20 w-72"
    >
      <div
        ref="previewMotionEl"
        class="pointer-events-auto invisible opacity-0"
        @pointerenter="cancelHoverClear"
        @pointerleave="scheduleHoverClear"
      >
        <ToolCard
          v-if="hoveredProject"
          :tool="hoverCardTool"
          :status-class="hoverStatusClass"
          :watermark-src="hoverWatermarkSrc"
          variant="hover"
        />
      </div>
    </div>

    <div class="spatial-meta spatial-meta-bottom">
      <span>GRID 16 × 08</span>
      <span>SLAB Δ 0.08</span>
      <span>DRAFT OPACITY 0.80</span>
    </div>

    <div class="pointer-events-none absolute bottom-4 left-[1.1rem] flex flex-col gap-[0.32rem] font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
      <span>X — INDEX SPAN</span>
      <span>Y — LAYER RAIL</span>
      <span>Z — DEPTH</span>
      <span>+ — ENTRY POINT</span>
    </div>

    <div class="pointer-events-none absolute bottom-4 right-[1.2rem] text-line-strong" aria-hidden="true">
      <svg viewBox="0 0 60 60" class="h-24 w-24 overflow-visible">
        <g
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.15"
          stroke-opacity="0.42"
        >
          <path d="M30 8 V16" />
          <path d="M18 34 L8 39.8" />
          <path d="M42 34 L52 39.8" />
          <path d="M30 16 L42 22 V34 L30 40 L18 34 V22 Z" />
          <path d="M18 22 L30 28 L42 22" />
          <path d="M30 28 V40" />
        </g>
        <g
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="0.9"
          stroke-dasharray="2 2"
          stroke-opacity="0.18"
        >
          <path d="M18 34 L30 28 L42 34" />
          <path d="M30 16 V28" />
        </g>
        <text x="30" y="5" text-anchor="middle" font-size="8" class="fill-current font-mono" fill-opacity="0.62">Z</text>
        <text x="5" y="40" text-anchor="middle" font-size="8" class="fill-current font-mono" fill-opacity="0.62">X</text>
        <text x="55" y="40" text-anchor="middle" font-size="8" class="fill-current font-mono" fill-opacity="0.62">Y</text>
      </svg>
    </div>
  </section>

  <section data-tools-enter class="mt-8 space-y-9 md:hidden">
    <div v-for="layer in layerMeta" :key="'m-' + layer.id">
      <div class="flex items-baseline justify-between">
        <span class="tech text-foreground">{{ layer.id }}</span>
        <span class="tech">{{ layer.count }}</span>
      </div>
      <ul class="mt-3 divide-y divide-line border-y border-line">
        <li
          v-for="project in projectsByLayer(layer.id)"
          :key="project.id"
          class="flex items-center gap-3 py-3 transition-colors duration-300"
          :class="entryVisible(project) ? '' : 'opacity-30'"
          @click="emit('select', project)"
        >
          <span class="font-mono text-xs text-blue">{{ project.no }}</span>
          <span class="flex-1 text-sm font-medium tracking-tight text-foreground">{{ project.title }}</span>
          <span class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
            <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(project.status)" aria-hidden="true" />
            {{ statusLabel(project.status) }}
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import coolPaletteWatermark from '../../assets/tools/cool-palete-watermark.png'
import exampleWatermark from '../../assets/tools/example-watermark.png'
import videoParserWatermark from '../../assets/tools/video-parser-watermark.png'
import ToolCard from './ToolCard.vue'

gsap.registerPlugin(CustomEase)

const props = defineProps({
  projects: { type: Array, required: true },
  activeFilter: { type: String, default: 'all' }
})

const emit = defineEmits(['select'])

const canvasEl = ref(null)
const overlayEl = ref(null)
const hoveredId = ref(null)
const hoveredProject = ref(null)
const previewPositionEl = ref(null)
const previewMotionEl = ref(null)
const railOverlayEl = ref(null)
const railLineEl = ref(null)
const railConnAEl = ref(null)
const railConnBEl = ref(null)
const railNodeAEl = ref(null)
const railNodeBEl = ref(null)
const targetOverlayEl = ref(null)

// Spatial geometry scale — tweak these to reshape the layered index.
// Per-project stem heights (authored in approximate screen px) so labels sit at
// staggered distances from their plane — never a uniform template height.
const STEM_PX = {
  '001': 110,
  '002': 72,
  '003': 92,
  '004': 64,
  '005': 58,
  '006': 88,
  '007': 70,
  '008': 54,
  '009': 82
}
const STEM_PX_TO_WORLD = 1 / 38
const STEM_FALLBACK_PX = 80
const HOVER_GUIDE_HEIGHT = 3.3
// Stem thickness in world units (≈ /38 of a px). Raise for a thicker stem.
const STEM_WIDTH = 0.03
function stemHeightFor(project) {
  return (STEM_PX[project.no] ?? STEM_FALLBACK_PX) * STEM_PX_TO_WORLD
}
const HALF_X = 7.6
const HALF_Z = 3.2
const LAYER_Y = { TOOLS: 4.4, WORKS: 0, EXPERIMENTS: -4.4 }
const CAMERA_POSITION = [4.6, 3.1, 12]
const CAMERA_TARGET = [0, -0.2, 0]
const SINGLE_LAYER_SCALE = 1.16
// Keep markers inside the narrowed volume (data is authored for a wider box).
const MARKER_X_SCALE = 0.68
const SPATIAL_PROFILE = {
  roomy: {
    frustum: 18.5,
    panX: 1.4,
    railX: -HALF_X - 3.1
  },
  compact: {
    frustum: 18.0,
    panX: 1.0,
    railX: -HALF_X - 2.45
  }
}
// Layer rail bridges into each slice. RAIL_Z puts nodes/labels at the mid-depth
// of each plane's left edge so a label points at its layer, not the gap.
const RAIL_Z = HALF_Z
// Lift the label/rail node above its plane so the plane's front-left corner node
// drops into the gap below the label.
const LABEL_LIFT = 2.0

function spatialProfileFor(width, height) {
  const narrow = width <= 1180
  const shortAndNarrow = width <= 1320 && height <= 760
  return narrow || shortAndNarrow ? SPATIAL_PROFILE.compact : SPATIAL_PROFILE.roomy
}

const statusNames = { live: 'LIVE', wip: 'WIP', beta: 'BETA', archived: 'ARCHIVED' }
const hoverPreviewEase = CustomEase.create('tools-hover-preview', '0.16,1,0.3,1')
const hoverCardTool = computed(() => {
  const project = hoveredProject.value
  if (!project) return null
  return {
    no: project.no,
    name: project.title,
    desc: project.description,
    tag: project.category,
    status: statusLabel(project.status),
    ver: project.version,
    href: project.href
  }
})
const hoverWatermarkSrc = computed(() => {
  if (hoveredProject.value?.id === '001') return videoParserWatermark
  if (hoveredProject.value?.id === '003') return coolPaletteWatermark
  return exampleWatermark
})
const hoverStatusClass = computed(() => {
  if (hoveredProject.value?.status === 'live') return 'text-blue'
  if (hoveredProject.value?.status === 'archived') return 'text-haze'
  return 'text-muted-foreground'
})

function pad2(value) {
  return String(value).padStart(2, '0')
}

const layerMeta = computed(() =>
  ['TOOLS', 'WORKS', 'EXPERIMENTS'].map((id) => ({
    id,
    count: pad2(props.projects.filter((project) => project.layer === id).length)
  }))
)

function statusLabel(status) {
  return statusNames[status] ?? status.toUpperCase()
}

function statusDotClass(status) {
  if (status === 'live') return 'bg-blue'
  if (status === 'archived') return 'bg-transparent ring-1 ring-muted-foreground'
  return 'bg-muted-foreground'
}

function entryVisible(project) {
  return props.activeFilter === 'all' || project.category === props.activeFilter
}

function projectsByLayer(layer) {
  return props.projects.filter((project) => project.layer === layer)
}

const entryEls = {}
const layerEls = {}
const entryMotionEls = {}
const layerMotionEls = {}

function setEntryEl(id, el) {
  if (el) entryEls[id] = el
  else delete entryEls[id]
}

function setEntryMotionEl(id, el) {
  if (el) entryMotionEls[id] = el
  else delete entryMotionEls[id]
}

function setLayerEl(id, el) {
  if (el) layerEls[id] = el
  else delete layerEls[id]
}

function setLayerMotionEl(id, el) {
  if (el) layerMotionEls[id] = el
  else delete layerMotionEls[id]
}

let sceneState = null
let desktopMq = null
let resizeObserver = null
let resizeFrame = 0
let hoverClearTimer = 0
let entranceRequested = false
let spatialEntrancePlayed = false
let spatialEntranceTimeline = null
const tmpVec = new THREE.Vector3()

function labelEntranceTargets() {
  const layerTargets = ['EXPERIMENTS', 'WORKS', 'TOOLS']
    .map((id) => layerMotionEls[id])
    .filter(Boolean)
  const entryTargets = [...props.projects]
    .sort((a, b) => a.no.localeCompare(b.no))
    .map((project) => entryMotionEls[project.id])
    .filter(Boolean)
  return { layerTargets, entryTargets }
}

function setEntranceEndState() {
  if (!sceneState) return
  const { layerTargets, entryTargets } = labelEntranceTargets()
  sceneState.boxState.value = 1
  sceneState.layers.forEach((layer) => {
    layer.fadeState.value = 1
    layer.group.position.y = LAYER_Y[layer.id]
    layer.group.scale.setScalar(1)
  })
  sceneState.markers.forEach((marker) => {
    marker.dotEntrance.value = 1
    marker.guideEntrance.value = 1
  })
  if (railOverlayEl.value) gsap.set(railOverlayEl.value, { opacity: 1 })
  gsap.set([...layerTargets, ...entryTargets], { autoAlpha: 1, y: 0 })
}

function setEntranceStartState() {
  if (!sceneState || sceneState.reducedMotion) return
  const { layerTargets, entryTargets } = labelEntranceTargets()

  sceneState.boxState.value = 0
  sceneState.layers.forEach((layer) => {
    layer.fadeState.value = 0
    layer.group.position.y = LAYER_Y[layer.id] - 0.72
    layer.group.scale.setScalar(0.985)
  })
  sceneState.markers.forEach((marker) => {
    marker.dotEntrance.value = 0
    marker.guideEntrance.value = 0
  })
  gsap.set([...layerTargets, ...entryTargets], { autoAlpha: 0, y: 14 })
  if (railOverlayEl.value) gsap.set(railOverlayEl.value, { opacity: 0 })
}

function playSpatialEntrance() {
  entranceRequested = true
  if (!sceneState || spatialEntrancePlayed) return
  spatialEntrancePlayed = true

  if (sceneState.reducedMotion) {
    setEntranceEndState()
    return
  }

  const layerOrder = ['EXPERIMENTS', 'WORKS', 'TOOLS']
    .map((id) => sceneState.layers.find((layer) => layer.id === id))
    .filter(Boolean)

  spatialEntranceTimeline = gsap.timeline({
    defaults: { ease: sceneState.spatialEase },
    onComplete: () => {
      spatialEntranceTimeline = null
    }
  })

  spatialEntranceTimeline.to(sceneState.boxState, { value: 1, duration: 0.76 }, 0)
  spatialEntranceTimeline.to(railOverlayEl.value, { opacity: 1, duration: 0.58 }, 0.08)

  layerOrder.forEach((layer, index) => {
    const at = index * 0.18
    const layerLabel = layerMotionEls[layer.id]
    spatialEntranceTimeline.to(layer.fadeState, { value: 1, duration: 0.58 }, at)
    spatialEntranceTimeline.to(layer.group.position, { y: LAYER_Y[layer.id], duration: 0.6 }, at)
    spatialEntranceTimeline.to(layer.group.scale, { x: 1, y: 1, z: 1, duration: 0.6 }, at)
    if (layerLabel) {
      spatialEntranceTimeline.to(
        layerLabel,
        { autoAlpha: 1, y: 0, duration: 0.38 },
        at + 0.08
      )
    }
  })

  spatialEntranceTimeline.addLabel('projects', 0.98)

  const markerOrder = [...sceneState.markers].sort((a, b) =>
    a.project.no.localeCompare(b.project.no)
  )
  markerOrder.forEach((marker, index) => {
    const label = entryMotionEls[marker.project.id]
    const sequenceStart = `marker-${index}`
    spatialEntranceTimeline.addLabel(sequenceStart, index === 0 ? 'projects' : '>-0.22')
    spatialEntranceTimeline.to(marker.dotEntrance, { value: 1, duration: 0.11 }, sequenceStart)
    spatialEntranceTimeline.to(marker.guideEntrance, { value: 1, duration: 0.28 }, `${sequenceStart}+=0.05`)
    if (label) {
      spatialEntranceTimeline.to(
        label,
        { autoAlpha: 1, y: 0, duration: 0.34 },
        `${sequenceStart}+=0.32`
      )
    }
  })
}

defineExpose({ playEntrance: playSpatialEntrance })

function getCssColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
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
  if (rgb) return new THREE.Color(rgb.r, rgb.g, rgb.b)
  return new THREE.Color(style)
}

function makeLine(points, color, opacity) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity })
  material.userData.baseOpacity = opacity
  return new THREE.Line(geometry, material)
}

const X_DIV = 16
const Z_DIV = 8
const LATTICE_STEP = 2
const DRAFT_EXTENT = 1.9
const DRAFT_OVER = 2.55
const DRAFT_GHOST_OFFSET = 0.1
// Dev preview opacity: keep the draft layer intentionally loud while tuning
// construction-line shape; lower this once the form is approved.
const DRAFT_DEV_OPACITY = 0.8
const BASE_MESH_OPACITY = 0.38
const BASE_EDGE_OPACITY = 0.68
const BASE_SLAB_OPACITY = 0.44
const BASE_CONNECTOR_OPACITY = 0.5
const NODE_TARGET_OPACITY = 0.74
const NODE_TICK_OPACITY = 0.58
const HISTORIC_TARGETS = {
  TOOLS: [
    { x: HALF_X, z: -HALF_Z, size: { rx: 5.0, ry: 6.3 }, opacity: NODE_TARGET_OPACITY },
    { x: -HALF_X * 0.45, z: HALF_Z, size: { rx: 4.4, ry: 5.6 }, opacity: NODE_TARGET_OPACITY * 0.7 },
    { x: -HALF_X, z: -HALF_Z * 0.34, size: { rx: 3.8, ry: 4.9 }, opacity: NODE_TARGET_OPACITY * 0.56 }
  ],
  WORKS: [
    { x: -HALF_X, z: 0, size: { rx: 4.7, ry: 5.9 }, opacity: NODE_TARGET_OPACITY * 0.82 },
    { x: HALF_X, z: -HALF_Z * 0.42, size: { rx: 4.1, ry: 5.2 }, opacity: NODE_TARGET_OPACITY * 0.62 },
    { x: HALF_X * 0.34, z: HALF_Z, size: { rx: 4.4, ry: 5.6 }, opacity: NODE_TARGET_OPACITY * 0.68 }
  ],
  EXPERIMENTS: [
    { x: -HALF_X, z: -HALF_Z, size: { rx: 4.6, ry: 5.7 }, opacity: NODE_TARGET_OPACITY * 0.76 },
    { x: HALF_X * 0.72, z: HALF_Z, size: { rx: 5.0, ry: 6.2 }, opacity: NODE_TARGET_OPACITY * 0.72 },
    { x: HALF_X, z: HALF_Z * 0.24, size: { rx: 3.9, ry: 5.0 }, opacity: NODE_TARGET_OPACITY * 0.58 }
  ]
}

// Coarser lattice (every Nth grid line) where vertical columns + entry nodes sit,
// over the finer surface grid.
function latticePoints() {
  const points = []
  for (let i = 0; i <= X_DIV; i += LATTICE_STEP) {
    const x = -HALF_X + (i / X_DIV) * HALF_X * 2
    for (let j = 0; j <= Z_DIV; j += LATTICE_STEP) {
      const z = -HALF_Z + (j / Z_DIV) * HALF_Z * 2
      points.push([x, z, i, j])
    }
  }
  return points
}

// Merge many segments into a single LineSegments (one draw call per opacity tier).
function mergedSegments(segments, color, opacity) {
  const points = []
  segments.forEach(([a, b]) => points.push(a, b))
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity })
  material.userData.baseOpacity = opacity
  return new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(points), material)
}

function addDraftLineTier(group, statics, segments, color, opacity) {
  if (segments.length === 0) return
  const line = mergedSegments(segments, color, opacity)
  group.add(line)
  statics.push({ material: line.material, base: opacity })
}

function pointBetween(a, b, t) {
  return new THREE.Vector3().lerpVectors(a, b, t)
}

function draftRecipe(seed) {
  const recipes = [
    [
      [0, 0.32],
      [0.5, 1]
    ],
    [[0.08, 0.72]],
    [
      [0, 0.22],
      [0.36, 0.58],
      [0.76, 1]
    ],
    [[0.2, 1]],
    []
  ]
  return recipes[Math.abs(seed) % recipes.length]
}

function addDraftStroke(segments, a, b, seed) {
  draftRecipe(seed).forEach(([from, to]) => {
    segments.push([pointBetween(a, b, from), pointBetween(a, b, to)])
  })
}

function addTickCross(segments, x, y, z, size) {
  segments.push(
    [new THREE.Vector3(x - size, y, z), new THREE.Vector3(x + size, y, z)],
    [new THREE.Vector3(x, y, z - size), new THREE.Vector3(x, y, z + size)]
  )
}

// Vertical offset of the rear/lower supporting layer — keeps each base a very
// thin double-layer slab rather than a single sheet (or a heavy box).
const SLAB_THICKNESS = 0.08

function buildLayerPlane(colors, statics, layerId) {
  const group = new THREE.Group()
  const targetAnchors = []

  const add = (object, base) => {
    group.add(object)
    statics.push({ material: object.material, base })
  }

  // --- Main top surface: fine grid (16×8) in cool gray (no theme blue). ---
  const edgeSegs = []
  const meshSegs = []
  for (let i = 0; i <= X_DIV; i += 1) {
    const x = -HALF_X + (i / X_DIV) * HALF_X * 2
    const seg = [new THREE.Vector3(x, 0, -HALF_Z), new THREE.Vector3(x, 0, HALF_Z)]
    if (i === 0 || i === X_DIV) edgeSegs.push(seg)
    else addDraftStroke(meshSegs, seg[0], seg[1], i * 5)
  }
  for (let j = 0; j <= Z_DIV; j += 1) {
    const z = -HALF_Z + (j / Z_DIV) * HALF_Z * 2
    const seg = [new THREE.Vector3(-HALF_X, 0, z), new THREE.Vector3(HALF_X, 0, z)]
    if (j === 0 || j === Z_DIV) edgeSegs.push(seg)
    else addDraftStroke(meshSegs, seg[0], seg[1], j * 7 + 2)
  }
  add(mergedSegments(meshSegs, colors.muted, BASE_MESH_OPACITY), BASE_MESH_OPACITY)
  add(mergedSegments(edgeSegs, colors.muted, BASE_EDGE_OPACITY), BASE_EDGE_OPACITY)

  // --- Rear/lower supporting layer: a faint perimeter outline offset down, so
  // the base reads as a thin slab with a back layer. ---
  const ly = -SLAB_THICKNESS
  const lower = [
    new THREE.Vector3(-HALF_X, ly, -HALF_Z),
    new THREE.Vector3(HALF_X, ly, -HALF_Z),
    new THREE.Vector3(HALF_X, ly, HALF_Z),
    new THREE.Vector3(-HALF_X, ly, HALF_Z)
  ]
  add(
    mergedSegments(
      [
        [lower[0], lower[1]],
        [lower[1], lower[2]],
        [lower[2], lower[3]],
        [lower[3], lower[0]]
      ],
      colors.muted,
      BASE_SLAB_OPACITY
    ),
    BASE_SLAB_OPACITY
  )

  // --- A few thin connectors (corners + edge midpoints) tying the two layers. ---
  const tops = [
    [-HALF_X, -HALF_Z],
    [HALF_X, -HALF_Z],
    [HALF_X, HALF_Z],
    [-HALF_X, HALF_Z],
    [0, -HALF_Z],
    [0, HALF_Z],
    [-HALF_X, 0],
    [HALF_X, 0]
  ]
  add(
    mergedSegments(
      tops.map(([x, z]) => [new THREE.Vector3(x, 0, z), new THREE.Vector3(x, ly, z)]),
      colors.muted,
      BASE_CONNECTOR_OPACITY
    ),
    BASE_CONNECTOR_OPACITY
  )

  // Fine ticks keep a few construction intersections without competing with the
  // historic target rings.
  const tickSegs = []

  const targetY = -SLAB_THICKNESS * 0.5
  ;(HISTORIC_TARGETS[layerId] ?? []).forEach(({ x, z, size, opacity }) => {
    const target = new THREE.Object3D()
    target.position.set(x, targetY, z)
    target.userData.targetSize = size
    target.userData.targetOpacity = opacity
    group.add(target)
    targetAnchors.push(target)
  })

  ;[
    [0, -HALF_Z],
    [HALF_X, 0],
    [0, HALF_Z],
    [-HALF_X, 0],
    [-HALF_X * 0.5, 0],
    [HALF_X * 0.5, 0]
  ].forEach(([x, z]) => addTickCross(tickSegs, x, 0.018, z, 0.16))
  add(mergedSegments(tickSegs, colors.muted, NODE_TICK_OPACITY), NODE_TICK_OPACITY)

  group.userData.targetAnchors = targetAnchors
  return group
}

function buildConstructionOverlay(colors, statics) {
  const group = new THREE.Group()
  const layerYs = Object.values(LAYER_Y)
  const verticalSegs = []
  const edgeExtensionSegs = []
  const ghostEdgeSegs = []
  const projectionSegs = []

  // Sparse through-lines that overshoot the slices. They are broken with fixed
  // recipes, so the draft feels historical rather than evenly generated.
  latticePoints().forEach(([x, z, i, j]) => {
    const perimeter = i === 0 || i === X_DIV || j === 0 || j === Z_DIV
    const drafted = perimeter ? (i + j) % 3 !== 1 : (i * 7 + j * 5) % 11 === 0
    if (!drafted) return
    const bottomOver = DRAFT_OVER * (0.45 + ((i + 2 * j) % 5) * 0.16)
    const topOver = DRAFT_OVER * (0.5 + ((2 * i + j) % 4) * 0.18)
    addDraftStroke(
      verticalSegs,
      new THREE.Vector3(x, LAYER_Y.EXPERIMENTS - bottomOver, z),
      new THREE.Vector3(x, LAYER_Y.TOOLS + topOver, z),
      i * 13 + j * 17
    )
  })

  layerYs.forEach((y, layerIndex) => {
    const ghost = DRAFT_GHOST_OFFSET * (layerIndex === 1 ? -1 : 1)
    const ghostY = y - SLAB_THICKNESS * 0.45

    // A second, slightly displaced perimeter pass reads like a construction
    // trace without changing the real plane dimensions.
    ;[
      [new THREE.Vector3(-HALF_X - ghost, ghostY, -HALF_Z), new THREE.Vector3(HALF_X + ghost * 0.5, ghostY, -HALF_Z)],
      [new THREE.Vector3(HALF_X + ghost, ghostY, -HALF_Z), new THREE.Vector3(HALF_X + ghost, ghostY, HALF_Z + ghost * 0.65)],
      [new THREE.Vector3(HALF_X, ghostY, HALF_Z + ghost), new THREE.Vector3(-HALF_X - ghost * 0.7, ghostY, HALF_Z + ghost)],
      [new THREE.Vector3(-HALF_X - ghost, ghostY, HALF_Z + ghost), new THREE.Vector3(-HALF_X - ghost, ghostY, -HALF_Z * 0.72)]
    ].forEach(([a, b], edgeIndex) =>
      addDraftStroke(ghostEdgeSegs, a, b, layerIndex * 7 + edgeIndex * 3)
    )

    ;[-HALF_Z, 0, HALF_Z].forEach((z, zIndex) => {
      const leftExtent = DRAFT_EXTENT * (0.42 + ((layerIndex + zIndex) % 4) * 0.28)
      const rightExtent = DRAFT_EXTENT * (0.55 + ((layerIndex * 2 + zIndex) % 3) * 0.36)
      addDraftStroke(
        edgeExtensionSegs,
        new THREE.Vector3(-HALF_X - leftExtent, y, z),
        new THREE.Vector3(-HALF_X, y, z),
        layerIndex * 11 + zIndex
      )
      addDraftStroke(
        edgeExtensionSegs,
        new THREE.Vector3(HALF_X, y, z),
        new THREE.Vector3(HALF_X + rightExtent, y, z),
        layerIndex * 13 + zIndex + 2
      )
    })

    ;[-HALF_X, 0, HALF_X].forEach((x, xIndex) => {
      const backExtent = DRAFT_EXTENT * (0.35 + ((xIndex + layerIndex) % 3) * 0.22)
      const frontExtent = DRAFT_EXTENT * (0.52 + ((xIndex * 2 + layerIndex) % 4) * 0.18)
      addDraftStroke(
        edgeExtensionSegs,
        new THREE.Vector3(x, y, -HALF_Z - backExtent),
        new THREE.Vector3(x, y, -HALF_Z),
        layerIndex * 17 + xIndex + 1
      )
      addDraftStroke(
        edgeExtensionSegs,
        new THREE.Vector3(x, y, HALF_Z),
        new THREE.Vector3(x, y, HALF_Z + frontExtent),
        layerIndex * 19 + xIndex + 4
      )
    })

    const rayZ = layerIndex === 1 ? 0 : HALF_Z
    addDraftStroke(
      projectionSegs,
      new THREE.Vector3(-HALF_X, y, rayZ),
      new THREE.Vector3(-HALF_X - DRAFT_EXTENT * (1.4 + layerIndex * 0.38), y, rayZ + 0.2),
      layerIndex * 23 + 3
    )
    addDraftStroke(
      projectionSegs,
      new THREE.Vector3(HALF_X, y, -rayZ),
      new THREE.Vector3(HALF_X + DRAFT_EXTENT * (1.2 + layerIndex * 0.27), y, -rayZ - 0.16),
      layerIndex * 29 + 5
    )
  })

  addDraftLineTier(group, statics, verticalSegs, colors.blueSoft, DRAFT_DEV_OPACITY)
  addDraftLineTier(group, statics, edgeExtensionSegs, colors.muted, DRAFT_DEV_OPACITY)
  addDraftLineTier(group, statics, ghostEdgeSegs, colors.lineStrong, DRAFT_DEV_OPACITY)
  addDraftLineTier(group, statics, projectionSegs, colors.blueSoft, DRAFT_DEV_OPACITY)

  return group
}

function buildSkeleton(colors, statics) {
  const group = new THREE.Group()
  const yTop = LAYER_Y.TOOLS
  const yBot = LAYER_Y.EXPERIMENTS

  // Verticals run past the top/bottom slices so the structure reads as an open
  // blueprint scaffold rather than a sealed box.
  const OVER = 0.8

  const pushLine = (line, base) => {
    group.add(line)
    statics.push({ material: line.material, base })
  }

  // Vertical guide columns at the lattice points run through all three slices —
  // these through-lines are the inter-layer connectors / open scaffold. Merged
  // per tier; perimeter columns are clearer and overshoot for the blueprint feel.
  const strongSegs = []
  const faintSegs = []
  latticePoints().forEach(([x, z, i, j]) => {
    const corner = (i === 0 || i === X_DIV) && (j === 0 || j === Z_DIV)
    const perimeter = i === 0 || i === X_DIV || j === 0 || j === Z_DIV
    const center = x === 0 && z === 0
    const over = corner || center ? OVER : 0
    const seg = [new THREE.Vector3(x, yBot - over, z), new THREE.Vector3(x, yTop + over, z)]
    ;(perimeter || center ? strongSegs : faintSegs).push(seg)
  })
  pushLine(mergedSegments(faintSegs, colors.blueSoft, 0.1), 0.1)
  pushLine(mergedSegments(strongSegs, colors.blueSoft, 0.16), 0.16)

  // The layer rail (vertical spine + separator nodes + horizontal connectors) is
  // drawn as a 2D overlay in renderScene so the connectors can be truly straight
  // (a world-space horizontal line would project slanted in this iso view).

  return group
}

function buildMarker(project, colors) {
  const root = new THREE.Group()
  root.position.set(project.pos[0] * MARKER_X_SCALE, 0, project.pos[1])

  const entryDotMaterial = new THREE.MeshBasicMaterial({
    color: project.status === 'archived' ? colors.muted : colors.ink,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide
  })
  entryDotMaterial.userData.baseOpacity = 0.9
  const entryDot = new THREE.Mesh(new THREE.CircleGeometry(0.075, 24), entryDotMaterial)
  entryDot.rotation.x = -Math.PI / 2
  entryDot.position.y = 0.026
  root.add(entryDot)

  const washerMaterial = new THREE.MeshBasicMaterial({
    color: project.status === 'archived' ? colors.muted : colors.lineStrong,
    transparent: true,
    opacity: 0.66,
    side: THREE.DoubleSide
  })
  washerMaterial.userData.baseOpacity = 0.66
  const washer = new THREE.Mesh(new THREE.RingGeometry(0.105, 0.135, 28), washerMaterial)
  washer.rotation.x = -Math.PI / 2
  washer.position.y = 0.024
  root.add(washer)

  const stemHeight = stemHeightFor(project)

  // Dedicated stem — a cool blue-gray that is clearly more visible than the gray
  // base lines, but still calmer than the rail's blue entry nodes. Rendered as a
  // thin vertical quad (not a Line) so its width is reliable across WebGL (the
  // LineBasicMaterial linewidth is ignored in most browsers). Tune STEM_WIDTH.
  const guideMaterial = new THREE.MeshBasicMaterial({
    color: colors.muted,
    transparent: true,
    opacity: 0.72,
    side: THREE.DoubleSide
  })
  guideMaterial.userData.baseOpacity = 0.72
  const guide = new THREE.Mesh(new THREE.PlaneGeometry(STEM_WIDTH, stemHeight), guideMaterial)
  guide.position.y = stemHeight / 2
  root.add(guide)

  const guideTopAnchor = new THREE.Object3D()
  guideTopAnchor.position.set(0, stemHeight, 0)
  root.add(guideTopAnchor)

  // Hit area is a vertical billboard covering the whole marker (entry dot +
  // stem), so the entire marker is hoverable, not just the base.
  const hitHeight = stemHeight + 0.4
  const hit = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, hitHeight),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
  )
  hit.position.set(0, hitHeight / 2 - 0.2, 0)
  hit.userData.projectId = project.id
  root.add(hit)

  const labelAnchor = new THREE.Object3D()
  labelAnchor.position.set(0, stemHeight + 0.06, 0)
  root.add(labelAnchor)

  return {
    project,
    root,
    hit,
    labelAnchor,
    entryDot: entryDotMaterial,
    washer: washerMaterial,
    guide,
    guideMaterial,
    guideTopAnchor,
    stemHeight,
    guideScaleCurrent: 1,
    scaleCurrent: 1,
    dotEntrance: { value: 1 },
    guideEntrance: { value: 1 },
    fadeState: { value: 1 }
  }
}

function buildScene() {
  const canvas = canvasEl.value
  if (!canvas) return null

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
  // Transparent canvas: the page background (--background) shows through so the
  // right surface stays unified with the rest of the page, never a separate panel.
  scene.background = null

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
  camera.position.set(...CAMERA_POSITION)
  camera.lookAt(...CAMERA_TARGET)

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setClearColor(0x000000, 0)

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const spatialEase = CustomEase.create('tools-spatial', '0.16,1,0.3,1')

  const boxStatics = []
  const boxState = { value: 1 }
  const skeleton = buildSkeleton(colors, boxStatics)
  scene.add(skeleton)
  scene.add(buildConstructionOverlay(colors, boxStatics))

  const layers = ['TOOLS', 'WORKS', 'EXPERIMENTS'].map((id) => {
    const statics = []
    const group = buildLayerPlane(colors, statics, id)
    group.position.y = LAYER_Y[id]

    // Lift the label above its plane so the layer reads: label on top, then the
    // plane's front-left corner node sitting in the gap below it.
    const labelAnchor = new THREE.Object3D()
    labelAnchor.position.set(SPATIAL_PROFILE.roomy.railX, LABEL_LIFT, RAIL_Z)
    group.add(labelAnchor)

    scene.add(group)
    return { id, group, statics, labelAnchor, targetAnchors: group.userData.targetAnchors ?? [], fadeState: { value: 1 } }
  })

  const layerById = Object.fromEntries(layers.map((layer) => [layer.id, layer]))
  const markers = props.projects.map((project) => {
    const marker = buildMarker(project, colors)
    marker.layer = layerById[project.layer]
    marker.layer.group.add(marker.root)
    return marker
  })

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  return {
    scene,
    camera,
    renderer,
    colors,
    layers,
    targetOverlays: layers.flatMap((layer) => layer.targetAnchors.map((anchor) => ({ anchor, layer }))),
    markers,
    boxState,
    boxStatics,
    raycaster,
    pointer,
    reducedMotion,
    spatialEase,
    profile: SPATIAL_PROFILE.roomy,
    size: { width: 1, height: 1 },
    animationId: 0
  }
}

function setCameraFrame(camera, profile, aspect, panX) {
  camera.left = (-profile.frustum * aspect) / 2 + panX
  camera.right = (profile.frustum * aspect) / 2 + panX
  camera.top = profile.frustum / 2
  camera.bottom = -profile.frustum / 2
  camera.updateProjectionMatrix()
}

function addLayerVisualBounds(points, y) {
  const lowerY = y - SLAB_THICKNESS
  const leftDraft = DRAFT_EXTENT * 1.95
  const rightDraft = DRAFT_EXTENT * 1.75
  const depthDraft = DRAFT_EXTENT * 1.05

  ;[
    [-HALF_X, y, -HALF_Z],
    [HALF_X, y, -HALF_Z],
    [HALF_X, y, HALF_Z],
    [-HALF_X, y, HALF_Z],
    [-HALF_X, lowerY, -HALF_Z],
    [HALF_X, lowerY, -HALF_Z],
    [HALF_X, lowerY, HALF_Z],
    [-HALF_X, lowerY, HALF_Z],
    [-HALF_X - leftDraft, y, -HALF_Z],
    [-HALF_X - leftDraft, y, HALF_Z],
    [HALF_X + rightDraft, y, -HALF_Z],
    [HALF_X + rightDraft, y, HALF_Z],
    [-HALF_X, y, -HALF_Z - depthDraft],
    [HALF_X, y, -HALF_Z - depthDraft],
    [-HALF_X, y, HALF_Z + depthDraft],
    [HALF_X, y, HALF_Z + depthDraft]
  ].forEach(([x, pointY, z]) => points.push(new THREE.Vector3(x, pointY, z)))
}

function visualBoundsPoints(profile) {
  const points = []
  Object.values(LAYER_Y).forEach((y) => addLayerVisualBounds(points, y))

  points.push(
    new THREE.Vector3(profile.railX - 0.28, LAYER_Y.TOOLS + LABEL_LIFT, RAIL_Z),
    new THREE.Vector3(profile.railX - 0.28, LAYER_Y.EXPERIMENTS + LABEL_LIFT, RAIL_Z),
    new THREE.Vector3(profile.railX + 1.9, LAYER_Y.TOOLS + LABEL_LIFT, RAIL_Z),
    new THREE.Vector3(profile.railX + 1.9, LAYER_Y.EXPERIMENTS + LABEL_LIFT, RAIL_Z),
    new THREE.Vector3(-HALF_X - DRAFT_EXTENT * 2.2, LAYER_Y.EXPERIMENTS - DRAFT_OVER * 0.7, HALF_Z),
    new THREE.Vector3(HALF_X + DRAFT_EXTENT * 1.8, LAYER_Y.TOOLS + DRAFT_OVER * 0.7, -HALF_Z)
  )

  sceneState?.markers.forEach((marker) => {
    marker.labelAnchor.getWorldPosition(tmpVec)
    points.push(tmpVec.clone())
  })

  return points
}

function calibrateCameraPan(profile, width, height, aspect) {
  setCameraFrame(sceneState.camera, profile, aspect, profile.panX)
  sceneState.scene.updateMatrixWorld(true)

  const bounds = visualBoundsPoints(profile).reduce(
    (acc, point) => {
      const projected = point.clone().project(sceneState.camera)
      const x = (projected.x * 0.5 + 0.5) * width
      return {
        min: Math.min(acc.min, x),
        max: Math.max(acc.max, x)
      }
    },
    { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY }
  )

  if (!Number.isFinite(bounds.min) || !Number.isFinite(bounds.max)) return profile.panX

  const visualCenterX = (bounds.min + bounds.max) / 2
  const centerOffsetPx = visualCenterX - width / 2
  const worldUnitsPerPx = (profile.frustum * aspect) / width
  return profile.panX + centerOffsetPx * worldUnitsPerPx
}

function resizeScene() {
  if (!sceneState || !canvasEl.value) return
  const rect = canvasEl.value.getBoundingClientRect()
  const width = Math.max(1, rect.width)
  const height = Math.max(1, rect.height)
  const aspect = width / height
  const profile = spatialProfileFor(width, height)

  sceneState.profile = profile
  sceneState.layers.forEach((layer) => {
    layer.labelAnchor.position.x = profile.railX
  })
  const panX = calibrateCameraPan(profile, width, height, aspect)
  setCameraFrame(sceneState.camera, profile, aspect, panX)
  sceneState.renderer.setSize(width, height, false)
  sceneState.size.width = width
  sceneState.size.height = height
}

function scheduleResize() {
  if (!sceneState) return
  if (resizeFrame) window.cancelAnimationFrame(resizeFrame)
  resizeFrame = window.requestAnimationFrame(() => {
    resizeFrame = 0
    resizeScene()
  })
}

function scheduleSettledResize() {
  scheduleResize()
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(resizeScene)
  })
}

function applyFilter(animate) {
  if (!sceneState) return
  const filter = props.activeFilter
  const single = filter !== 'all'
  const matchLayers = new Set(
    props.projects.filter((project) => filter === 'all' || project.category === filter).map((project) => project.layer)
  )
  const duration = animate && !sceneState.reducedMotion ? 0.82 : 0
  const ease = sceneState.spatialEase

  sceneState.layers.forEach((layer) => {
    const on = filter === 'all' || matchLayers.has(layer.id)
    const fade = on ? 1 : 0
    const y = single && on ? 0 : LAYER_Y[layer.id]
    const scale = single && on ? SINGLE_LAYER_SCALE : 1

    if (duration === 0) {
      layer.fadeState.value = fade
      layer.group.position.y = y
      layer.group.scale.setScalar(scale)
    } else {
      gsap.to(layer.fadeState, { value: fade, duration, ease })
      gsap.to(layer.group.position, { y, duration, ease })
      gsap.to(layer.group.scale, { x: scale, y: scale, z: scale, duration, ease })
    }
  })

  sceneState.markers.forEach((marker) => {
    const visible = filter === 'all' || marker.project.category === filter
    const fade = visible ? 1 : 0
    if (duration === 0) marker.fadeState.value = fade
    else gsap.to(marker.fadeState, { value: fade, duration, ease })
  })

  const boxFade = single ? 0 : 1
  if (duration === 0) sceneState.boxState.value = boxFade
  else gsap.to(sceneState.boxState, { value: boxFade, duration, ease })

  if (railOverlayEl.value) {
    if (duration === 0) gsap.set(railOverlayEl.value, { opacity: single ? 0 : 1 })
    else gsap.to(railOverlayEl.value, { opacity: single ? 0 : 1, duration: 0.42, ease })
  }
}

function projectAnchor(object) {
  object.getWorldPosition(tmpVec)
  tmpVec.project(sceneState.camera)
  return {
    x: (tmpVec.x * 0.5 + 0.5) * sceneState.size.width,
    y: (-tmpVec.y * 0.5 + 0.5) * sceneState.size.height
  }
}

function projectVec(x, y, z) {
  tmpVec.set(x, y, z).project(sceneState.camera)
  return {
    x: (tmpVec.x * 0.5 + 0.5) * sceneState.size.width,
    y: (-tmpVec.y * 0.5 + 0.5) * sceneState.size.height
  }
}

function updateRailOverlay() {
  const railWorldX = sceneState.profile.railX
  const railX = projectVec(railWorldX, 0, RAIL_Z).x
  // Rail spans from the first to the last label node (no overshoot into empty space).
  const topY = projectVec(railWorldX, LAYER_Y.TOOLS + LABEL_LIFT, RAIL_Z).y
  const botY = projectVec(railWorldX, LAYER_Y.EXPERIMENTS + LABEL_LIFT, RAIL_Z).y

  if (railLineEl.value) {
    railLineEl.value.setAttribute('x1', railX)
    railLineEl.value.setAttribute('y1', topY)
    railLineEl.value.setAttribute('x2', railX)
    railLineEl.value.setAttribute('y2', botY)
  }

  // Each node's straight horizontal connector lands on a plane's front-left corner
  // (where the plane's left + front edges meet and the other edges fan out). The
  // tilted planes project that corner into the gap below the layer's label, so a
  // node reads as a separator while actually tying into a real plane vertex.
  // No node below EXPERIMENTS — nothing is layered beneath it.
  const dividers = [
    { node: railNodeAEl.value, conn: railConnAEl.value, y: LAYER_Y.TOOLS },
    { node: railNodeBEl.value, conn: railConnBEl.value, y: LAYER_Y.WORKS }
  ]
  dividers.forEach(({ node, conn, y }) => {
    const corner = projectVec(-HALF_X, y, HALF_Z)
    if (node) {
      node.setAttribute('cx', railX)
      node.setAttribute('cy', corner.y)
    }
    if (conn) {
      conn.setAttribute('x1', railX)
      conn.setAttribute('y1', corner.y)
      conn.setAttribute('x2', corner.x)
      conn.setAttribute('y2', corner.y)
    }
  })

  return railX
}

function ensureTargetOverlayNodes() {
  const root = targetOverlayEl.value
  if (!root || !sceneState) return []
  const targets = sceneState.targetOverlays
  if (root.childNodes.length === targets.length) return Array.from(root.childNodes)

  root.replaceChildren()
  return targets.map(() => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse')
    ellipse.setAttribute('stroke-width', '0.85')
    ellipse.setAttribute('vector-effect', 'non-scaling-stroke')
    g.appendChild(ellipse)

    for (let i = 0; i < 4; i += 1) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('stroke-width', i < 2 ? '0.75' : '0.65')
      line.setAttribute('vector-effect', 'non-scaling-stroke')
      g.appendChild(line)
    }

    root.appendChild(g)
    return g
  })
}

function updateTargetOverlay() {
  if (!sceneState) return
  const nodes = ensureTargetOverlayNodes()
  sceneState.targetOverlays.forEach(({ anchor, layer }, index) => {
    const el = nodes[index]
    if (!el) return
    const point = projectAnchor(anchor)
    const size = anchor.userData.targetSize
    const rx = size.rx
    const ry = size.ry
    const xTick = rx + 3.2
    const xGap = rx + 1.15
    const yTick = ry + 3.4
    const yGap = ry + 1.25
    const opacity = anchor.userData.targetOpacity * layer.fadeState.value * sceneState.boxState.value
    const [ellipse, left, right, verticalA, verticalB] = el.childNodes

    el.setAttribute('opacity', String(opacity))
    ellipse.setAttribute('cx', point.x)
    ellipse.setAttribute('cy', point.y)
    ellipse.setAttribute('rx', rx)
    ellipse.setAttribute('ry', ry)

    left.setAttribute('x1', point.x - xTick)
    left.setAttribute('y1', point.y)
    left.setAttribute('x2', point.x - xGap)
    left.setAttribute('y2', point.y)

    right.setAttribute('x1', point.x + xGap)
    right.setAttribute('y1', point.y)
    right.setAttribute('x2', point.x + xTick)
    right.setAttribute('y2', point.y)

    verticalA.setAttribute('x1', point.x)
    verticalA.setAttribute('y1', point.y - yTick)
    verticalA.setAttribute('x2', point.x)
    verticalA.setAttribute('y2', point.y - yGap)

    verticalB.setAttribute('x1', point.x)
    verticalB.setAttribute('y1', point.y + yGap)
    verticalB.setAttribute('x2', point.x)
    verticalB.setAttribute('y2', point.y + yTick)
  })
}

function updateHoverPreviewPosition() {
  if (!sceneState || !hoveredProject.value || !previewPositionEl.value) return
  const marker = sceneState.markers.find((item) => item.project.id === hoveredProject.value.id)
  if (!marker) return

  const point = projectAnchor(marker.guideTopAnchor)
  const cardWidth = 288
  const cardHeight = 176
  const gap = 16
  const margin = 12
  const placeRight = point.x + gap + cardWidth <= sceneState.size.width - margin
  const preferredX = placeRight ? point.x + gap : point.x - gap - cardWidth
  const x = Math.max(margin, Math.min(preferredX, sceneState.size.width - cardWidth - margin))
  const preferredY = point.y + 5
  const y = Math.max(margin, Math.min(preferredY, sceneState.size.height - cardHeight - margin))
  previewPositionEl.value.style.transform = `translate(${x}px, ${y}px)`
}

function renderScene() {
  if (!sceneState) return
  const { colors } = sceneState
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  sceneState.boxStatics.forEach(({ material, base }) => {
    material.opacity = base * sceneState.boxState.value
  })

  sceneState.layers.forEach((layer) => {
    const fade = layer.fadeState.value
    layer.group.visible = fade > 0.001
    layer.statics.forEach(({ material, base }) => {
      material.opacity = base * fade
    })
  })

  sceneState.markers.forEach((marker) => {
    const layerFade = marker.layer.fadeState.value
    const markerFade = marker.fadeState.value
    const visible = layerFade * markerFade
    const hovered = hoveredId.value === marker.project.id
    const archived = marker.project.status === 'archived'

    const targetScale = hovered ? 1.26 : 1
    marker.scaleCurrent += (targetScale - marker.scaleCurrent) * 0.18
    marker.root.scale.setScalar(marker.scaleCurrent)

    const targetGuideScale = hovered ? HOVER_GUIDE_HEIGHT / marker.stemHeight : 1
    if (reduceMotion) marker.guideScaleCurrent = targetGuideScale
    else marker.guideScaleCurrent += (targetGuideScale - marker.guideScaleCurrent) * 0.14
    const renderedGuideScale = marker.guideScaleCurrent * marker.guideEntrance.value
    marker.guide.scale.y = renderedGuideScale
    marker.guide.position.y = (marker.stemHeight * renderedGuideScale) / 2
    marker.guideTopAnchor.position.y = marker.stemHeight * renderedGuideScale

    const inkColor = hovered ? colors.blue : archived ? colors.muted : colors.ink
    marker.entryDot.color.copy(inkColor)
    marker.entryDot.opacity = marker.entryDot.userData.baseOpacity * visible * marker.dotEntrance.value

    marker.washer.color.copy(hovered ? colors.blueSoft : archived ? colors.muted : colors.lineStrong)
    marker.washer.opacity = (hovered ? 0.82 : marker.washer.userData.baseOpacity) * visible * marker.dotEntrance.value

    marker.guideMaterial.color.copy(hovered ? colors.blue : colors.muted)
    marker.guideMaterial.opacity = (hovered ? 0.92 : marker.guideMaterial.userData.baseOpacity) * visible * marker.guideEntrance.value

    marker.hit.visible = visible > 0.3 && marker.guideEntrance.value > 0.98
  })

  sceneState.renderer.render(sceneState.scene, sceneState.camera)

  const railX = updateRailOverlay()
  updateTargetOverlay()

  sceneState.layers.forEach((layer) => {
    const el = layerEls[layer.id]
    if (!el) return
    const point = projectAnchor(layer.labelAnchor)
    el.style.transform = `translate(${railX}px, ${point.y}px)`
    el.style.opacity = String(layer.fadeState.value)
  })

  sceneState.markers.forEach((marker) => {
    const el = entryEls[marker.project.id]
    if (!el) return
    const point = projectAnchor(marker.labelAnchor)
    el.style.transform = `translate(${point.x}px, ${point.y}px)`
    const labelFade = hoveredId.value === marker.project.id ? 0 : 1
    el.style.opacity = String(marker.layer.fadeState.value * marker.fadeState.value * labelFade)
  })

  updateHoverPreviewPosition()

  sceneState.animationId = window.requestAnimationFrame(renderScene)
}

function pickProject(event) {
  if (!sceneState || !canvasEl.value) return null
  const rect = canvasEl.value.getBoundingClientRect()
  sceneState.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  sceneState.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  sceneState.raycaster.setFromCamera(sceneState.pointer, sceneState.camera)
  const targets = sceneState.markers.filter((marker) => marker.hit.visible).map((marker) => marker.hit)
  const hits = sceneState.raycaster.intersectObjects(targets, false)
  const id = hits[0]?.object?.userData.projectId
  return id ? props.projects.find((project) => project.id === id) ?? null : null
}

function cancelHoverClear() {
  if (!hoverClearTimer) return
  window.clearTimeout(hoverClearTimer)
  hoverClearTimer = 0
}

function showHoverPreview() {
  const el = previewMotionEl.value
  if (!el) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(el, { autoAlpha: 1, y: 0 })
    return
  }
  gsap.fromTo(
    el,
    { autoAlpha: 0, y: 8 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.62,
      ease: hoverPreviewEase,
      overwrite: 'auto'
    }
  )
}

function hideHoverPreview() {
  const el = previewMotionEl.value
  if (!el) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(el, { autoAlpha: 0, y: 0 })
    hoveredProject.value = null
    hoveredId.value = null
    return
  }
  gsap.to(el, {
    autoAlpha: 0,
    y: 5,
    duration: 0.2,
    ease: 'power1.out',
    overwrite: 'auto',
    onComplete: () => {
      hoveredProject.value = null
      hoveredId.value = null
    }
  })
}

async function setHoveredProject(project) {
  cancelHoverClear()
  if (!project) {
    scheduleHoverClear()
    return
  }
  if (hoveredProject.value?.id === project.id) {
    hoveredId.value = project.id
    return
  }
  hoveredId.value = project.id
  hoveredProject.value = project
  await nextTick()
  updateHoverPreviewPosition()
  showHoverPreview()
}

function scheduleHoverClear() {
  if (hoverClearTimer) return
  hoverClearTimer = window.setTimeout(hideHoverPreview, 110)
}

function handlePointerMove(event) {
  const project = pickProject(event)
  if (project) setHoveredProject(project)
  else if (hoveredProject.value) scheduleHoverClear()
  if (canvasEl.value) canvasEl.value.style.cursor = project ? 'pointer' : 'default'
}

function handlePointerLeave() {
  scheduleHoverClear()
  if (canvasEl.value) canvasEl.value.style.cursor = 'default'
}

function handleCanvasClick(event) {
  const project = pickProject(event)
  if (project) emit('select', project)
}

function initScene() {
  if (sceneState) return
  sceneState = buildScene()
  if (!sceneState) return
  resizeScene()
  applyFilter(false)
  setEntranceStartState()
  renderScene()
  gsap.set(canvasEl.value, { autoAlpha: 1 })
  if (entranceRequested) window.requestAnimationFrame(playSpatialEntrance)
  resizeObserver = new ResizeObserver(scheduleResize)
  if (canvasEl.value) resizeObserver.observe(canvasEl.value)
  window.addEventListener('resize', scheduleResize)
  document.fonts?.ready?.then(scheduleSettledResize)
  scheduleSettledResize()
}

function disposeScene() {
  if (!sceneState) return
  window.removeEventListener('resize', scheduleResize)
  resizeObserver?.disconnect()
  resizeObserver = null
  if (resizeFrame) window.cancelAnimationFrame(resizeFrame)
  resizeFrame = 0
  window.cancelAnimationFrame(sceneState.animationId)
  sceneState.scene.traverse((object) => {
    object.geometry?.dispose()
    if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose())
    else object.material?.dispose()
  })
  sceneState.renderer.dispose()
  sceneState = null
}

function handleMediaChange() {
  if (!desktopMq) return
  if (desktopMq.matches) {
    if (!sceneState) nextTick(initScene)
  } else {
    cancelHoverClear()
    hideHoverPreview()
    disposeScene()
  }
}

onMounted(async () => {
  await nextTick()
  desktopMq = window.matchMedia('(min-width: 768px)')
  if (desktopMq.matches) initScene()
  desktopMq.addEventListener('change', handleMediaChange)
})

watch(
  () => props.activeFilter,
  () => {
    cancelHoverClear()
    hideHoverPreview()
    if (spatialEntranceTimeline) {
      spatialEntranceTimeline.kill()
      spatialEntranceTimeline = null
      setEntranceEndState()
    }
    applyFilter(true)
  }
)

onBeforeUnmount(() => {
  cancelHoverClear()
  spatialEntranceTimeline?.kill()
  spatialEntranceTimeline = null
  gsap.killTweensOf(previewMotionEl.value)
  desktopMq?.removeEventListener('change', handleMediaChange)
  disposeScene()
})
</script>

<style scoped>
.spatial-meta {
  pointer-events: none;
  position: absolute;
  z-index: 2;
  display: flex;
  font-family: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.625rem;
  letter-spacing: 0.18em;
  line-height: 1.4;
  color: var(--muted-foreground);
  opacity: 0.48;
  text-transform: uppercase;
}

.spatial-meta-bottom {
  right: 5.35rem;
  bottom: 1.1rem;
  align-items: center;
  gap: 1rem;
}

@media (max-width: 1536px), (max-height: 820px) {
  .spatial-meta-bottom {
    right: 6.4rem;
    bottom: 2.65rem;
  }
}

/* Reused on every layer/entry anchor; needs will-change for per-frame transforms. */
.spatial-anchor {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform, opacity;
}

/* calc()-based label offsets are hard to express with Tailwind utilities. */
/* Label hangs just below-right of its rail node (the anchor origin). */
.spatial-layer-label {
  transform: translate(0.9rem, -0.55rem);
}

.spatial-entry {
  transform: translate(-50%, calc(-100% - 0.3rem));
}
</style>
