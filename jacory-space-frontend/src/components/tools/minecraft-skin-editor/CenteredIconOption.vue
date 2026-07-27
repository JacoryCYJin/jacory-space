<template>
  <button type="button" :disabled="disabled" :aria-pressed="selected" :class="['flex h-10 items-center justify-center gap-3 rounded-md border px-3 text-center text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-45', selected ? 'border-blue bg-blue/5 text-blue' : 'border-line text-muted-foreground hover:border-line-strong hover:text-foreground']">
    <slot name="icon" />
    <span class="min-w-0 whitespace-nowrap">{{ label }}</span>
  </button>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  selected: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})
</script>
