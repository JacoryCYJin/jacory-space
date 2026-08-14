<template>
  <div
    ref="sceneRoot"
    class="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    aria-hidden="true"
  >
    <canvas ref="baseCanvasEl" class="absolute inset-0 block h-full w-full" />
    <canvas
      ref="ballCanvasEl"
      class="absolute inset-0 block h-full w-full"
      :class="isBallForeground ? 'z-20' : 'z-[5]'"
    />
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { baseballAsciiArt } from './homeBallAsciiArt'
import { batAsciiArt } from './homeBatAsciiArt'

gsap.registerPlugin(ScrollTrigger)

const sceneRoot = ref(null)
const baseCanvasEl = ref(null)
const ballCanvasEl = ref(null)
const isBallForeground = ref(false)

const SCENE_LAYER = 0
const BALL_MASK_LAYER = 1

const SCENE_CONFIG = {
  cameraFov: 32,
  cameraZ: 6,
  sphereRadius: 0.56,
  sphereSegments: 64,
  compositionOffsetY: -0.2,
  batScale: 5,
  batImpactScaleMultiplier: 1.03,
  batImpactScaleStart: 0.68,
  batCenterOffset: 0.96,
  batImpactContactOffset: 0.42,
  batImpactOffsetX: 0.92,
  batImpactOffsetY: 0.12,
  batRevealAngle: THREE.MathUtils.degToRad(-155),
  batImpactAngle: THREE.MathUtils.degToRad(-140),
  navbarHeight: 64,
  pinScrollMultiplier: 2.2,
  pixelRatioCap: 2,
  phase: {
    sphereStillEnd: 0.18,
    batRevealEnd: 0.35,
    impactStart: 0.35,
    impactEnd: 0.48,
    flightStart: 0.48,
    flightEnd: 0.88,
    takeoverEnd: 1
  }
}

const DOT_MATRIX_CONFIG = {
  columns: 280,
  rowDensity: 1,
  threshold: 0.12,
  contrast: 1.22,
  dotSize: 0.76,
  gap: 0.1,
  minOpacity: 0.16,
  maxOpacity: 0.92
}

const BALL_ASCII_ART_CONFIG = {
  columns: 100,
  rows: 55,
  terminalCellAspect: 0.56,
  planeScale: 1.08,
  planeOffset: 0.016,
  subjectThreshold: 0.46,
  subjectPadding: 1
}

const BAT_ASCII_ART_CONFIG = {
  columns: 100,
  rows: 55,
  terminalCellAspect: 0.56,
  planeSize: 1.42,
  planeOffset: 0.14
}

const ASCII_ART_DENSITY = {
  ' ': 0,
  '.': 0.13,
  ':': 0.22,
  '-': 0.33,
  '=': 0.46,
  '+': 0.59,
  '*': 0.72,
  '#': 0.86,
  '%': 1,
  '@': 1
}

let baseRenderer
let ballRenderer
let scene
let camera
let baseMatrixOutput
let ballMatrixOutput
let sphereGroup
let batPivot
let bat
let sphereMaterial
let batMaterial
let asciiArtTexture
let asciiArtGeometry
let asciiArtMaterial
let batAsciiArtTexture
let batAsciiArtGeometry
let batAsciiArtMaterial
let environmentTexture
let ballMaskGeometry
let ballMaskMaterial
let renderFrame = 0
let resizeFrame = 0
let resizeObserver
let motionMedia
let sceneContext
let progressTimeline
let progressState
let sceneSection

const layout = {
  width: 1,
  height: 1,
  aspect: 1,
  startSphere: new THREE.Vector3(),
  finalSphere: new THREE.Vector3(),
  startBatPivot: new THREE.Vector3(),
  batArcControl: new THREE.Vector3(),
  batImpactPivot: new THREE.Vector3(),
  batImpactDirection: new THREE.Vector3(),
  scaledBatImpactPivot: new THREE.Vector3(),
  finalSphereDistance: 1
}

function readToken(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function clamp01(value) {
  return THREE.MathUtils.clamp(value, 0, 1)
}

function smoothStep(value) {
  const progress = clamp01(value)
  return progress * progress * (3 - 2 * progress)
}

function phaseProgress(value, start, end) {
  return smoothStep((value - start) / (end - start))
}

function lerp(a, b, progress) {
  return a + (b - a) * progress
}

function setQuadraticBezier(target, start, control, end, progress) {
  const inverse = 1 - progress
  const startWeight = inverse * inverse
  const controlWeight = 2 * inverse * progress
  const endWeight = progress * progress

  target.set(
    start.x * startWeight + control.x * controlWeight + end.x * endWeight,
    start.y * startWeight + control.y * controlWeight + end.y * endWeight,
    start.z * startWeight + control.z * controlWeight + end.z * endWeight
  )
}

function createBatGeometry() {
  const points = [
    new THREE.Vector2(0, -0.96),
    new THREE.Vector2(0.045, -0.96),
    new THREE.Vector2(0.065, -0.93),
    new THREE.Vector2(0.07, -0.8),
    new THREE.Vector2(0.072, -0.38),
    new THREE.Vector2(0.078, 0.18),
    new THREE.Vector2(0.095, 0.55),
    new THREE.Vector2(0.115, 0.75),
    new THREE.Vector2(0.118, 0.84),
    new THREE.Vector2(0.11, 0.91),
    new THREE.Vector2(0.08, 0.95),
    new THREE.Vector2(0.04, 0.97),
    new THREE.Vector2(0, 0.97)
  ]

  return new THREE.LatheGeometry(points, 64)
}

function createBallSubjectMask(densityValues, config) {
  const { columns, rows, subjectPadding, subjectThreshold } = config
  const cellCount = columns * rows
  const visited = new Uint8Array(cellCount)
  let largestComponent = []

  for (let index = 0; index < cellCount; index += 1) {
    if (visited[index] || densityValues[index] < subjectThreshold) continue

    const component = []
    const queue = [index]
    visited[index] = 1

    while (queue.length) {
      const current = queue.pop()
      const row = Math.floor(current / columns)
      const column = current % columns
      component.push(current)

      for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
        for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
          const nextRow = row + rowOffset
          const nextColumn = column + columnOffset

          if (
            nextRow < 0 || nextRow >= rows || nextColumn < 0 || nextColumn >= columns
          ) continue

          const next = nextRow * columns + nextColumn
          if (visited[next] || densityValues[next] < subjectThreshold) continue

          visited[next] = 1
          queue.push(next)
        }
      }
    }

    if (component.length > largestComponent.length) largestComponent = component
  }

  let mask = new Uint8Array(cellCount)
  largestComponent.forEach((index) => {
    mask[index] = 1
  })

  for (let step = 0; step < subjectPadding; step += 1) {
    const expandedMask = mask.slice()

    for (let index = 0; index < cellCount; index += 1) {
      if (!mask[index]) continue

      const row = Math.floor(index / columns)
      const column = index % columns

      for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
        for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
          const nextRow = row + rowOffset
          const nextColumn = column + columnOffset

          if (
            nextRow >= 0 && nextRow < rows && nextColumn >= 0 && nextColumn < columns
          ) expandedMask[nextRow * columns + nextColumn] = 1
        }
      }
    }

    mask = expandedMask
  }

  const exterior = new Uint8Array(cellCount)
  const exteriorQueue = []
  const enqueueExterior = (index) => {
    if (mask[index] || exterior[index]) return
    exterior[index] = 1
    exteriorQueue.push(index)
  }

  for (let column = 0; column < columns; column += 1) {
    enqueueExterior(column)
    enqueueExterior((rows - 1) * columns + column)
  }

  for (let row = 1; row < rows - 1; row += 1) {
    enqueueExterior(row * columns)
    enqueueExterior(row * columns + columns - 1)
  }

  while (exteriorQueue.length) {
    const current = exteriorQueue.pop()
    const row = Math.floor(current / columns)
    const column = current % columns

    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
      for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
        const nextRow = row + rowOffset
        const nextColumn = column + columnOffset

        if (
          nextRow < 0 || nextRow >= rows || nextColumn < 0 || nextColumn >= columns
        ) continue

        enqueueExterior(nextRow * columns + nextColumn)
      }
    }
  }

  for (let index = 0; index < cellCount; index += 1) {
    if (!exterior[index]) mask[index] = 1
  }

  return mask
}

function createAsciiArtTexture(source, config, useSubjectMask = false) {
  const rows = source.replaceAll('\r', '').split('\n').filter((line, index, lines) => (
    index < lines.length - 1 || line.length > 0
  ))
  const data = new Uint8Array(config.columns * config.rows * 4)
  const densityValues = new Float32Array(config.columns * config.rows)

  for (let row = 0; row < config.rows; row += 1) {
    const sourceRow = (rows[row] ?? '').padEnd(config.columns, ' ')

    for (let column = 0; column < config.columns; column += 1) {
      const density = ASCII_ART_DENSITY[sourceRow[column]] ?? 0
      const offset = (row * config.columns + column) * 4
      const channel = Math.round(density * 255)

      densityValues[row * config.columns + column] = density
      data[offset] = channel
      data[offset + 1] = channel
      data[offset + 2] = channel
    }
  }

  const subjectMask = useSubjectMask ? createBallSubjectMask(densityValues, config) : null

  for (let index = 0; index < densityValues.length; index += 1) {
    data[index * 4 + 3] = subjectMask ? subjectMask[index] * 255 : (densityValues[index] > 0 ? 255 : 0)
  }

  const texture = new THREE.DataTexture(
    data,
    config.columns,
    config.rows,
    THREE.RGBAFormat,
    THREE.UnsignedByteType
  )
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  texture.generateMipmaps = false
  texture.colorSpace = THREE.NoColorSpace
  texture.needsUpdate = true

  return texture
}

function createAsciiArtMaterial(texture) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthTest: true,
    depthWrite: true,
    toneMapped: false,
    uniforms: {
      artTexture: { value: texture },
      visibility: { value: 1 }
    },
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D artTexture;
      uniform float visibility;

      varying vec2 vUv;

      void main() {
        if (visibility < 0.01) discard;

        vec4 art = texture2D(artTexture, vec2(vUv.x, 1.0 - vUv.y));

        if (art.a < 0.01) discard;

        gl_FragColor = vec4(vec3(art.r), art.a * visibility);
      }
    `
  })
}

function createAsciiArtLayer() {
  asciiArtTexture = createAsciiArtTexture(baseballAsciiArt, BALL_ASCII_ART_CONFIG, true)

  const artAspect = (
    BALL_ASCII_ART_CONFIG.columns * BALL_ASCII_ART_CONFIG.terminalCellAspect
  ) / BALL_ASCII_ART_CONFIG.rows
  const artHeight = SCENE_CONFIG.sphereRadius * 2 * BALL_ASCII_ART_CONFIG.planeScale
  const artWidth = artHeight * artAspect

  asciiArtGeometry = new THREE.PlaneGeometry(artWidth, artHeight)
  asciiArtMaterial = createAsciiArtMaterial(asciiArtTexture)

  const artLayer = new THREE.Mesh(asciiArtGeometry, asciiArtMaterial)
  artLayer.position.z = SCENE_CONFIG.sphereRadius + BALL_ASCII_ART_CONFIG.planeOffset
  artLayer.renderOrder = 1

  return artLayer
}

function createBatAsciiArtLayer() {
  batAsciiArtTexture = createAsciiArtTexture(batAsciiArt, BAT_ASCII_ART_CONFIG, false)

  const artAspect = (
    BAT_ASCII_ART_CONFIG.columns * BAT_ASCII_ART_CONFIG.terminalCellAspect
  ) / BAT_ASCII_ART_CONFIG.rows
  const artHeight = BAT_ASCII_ART_CONFIG.planeSize
  const artWidth = artHeight * artAspect

  batAsciiArtGeometry = new THREE.PlaneGeometry(artWidth, artHeight)
  batAsciiArtMaterial = createAsciiArtMaterial(batAsciiArtTexture)

  const artLayer = new THREE.Mesh(batAsciiArtGeometry, batAsciiArtMaterial)
  artLayer.position.z = BAT_ASCII_ART_CONFIG.planeOffset
  artLayer.rotation.z = Math.PI / 4
  artLayer.renderOrder = 1

  return artLayer
}

function paintSoftReflection(context, x, y, radiusX, radiusY, color, opacity) {
  context.save()
  context.translate(x, y)
  context.scale(1, radiusY / radiusX)

  const reflection = context.createRadialGradient(0, 0, 0, 0, 0, radiusX)
  reflection.addColorStop(0, `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`)
  reflection.addColorStop(0.42, `${color}${Math.round(opacity * 0.42 * 255).toString(16).padStart(2, '0')}`)
  reflection.addColorStop(1, `${color}00`)

  context.fillStyle = reflection
  context.fillRect(-radiusX, -radiusX, radiusX * 2, radiusX * 2)
  context.restore()
}

function createEnvironment() {
  const environmentCanvas = document.createElement('canvas')
  environmentCanvas.width = 2048
  environmentCanvas.height = 1024

  const context = environmentCanvas.getContext('2d')
  if (!context) return

  const cardColor = readToken('--card')
  const backgroundColor = readToken('--background')
  const lineColor = readToken('--line-strong')
  const inkColor = readToken('--foreground')
  const baseGradient = context.createLinearGradient(0, 0, 0, environmentCanvas.height)
  baseGradient.addColorStop(0, cardColor)
  baseGradient.addColorStop(0.32, backgroundColor)
  baseGradient.addColorStop(0.62, lineColor)
  baseGradient.addColorStop(1, inkColor)
  context.fillStyle = baseGradient
  context.fillRect(0, 0, environmentCanvas.width, environmentCanvas.height)

  paintSoftReflection(context, 450, 210, 760, 190, cardColor, 0.98)
  paintSoftReflection(context, 1470, 350, 680, 150, cardColor, 0.72)
  paintSoftReflection(context, 1030, 790, 980, 220, inkColor, 0.38)
  paintSoftReflection(context, 90, 650, 520, 280, lineColor, 0.48)

  environmentTexture = new THREE.CanvasTexture(environmentCanvas)
  environmentTexture.colorSpace = THREE.SRGBColorSpace
  environmentTexture.mapping = THREE.EquirectangularReflectionMapping
  scene.environment = environmentTexture
}

function createDotMatrixOutput(splitMode) {
  const sourceRenderTarget = new THREE.WebGLRenderTarget(1, 1, {
    depthBuffer: true,
    stencilBuffer: false,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    magFilter: THREE.NearestFilter,
    minFilter: THREE.NearestFilter
  })
  sourceRenderTarget.texture.generateMipmaps = false

  const ballMaskRenderTarget = new THREE.WebGLRenderTarget(1, 1, {
    depthBuffer: false,
    stencilBuffer: false,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    magFilter: THREE.NearestFilter,
    minFilter: THREE.NearestFilter
  })
  ballMaskRenderTarget.texture.generateMipmaps = false

  const matrixScene = new THREE.Scene()
  const matrixCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  matrixCamera.position.z = 1
  const matrixGeometry = new THREE.PlaneGeometry(2, 2)
  const matrixMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      sourceTexture: { value: sourceRenderTarget.texture },
      ballMaskTexture: { value: ballMaskRenderTarget.texture },
      gridResolution: { value: new THREE.Vector2(1, 1) },
      dotColor: { value: new THREE.Color(readToken('--foreground')) },
      threshold: { value: DOT_MATRIX_CONFIG.threshold },
      contrast: { value: DOT_MATRIX_CONFIG.contrast },
      dotSize: { value: DOT_MATRIX_CONFIG.dotSize },
      gap: { value: DOT_MATRIX_CONFIG.gap },
      minOpacity: { value: DOT_MATRIX_CONFIG.minOpacity },
      maxOpacity: { value: DOT_MATRIX_CONFIG.maxOpacity },
      splitMode: { value: splitMode }
    },
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D sourceTexture;
      uniform sampler2D ballMaskTexture;
      uniform vec2 gridResolution;
      uniform vec3 dotColor;
      uniform float threshold;
      uniform float contrast;
      uniform float dotSize;
      uniform float gap;
      uniform float minOpacity;
      uniform float maxOpacity;
      uniform float splitMode;

      varying vec2 vUv;

      void main() {
        vec2 gridCell = floor(vUv * gridResolution);
        vec2 sampleUv = (gridCell + 0.5) / gridResolution;
        vec4 source = texture2D(sourceTexture, sampleUv);
        float ballMask = texture2D(ballMaskTexture, sampleUv).a;

        if (splitMode < 0.5 && ballMask > 0.5) discard;
        if (splitMode > 0.5 && ballMask <= 0.5) discard;

        if (source.a < 0.015) discard;

        float brightness = dot(source.rgb, vec3(0.2126, 0.7152, 0.0722));
        brightness = clamp((brightness - 0.5) * contrast + 0.5, 0.0, 1.0);
        float intensity = clamp((brightness - threshold) / max(0.0001, 1.0 - threshold), 0.0, 1.0);

        if (intensity <= 0.0) discard;

        vec2 cellUv = fract(vUv * gridResolution) - 0.5;
        float resolvedDotSize = min(dotSize, 1.0 - gap);

        if (max(abs(cellUv.x), abs(cellUv.y)) > resolvedDotSize * 0.5) discard;

        float opacity = mix(minOpacity, maxOpacity, intensity) * source.a;
        gl_FragColor = vec4(dotColor, opacity);
      }
    `
  })

  matrixScene.add(new THREE.Mesh(matrixGeometry, matrixMaterial))

  return {
    sourceRenderTarget,
    ballMaskRenderTarget,
    matrixScene,
    matrixCamera,
    matrixGeometry,
    matrixMaterial
  }
}

function createRenderer(canvas) {
  const nextRenderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  })

  nextRenderer.setPixelRatio(Math.min(window.devicePixelRatio, SCENE_CONFIG.pixelRatioCap))
  nextRenderer.outputColorSpace = THREE.SRGBColorSpace
  nextRenderer.toneMapping = THREE.ACESFilmicToneMapping
  nextRenderer.toneMappingExposure = 1.05
  nextRenderer.setClearColor(0x000000, 0)

  return nextRenderer
}

function createScene() {
  scene = new THREE.Scene()
  scene.background = null

  camera = new THREE.PerspectiveCamera(
    SCENE_CONFIG.cameraFov,
    1,
    0.05,
    100
  )
  camera.position.set(0, 0, SCENE_CONFIG.cameraZ)
  camera.lookAt(0, 0, 0)

  baseRenderer = createRenderer(baseCanvasEl.value)
  ballRenderer = createRenderer(ballCanvasEl.value)

  createEnvironment()

  const baseColor = new THREE.Color(readToken('--card'))
  const batColor = new THREE.Color(readToken('--line-strong'))

  sphereMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(readToken('--line-strong')).lerp(
      new THREE.Color(readToken('--foreground')),
      0.48
    ),
    metalness: 0.08,
    roughness: 0.38,
    envMapIntensity: 0.48
  })

  batMaterial = new THREE.MeshPhysicalMaterial({
    color: batColor,
    metalness: 1,
    roughness: 0.12,
    clearcoat: 0.36,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.5
  })

  sphereGroup = new THREE.Group()
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(
      SCENE_CONFIG.sphereRadius,
      SCENE_CONFIG.sphereSegments,
      SCENE_CONFIG.sphereSegments
    ),
    sphereMaterial
  )
  sphereGroup.add(sphere)
  sphereGroup.add(createAsciiArtLayer())

  ballMaskGeometry = new THREE.SphereGeometry(
    SCENE_CONFIG.sphereRadius,
    SCENE_CONFIG.sphereSegments,
    SCENE_CONFIG.sphereSegments
  )
  ballMaskMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    toneMapped: false
  })
  const ballMask = new THREE.Mesh(ballMaskGeometry, ballMaskMaterial)
  ballMask.layers.set(BALL_MASK_LAYER)
  sphereGroup.add(ballMask)
  scene.add(sphereGroup)

  batPivot = new THREE.Group()
  bat = new THREE.Mesh(createBatGeometry(), batMaterial)
  bat.rotation.z = -Math.PI / 2
  bat.scale.setScalar(SCENE_CONFIG.batScale)
  bat.position.x = SCENE_CONFIG.batCenterOffset * SCENE_CONFIG.batScale
  bat.visible = false
  bat.add(createBatAsciiArtLayer())
  batPivot.add(bat)
  scene.add(batPivot)

  const keyLight = new THREE.DirectionalLight(baseColor, 1.15)
  keyLight.position.set(-2, 3, 5)
  scene.add(keyLight)

  const fillLight = new THREE.DirectionalLight(new THREE.Color(readToken('--line-strong')), 0.48)
  fillLight.position.set(4, -1, 2)
  scene.add(fillLight)

  baseMatrixOutput = createDotMatrixOutput(0)
  ballMatrixOutput = createDotMatrixOutput(1)

  progressState = { value: 0 }
  applySceneProgress(0)
}

function resizeMatrixOutput(matrixOutput, rows) {
  if (!matrixOutput) return

  matrixOutput.sourceRenderTarget.setSize(DOT_MATRIX_CONFIG.columns, rows)
  matrixOutput.ballMaskRenderTarget.setSize(DOT_MATRIX_CONFIG.columns, rows)
  matrixOutput.matrixMaterial.uniforms.gridResolution.value.set(DOT_MATRIX_CONFIG.columns, rows)
}

function updateLayout() {
  if (!baseRenderer || !ballRenderer || !camera || !sceneRoot.value) return

  const rect = sceneRoot.value.getBoundingClientRect()
  layout.width = Math.max(1, rect.width)
  layout.height = Math.max(1, rect.height)
  layout.aspect = layout.width / layout.height

  camera.aspect = layout.aspect
  camera.updateProjectionMatrix()
  baseRenderer.setSize(layout.width, layout.height, false)
  ballRenderer.setSize(layout.width, layout.height, false)

  const rows = Math.max(
    1,
    Math.round((DOT_MATRIX_CONFIG.columns / layout.aspect) * DOT_MATRIX_CONFIG.rowDensity)
  )
  resizeMatrixOutput(baseMatrixOutput, rows)
  resizeMatrixOutput(ballMatrixOutput, rows)

  const halfHeightAtStart = Math.tan(THREE.MathUtils.degToRad(SCENE_CONFIG.cameraFov / 2)) * SCENE_CONFIG.cameraZ
  const halfWidthAtStart = halfHeightAtStart * layout.aspect
  const startX = 0
  const startY = SCENE_CONFIG.compositionOffsetY
  layout.startSphere.set(startX, startY, 0)

  const halfFov = THREE.MathUtils.degToRad(SCENE_CONFIG.cameraFov / 2)
  const cornerAngle = Math.atan(Math.hypot(Math.tan(halfFov) * layout.aspect, Math.tan(halfFov)))
  layout.finalSphereDistance = Math.max(
    SCENE_CONFIG.sphereRadius * 1.12,
    (SCENE_CONFIG.sphereRadius / Math.sin(cornerAngle)) * 0.9
  )
  layout.finalSphere.set(
    0,
    0,
    SCENE_CONFIG.cameraZ - layout.finalSphereDistance
  )

  const batCenterOffset = SCENE_CONFIG.batCenterOffset * SCENE_CONFIG.batScale
  const batImpactOffset = (
    SCENE_CONFIG.batCenterOffset + SCENE_CONFIG.batImpactContactOffset
  ) * SCENE_CONFIG.batScale
  const revealDirectionX = Math.cos(SCENE_CONFIG.batRevealAngle)
  const revealDirectionY = Math.sin(SCENE_CONFIG.batRevealAngle)
  const impactDirectionX = Math.cos(SCENE_CONFIG.batImpactAngle)
  const impactDirectionY = Math.sin(SCENE_CONFIG.batImpactAngle)
  layout.batImpactDirection.set(impactDirectionX, impactDirectionY, 0)

  layout.startBatPivot.set(
    startX - batCenterOffset * revealDirectionX,
    startY - batCenterOffset * revealDirectionY,
    -14
  )
  layout.batArcControl.set(startX + 1.1, startY + 0.76, -2.4)
  layout.batImpactPivot.set(
    startX + SCENE_CONFIG.sphereRadius * SCENE_CONFIG.batImpactOffsetX - batImpactOffset * impactDirectionX,
    startY + SCENE_CONFIG.batImpactOffsetY - batImpactOffset * impactDirectionY,
    -0.2
  )

  applySceneProgress(progressState?.value ?? 0)
}

function applySceneProgress(value) {
  if (!sphereGroup || !batPivot) return

  const progress = clamp01(value)
  const {
    sphereStillEnd,
    impactStart,
    impactEnd,
    flightStart,
    flightEnd
  } = SCENE_CONFIG.phase

  const batArcWindow = impactStart + 0.08 - sphereStillEnd
  const batArcProgress = clamp01((progress - sphereStillEnd) / batArcWindow)
  const batArc = batArcProgress * batArcProgress
  const batImpactScaleProgress = smoothStep(
    (batArcProgress - SCENE_CONFIG.batImpactScaleStart)
      / (1 - SCENE_CONFIG.batImpactScaleStart)
  )
  const batScale = lerp(
    SCENE_CONFIG.batScale,
    SCENE_CONFIG.batScale * SCENE_CONFIG.batImpactScaleMultiplier,
    batImpactScaleProgress
  )
  const batImpactScaleDifference = (
    SCENE_CONFIG.batCenterOffset + SCENE_CONFIG.batImpactContactOffset
  ) * (batScale - SCENE_CONFIG.batScale)
  const batAngle = lerp(
    SCENE_CONFIG.batRevealAngle,
    SCENE_CONFIG.batImpactAngle,
    smoothStep(batArcProgress)
  )
  const impact = phaseProgress(progress, impactStart, impactEnd)
  const flight = phaseProgress(progress, flightStart, flightEnd)

  isBallForeground.value = flight > 0.1

  bat.visible = batArcProgress > 0.025
  bat.scale.setScalar(batScale)
  bat.position.x = SCENE_CONFIG.batCenterOffset * batScale
  layout.scaledBatImpactPivot
    .copy(layout.batImpactPivot)
    .addScaledVector(layout.batImpactDirection, -batImpactScaleDifference)
  setQuadraticBezier(
    batPivot.position,
    layout.startBatPivot,
    layout.batArcControl,
    layout.scaledBatImpactPivot,
    batArc
  )
  batPivot.rotation.set(0, 0, batAngle)
  batPivot.position.z = lerp(batPivot.position.z, -1.65, flight)

  const flightEase = smoothStep(flight)
  const artRelease = phaseProgress(progress, SCENE_CONFIG.phase.flightEnd, SCENE_CONFIG.phase.takeoverEnd)

  if (asciiArtMaterial) {
    asciiArtMaterial.uniforms.visibility.value = 1 - artRelease
  }

  sphereGroup.position.set(
    lerp(layout.startSphere.x, layout.finalSphere.x, flightEase),
    lerp(layout.startSphere.y, layout.finalSphere.y, flightEase),
    lerp(layout.startSphere.z, layout.finalSphere.z, flightEase)
  )
  sphereGroup.position.z += impact * 0.08

  const squash = impact < 0.5 ? impact * 2 : (1 - impact) * 2
  sphereGroup.scale.set(
    1 - squash * 0.18,
    1 + squash * 0.12,
    1 - squash * 0.12
  )
}

function renderMatrixLayer(renderer, matrixOutput) {
  if (!renderer || !matrixOutput) return

  camera.layers.set(SCENE_LAYER)
  renderer.setRenderTarget(matrixOutput.sourceRenderTarget)
  renderer.clear()
  renderer.render(scene, camera)

  camera.layers.set(BALL_MASK_LAYER)
  renderer.setRenderTarget(matrixOutput.ballMaskRenderTarget)
  renderer.clear()
  renderer.render(scene, camera)

  camera.layers.set(SCENE_LAYER)
  renderer.setRenderTarget(null)
  renderer.clear()
  renderer.render(matrixOutput.matrixScene, matrixOutput.matrixCamera)
}

function renderScene() {
  if (!baseRenderer || !ballRenderer || !scene || !camera) return

  renderMatrixLayer(baseRenderer, baseMatrixOutput)
  renderMatrixLayer(ballRenderer, ballMatrixOutput)

  renderFrame = window.requestAnimationFrame(renderScene)
}

function scheduleResize() {
  if (resizeFrame) window.cancelAnimationFrame(resizeFrame)
  resizeFrame = window.requestAnimationFrame(() => {
    resizeFrame = 0
    updateLayout()
    ScrollTrigger.refresh()
  })
}

function createScrollScene() {
  if (!sceneSection || !progressState) return

  sceneContext = gsap.context(() => {
    progressTimeline = gsap.timeline({
      paused: true,
      scrollTrigger: {
        id: 'home-chrome-sphere',
        trigger: sceneSection,
        start: () => `top top+=${SCENE_CONFIG.navbarHeight}`,
        end: () => `+=${Math.max(sceneSection.offsetHeight * SCENE_CONFIG.pinScrollMultiplier, 1200)}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: updateLayout
      }
    })

    progressTimeline.to(progressState, {
      value: 1,
      duration: 1,
      ease: 'none',
      onUpdate: () => applySceneProgress(progressState.value)
    })
  }, sceneRoot.value)
}

function disposeMatrixOutput(matrixOutput) {
  if (!matrixOutput) return

  matrixOutput.sourceRenderTarget.dispose()
  matrixOutput.ballMaskRenderTarget.dispose()
  matrixOutput.matrixGeometry.dispose()
  matrixOutput.matrixMaterial.dispose()
}

function disposeScene() {
  if (!scene) return

  scene.traverse((object) => {
    object.geometry?.dispose()
    if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose())
    else object.material?.dispose()
  })
  environmentTexture?.dispose()
  environmentTexture = null
  disposeMatrixOutput(baseMatrixOutput)
  disposeMatrixOutput(ballMatrixOutput)
  baseMatrixOutput = null
  ballMatrixOutput = null
  asciiArtTexture?.dispose()
  asciiArtTexture = null
  asciiArtGeometry = null
  asciiArtMaterial = null
  batAsciiArtTexture?.dispose()
  batAsciiArtTexture = null
  batAsciiArtGeometry = null
  batAsciiArtMaterial = null
  ballMaskGeometry = null
  ballMaskMaterial = null
  baseRenderer?.dispose()
  baseRenderer = null
  ballRenderer?.dispose()
  ballRenderer = null
  scene = null
  camera = null
  sphereGroup = null
  batPivot = null
  bat = null
  sphereMaterial = null
  batMaterial = null
}

onMounted(async () => {
  await nextTick()
  if (!sceneRoot.value || !baseCanvasEl.value || !ballCanvasEl.value) return

  sceneSection = sceneRoot.value.parentElement
  createScene()
  updateLayout()
  renderScene()

  resizeObserver = new ResizeObserver(scheduleResize)
  resizeObserver.observe(sceneRoot.value)
  window.addEventListener('resize', scheduleResize)

  motionMedia = gsap.matchMedia()
  motionMedia.add('(prefers-reduced-motion: no-preference)', () => {
    createScrollScene()
    return () => {
      sceneContext?.revert()
      sceneContext = null
      progressTimeline = null
    }
  })

  motionMedia.add('(prefers-reduced-motion: reduce)', () => {
    applySceneProgress(0)
  })

  document.fonts?.ready?.then(() => {
    window.requestAnimationFrame(() => ScrollTrigger.refresh())
  })
})

onBeforeUnmount(() => {
  motionMedia?.revert()
  sceneContext?.revert()
  resizeObserver?.disconnect()
  window.removeEventListener('resize', scheduleResize)
  if (resizeFrame) window.cancelAnimationFrame(resizeFrame)
  if (renderFrame) window.cancelAnimationFrame(renderFrame)
  disposeScene()
})
</script>
