# Jacory Space Frontend

Vite + Vue 3 + Tailwind CSS frontend for the Jacory Space personal website.

The media parser runtime has moved to the separate `media-parser` desktop application repository. This frontend keeps the public introduction pages and release links, but no longer proxies `/api` requests to a local backend.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

Development server: `http://localhost:3001`

## Structure

```text
jacory-space-frontend/
├── src/
│   ├── components/
│   ├── content/
│   ├── i18n/
│   ├── router/
│   ├── views/
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── vite.config.js
├── tailwind.config.js
└── package.json
```
