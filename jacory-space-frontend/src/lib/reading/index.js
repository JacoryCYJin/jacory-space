import { parseBook } from './parser.js'
const files = import.meta.glob('../../content/reading/*.md', { query: '?raw', import: 'default', eager: true })
export const books = Object.entries(files).sort(([a], [b]) => a.localeCompare(b)).map(([path, raw]) => parseBook(raw, path.split('/').pop().replace(/\.md$/, ''))).filter(book => import.meta.env.DEV || !book.sample)
