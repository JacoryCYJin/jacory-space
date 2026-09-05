<template>
  <section
    data-home-web-development-page
    class="home-web-development-page relative isolate overflow-hidden"
    aria-label="Web development"
  >
    <p class="pointer-events-none absolute left-4 top-4 font-display text-capability-display font-normal leading-none tracking-tighter text-foreground sm:left-10 sm:top-6">
      WEB DEVELOPMENT
    </p>
  </section>
</template>

<style scoped>
.home-web-development-page {
  height: var(--home-transition-stage-height);
  background: var(--home-capability-web-development-sage);
}

@media (prefers-reduced-motion: no-preference) {
  .home-web-development-page {
    position: sticky;
    top: var(--navbar-height);
    z-index: 0;
  }
}
</style>
