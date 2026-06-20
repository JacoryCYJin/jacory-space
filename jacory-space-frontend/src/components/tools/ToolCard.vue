<template>
  <RouterLink
    :to="tool.href"
    class="group relative flex h-full min-h-64 flex-col justify-between overflow-hidden bg-background p-6 transition-colors duration-300 hover:bg-card"
  >
    <img
      :src="watermarkSrc"
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute right-[-10%] top-1/2 z-0 w-[68%] -translate-y-1/2 opacity-[0.16] transition-opacity duration-500 group-hover:opacity-[0.22]"
    >

    <div class="relative z-10 flex items-start justify-between">
      <span class="font-mono text-xs text-blue">№ {{ tool.no }}</span>
      <span
        class="font-mono text-[11px] tracking-[0.16em]"
        :class="statusClass"
      >
        ● {{ tool.status }}
      </span>
    </div>

    <div class="relative z-10 mt-10">
      <h2
        class="font-sans text-2xl font-medium tracking-tight text-foreground transition-transform duration-300 group-hover:translate-x-1"
      >
        {{ tool.name }}
      </h2>
      <p class="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
        {{ tool.desc }}
      </p>
    </div>

    <div class="relative z-10 mt-8 flex items-center justify-between border-t border-line pt-4">
      <span class="tech">{{ tool.tag }}</span>
      <span
        class="font-mono text-[11px] tracking-[0.12em] text-muted-foreground transition-all duration-300 group-hover:text-blue"
      >
        {{ tool.ver }} ↗
      </span>
    </div>
  </RouterLink>
</template>

<script setup>
defineProps({
  tool: {
    type: Object,
    required: true
  },
  statusClass: {
    type: String,
    required: true
  },
  watermarkSrc: {
    type: String,
    required: true
  }
})
</script>
