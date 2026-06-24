<template>
  <RouterLink
    v-if="variant === 'default'"
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

  <RouterLink
    v-else
    :to="tool.href"
    class="tool-card-hover relative block w-full overflow-hidden rounded border border-line bg-card px-4 py-3.5"
  >
    <img
      :src="watermarkSrc"
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute bottom-[-15%] right-[-15%] z-0 w-[75%] opacity-[0.2] mix-blend-multiply"
    >

    <div class="relative z-10 flex items-center justify-between gap-4">
      <span class="font-mono text-[11px] tracking-[0.08em] text-blue">{{ tool.no }}</span>
      <span class="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        <span class="h-1.5 w-1.5 rounded-full bg-blue" aria-hidden="true" />
        {{ tool.status }}
      </span>
    </div>

    <h2 class="relative z-10 mt-2.5 font-sans text-base font-medium leading-tight tracking-tight text-foreground">
      {{ tool.name }}
    </h2>

    <p class="relative z-10 mt-1.5 line-clamp-2 max-w-[22ch] text-[13px] leading-[1.55] text-muted-foreground">
      {{ tool.desc }}
    </p>

    <p class="relative z-10 mt-2.5 border-t border-line pt-2.5 font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground">
      {{ tool.tag }} · {{ tool.status }} · {{ tool.ver }}
    </p>
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
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'hover'].includes(value)
  }
})
</script>

<style scoped>
.tool-card-hover {
  box-shadow: 0 8px 24px color-mix(in oklab, var(--foreground) 4%, transparent);
}
</style>
