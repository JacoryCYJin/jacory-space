import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import {
  DRAFT_EXTENT,
  DRAFT_OVER,
  HALF_X,
  HALF_Z,
  HOVER_GUIDE_HEIGHT,
  LABEL_LIFT,
  LAYER_Y,
  RAIL_Z,
  SINGLE_LAYER_SCALE,
  SLAB_THICKNESS,
  spatialProfileFor
} from './constants'
import { buildScene, disposeSceneState } from './scene'

gsap.registerPlugin(CustomEase)

export function useLayeredSpatialIndex(props, emit) {
  const canvasEl = ref(null)
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

  const layerMeta = computed(() =>
    ['TOOLS', 'WORKS', 'EXPERIMENTS'].map((id) => ({
      id,
      count: String(props.projects.filter((project) => project.layer === id).length).padStart(2, '0')
    }))
  )

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
  const hoverPreviewEase = CustomEase.create('tools-hover-preview', '0.16,1,0.3,1')

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
        spatialEntranceTimeline.to(layerLabel, { autoAlpha: 1, y: 0, duration: 0.38 }, at + 0.08)
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
        spatialEntranceTimeline.to(label, { autoAlpha: 1, y: 0, duration: 0.34 }, `${sequenceStart}+=0.32`)
      }
    })
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
        return { min: Math.min(acc.min, x), max: Math.max(acc.max, x) }
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
    const topY = projectVec(railWorldX, LAYER_Y.TOOLS + LABEL_LIFT, RAIL_Z).y
    const botY = projectVec(railWorldX, LAYER_Y.EXPERIMENTS + LABEL_LIFT, RAIL_Z).y
    if (railLineEl.value) {
      railLineEl.value.setAttribute('x1', railX)
      railLineEl.value.setAttribute('y1', topY)
      railLineEl.value.setAttribute('x2', railX)
      railLineEl.value.setAttribute('y2', botY)
    }
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
      const { rx, ry } = anchor.userData.targetSize
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
      const visible = marker.layer.fadeState.value * marker.fadeState.value
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
    gsap.fromTo(el, { autoAlpha: 0, y: 8 }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.62,
      ease: hoverPreviewEase,
      overwrite: 'auto'
    })
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
    sceneState = buildScene(canvasEl.value, props.projects)
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
    disposeSceneState(sceneState)
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

  return {
    canvasEl,
    hoveredId,
    hoveredProject,
    previewPositionEl,
    previewMotionEl,
    railOverlayEl,
    railLineEl,
    railConnAEl,
    railConnBEl,
    railNodeAEl,
    railNodeBEl,
    targetOverlayEl,
    layerMeta,
    setEntryEl,
    setEntryMotionEl,
    setLayerEl,
    setLayerMotionEl,
    playSpatialEntrance,
    setHoveredProject,
    scheduleHoverClear,
    cancelHoverClear,
    handlePointerMove,
    handlePointerLeave,
    handleCanvasClick
  }
}
