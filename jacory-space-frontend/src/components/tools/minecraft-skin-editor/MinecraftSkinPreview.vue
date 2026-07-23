<template>
  <div ref="mount" class="relative h-full min-h-[26rem] w-full overflow-hidden bg-background">
    <canvas ref="canvas" class="block h-full w-full touch-none" aria-label="Minecraft 3D skin preview" />
  </div>
</template>

<script setup>
import { BufferGeometry, Float32BufferAttribute, LineBasicMaterial, LineSegments, Raycaster, Vector2, Vector3 } from 'skinview3d/node_modules/three/build/three.module.js'
import { Line2 } from 'skinview3d/node_modules/three/examples/jsm/lines/Line2.js'
import { LineGeometry } from 'skinview3d/node_modules/three/examples/jsm/lines/LineGeometry.js'
import { LineMaterial } from 'skinview3d/node_modules/three/examples/jsm/lines/LineMaterial.js'
import { SkinViewer } from 'skinview3d'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const emit = defineEmits(['error', 'paint-start', 'paint-pixel', 'paint-end'])

const props = defineProps({
  textureCanvas: { type: Object, required: true },
  textureVersion: { type: Number, default: 0 },
  model: { type: String, default: 'classic' },
  activeLayer: { type: String, default: 'base' },
  activeTool: { type: String, default: 'brush' },
  showGrid: { type: Boolean, default: false }
})

const mount = ref(null)
const canvas = ref(null)
const raycaster = new Raycaster()
const pointer = new Vector2()
let viewer
let resizeObserver
let drawingPointerId = null
let lastPaintedPixel = null
let hoverOutline
let targetZoom = 0.72
let zoomAnimationFrame
let pixelGridObjects = []

function viewerModel() {
  return props.model === 'slim' ? 'slim' : 'default'
}

function updateSkin() {
  if (!viewer || !props.textureCanvas) return
  viewer.loadSkin(props.textureCanvas, { model: viewerModel() })
  applyLayerVisibility()
}

function updateModel() {
  if (!viewer) return
  viewer.playerObject.skin.modelType = viewerModel()
}

function applyLayerVisibility() {
  if (!viewer) return
  const skin = viewer.playerObject.skin
  skin.setInnerLayerVisible(true)
  skin.setOuterLayerVisible(props.activeLayer === 'outer')
}

function resize() {
  if (!viewer || !mount.value) return
  viewer.setSize(mount.value.clientWidth, mount.value.clientHeight)
  hoverOutline?.material.resolution.set(mount.value.clientWidth, mount.value.clientHeight)
}

function activeMeshTargets() {
  const skin = viewer.playerObject.skin
  const parts = [skin.head, skin.body, skin.rightArm, skin.leftArm, skin.rightLeg, skin.leftLeg]
  return parts.map((part) => props.activeLayer === 'outer' ? part.outerLayer : part.innerLayer)
}

function visibleMeshTargets() {
  const skin = viewer.playerObject.skin
  const parts = [skin.head, skin.body, skin.rightArm, skin.leftArm, skin.rightLeg, skin.leftLeg]
  return [
    ...parts.map((part) => part.outerLayer),
    ...parts.map((part) => part.innerLayer)
  ]
}

function vertexIndex(geometry, index) {
  return geometry.index ? geometry.index.getX(index) : index
}

function createPixelGrid(mesh) {
  const geometry = mesh.geometry
  const position = geometry.getAttribute('position')
  const uv = geometry.getAttribute('uv')
  const normalAttribute = geometry.getAttribute('normal')
  if (!position || !uv || !normalAttribute) return null
  const segments = []

  for (const group of geometry.groups) {
    const indexes = Array.from({ length: group.count }, (_, offset) => vertexIndex(geometry, group.start + offset))
    const [indexA, indexB, indexC] = indexes
    const vertexA = new Vector3().fromBufferAttribute(position, indexA)
    const vertexB = new Vector3().fromBufferAttribute(position, indexB)
    const vertexC = new Vector3().fromBufferAttribute(position, indexC)
    const uvA = new Vector2().fromBufferAttribute(uv, indexA)
    const uvB = new Vector2().fromBufferAttribute(uv, indexB)
    const uvC = new Vector2().fromBufferAttribute(uv, indexC)
    const edgeAB = vertexB.clone().sub(vertexA)
    const edgeAC = vertexC.clone().sub(vertexA)
    const deltaUvAB = uvB.clone().sub(uvA)
    const deltaUvAC = uvC.clone().sub(uvA)
    const determinant = deltaUvAB.x * deltaUvAC.y - deltaUvAB.y * deltaUvAC.x
    if (Math.abs(determinant) < Number.EPSILON) continue

    const positionPerU = edgeAB.clone().multiplyScalar(deltaUvAC.y).sub(edgeAC.clone().multiplyScalar(deltaUvAB.y)).multiplyScalar(1 / determinant)
    const positionPerV = edgeAC.clone().multiplyScalar(deltaUvAB.x).sub(edgeAB.clone().multiplyScalar(deltaUvAC.x)).multiplyScalar(1 / determinant)
    const groupUvs = indexes.map((index) => new Vector2().fromBufferAttribute(uv, index))
    const minU = Math.min(...groupUvs.map((point) => point.x))
    const maxU = Math.max(...groupUvs.map((point) => point.x))
    const minV = Math.min(...groupUvs.map((point) => point.y))
    const maxV = Math.max(...groupUvs.map((point) => point.y))
    const columns = Math.round((maxU - minU) * 64)
    const rows = Math.round((maxV - minV) * 64)
    const normal = new Vector3().fromBufferAttribute(normalAttribute, indexA).multiplyScalar(0.003)
    const pointAt = (u, v) => vertexA.clone().addScaledVector(positionPerU, u - uvA.x).addScaledVector(positionPerV, v - uvA.y).add(normal)
    const addSegment = (from, to) => segments.push(from.x, from.y, from.z, to.x, to.y, to.z)

    for (let column = 0; column <= columns; column += 1) {
      const u = minU + column / 64
      addSegment(pointAt(u, minV), pointAt(u, maxV))
    }
    for (let row = 0; row <= rows; row += 1) {
      const v = minV + row / 64
      addSegment(pointAt(minU, v), pointAt(maxU, v))
    }
  }

  if (!segments.length) return null
  const gridGeometry = new BufferGeometry()
  gridGeometry.setAttribute('position', new Float32BufferAttribute(segments, 3))
  const gridMaterial = new LineBasicMaterial({
    color: getComputedStyle(mount.value).getPropertyValue('--muted-foreground').trim(),
    transparent: true,
    opacity: 0.55,
    depthTest: true,
    depthWrite: false
  })
  const grid = new LineSegments(gridGeometry, gridMaterial)
  grid.renderOrder = 1
  grid.raycast = () => {}
  mesh.add(grid)
  return { mesh, grid }
}

function clearPixelGrid() {
  pixelGridObjects.forEach(({ mesh, grid }) => {
    mesh.remove(grid)
    grid.geometry.dispose()
    grid.material.dispose()
  })
  pixelGridObjects = []
}

function syncPixelGrid() {
  clearPixelGrid()
  if (!viewer || !props.showGrid) return
  pixelGridObjects = activeMeshTargets().map(createPixelGrid).filter(Boolean)
}

function pixelFromHit(hit) {
  if (!hit?.uv) return null
  return {
    x: Math.max(0, Math.min(63, Math.floor(hit.uv.x * 64))),
    y: Math.max(0, Math.min(63, Math.floor((1 - hit.uv.y) * 64)))
  }
}

function alphaAt(pixel) {
  const context = props.textureCanvas.getContext('2d', { willReadFrequently: true })
  return context.getImageData(pixel.x, pixel.y, 1, 1).data[3]
}

function intersectionAtPointer(event, visibleColor = false) {
  if (!viewer || !canvas.value) return null
  const bounds = canvas.value.getBoundingClientRect()
  pointer.set(
    ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
    -((event.clientY - bounds.top) / bounds.height) * 2 + 1
  )
  raycaster.setFromCamera(pointer, viewer.camera)
  const hits = raycaster.intersectObjects(visibleColor ? visibleMeshTargets() : activeMeshTargets(), true)
  let fallback = null
  for (const hit of hits) {
    const pixel = pixelFromHit(hit)
    if (!pixel) continue
    fallback ||= { hit, pixel }
    if (!visibleColor || alphaAt(pixel) > 0) return { hit, pixel }
  }
  return fallback
}

function pixelAtPointer(event, visibleColor = false) {
  return intersectionAtPointer(event, visibleColor)?.pixel || null
}

function drawHoverOutline(hit, pixel) {
  const position = hit.object.geometry.getAttribute('position')
  const uv = hit.object.geometry.getAttribute('uv')
  if (!position || !uv || !hit.face) return

  const vertexA = new Vector3().fromBufferAttribute(position, hit.face.a)
  const vertexB = new Vector3().fromBufferAttribute(position, hit.face.b)
  const vertexC = new Vector3().fromBufferAttribute(position, hit.face.c)
  const uvA = new Vector2().fromBufferAttribute(uv, hit.face.a)
  const uvB = new Vector2().fromBufferAttribute(uv, hit.face.b)
  const uvC = new Vector2().fromBufferAttribute(uv, hit.face.c)
  const edgeAB = vertexB.clone().sub(vertexA)
  const edgeAC = vertexC.clone().sub(vertexA)
  const deltaUvAB = uvB.clone().sub(uvA)
  const deltaUvAC = uvC.clone().sub(uvA)
  const determinant = deltaUvAB.x * deltaUvAC.y - deltaUvAB.y * deltaUvAC.x
  if (Math.abs(determinant) < Number.EPSILON) return

  const positionPerU = edgeAB.clone().multiplyScalar(deltaUvAC.y).sub(edgeAC.clone().multiplyScalar(deltaUvAB.y)).multiplyScalar(1 / determinant)
  const positionPerV = edgeAC.clone().multiplyScalar(deltaUvAB.x).sub(edgeAB.clone().multiplyScalar(deltaUvAC.x)).multiplyScalar(1 / determinant)
  const center = hit.object.worldToLocal(new Vector3(hit.point.x, hit.point.y, hit.point.z))
  const centerU = (pixel.x + 0.5) / 64
  const centerV = 1 - (pixel.y + 0.5) / 64
  center.addScaledVector(positionPerU, centerU - hit.uv.x)
  center.addScaledVector(positionPerV, centerV - hit.uv.y)

  const halfU = positionPerU.multiplyScalar(1 / 128)
  const halfV = positionPerV.multiplyScalar(1 / 128)
  const offset = new Vector3(hit.face.normal.x, hit.face.normal.y, hit.face.normal.z).transformDirection(hit.object.matrixWorld).multiplyScalar(0.02)
  const corners = [
    center.clone().sub(halfU).sub(halfV),
    center.clone().add(halfU).sub(halfV),
    center.clone().add(halfU).add(halfV),
    center.clone().sub(halfU).add(halfV)
  ].map((corner) => hit.object.localToWorld(corner).add(offset))

  hoverOutline.geometry.setPositions([...corners, corners[0]].flatMap((corner) => [corner.x, corner.y, corner.z]))
  hoverOutline.visible = true
}

function updateHover(event) {
  const intersection = intersectionAtPointer(event, props.activeTool === 'eyedropper')
  if (!intersection || !hoverOutline) {
    if (hoverOutline) hoverOutline.visible = false
    return null
  }
  drawHoverOutline(intersection.hit, intersection.pixel)
  return intersection.pixel
}

function onPointerDown(event) {
  if (event.button !== 0) return
  const pixel = updateHover(event)
  if (!pixel) return
  event.preventDefault()
  event.stopImmediatePropagation()
  drawingPointerId = event.pointerId
  lastPaintedPixel = pixel
  canvas.value.setPointerCapture(event.pointerId)
  emit('paint-start')
  emit('paint-pixel', pixel)
}

function onPointerMove(event) {
  updateHover(event)
  if (event.pointerId !== drawingPointerId) return
  event.preventDefault()
  event.stopImmediatePropagation()
  const pixel = pixelAtPointer(event, props.activeTool === 'eyedropper')
  if (!pixel || (pixel.x === lastPaintedPixel?.x && pixel.y === lastPaintedPixel?.y)) return
  lastPaintedPixel = pixel
  emit('paint-pixel', pixel)
}

function finishPaintStroke(event) {
  if (event.pointerId !== drawingPointerId) return
  event.preventDefault()
  event.stopImmediatePropagation()
  if (canvas.value?.hasPointerCapture(event.pointerId)) canvas.value.releasePointerCapture(event.pointerId)
  drawingPointerId = null
  lastPaintedPixel = null
  emit('paint-end')
}

function clearHover() {
  if (hoverOutline) hoverOutline.visible = false
}

function animateZoom() {
  if (!viewer) return
  const difference = targetZoom - viewer.zoom
  if (Math.abs(difference) < 0.001) {
    viewer.zoom = targetZoom
    zoomAnimationFrame = undefined
    return
  }
  viewer.zoom += difference * 0.16
  viewer.controls.update()
  zoomAnimationFrame = window.requestAnimationFrame(animateZoom)
}

function onWheel(event) {
  if (!viewer) return
  event.preventDefault()
  event.stopImmediatePropagation()
  targetZoom = Math.min(1.8, Math.max(0.38, targetZoom * Math.exp(-event.deltaY * 0.0012)))
  if (!zoomAnimationFrame) zoomAnimationFrame = window.requestAnimationFrame(animateZoom)
}

onMounted(() => {
  try {
    viewer = new SkinViewer({
      canvas: canvas.value,
      width: mount.value.clientWidth,
      height: mount.value.clientHeight,
      skin: props.textureCanvas,
      model: viewerModel(),
      fov: 45,
      zoom: 0.72,
      pixelRatio: Math.min(window.devicePixelRatio, 2)
    })
    viewer.controls.enablePan = true
    viewer.controls.enableDamping = true
    viewer.controls.dampingFactor = 0.055
    viewer.controls.rotateSpeed = 0.55
    viewer.controls.panSpeed = 0.7
    viewer.camera.position.set(0.45, 0.2, 1)
    viewer.adjustCameraDistance()
    viewer.controls.update()
    const hoverMaterial = new LineMaterial({
      color: getComputedStyle(mount.value).getPropertyValue('--blue').trim(),
      linewidth: 3,
      depthTest: false
    })
    hoverMaterial.resolution.set(mount.value.clientWidth, mount.value.clientHeight)
    hoverOutline = new Line2(new LineGeometry(), hoverMaterial)
    hoverOutline.renderOrder = 1
    hoverOutline.visible = false
    viewer.scene.add(hoverOutline)
    applyLayerVisibility()
    syncPixelGrid()
    canvas.value.addEventListener('contextmenu', (event) => event.preventDefault())
    canvas.value.addEventListener('pointerdown', onPointerDown, true)
    canvas.value.addEventListener('pointermove', onPointerMove, true)
    canvas.value.addEventListener('pointerup', finishPaintStroke, true)
    canvas.value.addEventListener('pointercancel', finishPaintStroke, true)
    canvas.value.addEventListener('pointerleave', clearHover)
    canvas.value.addEventListener('wheel', onWheel, { capture: true, passive: false })
    resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount.value)
  } catch (error) {
    emit('error', error)
  }
})

watch(() => props.textureVersion, updateSkin)
watch(() => props.model, () => {
  updateModel()
  applyLayerVisibility()
  syncPixelGrid()
})
watch(() => [props.showGrid, props.activeLayer], () => {
  applyLayerVisibility()
  syncPixelGrid()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  canvas.value?.removeEventListener('pointerdown', onPointerDown, true)
  canvas.value?.removeEventListener('pointermove', onPointerMove, true)
  canvas.value?.removeEventListener('pointerup', finishPaintStroke, true)
  canvas.value?.removeEventListener('pointercancel', finishPaintStroke, true)
  canvas.value?.removeEventListener('pointerleave', clearHover)
  canvas.value?.removeEventListener('wheel', onWheel, true)
  if (zoomAnimationFrame) window.cancelAnimationFrame(zoomAnimationFrame)
  clearPixelGrid()
  if (hoverOutline) {
    viewer?.scene.remove(hoverOutline)
    hoverOutline.geometry.dispose()
    hoverOutline.material.dispose()
  }
  viewer?.dispose()
})
</script>
