// Only read-capability Notion operations belong in this module. A view query is
// a temporary read result, not a modification to its view, pages, or properties.
const DEFAULT_VIEW_ID = '401b7127-7273-80a1-96f9-000c4cc7c28f'
const NOTION_VERSION = '2026-03-11'
const UUID = /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i

class SourceError extends Error {
  constructor(code) { super(code); this.code = code }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
      Vary: 'Authorization',
    },
  })
}

function sameKey(actual, expected) {
  let difference = actual.length ^ expected.length
  for (let i = 0; i < Math.max(actual.length, expected.length); i++) {
    difference |= (actual.charCodeAt(i) || 0) ^ (expected.charCodeAt(i) || 0)
  }
  return difference === 0
}

function propertyPath(id) {
  // Notion property IDs can already be URL-encoded.
  try { return encodeURIComponent(decodeURIComponent(id)) }
  catch { throw new SourceError('SOURCE_FORMAT') }
}

export async function readDailyWords(env, { fetchImpl = fetch, now = () => new Date() } = {}) {
  const viewId = env.NOTION_WORD_REVIEW_VIEW_ID || DEFAULT_VIEW_ID
  if (!UUID.test(viewId)) throw new SourceError('SOURCE_FORMAT')
  const deadline = Date.now() + 45000

  async function notion(path, method = 'GET', body) {
    for (let attempt = 0; attempt < 3; attempt++) {
      if (Date.now() >= deadline) throw new SourceError('SOURCE_UNAVAILABLE')
      const response = await fetchImpl(`https://api.notion.com/v1/${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${env.NOTION_WORD_REVIEW_TOKEN}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type': 'application/json',
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
        signal: AbortSignal.timeout(Math.min(12000, deadline - Date.now())),
      })
      if (response.status === 429) {
        if (attempt === 2) throw new SourceError('SOURCE_BUSY')
        const seconds = Number(response.headers.get('Retry-After')) || 1
        if (seconds > 10) throw new SourceError('SOURCE_BUSY')
        await new Promise(resolve => setTimeout(resolve, Math.max(1, seconds) * 1000))
        continue
      }
      if ([401, 403, 404].includes(response.status)) throw new SourceError('SOURCE_ACCESS')
      if (!response.ok) throw new SourceError('SOURCE_UNAVAILABLE')
      return response.json()
    }
  }

  const view = await notion(`views/${viewId}`)
  if (view.object !== 'view' || typeof view.name !== 'string') throw new SourceError('SOURCE_FORMAT')
  let result = await notion(`views/${viewId}/queries`, 'POST', { page_size: 100 })
  if (typeof result.id !== 'string' || !UUID.test(result.id)) throw new SourceError('SOURCE_FORMAT')
  const queryId = result.id
  const pages = []
  const cursors = new Set()
  while (true) {
    if (!Array.isArray(result.results)) throw new SourceError('SOURCE_FORMAT')
    pages.push(...result.results)
    if (!result.has_more) break
    if (!result.next_cursor || cursors.has(result.next_cursor) || cursors.size >= 100) throw new SourceError('SOURCE_FORMAT')
    cursors.add(result.next_cursor)
    result = await notion(`views/${viewId}/queries/${queryId}?page_size=100&start_cursor=${encodeURIComponent(result.next_cursor)}`)
  }

  async function textProperty(page, name, type) {
    const property = page.properties?.[name]
    if (!property || property.type !== type || !Array.isArray(property[type])) throw new SourceError('SOURCE_FORMAT')
    const inline = property[type]
    // Retrieve paginated property items when the inline property may be capped.
    if (inline.length < 25 && !property.has_more) return inline
    if (!property.id) throw new SourceError('SOURCE_FORMAT')
    const items = []
    const seen = new Set()
    let cursor = ''
    do {
      const suffix = cursor ? `&start_cursor=${encodeURIComponent(cursor)}` : ''
      const data = await notion(`pages/${page.id}/properties/${propertyPath(property.id)}?page_size=100${suffix}`)
      if (!Array.isArray(data.results)) throw new SourceError('SOURCE_FORMAT')
      for (const item of data.results) {
        if (!item[type]) throw new SourceError('SOURCE_FORMAT')
        items.push(item[type])
      }
      if (!data.has_more) break
      cursor = data.next_cursor
      if (!cursor || seen.has(cursor) || seen.size >= 100) throw new SourceError('SOURCE_FORMAT')
      seen.add(cursor)
    } while (true)
    return items
  }

  const words = []
  const seenIds = new Set()
  for (const entry of pages) {
    if (entry.object !== 'page' || !UUID.test(entry.id)) throw new SourceError('SOURCE_FORMAT')
    if (seenIds.has(entry.id)) continue
    // View queries can return page references containing only object/id.
    // Read their properties separately, retaining the view's original order.
    const page = entry.properties ? entry : await notion(`pages/${entry.id}`)
    if (page.object !== 'page' || page.id !== entry.id) throw new SourceError('SOURCE_FORMAT')
    seenIds.add(entry.id)
    const title = await textProperty(page, '单词', 'title')
    const meaning = await textProperty(page, '中文释义', 'rich_text')
    const word = title.map(item => item.plain_text ?? item.text?.content ?? '').join('').trim()
    if (!word) throw new SourceError('SOURCE_FORMAT')
    words.push({
      id: page.id,
      word,
      meaning: meaning.map(item => ({
        text: item.plain_text ?? item.text?.content ?? '',
        bold: item.annotations?.bold === true,
      })),
    })
  }
  return { viewId, viewName: view.name, loadedAt: now().toISOString(), words }
}

export async function handleWordReviewRequest(request, env, dependencies) {
  if (request.method !== 'GET') return json({ error: 'METHOD_NOT_ALLOWED' }, 405)
  const origin = request.headers.get('Origin')
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get('Sec-Fetch-Site') === 'cross-site') {
    return json({ error: 'FORBIDDEN' }, 403)
  }
  if (!env.NOTION_WORD_REVIEW_TOKEN || !env.WORD_REVIEW_ACCESS_KEY) return json({ error: 'NOT_CONFIGURED' }, 503)
  const key = request.headers.get('Authorization') || ''
  if (!sameKey(key, `Bearer ${env.WORD_REVIEW_ACCESS_KEY}`)) return json({ error: 'AUTH_REQUIRED' }, 401)
  try {
    return json(await readDailyWords(env, dependencies))
  } catch (error) {
    // Do not forward Notion response bodies, tokens, or private page details.
    return json({ error: error instanceof SourceError ? error.code : 'SOURCE_UNAVAILABLE' }, 502)
  }
}
