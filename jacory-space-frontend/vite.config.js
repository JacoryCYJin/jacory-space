import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  resolve: {
    alias: {
      '@library-index': fileURLToPath(new URL(
        command === 'serve' ? './src/content/library.development.js' : './src/content/library.js',
        import.meta.url,
      )),
    },
  },
  server: {
    port: 3001,
  },
  ssr: {
    noExternal: ['gsap'],
  },
}))
