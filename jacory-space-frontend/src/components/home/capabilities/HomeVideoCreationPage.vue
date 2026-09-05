<template>
  <section
    data-home-video-creation-page
  class="home-video-creation-page relative isolate overflow-hidden"
    aria-label="Video creation"
  >
    <p class="pointer-events-none absolute left-4 top-4 font-display text-capability-display font-normal leading-none tracking-tighter text-foreground sm:left-10 sm:top-6">
      VIDEO CREATION
    </p>
  </section>
</template>

<style scoped>
.home-video-creation-page {
  height: var(--home-transition-stage-height);
  background: var(--home-video-creation-coral);
}

@media (prefers-reduced-motion: no-preference) {
  .home-video-creation-page {
    position: sticky;
    top: var(--navbar-height);
    z-index: 0;
  }
}

</style>
