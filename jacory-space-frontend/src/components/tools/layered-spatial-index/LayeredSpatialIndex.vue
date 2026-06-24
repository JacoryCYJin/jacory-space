<template>
  <section
    class="relative hidden h-full min-h-[560px] md:block lg:min-h-0"
    aria-label="Layered spatial project index"
  >
    <canvas
      ref="canvasEl"
      class="invisible block h-full w-full opacity-0"
      @pointermove="handlePointerMove"
      @pointerleave="handlePointerLeave"
      @click="handleCanvasClick"
    />

    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <svg class="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <g ref="railOverlayEl">
          <line ref="railLineEl" x1="0" y1="0" x2="0" y2="0" class="stroke-line-strong" stroke-width="1" stroke-opacity="0.68" />
          <line ref="railConnAEl" x1="0" y1="0" x2="0" y2="0" class="stroke-line-strong" stroke-width="1" stroke-opacity="0.68" />
          <line ref="railConnBEl" x1="0" y1="0" x2="0" y2="0" class="stroke-line-strong" stroke-width="1" stroke-opacity="0.68" />
          <circle ref="railNodeAEl" cx="0" cy="0" r="3" class="stroke-line-strong fill-background" stroke-width="1.1" stroke-opacity="0.85" />
          <circle ref="railNodeBEl" cx="0" cy="0" r="3" class="stroke-line-strong fill-background" stroke-width="1.1" stroke-opacity="0.85" />
        </g>
        <g
          ref="targetOverlayEl"
          fill="none"
          stroke="var(--line-strong)"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <div
        v-for="layer in layerMeta"
        :key="'layer-' + layer.id"
        :ref="(el) => setLayerEl(layer.id, el)"
        class="spatial-anchor"
      >
        <svg class="spatial-rail-node pointer-events-none absolute left-0 top-0 overflow-visible text-blue" aria-hidden="true">
          <line x1="6" y1="0" x2="12" y2="0" stroke="currentColor" stroke-width="1" stroke-opacity="0.7" />
          <circle cx="0" cy="0" r="5" stroke="currentColor" stroke-width="1.7" class="fill-background" />
        </svg>
        <div class="spatial-layer-label flex flex-col items-start gap-[0.2rem] text-left">
          <span
            :ref="(el) => setLayerMotionEl(layer.id, el)"
            class="flex flex-col items-start gap-[0.2rem]"
          >
            <span class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-blue">{{ layer.id }}</span>
            <span class="font-mono text-xs tracking-[0.16em] text-muted-foreground">{{ layer.count }}</span>
          </span>
        </div>
      </div>

      <div
        v-for="project in projects"
        :key="'entry-' + project.id"
        :ref="(el) => setEntryEl(project.id, el)"
        class="spatial-anchor"
      >
        <div
          class="spatial-entry pointer-events-auto inline-flex cursor-pointer items-baseline gap-[0.4rem] whitespace-nowrap"
          @pointerenter="setHoveredProject(project)"
          @pointerleave="scheduleHoverClear"
          @click="emit('select', project)"
        >
          <span
            :ref="(el) => setEntryMotionEl(project.id, el)"
            class="inline-flex items-baseline gap-[0.4rem]"
          >
            <span class="font-mono text-xs tracking-[0.06em] text-blue">{{ project.no }}</span>
            <span
              class="font-mono text-sm tracking-[0.01em] transition-colors duration-300 ease-premium"
              :class="hoveredId === project.id ? 'text-blue' : 'text-foreground'"
            >{{ project.title }}</span>
          </span>
        </div>
      </div>
    </div>

    <div
      v-show="hoveredProject"
      ref="previewPositionEl"
      class="pointer-events-none absolute left-0 top-0 z-20 w-72"
    >
      <div
        ref="previewMotionEl"
        class="pointer-events-auto invisible opacity-0"
        @pointerenter="cancelHoverClear"
        @pointerleave="scheduleHoverClear"
      >
        <ToolCard
          v-if="hoveredProject"
          :tool="hoverCardTool"
          :status-class="hoverStatusClass"
          :watermark-src="hoverWatermarkSrc"
          variant="hover"
        />
      </div>
    </div>

    <div class="spatial-meta spatial-meta-bottom">
      <span>GRID 16 × 08</span>
      <span>SLAB Δ 0.08</span>
      <span>DRAFT OPACITY 0.80</span>
    </div>

    <div class="pointer-events-none absolute bottom-4 left-[1.1rem] flex flex-col gap-[0.32rem] font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
      <span>X — INDEX SPAN</span>
      <span>Y — LAYER RAIL</span>
      <span>Z — DEPTH</span>
      <span>+ — ENTRY POINT</span>
    </div>

    <div class="pointer-events-none absolute bottom-4 right-[1.2rem] text-line-strong" aria-hidden="true">
      <svg viewBox="0 0 60 60" class="h-24 w-24 overflow-visible">
        <g
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.15"
          stroke-opacity="0.42"
        >
          <path d="M30 8 V16" />
          <path d="M18 34 L8 39.8" />
          <path d="M42 34 L52 39.8" />
          <path d="M30 16 L42 22 V34 L30 40 L18 34 V22 Z" />
          <path d="M18 22 L30 28 L42 22" />
          <path d="M30 28 V40" />
        </g>
        <g
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="0.9"
          stroke-dasharray="2 2"
          stroke-opacity="0.18"
        >
          <path d="M18 34 L30 28 L42 34" />
          <path d="M30 16 V28" />
        </g>
        <text x="30" y="5" text-anchor="middle" font-size="8" class="fill-current font-mono" fill-opacity="0.62">Z</text>
        <text x="5" y="40" text-anchor="middle" font-size="8" class="fill-current font-mono" fill-opacity="0.62">X</text>
        <text x="55" y="40" text-anchor="middle" font-size="8" class="fill-current font-mono" fill-opacity="0.62">Y</text>
      </svg>
    </div>
  </section>

  <LayeredSpatialMobileIndex
    :projects="projects"
    :active-filter="activeFilter"
    :layer-meta="layerMeta"
    @select="emit('select', $event)"
  />
</template>

<script setup>
import { computed } from 'vue'
import coolPaletteWatermark from '../../../assets/tools/cool-palete-watermark.png'
import exampleWatermark from '../../../assets/tools/example-watermark.png'
import videoParserWatermark from '../../../assets/tools/video-parser-watermark.png'
import LayeredSpatialMobileIndex from './LayeredSpatialMobileIndex.vue'
import ToolCard from '../ToolCard.vue'
import { useLayeredSpatialIndex } from './useLayeredSpatialIndex'

const props = defineProps({
  projects: { type: Array, required: true },
  activeFilter: { type: String, default: 'all' }
})

const emit = defineEmits(['select'])

const {
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
} = useLayeredSpatialIndex(props, emit)

const statusNames = { live: 'LIVE', wip: 'WIP', beta: 'BETA', archived: 'ARCHIVED' }

function statusLabel(status) {
  return statusNames[status] ?? status.toUpperCase()
}

const hoverCardTool = computed(() => {
  const project = hoveredProject.value
  if (!project) return null
  return {
    no: project.no,
    name: project.title,
    desc: project.description,
    tag: project.category,
    status: statusLabel(project.status),
    ver: project.version,
    href: project.href
  }
})

const hoverWatermarkSrc = computed(() => {
  if (hoveredProject.value?.id === '001') return videoParserWatermark
  if (hoveredProject.value?.id === '003') return coolPaletteWatermark
  return exampleWatermark
})

const hoverStatusClass = computed(() => {
  if (hoveredProject.value?.status === 'live') return 'text-blue'
  if (hoveredProject.value?.status === 'archived') return 'text-haze'
  return 'text-muted-foreground'
})

defineExpose({ playEntrance: playSpatialEntrance })
</script>

<style scoped>
.spatial-meta {
  pointer-events: none;
  position: absolute;
  z-index: 2;
  display: flex;
  font-family: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.625rem;
  letter-spacing: 0.18em;
  line-height: 1.4;
  color: var(--muted-foreground);
  opacity: 0.48;
  text-transform: uppercase;
}

.spatial-meta-bottom {
  right: 5.35rem;
  bottom: 1.1rem;
  align-items: center;
  gap: 1rem;
}

@media (max-width: 1536px), (max-height: 820px) {
  .spatial-meta-bottom {
    right: 6.4rem;
    bottom: 2.65rem;
  }
}

/* Reused on every layer/entry anchor; needs will-change for per-frame transforms. */
.spatial-anchor {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform, opacity;
}

/* calc()-based label offsets are hard to express with Tailwind utilities. */
/* Label hangs just below-right of its rail node (the anchor origin). */
.spatial-layer-label {
  transform: translate(0.9rem, -0.55rem);
}

.spatial-entry {
  transform: translate(-50%, calc(-100% - 0.3rem));
}
</style>
