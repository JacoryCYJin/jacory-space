<template>
  <section
    data-home-capabilities-page
    class="relative min-h-[calc(150svh-var(--navbar-height))] overflow-hidden bg-background [--navbar-height:4rem]"
    aria-label="Creative capabilities"
  >
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <HomeDotMatrixField
        :scatter-progress="0"
        :dissolve-progress="1"
        :terminal-progress="1"
        residue-only
      />
    </div>

    <h2 class="sr-only">Creative capabilities</h2>
    <slot />
  </section>
</template>

<script setup>
import HomeDotMatrixField from '../jacory-reveal/HomeDotMatrixField.vue'
</script>
