import { ViteSSG } from 'vite-ssg'
import './style.css'
import App from './App.vue'
import { routes } from './router'
import { i18n } from './i18n'
import { getAllPostMeta } from './lib/blog/index.js'

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app }) => {
    app.use(i18n)
  },
)

export async function includedRoutes(paths) {
  const posts = await getAllPostMeta()
  const publicPosts = posts
    .filter((post) => post.slug !== '999-markdown-parser-fixture')
    .map((post) => `/blog/${post.slug}`)

  return [
    ...paths.filter((path) => !path.includes(':') && !['/media-parser', '/video-parser', '/podcast-parser'].includes(path)),
    ...publicPosts,
  ]
}
