<template>
  <div
    data-home-loading-crt
    class="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    aria-hidden="true"
  >
    <span data-home-loading-crt-tone class="home-loading-crt__tone absolute inset-0" />
    <span data-home-loading-crt-scanlines class="home-loading-crt__scanlines absolute inset-0" />
    <span data-home-loading-crt-vignette class="home-loading-crt__vignette absolute inset-0" />
  </div>
</template>

<style scoped>
.home-loading-crt__tone {
  background: var(--blue-soft);
  mix-blend-mode: multiply;
  opacity: 0.035;
}

.home-loading-crt__scanlines {
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 2px,
    color-mix(in srgb, var(--foreground) 16%, transparent) 2px,
    color-mix(in srgb, var(--foreground) 16%, transparent) 3px
  );
  mix-blend-mode: multiply;
  opacity: 0.52;
}

.home-loading-crt__vignette {
  background: radial-gradient(
    ellipse at center,
    transparent 50%,
    color-mix(in srgb, var(--foreground) 4%, transparent) 78%,
    color-mix(in srgb, var(--foreground) 10%, transparent) 100%
  );
  opacity: 0.72;
}

@media (prefers-reduced-motion: reduce) {
  [data-home-loading-crt] {
    display: none;
  }
}
</style>
