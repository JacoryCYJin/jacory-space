---
name: threejs-fundamentals
description: Three.js scene setup, cameras, renderer, Object3D hierarchy, coordinate systems, cleanup, resize handling, and transform basics for Jacory Space Vue surfaces.
---

# Three.js Fundamentals

## When To Use

Use this skill when setting up or reviewing Three.js code that touches:

- Scene, camera, renderer, lights, object hierarchy, transforms, or coordinate systems.
- Vue component mounting/unmounting for WebGL surfaces.
- Animation loops, resize handling, pointer listeners, disposal, or renderer performance.
- Existing 3D work under `jacory-space-frontend/src/components/tools/layered-spatial-index/`.

## Jacory Space Vue Usage

The frontend is Vue 3 + Vite under `jacory-space-frontend/`. When adding or editing Three.js in this project:

- Keep scene setup and animation logic in a component-local helper or composable when possible, matching the existing `scene.js` / `useLayeredSpatialIndex.js` pattern.
- Mount the renderer into a Vue ref in `onMounted()` and tear it down in `onBeforeUnmount()`.
- Store animation frame IDs and remove resize / pointer listeners during cleanup.
- Dispose geometries, materials, textures, and renderer resources for any scene that can unmount.
- Use `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` to avoid excessive GPU cost.
- Keep 3D styling aligned with `personal-operating-system-visual-style`: cool-white archive surface, restrained blue accents, no heavy glow/orb decoration.
- After frontend 3D changes, run `cd jacory-space-frontend && npm run build`.
- If visual behavior changed, verify desktop and mobile framing in the browser.

## Reference Routing

- For scene/camera/renderer setup, Object3D hierarchy, coordinate system, math utilities, cleanup, resize, loading manager, and performance examples, read `references/fundamentals-api.md`.
- Keep project-specific Vue and visual-system rules in this `SKILL.md`; keep third-party API reference in `references/`.
