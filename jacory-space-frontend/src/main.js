import { ViteSSG } from 'vite-ssg'
import './style.css'
import App from './App.vue'
import { routes } from './router'
import { i18n } from './i18n'
import { getAllPostMeta } from './lib/blog/index.js'
import { libraryEntries } from './content/library.js'

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
  const publicLibraryEntries = libraryEntries.map((entry) => '/library/' + entry.id)

  return [
    ...paths.filter((path) => !path.includes(':') && !['/media-parser', '/video-parser', '/podcast-parser'].includes(path)),
    ...publicPosts,
    ...publicLibraryEntries,
  ]
}
