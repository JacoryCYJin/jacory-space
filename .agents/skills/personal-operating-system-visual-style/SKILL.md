---
name: personal-operating-system-visual-style
description: "Use this skill for any UI, visual design, layout, styling, animation, theme-token, homepage, blog, tools, portfolio, or component work. It enforces the personal operating system visual style: cool-white editorial archive, restrained technical mood, cool-blue accent, hairlines, Geist typography, subtle GSAP-style motion, and no SaaS/card/template look."
---

# Global Visual Style & Color Rule — Personal Operating System

## Scope

* Applies **globally** to the entire project (every page, route, and UI component).
* Governs only the **overall website style, mood, color, typography, layout language, and motion baseline**.
* Does NOT prescribe how any individual page (journal, tools, portfolio, etc.) is laid out — only the shared visual system every page must inherit.
* Shared tokens live in `jacory-space-frontend/src/style.css`; Tailwind token mappings live in `jacory-space-frontend/tailwind.config.js`.
* Shared Vue surfaces live under `jacory-space-frontend/src/components/`, route views live under `jacory-space-frontend/src/views/`, and routes live in `jacory-space-frontend/src/router/`.

## Trigger

* **Always loaded.** This is a foundational style rule and must inform every design or UI decision.
* Path scope: all UI files in `jacory-space-frontend/src/**/*.{vue,js,ts}`, especially `src/views/`, `src/components/`, `src/style.css`, `tailwind.config.js`, and `src/router/`.
* Applies whenever generating, editing, or reviewing any visual surface or theme token.

## Context

* The product is a **personal digital space / digital archive / personal operating system** — not a SaaS app, not a marketing site.
* Mood: high-end, restrained, calm, clean, ordered, quietly technical, slightly mysterious.
* Visual references (blend, do not copy):

  * **Floema** — minimal whitespace, editorial typography, precise order.
  * **The Renaissance Edition** — experimental scroll motion, artful transitions, layered depth.
  * **Hermes Agent** — cool technical tone, terminal / open-source-tool feel, mystery.
* Established conventions already in the codebase:

  * Cool-white background, single cool-blue accent, hairline (1px) dividers, NO shadows, NO cards with elevation.
  * Two type families only: Geist Sans (display + body) and Geist Mono (numbering, indices, technical labels).
  * Utility classes: `.tech` (mono uppercase label), `.hairline` (1px line color), `.reveal` / `.reveal.is-in` (scroll fade+rise), `.grain` (subtle etched noise overlay).
  * Easing baseline: `cubic-bezier(0.16, 1, 0.3, 1)`, ~600–900ms. Default reveal motion primarily uses opacity + small (~14px) translate; advanced GSAP-style effects are allowed when subtle and aligned with the same motion baseline.
* Color tokens are defined as CSS variables in `jacory-space-frontend/src/style.css`; Tailwind exposes them through semantic utilities in `jacory-space-frontend/tailwind.config.js`. The oklch values below are reference equivalents for checking tone, not the current source format.

## Rules

### 1. Overall character

* Every surface must read as a curated archive / operating system: ordered, editorial, architectural, restrained.
* Favor emptiness over density. Whitespace is a primary design material.

### 2. Color (use these exact values)

| Role                    | Token                    | Hex       | oklch                    |
| ----------------------- | ------------------------ | --------- | ------------------------ |
| Background (cool white) | `--background`           | `#f6f8fa` | `oklch(0.985 0.003 247)` |
| Surface / raised paper  | `--card`                 | `#fafbfc` | `oklch(0.992 0.003 247)` |
| Primary text (ink)      | `--foreground` / `--ink` | `#1d2127` | `oklch(0.205 0.014 257)` |
| Secondary text          | `--muted-foreground`     | `#73787f` | `oklch(0.545 0.018 252)` |
| Tertiary / meta (haze)  | `--haze`                 | `#969ba2` | `oklch(0.66 0.02 252)`   |
| Border / hairline       | `--border` / `--line`    | `#dcdfe3` | `oklch(0.9 0.006 250)`   |
| Strong line             | `--line-strong`          | `#c4c9ce` | `oklch(0.82 0.012 252)`  |
| Accent (cool blue)      | `--blue`                 | `#0e66c8` | `oklch(0.52 0.17 256)`   |
| Soft accent             | `--blue-soft`            | `#6f9ad6` | `oklch(0.7 0.1 252)`     |

* Background is always cool white / paper white / near-white. Never warm.
* Text is black-grey ink; accent is cool blue (optionally a cool blue-green in the same family).
* Accent is used **sparingly** — links, a single emphasized word, status dots, the scroll progress line, hover states. Accent must never dominate a viewport.
* Approximate balance: ~92% background, ~6% ink, ~2% accent.
* Always reference semantic tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, `text-blue`, `border-border`/`border-line`, `.hairline`) in Vue templates and shared CSS. Never hardcode raw colors in components unless adding a token to `src/style.css` and mapping it in `tailwind.config.js`.

### 3. Typography

* Two families only: **Geist Sans** (display + body), **Geist Mono** (`.tech` labels, numbering, indices, coordinates, version/status meta).
* Emphasize: large tight-tracked display headings, small mono labels, numbering (`№`, `01 / 24`), index rows, metadata lines.
* Body: line-height 1.4–1.6, measure ≤ ~66 characters, generous spacing between blocks.
* Editorial + architectural feel: negative letter-spacing on big headings; 0.18em uppercase tracking on mono labels.

### 4. Layout

* Use grids (12-col), visible hairlines, module/section numbering, and asymmetric composition.
* Structure itself is the decoration — dividers and indices, not ornament.
* Components should look like a tidy filing/archive system, not an admin dashboard panel.
* Spacing: prefer Tailwind scale + `gap-*`; mobile-first, then enhance.

### 5. Motion

* GSAP-style is allowed. Permitted: scroll-triggered reveals, fade-in, mask reveal, parallax, hover reveal, section transitions, scroll progress indicator.
* Baseline: easing `cubic-bezier(0.16, 1, 0.3, 1)`, ~600–900ms, opacity + small translate (~14px). No bounce, no overshoot.
* Motion must be restrained, smooth, premium — supportive, never showing off.
* Respect `prefers-reduced-motion`.

### 6. Texture

* Allowed: hairline rules, fine `.grain` / etched noise at very low opacity (~0.04), thin underlines.
* These are subtle accents only — never a dominant visual layer.

## Do Not

* Do NOT use warm luxury styling, beige/cream/ivory, yellow or warm tints anywhere.
* Do NOT make it look like a generic SaaS landing page or admin dashboard template.
* Do NOT use colorful / large gradient backgrounds (subtle single-hue accents only, and only if necessary).
* Do NOT use heavy cards, large border-radius (keep `--radius` small, `0.25rem`), or strong/elevated shadows.
* Do NOT scatter random decorative elements (blobs, glows, gradient circles, emoji icons).
* Do NOT give each page a different visual style — all pages inherit this one system.
* Do NOT introduce a third font family or a second prominent accent color.
* Do NOT hardcode hex/rgb colors in components — always use the semantic tokens.

## Verification

* Confirm the page background resolves to cool white (`--background` ≈ `#f6f8fa`) and contains no warm tones.
* Confirm only one accent (cool blue `#0e66c8`) appears, and only in small amounts (links, dots, emphasis, progress line).
* Confirm only Geist Sans + Geist Mono are used; mono is reserved for labels/numbering/meta.
* Confirm no elevated cards, large radii (>~6px), strong shadows, or gradient backgrounds are present.
* Confirm hairline dividers and section/module numbering are used for structure instead of heavy containers.
* Confirm default reveal motion uses the standard easing/duration and primarily uses opacity + small translate. Advanced GSAP-style motion such as mask reveal, parallax, hover reveal, scroll progress, or section transitions is allowed, but must remain subtle, smooth, restrained, and follow the same easing/duration baseline. Verify `prefers-reduced-motion` is honored.
* For frontend UI changes, run `cd jacory-space-frontend && npm run build`. If visual behavior changed, check `bash scripts/dev.sh status` before starting services, then verify in the browser at desktop (~1440px) and mobile widths that the surface reads as an ordered cool archive, not a SaaS panel.
* If a value cannot be verified (e.g. token not rendering due to a stale build), state that explicitly and re-check the compiled CSS rather than assuming.
