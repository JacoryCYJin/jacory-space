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

export const HOVER_GUIDE_HEIGHT = 3.3
// Stem thickness in world units (≈ /38 of a px). Raise for a thicker stem.
export const STEM_WIDTH = 0.03
export const HALF_X = 7.6
export const HALF_Z = 3.2
export const LAYER_Y = { TOOLS: 4.4, WORKS: 0, EXPERIMENTS: -4.4 }
export const CAMERA_POSITION = [4.6, 3.1, 12]
export const CAMERA_TARGET = [0, -0.2, 0]
export const SINGLE_LAYER_SCALE = 1.16
// Keep markers inside the narrowed volume (data is authored for a wider box).
export const MARKER_X_SCALE = 0.68
export const SPATIAL_PROFILE = {
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
export const RAIL_Z = HALF_Z
// Lift the label/rail node above its plane so the plane's front-left corner node
// drops into the gap below the label.
export const LABEL_LIFT = 2.0

export const X_DIV = 16
export const Z_DIV = 8
export const LATTICE_STEP = 2
export const DRAFT_EXTENT = 1.9
export const DRAFT_OVER = 2.55
export const DRAFT_GHOST_OFFSET = 0.1
// Dev preview opacity: keep the draft layer intentionally loud while tuning
// construction-line shape; lower this once the form is approved.
export const DRAFT_DEV_OPACITY = 0.8
export const BASE_MESH_OPACITY = 0.38
export const BASE_EDGE_OPACITY = 0.68
export const BASE_SLAB_OPACITY = 0.44
export const BASE_CONNECTOR_OPACITY = 0.5
export const NODE_TARGET_OPACITY = 0.74
export const NODE_TICK_OPACITY = 0.58
export const HISTORIC_TARGETS = {
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

// Vertical offset of the rear/lower supporting layer — keeps each base a very
// thin double-layer slab rather than a single sheet (or a heavy box).
export const SLAB_THICKNESS = 0.08

export function stemHeightFor(project) {
  return (STEM_PX[project.no] ?? STEM_FALLBACK_PX) * STEM_PX_TO_WORLD
}

export function spatialProfileFor(width, height) {
  const narrow = width <= 1180
  const shortAndNarrow = width <= 1320 && height <= 760
  return narrow || shortAndNarrow ? SPATIAL_PROFILE.compact : SPATIAL_PROFILE.roomy
}
