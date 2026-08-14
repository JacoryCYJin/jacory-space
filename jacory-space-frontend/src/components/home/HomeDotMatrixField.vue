<template>
  <div
    ref="fieldRoot"
    class="pointer-events-none absolute inset-0 overflow-hidden"
    aria-hidden="true"
  >
    <canvas ref="canvasEl" class="block h-full w-full" />
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'
import { HOME_DOT_MATRIX_CONFIG, resolveDotMatrixRows } from './homeDotMatrixConfig'

const fieldRoot = ref(null)
const canvasEl = ref(null)

let renderer
let scene
let camera
let geometry
let material
let resizeObserver
let resizeFrame = 0

function readToken(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function renderField() {
  renderer?.render(scene, camera)
}

function updateLayout() {
  if (!renderer || !fieldRoot.value || !material) return

  const rect = fieldRoot.value.getBoundingClientRect()
  const width = Math.max(1, rect.width)
  const height = Math.max(1, rect.height)

  renderer.setSize(width, height, false)
  material.uniforms.gridResolution.value.set(
    HOME_DOT_MATRIX_CONFIG.columns,
    resolveDotMatrixRows(width, height)
  )
  renderField()
}

function scheduleResize() {
  if (resizeFrame) window.cancelAnimationFrame(resizeFrame)
  resizeFrame = window.requestAnimationFrame(() => {
    resizeFrame = 0
    updateLayout()
  })
}

onMounted(async () => {
  await nextTick()
  if (!canvasEl.value || !fieldRoot.value) return

  renderer = new THREE.WebGLRenderer({
    canvas: canvasEl.value,
    alpha: true,
    antialias: false,
    powerPreference: 'high-performance'
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setClearColor(0x000000, 0)

  scene = new THREE.Scene()
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  geometry = new THREE.PlaneGeometry(2, 2)
  material = new THREE.ShaderMaterial({
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      gridResolution: { value: new THREE.Vector2(1, 1) },
      backgroundColor: { value: new THREE.Color(readToken('--background')) },
      dotColor: { value: new THREE.Color(readToken('--line-strong')) },
      dotSize: { value: HOME_DOT_MATRIX_CONFIG.dotSize },
      gap: { value: HOME_DOT_MATRIX_CONFIG.gap }
    },
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec2 gridResolution;
      uniform vec3 backgroundColor;
      uniform vec3 dotColor;
      uniform float dotSize;
      uniform float gap;

      varying vec2 vUv;

      void main() {
        vec2 cellUv = fract(vUv * gridResolution) - 0.5;
        float resolvedDotSize = min(dotSize, 1.0 - gap);
        bool isDot = max(abs(cellUv.x), abs(cellUv.y)) <= resolvedDotSize * 0.5;

        gl_FragColor = vec4(isDot ? dotColor : backgroundColor, 1.0);
      }
    `
  })
  scene.add(new THREE.Mesh(geometry, material))

  updateLayout()
  resizeObserver = new ResizeObserver(scheduleResize)
  resizeObserver.observe(fieldRoot.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  if (resizeFrame) window.cancelAnimationFrame(resizeFrame)
  geometry?.dispose()
  material?.dispose()
  renderer?.dispose()
})
</script>
