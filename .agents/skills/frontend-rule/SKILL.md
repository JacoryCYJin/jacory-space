---
name: jacory-space-frontend-rule
description: Jacory Space frontend UI rule for files under jacory-space-frontend. Use when editing Vue, Tailwind, UI components, pages, navigation, buttons, cards, status messages, or any visual frontend code. Do not use emoji as UI icons; use SVG components or an icon library such as lucide-vue-next.
---

# jacory-space-frontend-rule

Use this skill when editing files under `jacory-space-frontend/`.

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
