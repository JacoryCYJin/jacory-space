---
name: gsap-core
description: Official GSAP skill for the core API. Use when adding or reviewing Vue/DOM/SVG animations that need gsap.to(), from(), fromTo(), easing, stagger, defaults, or gsap.matchMedia().
license: MIT
---

# GSAP Core

## When To Use

Use this skill when writing or reviewing GSAP animations that use the core engine:

- Vue, DOM, or SVG tweens with `gsap.to()`, `gsap.from()`, `gsap.fromTo()`, or `gsap.set()`.
- Easing, duration, stagger, transform aliases, `autoAlpha`, or tween lifecycle questions.
- Responsive or reduced-motion animation setup with `gsap.matchMedia()`.
- User asks for a JavaScript animation library and has not already chosen another one.

For sequencing multiple steps, prefer a timeline-specific reference if available. For scroll-linked animation, prefer a ScrollTrigger-specific reference if available.

## Jacory Space Vue Usage

The frontend is Vue 3 + Vite under `jacory-space-frontend/`. When adding GSAP to Vue components:

- Create animations in `onMounted()` after DOM refs exist.
- Store tweens, timelines, `gsap.context()`, or `gsap.matchMedia()` handles and clean them in `onBeforeUnmount()`.
- Prefer refs or a scoped root element over broad global selectors.
- Use the project motion baseline from `personal-operating-system-visual-style`: `cubic-bezier(0.16, 1, 0.3, 1)`, roughly 600-900ms, opacity plus small translate.
- Avoid bounce, overshoot, or showy motion unless the user explicitly asks and it still fits the visual system.
- Respect `prefers-reduced-motion`; `gsap.matchMedia()` is preferred when responsive or reduced-motion branches are needed.
- After frontend animation changes, run `cd jacory-space-frontend && npm run build`.

```vue
<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";

const rootEl = ref(null);
let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from(".reveal-item", {
      autoAlpha: 0,
      y: 14,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.08,
    });
  }, rootEl);
});

onBeforeUnmount(() => {
  ctx?.revert();
});
</script>
```

## Reference Routing

- For GSAP method details, common vars, transforms, targets, stagger, easing, defaults, and `gsap.matchMedia()`, read `references/core-api.md`.
- Keep project-specific rules in this `SKILL.md`; keep third-party API reference in `references/`.
