<template>
  <section data-tools-enter class="mt-8 space-y-9 md:hidden">
    <div v-for="layer in layerMeta" :key="'m-' + layer.id">
      <div class="flex items-baseline justify-between">
        <span class="tech text-foreground">{{ layer.id }}</span>
        <span class="tech">{{ layer.count }}</span>
      </div>
      <ul class="mt-3 divide-y divide-line border-y border-line">
        <li
          v-for="project in projectsByLayer(layer.id)"
          :key="project.id"
          class="flex items-center gap-3 py-3 transition-colors duration-300"
          :class="entryVisible(project) ? '' : 'opacity-30'"
          @click="emit('select', project)"
        >
          <span class="font-mono text-xs text-blue">{{ project.no }}</span>
          <span class="flex-1 text-sm font-medium tracking-tight text-foreground">{{ project.title }}</span>
          <span class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
            <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(project.status)" aria-hidden="true" />
            {{ statusLabel(project.status) }}
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  projects: { type: Array, required: true },
  activeFilter: { type: String, default: 'all' },
  layerMeta: { type: Array, required: true }
})

const emit = defineEmits(['select'])

const statusNames = { live: 'LIVE', wip: 'WIP', beta: 'BETA', archived: 'ARCHIVED' }

function statusLabel(status) {
  return statusNames[status] ?? status.toUpperCase()
}

function statusDotClass(status) {
  if (status === 'live') return 'bg-blue'
  if (status === 'archived') return 'bg-transparent ring-1 ring-muted-foreground'
  return 'bg-muted-foreground'
}

function entryVisible(project) {
  return props.activeFilter === 'all' || project.category === props.activeFilter
}

function projectsByLayer(layer) {
  return props.projects.filter((project) => project.layer === layer)
}
</script>
