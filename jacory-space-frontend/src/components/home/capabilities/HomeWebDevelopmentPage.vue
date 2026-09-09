<template>
  <section
    data-home-web-development-page
    class="home-web-development-page relative isolate overflow-hidden"
    aria-label="Web development"
  >
    <div class="pointer-events-none absolute inset-x-0 bottom-0 font-display text-web-development-display font-normal leading-none tracking-tighter text-foreground">
      <p class="m-0 ml-4 sm:ml-10">WEB</p>
      <p class="m-0">DEVELOPMENT</p>
    </div>
  </section>
</template>

<style scoped>
.home-web-development-page {
  height: var(--home-transition-stage-height);
  background: var(--home-capability-web-development-sage);
  container-type: inline-size;
}

@media (prefers-reduced-motion: no-preference) {
  .home-web-development-page {
    position: sticky;
    top: var(--navbar-height);
    z-index: 0;
  }
}
</style>
