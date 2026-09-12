import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

const loadingAvatarPath = fileURLToPath(new URL('./src/assets/home-loading/jacory-o-avatar.png', import.meta.url))

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  build: {
    // The loading identity must not depend on a separate image request completing.
    assetsInlineLimit: (filePath) => filePath === loadingAvatarPath ? true : undefined,
  },
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
