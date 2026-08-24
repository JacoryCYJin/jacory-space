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
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import jacoryLogo from '../../assets/jacory-logo.svg'
import { HOME_DOT_MATRIX_CONFIG, resolveDotMatrixRows } from './homeDotMatrixConfig'

const emit = defineEmits(['ready'])
const props = defineProps({
  scatterProgress: {
    type: Number,
    default: 0
  },
  terminalProgress: {
    type: Number,
    default: 0
  }
})
const fieldRoot = ref(null)
const canvasEl = ref(null)

let renderer
let scene
let camera
let geometry
let gridMesh
let material
let nameMaskTexture
let leadingLetterMaskTexture
let titleMaskTexture
let logoMaskTexture
let statusMaskTexture
let cursorMaskTexture
let emptyMaskTexture
let logoMaskCanvas
let logoImage
let titleMaskRows = 0
let titleMaskAspect = 0
let gridRows = 0
let terminalLayout
let terminalProgress = 0
let terminalTypeStep = -1
let resizeObserver
let resizeFrame = 0
let statusPulseFrame = 0
let statusMotionQuery
let statusVisibilityObserver
let statusVisible = true

const TERMINAL_FRAME = {
  top: 0.64,
  right: 0.97,
  bottom: 0.97,
  left: 0.03
}
const TERMINAL_CONTENT_INSET = 0.02
const TERMINAL_FONT_SIZE = 80
const TERMINAL_INPUT_LINES = ['A CREATOR', 'I GUESS']
const TERMINAL_INPUT_LENGTH = TERMINAL_INPUT_LINES.reduce((total, line) => total + line.length, 0)

function readToken(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function createEmptyMaskTexture() {
  const texture = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1)
  texture.colorSpace = THREE.NoColorSpace
  texture.generateMipmaps = false
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  texture.needsUpdate = true
  return texture
}

async function waitForDisplayFont() {
  if (!document.fonts?.load) return

  await document.fonts.load('400 670px Anton', 'JACORY').catch(() => undefined)
}

function renderField() {
  renderer?.render(scene, camera)
}

function applyFieldProgress(scatterProgress) {
  if (!material) return

  material.uniforms.scatterProgress.value = Math.min(1, Math.max(0, scatterProgress))
  renderField()
}

watch(
  () => props.scatterProgress,
  applyFieldProgress,
  { immediate: true }
)

watch(
  () => props.terminalProgress,
  applyTerminalProgress,
  { immediate: true }
)

function resolveTerminalLayout(fieldAspect) {
  const terminalHeight = TERMINAL_FRAME.bottom - TERMINAL_FRAME.top
  const divider = TERMINAL_FRAME.left + terminalHeight / fieldAspect
  const verticalInset = terminalHeight * 0.12
  const firstRowCenter = TERMINAL_FRAME.top + verticalInset
  const lastRowCenter = TERMINAL_FRAME.bottom - verticalInset
  const rowGap = (lastRowCenter - firstRowCenter) / 4

  return {
    ...TERMINAL_FRAME,
    divider,
    contentLeft: divider + TERMINAL_CONTENT_INSET,
    contentRight: TERMINAL_FRAME.right - TERMINAL_CONTENT_INSET,
    headerCenter: firstRowCenter,
    firstLineCenter: firstRowCenter + rowGap,
    secondLineCenter: firstRowCenter + rowGap * 2,
    thirdLineCenter: firstRowCenter + rowGap * 3,
    modelLineCenter: lastRowCenter
  }
}

function clampProgress(value) {
  return Math.min(1, Math.max(0, value))
}

function resolveTerminalInput(progress) {
  const typedCharacters = Math.min(
    TERMINAL_INPUT_LENGTH,
    Math.floor(clampProgress(progress) * TERMINAL_INPUT_LENGTH)
  )
  const firstLineLength = TERMINAL_INPUT_LINES[0].length
  const firstLine = `> ${TERMINAL_INPUT_LINES[0].slice(0, Math.min(typedCharacters, firstLineLength))}`

  if (typedCharacters < firstLineLength) {
    return { activeLine: 0, complete: false, lines: [firstLine], typedCharacters }
  }

  const secondLineCharacters = typedCharacters - firstLineLength
  const secondLine = `> ${TERMINAL_INPUT_LINES[1].slice(0, secondLineCharacters)}`
  if (typedCharacters < TERMINAL_INPUT_LENGTH) {
    return { activeLine: 1, complete: false, lines: [firstLine, secondLine], typedCharacters }
  }

  return {
    activeLine: 2,
    complete: true,
    lines: [firstLine, secondLine, '> '],
    typedCharacters
  }
}

function resolveTerminalLineCenter(layout, lineIndex) {
  return [layout.firstLineCenter, layout.secondLineCenter, layout.thirdLineCenter][lineIndex]
}

function rebuildTerminalMasks() {
  if (!material || !terminalLayout || titleMaskRows < 1) return

  const terminalInput = resolveTerminalInput(terminalProgress)
  titleMaskTexture?.dispose()
  cursorMaskTexture?.dispose()
  titleMaskTexture = createTitleMaskTexture(titleMaskRows, terminalLayout, terminalInput)
  cursorMaskTexture = createCursorMaskTexture(titleMaskRows, terminalLayout, terminalInput)
  material.uniforms.titleMaskTexture.value = titleMaskTexture
  material.uniforms.cursorMaskTexture.value = cursorMaskTexture
  material.uniforms.cursorPulse.value = terminalInput.complete ? material.uniforms.cursorPulse.value : 1
  renderField()
}

function applyTerminalProgress(value) {
  terminalProgress = clampProgress(value)
  const nextTypeStep = resolveTerminalInput(terminalProgress).typedCharacters
  if (nextTypeStep === terminalTypeStep) return

  terminalTypeStep = nextTypeStep
  rebuildTerminalMasks()
}

function loadLogoImage() {
  const image = new Image()
  image.decoding = 'async'
  image.src = jacoryLogo
  return image.decode().then(() => image)
}

function createLogoMaskTexture() {
  logoMaskCanvas = document.createElement('canvas')
  logoMaskCanvas.width = 2048
  logoMaskCanvas.height = 1024

  const texture = new THREE.CanvasTexture(logoMaskCanvas)
  texture.colorSpace = THREE.NoColorSpace
  texture.generateMipmaps = false
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  return texture
}

function drawLogoMask(layout, fieldAspect) {
  if (!logoMaskCanvas || !logoImage || !logoMaskTexture) return

  const context = logoMaskCanvas.getContext('2d')
  if (!context) return

  const terminalHeight = layout.bottom - layout.top
  const logoHeight = logoMaskCanvas.height * terminalHeight * 0.76
  const logoWidth = logoHeight * (logoMaskCanvas.width / logoMaskCanvas.height) / fieldAspect
  const logoX = logoMaskCanvas.width * ((layout.left + layout.divider) / 2) - logoWidth / 2
  const logoY = logoMaskCanvas.height * ((layout.top + layout.bottom) / 2) - logoHeight / 2

  context.clearRect(0, 0, logoMaskCanvas.width, logoMaskCanvas.height)
  context.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight)
  logoMaskTexture.needsUpdate = true
}

function createStatusMaskTexture(gridRows, layout) {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024

  const context = canvas.getContext('2d')
  if (!context) return null

  context.font = `500 ${TERMINAL_FONT_SIZE}px ui-monospace`
  const runningWidth = context.measureText('RUNNING').width
  const cellWidth = canvas.width / HOME_DOT_MATRIX_CONFIG.columns
  const cellHeight = canvas.height / gridRows
  const statusSize = 7
  const statusRadius = (statusSize - 1) / 2
  const runningStartX = canvas.width * layout.contentRight - runningWidth
  const statusY = canvas.height * layout.headerCenter
  const column = Math.min(
    HOME_DOT_MATRIX_CONFIG.columns - statusSize,
    Math.max(0, Math.floor(runningStartX / cellWidth) - statusSize - 1)
  )
  const row = Math.min(
    gridRows - statusSize,
    Math.max(0, Math.round(statusY / cellHeight) - Math.ceil(statusSize / 2))
  )

  for (let offsetY = 0; offsetY < statusSize; offsetY += 1) {
    for (let offsetX = 0; offsetX < statusSize; offsetX += 1) {
      const distance = Math.hypot(offsetX - statusRadius, offsetY - statusRadius)
      if (distance > statusRadius) continue

      const alpha = 1 - distance / (statusRadius + 0.5)
      context.fillStyle = `rgba(255, 255, 255, ${alpha})`
      context.fillRect(
        (column + offsetX) * cellWidth,
        (row + offsetY) * cellHeight,
        cellWidth,
        cellHeight
      )
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.NoColorSpace
  texture.generateMipmaps = false
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  return texture
}

function renderStatusPulse(timestamp) {
  if (!material || !statusMotionQuery?.matches) return

  const phase = (timestamp % 900) / 900
  const pulse = 0.32 + 0.68 * Math.sin(phase * Math.PI)
  material.uniforms.statusPulse.value = pulse
  material.uniforms.cursorPulse.value = terminalTypeStep >= TERMINAL_INPUT_LENGTH ? pulse : 1
  renderField()
  statusPulseFrame = window.requestAnimationFrame(renderStatusPulse)
}

function updateStatusMotion() {
  if (!material) return
  if (statusPulseFrame) window.cancelAnimationFrame(statusPulseFrame)
  statusPulseFrame = 0

  if (statusMotionQuery?.matches && statusVisible) {
    statusPulseFrame = window.requestAnimationFrame(renderStatusPulse)
  } else {
    material.uniforms.statusPulse.value = 1
    material.uniforms.cursorPulse.value = 1
    renderField()
  }
}

function createTextMaskTexture(
  text,
  fontSize,
  centerY,
  scaleY = 1,
  fontFamily = 'Anton',
  fontWeight = 400,
  horizontalRulePositions = [],
  gridRows = 1,
  terminalFrame = null,
  textLayout = { align: 'center', x: 0.5 }
) {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024

  const context = canvas.getContext('2d')
  if (!context) return null

  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = readToken('--card')
  context.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  context.textBaseline = 'alphabetic'
  const textCenters = Array.isArray(centerY) ? centerY : [centerY]
  const textLines = (Array.isArray(text) ? text : [text]).map((line, index) => (
    typeof line === 'string'
      ? {
          text: line,
          center: textCenters[index] ?? textCenters[0],
          align: textLayout.align,
          x: textLayout.x,
          fixedBaseline: false
        }
      : {
          text: line.text,
          center: line.center ?? textCenters[index] ?? textCenters[0],
          align: line.align ?? textLayout.align,
          x: line.x ?? textLayout.x,
          fixedBaseline: line.fixedBaseline ?? false
        }
  ))
  const textMetrics = textLines.map((line) => context.measureText(line.text))
  const terminalBaselineMetrics = context.measureText('> I GUESS')
  const widestText = Math.max(...textMetrics.map((metrics) => metrics.width))
  const horizontalScale = Math.min(1, (canvas.width * 0.94) / widestText)

  const ruleCellHeight = canvas.height / gridRows
  horizontalRulePositions.forEach((position) => {
    const ruleRow = Math.min(gridRows - 1, Math.max(0, Math.floor(position * gridRows)))
    const ruleHeight = ruleCellHeight * 0.8
    const ruleY = ruleRow * ruleCellHeight + (ruleCellHeight - ruleHeight) / 2
    context.fillRect(canvas.width * 0.03, ruleY, canvas.width * 0.94, ruleHeight)
  })

  if (terminalFrame) {
    const topRow = Math.min(gridRows - 1, Math.max(0, Math.floor(terminalFrame.top * gridRows)))
    const bottomRow = Math.min(gridRows - 1, Math.max(0, Math.floor(terminalFrame.bottom * gridRows)))
    const ruleHeight = ruleCellHeight * 0.8
    const topY = topRow * ruleCellHeight + (ruleCellHeight - ruleHeight) / 2
    const bottomY = bottomRow * ruleCellHeight + (ruleCellHeight - ruleHeight) / 2
    const ruleWidth = (canvas.width / HOME_DOT_MATRIX_CONFIG.columns) * 0.8
    const leftX = canvas.width * terminalFrame.left
    const rightX = canvas.width * terminalFrame.right - ruleWidth

    context.fillRect(leftX, topY, ruleWidth, bottomY + ruleHeight - topY)
    context.fillRect(rightX, topY, ruleWidth, bottomY + ruleHeight - topY)

    if (terminalFrame.divider) {
      const dividerX = canvas.width * terminalFrame.divider - ruleWidth / 2
      context.fillRect(dividerX, topY, ruleWidth, bottomY + ruleHeight - topY)
    }
  }

  textLines.forEach((line, index) => {
    const lineCenter = line.center
    const textAnchorX = canvas.width * line.x
    const metrics = line.fixedBaseline ? terminalBaselineMetrics : textMetrics[index]
    const textBaseline = lineCenter + (
      metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent
    ) / 2

    context.save()
    context.translate(textAnchorX, lineCenter)
    context.scale(horizontalScale, scaleY)
    context.translate(-textAnchorX, -lineCenter)
    context.textAlign = line.align
    context.fillText(line.text, textAnchorX, textBaseline)
    context.restore()
  })

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.NoColorSpace
  texture.generateMipmaps = false
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  return texture
}

function disposeFieldResources() {
  geometry?.dispose()
  material?.dispose()
  nameMaskTexture?.dispose()
  leadingLetterMaskTexture?.dispose()
  titleMaskTexture?.dispose()
  logoMaskTexture?.dispose()
  statusMaskTexture?.dispose()
  cursorMaskTexture?.dispose()
  emptyMaskTexture?.dispose()
  renderer?.dispose()

  geometry = null
  material = null
  nameMaskTexture = null
  leadingLetterMaskTexture = null
  titleMaskTexture = null
  logoMaskTexture = null
  statusMaskTexture = null
  cursorMaskTexture = null
  emptyMaskTexture = null
  gridMesh = null
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

function createCursorMaskTexture(gridRows, layout, terminalInput) {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024

  const context = canvas.getContext('2d')
  if (!context) return null

  context.font = `500 ${TERMINAL_FONT_SIZE}px ui-monospace`
  const activeInput = terminalInput.lines[terminalInput.activeLine] ?? '> '
  const inputWidth = context.measureText(activeInput).width
  const cursorHeight = TERMINAL_FONT_SIZE * 0.72
  const cursorWidth = Math.max(
    (canvas.width / HOME_DOT_MATRIX_CONFIG.columns) * 0.8,
    TERMINAL_FONT_SIZE * 0.14
  )
  const cursorX = canvas.width * layout.contentLeft + inputWidth + cursorWidth * 0.75
  const cursorY = canvas.height * resolveTerminalLineCenter(layout, terminalInput.activeLine) - cursorHeight / 2

  context.fillRect(cursorX, cursorY, cursorWidth, cursorHeight)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.NoColorSpace
  texture.generateMipmaps = false
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  return texture
}

function createTitleMaskTexture(gridRows, layout, terminalInput) {
  return createTextMaskTexture(
    [
      { text: 'IDENTITY', center: 1024 * layout.headerCenter, align: 'left', x: layout.contentLeft },
      { text: 'RUNNING', center: 1024 * layout.headerCenter, align: 'right', x: layout.contentRight },
      ...terminalInput.lines.map((text, index) => ({
        text,
        center: 1024 * resolveTerminalLineCenter(layout, index),
        align: 'left',
        x: layout.contentLeft,
        fixedBaseline: true
      })),
      { text: 'Model: My Brain High', center: 1024 * layout.modelLineCenter, align: 'right', x: layout.contentRight }
    ],
    TERMINAL_FONT_SIZE,
    0,
    0.72,
    'ui-monospace',
    500,
    [layout.top, layout.bottom],
    gridRows,
    layout
  )
}

function createGridGeometry(columns, rows) {
  const baseGeometry = new THREE.PlaneGeometry(1, 1)
  const nextGeometry = new THREE.InstancedBufferGeometry().copy(baseGeometry)
  const cellCoordinates = new Float32Array(columns * rows * 2)

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const offset = (row * columns + column) * 2
      cellCoordinates[offset] = column
      cellCoordinates[offset + 1] = row
    }
  }

  nextGeometry.setAttribute(
    'cellCoordinate',
    new THREE.InstancedBufferAttribute(cellCoordinates, 2)
  )
  nextGeometry.instanceCount = columns * rows
  baseGeometry.dispose()
  return nextGeometry
}

function updateGridGeometry(columns, rows) {
  if (!gridMesh || gridRows === rows) return

  const nextGeometry = createGridGeometry(columns, rows)
  const previousGeometry = geometry
  geometry = nextGeometry
  gridMesh.geometry = nextGeometry
  gridRows = rows
  previousGeometry?.dispose()
}

function updateLayout() {
  if (!renderer || !fieldRoot.value || !material) return

  const rect = fieldRoot.value.getBoundingClientRect()
  const width = Math.max(1, rect.width)
  const height = Math.max(1, rect.height)

  renderer.setSize(width, height, false)
  const resolvedGridRows = resolveDotMatrixRows(width, height)
  const fieldAspect = width / height
  terminalLayout = resolveTerminalLayout(fieldAspect)
  material.uniforms.gridResolution.value.set(HOME_DOT_MATRIX_CONFIG.columns, resolvedGridRows)
  material.uniforms.fieldAspect.value = fieldAspect
  updateGridGeometry(HOME_DOT_MATRIX_CONFIG.columns, resolvedGridRows)

  if (titleMaskRows !== resolvedGridRows || Math.abs(titleMaskAspect - fieldAspect) > 0.001) {
    statusMaskTexture?.dispose()
    statusMaskTexture = createStatusMaskTexture(resolvedGridRows, terminalLayout)
    material.uniforms.statusMaskTexture.value = statusMaskTexture
    titleMaskRows = resolvedGridRows
    titleMaskAspect = fieldAspect
    rebuildTerminalMasks()
  }

  drawLogoMask(terminalLayout, fieldAspect)

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
    geometry = createGridGeometry(HOME_DOT_MATRIX_CONFIG.columns, 1)
    gridRows = 1
    emptyMaskTexture = createEmptyMaskTexture()
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
        logoColor: { value: new THREE.Color(readToken('--primary')) },
        statusColor: { value: new THREE.Color(readToken('--blue')) },
        nameMaskTexture: { value: emptyMaskTexture },
        leadingLetterMaskTexture: { value: emptyMaskTexture },
        titleMaskTexture: { value: emptyMaskTexture },
        logoMaskTexture: { value: emptyMaskTexture },
        statusMaskTexture: { value: emptyMaskTexture },
        cursorMaskTexture: { value: emptyMaskTexture },
        dotSize: { value: HOME_DOT_MATRIX_CONFIG.dotSize },
        gap: { value: HOME_DOT_MATRIX_CONFIG.gap },
        scatterProgress: { value: props.scatterProgress },
        statusPulse: { value: 1 },
        cursorPulse: { value: 1 },
        fieldAspect: { value: 1 }
      },
      vertexShader: `
      attribute vec2 cellCoordinate;

      uniform vec2 gridResolution;
      uniform float scatterProgress;
      uniform float fieldAspect;

      varying vec2 vUv;
      varying vec2 vCellUv;

      float hash(vec2 value) {
        return fract(sin(dot(value, vec2(127.1, 311.7))) * 43758.5453123);
      }

      void main() {
        vUv = uv;
        vCellUv = (cellCoordinate + 0.5) / gridResolution;

        vec2 basePosition = vCellUv * 2.0 - 1.0;
        vec2 radial = vec2((vCellUv.x - 0.5) * fieldAspect, vCellUv.y - 0.5);
        float radialLength = length(radial);
        float fallbackAngle = hash(cellCoordinate) * 6.28318530718;
        vec2 direction = radialLength > 0.001
          ? radial / radialLength
          : vec2(cos(fallbackAngle), sin(fallbackAngle));
        direction.x /= fieldAspect;

        float easedProgress = scatterProgress * scatterProgress * (3.0 - 2.0 * scatterProgress);
        float travelDistance = mix(2.35, 2.9, hash(cellCoordinate + 17.0));
        vec2 scatteredPosition = basePosition + direction * travelDistance * easedProgress;
        vec2 cellSize = 2.0 / gridResolution;
        vec2 localPosition = position.xy * cellSize;

        gl_Position = vec4(scatteredPosition + localPosition, 0.0, 1.0);
      }
    `,
      fragmentShader: `
      uniform vec3 backgroundColor;
      uniform vec3 dotColor;
      uniform vec3 nameColor;
      uniform vec3 leadingLetterColor;
      uniform vec3 titleColor;
      uniform vec3 logoColor;
      uniform vec3 statusColor;
      uniform sampler2D nameMaskTexture;
      uniform sampler2D leadingLetterMaskTexture;
      uniform sampler2D titleMaskTexture;
      uniform sampler2D logoMaskTexture;
      uniform sampler2D statusMaskTexture;
      uniform sampler2D cursorMaskTexture;
      uniform float dotSize;
      uniform float gap;
      uniform float statusPulse;
      uniform float cursorPulse;

      varying vec2 vUv;
      varying vec2 vCellUv;

      void main() {
        vec2 sampleUv = vCellUv;
        vec2 cellUv = vUv - 0.5;
        float resolvedDotSize = min(dotSize, 1.0 - gap);
        bool isDot = max(abs(cellUv.x), abs(cellUv.y)) <= resolvedDotSize * 0.5;
        float nameMask = texture2D(nameMaskTexture, sampleUv).a;
        float leadingLetterMask = texture2D(leadingLetterMaskTexture, sampleUv).a;
        float titleMask = texture2D(titleMaskTexture, sampleUv).a;
        float logoMask = texture2D(logoMaskTexture, sampleUv).a;
        float statusMask = texture2D(statusMaskTexture, sampleUv).a;
        float cursorMask = texture2D(cursorMaskTexture, sampleUv).a;
        float nameCell = step(0.1, nameMask);
        float leadingLetterCell = step(0.1, leadingLetterMask);
        float titleCell = step(0.1, titleMask);
        float logoCell = step(0.1, logoMask);
        float statusThreshold = 1.0 - statusPulse;
        float statusCell = step(0.01, statusMask)
          * smoothstep(statusThreshold - 0.05, statusThreshold + 0.05, statusMask);
        float cursorCell = step(0.1, cursorMask) * cursorPulse;
        vec3 resolvedDotColor = mix(dotColor, nameColor, nameCell);
        resolvedDotColor = mix(resolvedDotColor, leadingLetterColor, leadingLetterCell);
        resolvedDotColor = mix(resolvedDotColor, titleColor, titleCell);
        resolvedDotColor = mix(resolvedDotColor, logoColor, logoCell);
        resolvedDotColor = mix(resolvedDotColor, statusColor, statusCell);
        resolvedDotColor = mix(resolvedDotColor, titleColor, cursorCell);

        gl_FragColor = vec4(isDot ? resolvedDotColor : backgroundColor, 1.0);
      }
      `
    })
    await waitForDisplayFont()
    nameMaskTexture = createTextMaskTexture('JACORY', 670, 1024 * 0.32, 1)
    leadingLetterMaskTexture = createLeadingLetterMaskTexture('JACORY', 'J', 670, 1024 * 0.32, 1)
    material.uniforms.nameMaskTexture.value = nameMaskTexture
    material.uniforms.leadingLetterMaskTexture.value = leadingLetterMaskTexture
    logoImage = await loadLogoImage().catch(() => null)
    if (logoImage) {
      logoMaskTexture = createLogoMaskTexture()
      material.uniforms.logoMaskTexture.value = logoMaskTexture
    }
    gridMesh = new THREE.Mesh(geometry, material)
    scene.add(gridMesh)

    updateLayout()
    await prepareInitialFrame()
    statusMotionQuery = window.matchMedia('(prefers-reduced-motion: no-preference)')
    statusMotionQuery.addEventListener('change', updateStatusMotion)
    statusVisibilityObserver = new IntersectionObserver(([entry]) => {
      statusVisible = entry.isIntersecting
      updateStatusMotion()
    })
    statusVisibilityObserver.observe(fieldRoot.value)
    updateStatusMotion()
  } catch (error) {
    console.error('[HomeDotMatrixField] Failed to initialize the dot-matrix field.', error)
    disposeFieldResources()
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
  statusVisibilityObserver?.disconnect()
  statusMotionQuery?.removeEventListener('change', updateStatusMotion)
  if (resizeFrame) window.cancelAnimationFrame(resizeFrame)
  if (statusPulseFrame) window.cancelAnimationFrame(statusPulseFrame)
  disposeFieldResources()
  titleMaskRows = 0
  titleMaskAspect = 0
  gridRows = 0
  terminalLayout = null
  terminalTypeStep = -1
})
</script>
