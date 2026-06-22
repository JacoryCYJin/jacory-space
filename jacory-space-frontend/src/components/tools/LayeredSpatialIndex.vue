<template>
  <section
    data-tools-enter
    class="relative hidden h-full min-h-[560px] border-y border-line md:block lg:min-h-0"
    aria-label="Layered spatial project index"
  >
    <canvas
      ref="canvasEl"
      class="block h-full w-full"
      @pointermove="handlePointerMove"
      @pointerleave="handlePointerLeave"
      @click="handleCanvasClick"
    />

    <div ref="overlayEl" class="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        v-for="layer in layerMeta"
        :key="'layer-' + layer.id"
        :ref="(el) => setLayerEl(layer.id, el)"
        class="spatial-anchor"
      >
        <div class="spatial-layer-label flex flex-col items-end gap-[0.2rem] text-right">
          <span class="font-mono text-xs uppercase tracking-[0.2em] text-foreground">{{ layer.id }}</span>
          <span class="font-mono text-xs tracking-[0.16em] text-muted-foreground">{{ layer.count }}</span>
        </div>
      </div>

      <div
        v-for="project in projects"
        :key="'entry-' + project.id"
        :ref="(el) => setEntryEl(project.id, el)"
        class="spatial-anchor"
      >
        <div class="spatial-entry inline-flex items-baseline gap-[0.4rem] whitespace-nowrap">
          <span class="font-mono text-xs tracking-[0.06em] text-blue">{{ project.no }}</span>
          <span
            class="font-mono text-sm tracking-[0.01em] transition-colors duration-300 ease-premium"
            :class="hoveredId === project.id ? 'text-blue' : 'text-foreground'"
          >{{ project.title }}</span>
          <span
            class="h-[0.34rem] w-[0.34rem] self-center rounded-full"
            :class="statusDotClass(project.status)"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>

    <p class="absolute bottom-4 left-[1.1rem] font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
      Hover to inspect / Click to open
    </p>

    <div class="pointer-events-none absolute bottom-4 right-[1.2rem] h-12 w-12" aria-hidden="true">
      <span class="absolute right-[1.2rem] top-0 font-mono text-xs tracking-[0.1em] text-muted-foreground">Z</span>
      <span class="absolute bottom-0 right-0 font-mono text-xs tracking-[0.1em] text-muted-foreground">Y</span>
      <span class="absolute bottom-0 left-0 font-mono text-xs tracking-[0.1em] text-muted-foreground">X</span>
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

gsap.registerPlugin(CustomEase)

const props = defineProps({
  projects: { type: Array, required: true },
  activeFilter: { type: String, default: 'all' }
})

const emit = defineEmits(['select'])

const canvasEl = ref(null)
const overlayEl = ref(null)
const hoveredId = ref(null)

// Spatial geometry scale — tweak these to reshape the layered index.
const GUIDE_HEIGHT = 0.95
const HALF_X = 9.5
const HALF_Z = 3.2
const LAYER_Y = { TOOLS: 4.4, WORKS: 0, EXPERIMENTS: -4.4 }
const FRUSTUM = 15.2
const CAMERA_POSITION = [4.6, 3.1, 12]
const CAMERA_TARGET = [0, -0.2, 0]
const SINGLE_LAYER_SCALE = 1.16

const statusNames = { live: 'LIVE', wip: 'WIP', beta: 'BETA', archived: 'ARCHIVED' }

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

function setEntryEl(id, el) {
  if (el) entryEls[id] = el
  else delete entryEls[id]
}

function setLayerEl(id, el) {
  if (el) layerEls[id] = el
  else delete layerEls[id]
}

let sceneState = null
let desktopMq = null
const tmpVec = new THREE.Vector3()

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

function buildLayerPlane(colors, statics) {
  const group = new THREE.Group()

  const outline = makeLine(
    [
      new THREE.Vector3(-HALF_X, 0, -HALF_Z),
      new THREE.Vector3(HALF_X, 0, -HALF_Z),
      new THREE.Vector3(HALF_X, 0, HALF_Z),
      new THREE.Vector3(-HALF_X, 0, HALF_Z),
      new THREE.Vector3(-HALF_X, 0, -HALF_Z)
    ],
    colors.lineStrong,
    0.5
  )
  group.add(outline)
  statics.push({ material: outline.material, base: 0.5 })

  for (let i = 1; i < 8; i += 1) {
    const x = -HALF_X + (i / 8) * HALF_X * 2
    const line = makeLine([new THREE.Vector3(x, 0, -HALF_Z), new THREE.Vector3(x, 0, HALF_Z)], colors.line, 0.24)
    group.add(line)
    statics.push({ material: line.material, base: 0.24 })
  }
  for (let i = 1; i < 4; i += 1) {
    const z = -HALF_Z + (i / 4) * HALF_Z * 2
    const line = makeLine([new THREE.Vector3(-HALF_X, 0, z), new THREE.Vector3(HALF_X, 0, z)], colors.line, 0.24)
    group.add(line)
    statics.push({ material: line.material, base: 0.24 })
  }

  return group
}

function buildMarker(project, colors) {
  const root = new THREE.Group()
  root.position.set(project.pos[0], 0, project.pos[1])

  const crossGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-0.16, 0.02, 0),
    new THREE.Vector3(0.16, 0.02, 0),
    new THREE.Vector3(0, 0.02, -0.16),
    new THREE.Vector3(0, 0.02, 0.16)
  ])
  const crossMaterial = new THREE.LineBasicMaterial({
    color: project.status === 'archived' ? colors.muted : colors.ink,
    transparent: true,
    opacity: 0.95
  })
  crossMaterial.userData.baseOpacity = 0.95
  const cross = new THREE.LineSegments(crossGeometry, crossMaterial)
  root.add(cross)

  const guideMaterial = new THREE.LineBasicMaterial({ color: colors.lineStrong, transparent: true, opacity: 0.4 })
  guideMaterial.userData.baseOpacity = 0.4
  const guide = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, GUIDE_HEIGHT, 0)]),
    guideMaterial
  )
  root.add(guide)

  const baseGeometry = new THREE.RingGeometry(0.04, 0.07, 20)
  const baseMaterial = new THREE.MeshBasicMaterial({
    color: colors.lineStrong,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide
  })
  baseMaterial.userData.baseOpacity = 0.6
  const baseDot = new THREE.Mesh(baseGeometry, baseMaterial)
  baseDot.rotation.x = -Math.PI / 2
  root.add(baseDot)

  const hit = new THREE.Mesh(
    new THREE.PlaneGeometry(0.95, 0.95),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
  )
  hit.rotation.x = -Math.PI / 2
  hit.position.y = 0.02
  hit.userData.projectId = project.id
  root.add(hit)

  const labelAnchor = new THREE.Object3D()
  labelAnchor.position.set(0, GUIDE_HEIGHT + 0.06, 0)
  root.add(labelAnchor)

  return {
    project,
    root,
    hit,
    labelAnchor,
    cross: crossMaterial,
    guide: guideMaterial,
    baseDot: baseMaterial,
    scaleCurrent: 1,
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
  scene.background = colors.background

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
  camera.position.set(...CAMERA_POSITION)
  camera.lookAt(...CAMERA_TARGET)

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const spatialEase = CustomEase.create('tools-spatial', '0.16,1,0.3,1')

  const boxStatics = []
  const boxState = { value: 1 }
  const boxGeometry = new THREE.BoxGeometry(HALF_X * 2, LAYER_Y.TOOLS - LAYER_Y.EXPERIMENTS + 1.6, HALF_Z * 2)
  const boxEdges = new THREE.EdgesGeometry(boxGeometry)
  const boxMaterial = new THREE.LineBasicMaterial({ color: colors.line, transparent: true, opacity: 0.45 })
  boxMaterial.userData.baseOpacity = 0.45
  const box = new THREE.LineSegments(boxEdges, boxMaterial)
  boxGeometry.dispose()
  scene.add(box)
  boxStatics.push({ material: boxMaterial, base: 0.45 })

  const layers = ['TOOLS', 'WORKS', 'EXPERIMENTS'].map((id) => {
    const statics = []
    const group = buildLayerPlane(colors, statics)
    group.position.y = LAYER_Y[id]

    const labelAnchor = new THREE.Object3D()
    labelAnchor.position.set(-HALF_X - 0.35, 0, HALF_Z * 0.35)
    group.add(labelAnchor)

    scene.add(group)
    return { id, group, statics, labelAnchor, fadeState: { value: 1 } }
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
    markers,
    box: boxMaterial,
    boxState,
    boxStatics,
    raycaster,
    pointer,
    reducedMotion,
    spatialEase,
    size: { width: 1, height: 1 },
    animationId: 0
  }
}

function resizeScene() {
  if (!sceneState || !canvasEl.value) return
  const rect = canvasEl.value.getBoundingClientRect()
  const width = Math.max(1, rect.width)
  const height = Math.max(1, rect.height)
  const aspect = width / height

  sceneState.camera.left = (-FRUSTUM * aspect) / 2
  sceneState.camera.right = (FRUSTUM * aspect) / 2
  sceneState.camera.top = FRUSTUM / 2
  sceneState.camera.bottom = -FRUSTUM / 2
  sceneState.camera.updateProjectionMatrix()
  sceneState.renderer.setSize(width, height, false)
  sceneState.size.width = width
  sceneState.size.height = height
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
}

function projectAnchor(object) {
  object.getWorldPosition(tmpVec)
  tmpVec.project(sceneState.camera)
  return {
    x: (tmpVec.x * 0.5 + 0.5) * sceneState.size.width,
    y: (-tmpVec.y * 0.5 + 0.5) * sceneState.size.height
  }
}

function renderScene() {
  if (!sceneState) return
  const { colors } = sceneState

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

    const inkColor = hovered ? colors.blue : archived ? colors.muted : colors.ink
    marker.cross.color.copy(inkColor)
    marker.cross.opacity = marker.cross.userData.baseOpacity * visible

    marker.guide.color.copy(hovered ? colors.blue : colors.lineStrong)
    marker.guide.opacity = (hovered ? 0.7 : marker.guide.userData.baseOpacity) * visible

    marker.baseDot.color.copy(hovered ? colors.blueSoft : colors.lineStrong)
    marker.baseDot.opacity = marker.baseDot.userData.baseOpacity * visible

    marker.hit.visible = visible > 0.3
  })

  sceneState.renderer.render(sceneState.scene, sceneState.camera)

  sceneState.layers.forEach((layer) => {
    const el = layerEls[layer.id]
    if (!el) return
    const point = projectAnchor(layer.labelAnchor)
    el.style.transform = `translate(${point.x}px, ${point.y}px)`
    el.style.opacity = String(layer.fadeState.value)
  })

  sceneState.markers.forEach((marker) => {
    const el = entryEls[marker.project.id]
    if (!el) return
    const point = projectAnchor(marker.labelAnchor)
    el.style.transform = `translate(${point.x}px, ${point.y}px)`
    el.style.opacity = String(marker.layer.fadeState.value * marker.fadeState.value)
  })

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

function handlePointerMove(event) {
  const project = pickProject(event)
  hoveredId.value = project?.id ?? null
  if (canvasEl.value) canvasEl.value.style.cursor = project ? 'pointer' : 'default'
}

function handlePointerLeave() {
  hoveredId.value = null
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
  renderScene()
  window.addEventListener('resize', resizeScene)
}

function disposeScene() {
  if (!sceneState) return
  window.removeEventListener('resize', resizeScene)
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
    hoveredId.value = null
    applyFilter(true)
  }
)

onBeforeUnmount(() => {
  desktopMq?.removeEventListener('change', handleMediaChange)
  disposeScene()
})
</script>

<style scoped>
/* Reused on every layer/entry anchor; needs will-change for per-frame transforms. */
.spatial-anchor {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform, opacity;
}

/* calc()-based label offsets are hard to express with Tailwind utilities. */
.spatial-layer-label {
  transform: translate(calc(-100% - 0.6rem), -50%);
}

.spatial-entry {
  transform: translate(-50%, calc(-100% - 0.3rem));
}
</style>
