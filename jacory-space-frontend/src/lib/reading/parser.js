import { parseFrontmatter } from '../markdown/blog-extensions.js'

// Hour-precision entries use Asia/Shanghai (UTC+08:00). Date-only legacy
// entries retain their unknown hour and sort after timed entries on that day.
export function parseRecordedTime(value) {
  const match = /^(\d{4}-\d{2}-\d{2})(?: (\d{2}))?$/.exec(value)
  if (!match) throw new Error('Expected YYYY-MM-DD HH or YYYY-MM-DD')
  const [, date, hour] = match
  if (!Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date || (hour !== undefined && Number(hour) > 23)) throw new Error('Invalid recording time: ' + value)
  return {
    date,
    recordedAt: hour === undefined ? date : date + 'T' + hour + ':00:00+08:00',
    sortKey: date + ' ' + (hour ?? '--'),
  }
}

export function parseBook(raw, slug) {
  const { frontmatter, body } = parseFrontmatter(raw.replace(/\r\n/g, '\n'))
  const fail = (message) => { throw new Error('[reading] ' + slug + ': ' + message) }
  if (!frontmatter.title?.trim()) fail('Missing title')
  const ids = new Set()
  const excerpts = body.split(/^##\s+/m).slice(1).map((section) => {
    const [heading, ...lines] = section.split('\n')
    const id = heading.trim()
    if (!/^\d+$/.test(id) || ids.has(id)) fail('Invalid or duplicate excerpt ID: ' + id)
    ids.add(id)
    const text = lines.filter(line => /^>/.test(line)).map(line => line.replace(/^> ?/, '')).join('\n').trim()
    const timeValue = lines.find(line => /^摘录(?:时间|日期)：/.test(line))?.slice(5).trim() || ''
    if (!text) fail('Empty excerpt: ' + id)
    let recordedTime
    try { recordedTime = parseRecordedTime(timeValue) } catch { fail('Invalid recording time: ' + id) }
    const noteStart = lines.findIndex(line => /^随记：/.test(line))
    const note = noteStart < 0 ? '' : lines.slice(noteStart).join('\n').replace(/^随记：/, '').trim()
    return { id, text, ...recordedTime, note }
  })
  return { slug, title: frontmatter.title, author: frontmatter.author || '', edition: frontmatter.edition || '', sample: frontmatter.sample === 'true', excerpts }
}

export function filterBooks(books, query) {
  const needle = query.trim().toLocaleLowerCase()
  if (!needle) return books
  return books.map(book => {
    const matchesBook = [book.title, book.author].some(value => value.toLocaleLowerCase().includes(needle))
    return { ...book, excerpts: matchesBook ? book.excerpts : book.excerpts.filter(item => [item.text, item.note].some(value => value.toLocaleLowerCase().includes(needle))) }
  }).filter(book => book.excerpts.length)
}

export function groupExcerptsByDate(books) {
  const entries = books.flatMap(book => book.excerpts.map(excerpt => ({
    ...excerpt, bookSlug: book.slug, bookTitle: book.title, sample: book.sample,
  }))).sort((a, b) => b.sortKey.localeCompare(a.sortKey) || a.bookSlug.localeCompare(b.bookSlug) || a.id.localeCompare(b.id, undefined, { numeric: true }))
  const groups = new Map()
  for (const [index, excerpt] of entries.entries()) {
    if (!groups.has(excerpt.date)) groups.set(excerpt.date, { slug: 'date-' + excerpt.date, title: excerpt.date, excerpts: [] })
    groups.get(excerpt.date).excerpts.push({ ...excerpt, displayNumber: String(index + 1).padStart(3, '0') })
  }
  return [...groups.values()]
}
