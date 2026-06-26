import * as THREE from 'three'
import { CustomEase } from 'gsap/CustomEase'
import {
  BASE_CONNECTOR_OPACITY,
  BASE_EDGE_OPACITY,
  BASE_MESH_OPACITY,
  BASE_SLAB_OPACITY,
  CAMERA_POSITION,
  CAMERA_TARGET,
  DRAFT_DEV_OPACITY,
  DRAFT_EXTENT,
  DRAFT_GHOST_OFFSET,
  DRAFT_OVER,
  HALF_X,
  HALF_Z,
  HISTORIC_TARGETS,
  LABEL_LIFT,
  LATTICE_STEP,
  LAYER_Y,
  MARKER_X_SCALE,
  NODE_TICK_OPACITY,
  RAIL_Z,
  SLAB_THICKNESS,
  SPATIAL_PROFILE,
  STEM_WIDTH,
  X_DIV,
  Z_DIV,
  stemHeightFor
} from './constants'

function getCssColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function colorToThree(name) {
  const style = getCssColor(name)
  return new THREE.Color(style)
}

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
    [[0, 0.32], [0.5, 1]],
    [[0.08, 0.72]],
    [[0, 0.22], [0.36, 0.58], [0.76, 1]],
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

function buildLayerPlane(colors, statics, layerId) {
  const group = new THREE.Group()
  const targetAnchors = []
  const add = (object, base) => {
    group.add(object)
    statics.push({ material: object.material, base })
  }

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

  const ly = -SLAB_THICKNESS
  const lower = [
    new THREE.Vector3(-HALF_X, ly, -HALF_Z),
    new THREE.Vector3(HALF_X, ly, -HALF_Z),
    new THREE.Vector3(HALF_X, ly, HALF_Z),
    new THREE.Vector3(-HALF_X, ly, HALF_Z)
  ]
  add(mergedSegments([
    [lower[0], lower[1]],
    [lower[1], lower[2]],
    [lower[2], lower[3]],
    [lower[3], lower[0]]
  ], colors.muted, BASE_SLAB_OPACITY), BASE_SLAB_OPACITY)

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
  add(mergedSegments(
    tops.map(([x, z]) => [new THREE.Vector3(x, 0, z), new THREE.Vector3(x, ly, z)]),
    colors.muted,
    BASE_CONNECTOR_OPACITY
  ), BASE_CONNECTOR_OPACITY)

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
    ;[
      [new THREE.Vector3(-HALF_X - ghost, ghostY, -HALF_Z), new THREE.Vector3(HALF_X + ghost * 0.5, ghostY, -HALF_Z)],
      [new THREE.Vector3(HALF_X + ghost, ghostY, -HALF_Z), new THREE.Vector3(HALF_X + ghost, ghostY, HALF_Z + ghost * 0.65)],
      [new THREE.Vector3(HALF_X, ghostY, HALF_Z + ghost), new THREE.Vector3(-HALF_X - ghost * 0.7, ghostY, HALF_Z + ghost)],
      [new THREE.Vector3(-HALF_X - ghost, ghostY, HALF_Z + ghost), new THREE.Vector3(-HALF_X - ghost, ghostY, -HALF_Z * 0.72)]
    ].forEach(([a, b], edgeIndex) => addDraftStroke(ghostEdgeSegs, a, b, layerIndex * 7 + edgeIndex * 3))

    ;[-HALF_Z, 0, HALF_Z].forEach((z, zIndex) => {
      const leftExtent = DRAFT_EXTENT * (0.42 + ((layerIndex + zIndex) % 4) * 0.28)
      const rightExtent = DRAFT_EXTENT * (0.55 + ((layerIndex * 2 + zIndex) % 3) * 0.36)
      addDraftStroke(edgeExtensionSegs, new THREE.Vector3(-HALF_X - leftExtent, y, z), new THREE.Vector3(-HALF_X, y, z), layerIndex * 11 + zIndex)
      addDraftStroke(edgeExtensionSegs, new THREE.Vector3(HALF_X, y, z), new THREE.Vector3(HALF_X + rightExtent, y, z), layerIndex * 13 + zIndex + 2)
    })

    ;[-HALF_X, 0, HALF_X].forEach((x, xIndex) => {
      const backExtent = DRAFT_EXTENT * (0.35 + ((xIndex + layerIndex) % 3) * 0.22)
      const frontExtent = DRAFT_EXTENT * (0.52 + ((xIndex * 2 + layerIndex) % 4) * 0.18)
      addDraftStroke(edgeExtensionSegs, new THREE.Vector3(x, y, -HALF_Z - backExtent), new THREE.Vector3(x, y, -HALF_Z), layerIndex * 17 + xIndex + 1)
      addDraftStroke(edgeExtensionSegs, new THREE.Vector3(x, y, HALF_Z), new THREE.Vector3(x, y, HALF_Z + frontExtent), layerIndex * 19 + xIndex + 4)
    })

    const rayZ = layerIndex === 1 ? 0 : HALF_Z
    addDraftStroke(projectionSegs, new THREE.Vector3(-HALF_X, y, rayZ), new THREE.Vector3(-HALF_X - DRAFT_EXTENT * (1.4 + layerIndex * 0.38), y, rayZ + 0.2), layerIndex * 23 + 3)
    addDraftStroke(projectionSegs, new THREE.Vector3(HALF_X, y, -rayZ), new THREE.Vector3(HALF_X + DRAFT_EXTENT * (1.2 + layerIndex * 0.27), y, -rayZ - 0.16), layerIndex * 29 + 5)
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
  const strongSegs = []
  const faintSegs = []
  latticePoints().forEach(([x, z, i, j]) => {
    const corner = (i === 0 || i === X_DIV) && (j === 0 || j === Z_DIV)
    const perimeter = i === 0 || i === X_DIV || j === 0 || j === Z_DIV
    const center = x === 0 && z === 0
    const over = corner || center ? 0.8 : 0
    const seg = [new THREE.Vector3(x, yBot - over, z), new THREE.Vector3(x, yTop + over, z)]
    ;(perimeter || center ? strongSegs : faintSegs).push(seg)
  })
  ;[
    [mergedSegments(faintSegs, colors.blueSoft, 0.1), 0.1],
    [mergedSegments(strongSegs, colors.blueSoft, 0.16), 0.16]
  ].forEach(([line, base]) => {
    group.add(line)
    statics.push({ material: line.material, base })
  })
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

export function buildScene(canvas, projects) {
  if (!canvas) return null
  const colors = {
    ink: colorToThree('--foreground'),
    muted: colorToThree('--muted-foreground'),
    lineStrong: colorToThree('--line-strong'),
    blue: colorToThree('--blue'),
    blueSoft: colorToThree('--blue-soft')
  }
  const scene = new THREE.Scene()
  scene.background = null
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
  camera.position.set(...CAMERA_POSITION)
  camera.lookAt(...CAMERA_TARGET)
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setClearColor(0x000000, 0)

  const boxStatics = []
  const boxState = { value: 1 }
  scene.add(buildSkeleton(colors, boxStatics))
  scene.add(buildConstructionOverlay(colors, boxStatics))

  const layers = ['TOOLS', 'WORKS', 'EXPERIMENTS'].map((id) => {
    const statics = []
    const group = buildLayerPlane(colors, statics, id)
    group.position.y = LAYER_Y[id]
    const labelAnchor = new THREE.Object3D()
    labelAnchor.position.set(SPATIAL_PROFILE.roomy.railX, LABEL_LIFT, RAIL_Z)
    group.add(labelAnchor)
    scene.add(group)
    return { id, group, statics, labelAnchor, targetAnchors: group.userData.targetAnchors ?? [], fadeState: { value: 1 } }
  })
  const layerById = Object.fromEntries(layers.map((layer) => [layer.id, layer]))
  const markers = projects.map((project) => {
    const marker = buildMarker(project, colors)
    marker.layer = layerById[project.layer]
    marker.layer.group.add(marker.root)
    return marker
  })

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
    raycaster: new THREE.Raycaster(),
    pointer: new THREE.Vector2(),
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    spatialEase: CustomEase.create('tools-spatial', '0.16,1,0.3,1'),
    profile: SPATIAL_PROFILE.roomy,
    size: { width: 1, height: 1 },
    animationId: 0
  }
}

export function disposeSceneState(sceneState) {
  sceneState.scene.traverse((object) => {
    object.geometry?.dispose()
    if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose())
    else object.material?.dispose()
  })
  sceneState.renderer.dispose()
}
