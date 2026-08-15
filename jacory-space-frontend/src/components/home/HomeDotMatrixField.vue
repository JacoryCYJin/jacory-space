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
import '@fontsource-variable/roboto-flex/wght.css'
import { HOME_DOT_MATRIX_CONFIG, resolveDotMatrixRows } from './homeDotMatrixConfig'

const emit = defineEmits(['ready'])
const fieldRoot = ref(null)
const canvasEl = ref(null)

let renderer
let scene
let camera
let geometry
let material
let nameMaskTexture
let leadingLetterMaskTexture
let titleMaskTexture
let titleMaskRows = 0
let resizeObserver
let resizeFrame = 0

function readToken(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function renderField() {
  renderer?.render(scene, camera)
}

function createTextMaskTexture(
  text,
  fontSize,
  centerY,
  scaleY = 1,
  fontFamily = 'Anton',
  fontWeight = 400,
  horizontalRulePositions = [],
  gridRows = 1
) {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024

  const context = canvas.getContext('2d')
  if (!context) return null

  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = readToken('--card')
  context.font = `${fontWeight} ${fontSize}px "${fontFamily}"`
  context.textAlign = 'center'
  context.textBaseline = 'alphabetic'
  const textMetrics = context.measureText(text)
  const horizontalScale = Math.min(1, (canvas.width * 0.94) / textMetrics.width)
  const textBaseline = centerY + (
    textMetrics.actualBoundingBoxAscent - textMetrics.actualBoundingBoxDescent
  ) / 2

  const ruleCellHeight = canvas.height / gridRows
  horizontalRulePositions.forEach((position) => {
    const ruleRow = Math.min(gridRows - 1, Math.max(0, Math.floor(position * gridRows)))
    const ruleHeight = ruleCellHeight * 0.8
    const ruleY = ruleRow * ruleCellHeight + (ruleCellHeight - ruleHeight) / 2
    context.fillRect(canvas.width * 0.03, ruleY, canvas.width * 0.94, ruleHeight)
  })

  context.save()
  context.translate(canvas.width / 2, centerY)
  context.scale(horizontalScale, scaleY)
  context.translate(-canvas.width / 2, -centerY)
  context.fillText(text, canvas.width / 2, textBaseline)
  context.restore()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.NoColorSpace
  texture.generateMipmaps = false
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  return texture
}

function createLeadingLetterMaskTexture(text, letter, fontSize, centerY, scaleY = 1) {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024

  const context = canvas.getContext('2d')
  if (!context) return null

  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = readToken('--card')
  context.font = `${fontSize}px "Anton"`
  context.textAlign = 'left'
  context.textBaseline = 'alphabetic'
  const textMetrics = context.measureText(text)
  const horizontalScale = Math.min(1, (canvas.width * 0.94) / textMetrics.width)
  const textBaseline = centerY + (
    textMetrics.actualBoundingBoxAscent - textMetrics.actualBoundingBoxDescent
  ) / 2
  const textStart = canvas.width / 2 - textMetrics.width / 2

  context.save()
  context.translate(canvas.width / 2, centerY)
  context.scale(horizontalScale, scaleY)
  context.translate(-canvas.width / 2, -centerY)
  context.fillText(letter, textStart, textBaseline)
  context.restore()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.NoColorSpace
  texture.generateMipmaps = false
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  return texture
}

function createTitleMaskTexture(gridRows) {
  return createTextMaskTexture(
    'DESIGNER · DEVELOPER · WRITER · CREATOR',
    96,
    1024 * 0.88,
    2,
    'Roboto Flex Variable',
    650,
    [0.785, 0.97],
    gridRows
  )
}

function updateLayout() {
  if (!renderer || !fieldRoot.value || !material) return

  const rect = fieldRoot.value.getBoundingClientRect()
  const width = Math.max(1, rect.width)
  const height = Math.max(1, rect.height)

  renderer.setSize(width, height, false)
  const gridRows = resolveDotMatrixRows(width, height)
  material.uniforms.gridResolution.value.set(HOME_DOT_MATRIX_CONFIG.columns, gridRows)

  if (titleMaskRows !== gridRows) {
    titleMaskTexture?.dispose()
    titleMaskTexture = createTitleMaskTexture(gridRows)
    material.uniforms.titleMaskTexture.value = titleMaskTexture
    titleMaskRows = gridRows
  }

  renderField()
}

function scheduleResize() {
  if (resizeFrame) window.cancelAnimationFrame(resizeFrame)
  resizeFrame = window.requestAnimationFrame(() => {
    resizeFrame = 0
    updateLayout()
  })
}

async function prepareInitialFrame() {
  try {
    await renderer?.compileAsync(scene, camera)
  } catch {
    // The first render below remains the fallback for WebGL contexts without parallel compilation.
  }

  renderField()
  await new Promise((resolve) => window.requestAnimationFrame(resolve))
}

onMounted(async () => {
  await nextTick()
  if (!canvasEl.value || !fieldRoot.value) {
    emit('ready')
    return
  }

  try {
    await document.fonts.load(
      '650 96px "Roboto Flex Variable"',
      'DESIGNER · DEVELOPER · WRITER · CREATOR'
    )
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
        dotColor: { value: new THREE.Color(readToken('--home-dot-matrix-dot')) },
        nameColor: { value: new THREE.Color(readToken('--primary')) },
        leadingLetterColor: { value: new THREE.Color(readToken('--home-dot-matrix-accent')) },
        titleColor: { value: new THREE.Color(readToken('--primary')) },
        nameMaskTexture: { value: null },
        leadingLetterMaskTexture: { value: null },
        titleMaskTexture: { value: null },
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
      uniform vec3 nameColor;
      uniform vec3 leadingLetterColor;
      uniform vec3 titleColor;
      uniform sampler2D nameMaskTexture;
      uniform sampler2D leadingLetterMaskTexture;
      uniform sampler2D titleMaskTexture;
      uniform float dotSize;
      uniform float gap;

      varying vec2 vUv;

      void main() {
        vec2 gridCell = floor(vUv * gridResolution);
        vec2 sampleUv = (gridCell + 0.5) / gridResolution;
        vec2 cellUv = fract(vUv * gridResolution) - 0.5;
        float resolvedDotSize = min(dotSize, 1.0 - gap);
        bool isDot = max(abs(cellUv.x), abs(cellUv.y)) <= resolvedDotSize * 0.5;
        float nameMask = texture2D(nameMaskTexture, sampleUv).a;
        float leadingLetterMask = texture2D(leadingLetterMaskTexture, sampleUv).a;
        float titleMask = texture2D(titleMaskTexture, sampleUv).a;
        float nameCell = step(0.1, nameMask);
        float leadingLetterCell = step(0.1, leadingLetterMask);
        float titleCell = step(0.1, titleMask);
        float identityCell = max(max(nameCell, leadingLetterCell), titleCell);
        vec3 resolvedDotColor = mix(dotColor, nameColor, nameCell);
        resolvedDotColor = mix(resolvedDotColor, leadingLetterColor, leadingLetterCell);
        resolvedDotColor = mix(resolvedDotColor, titleColor, titleCell);

        gl_FragColor = vec4(identityCell > 0.5 || isDot ? resolvedDotColor : backgroundColor, 1.0);
      }
      `
    })
    nameMaskTexture = createTextMaskTexture('JACORY', 670, 1024 * 0.4, 1.23)
    leadingLetterMaskTexture = createLeadingLetterMaskTexture('JACORY', 'J', 670, 1024 * 0.4, 1.23)
    material.uniforms.nameMaskTexture.value = nameMaskTexture
    material.uniforms.leadingLetterMaskTexture.value = leadingLetterMaskTexture
    scene.add(new THREE.Mesh(geometry, material))

    updateLayout()
    await prepareInitialFrame()
  } catch {
    // A failed optional WebGL field must not block the page loader indefinitely.
    emit('ready')
    return
  }

  emit('ready')
  resizeObserver = new ResizeObserver(scheduleResize)
  resizeObserver.observe(fieldRoot.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  if (resizeFrame) window.cancelAnimationFrame(resizeFrame)
  geometry?.dispose()
  material?.dispose()
  nameMaskTexture?.dispose()
  leadingLetterMaskTexture?.dispose()
  titleMaskTexture?.dispose()
  titleMaskRows = 0
  renderer?.dispose()
})
</script>
