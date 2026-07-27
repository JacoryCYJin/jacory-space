import { mkdir, readdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))
const appDir = join(rootDir, '..')
const publicDir = join(appDir, 'public')
const blogDir = join(appDir, 'src', 'content', 'blog')
const siteUrl = 'https://jacoryspace.top'

const staticPaths = [
  '/',
  '/tools',
  '/tools/media-parser',
  '/tools/minecraft-skin-editor',
  '/blog',
  '/about',
]

const xmlEscape = (value) => value.replace(/[<>&'\"]/g, (character) => ({
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  "'": '&apos;',
  '"': '&quot;',
}[character]))

const files = await readdir(blogDir)
const blogPaths = files
  .filter((file) => file.endsWith('.md') && file !== '999-markdown-parser-fixture.md')
  .map((file) => `/blog/${file.replace(/\.md$/, '')}`)
  .sort()

const urls = [...staticPaths, ...blogPaths]
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((path) => `  <url><loc>${xmlEscape(new URL(path, siteUrl).href)}</loc></url>`),
  '</urlset>',
  '',
].join('\n')

const robots = [
  'User-agent: *',
  'Allow: /',
  '',
  `Sitemap: ${siteUrl}/sitemap.xml`,
  '',
].join('\n')

await mkdir(publicDir, { recursive: true })
await Promise.all([
  writeFile(join(publicDir, 'sitemap.xml'), sitemap),
  writeFile(join(publicDir, 'robots.txt'), robots),
])

console.log(`Generated SEO assets for ${urls.length} public URLs.`)
