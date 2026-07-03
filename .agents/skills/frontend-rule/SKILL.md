---
name: jacory-space-frontend-rule
description: Jacory Space frontend UI rule for files under jacory-space-frontend. Use when editing Vue, Tailwind, UI components, pages, navigation, buttons, cards, status messages, or any visual frontend code. Do not use emoji as UI icons; use SVG components or an icon library such as lucide-vue-next.
---

# jacory-space-frontend-rule

Use this skill when editing files under `jacory-space-frontend/`.

## Styles

- Prefer Tailwind utility classes directly in Vue template `class` attributes for colors, spacing, layout, positioning, and typography.
- Use scoped CSS classes only when a style block is reused by multiple elements/components, or when Tailwind cannot express the property cleanly, such as complex transforms, letter spacing, pseudo-elements, or keyframes.
- Do not create a one-off `.xxx` class just to wrap a few utility classes used once.
- For visual direction, color palette, motion baseline, layout mood, and page-level surface decisions, also use `personal-operating-system-visual-style`.

## Icons

- Do not use emoji as UI icons, such as `🎬`, `📺`, `🔑`, `📁`, or `✓`.
- Use icons instead: SVG components or an icon library such as `@heroicons/vue` or `lucide-vue-next`.
- Buttons, navigation, decorative card icons, and status hints should all use icon components.

```vue
<!-- BAD -->
<button>🔑 Cookies 设置</button>
<span class="text-2xl">📺</span>

<!-- GOOD -->
<button>
  <KeyIcon class="w-4 h-4" />
  Cookies 设置
</button>
<MonitorPlayIcon class="w-6 h-6" />
```

When adding a new icon dependency, prefer a lightweight library that works well with Tailwind. Do not handwrite large SVG blocks for a single icon unless the project already has a unified icon component pattern.

## Typography

- Use Tailwind named font sizes (`text-xs`, `text-sm`, `text-base`, etc.) and choose the closest standard step.
- Do not use arbitrary text sizes such as `text-[0.78rem]` or `text-[11px]`; do not write `font-size` in `<style>`.
- For 10px/11px-like labels, converge to `text-xs`; use `text-sm` for stronger hierarchy.
- Use `font-sans` for body/headings and `font-mono` for numbers, coordinates, status, and meta.
- Keep `<style>` for properties Tailwind cannot express cleanly (`letter-spacing`, `transform`, positioning, token color, `text-transform`). Use semantic token classes or CSS variables for color.

## Illustrations And Grain

- The visual system defines the canonical background and texture usage; do not restate those values here.
- When a page already uses the global `grain` layer, do not add another local `grain` layer to illustration containers.
- Illustrations should sit beneath the existing page-level `grain::after` overlay, for example with `relative z-0` on the image when the stacking order needs to be explicit.
- Do not duplicate grain on a `<figure>` or illustration wrapper just to blend an image into the page; that makes the local texture heavier than the surrounding background.
