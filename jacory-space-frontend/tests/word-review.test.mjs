import test from 'node:test'
import assert from 'node:assert/strict'
import {
  answerWord, createSession, markedIds, previousWord, repeatSession, restoreSession, startSession,
} from '../src/lib/word-review/session.js'
import { handleWordReviewRequest } from '../server/word-review.js'
import { meaningLines } from '../src/lib/word-review/meaning.js'
import { createRenderer } from 'vue'
import { useWordReview } from '../src/composables/useWordReview.js'
import zhWords from '../src/i18n/locales/zh-CN/words.js'
import enWords from '../src/i18n/locales/en-US/words.js'
import jaWords from '../src/i18n/locales/ja-JP/words.js'

test('semicolon display lines preserve every source character and bold span across rich-text boundaries', () => {
  const parts = [
    { text: 'adj. ', bold: false }, { text: '热的，热量的', bold: true },
    { text: '；', bold: false }, { text: '保暖的', bold: true },
    { text: '；温热的；n. 保暖内衣裤；', bold: false }, { text: '上升的热气流', bold: true },
  ]
  const original = JSON.stringify(parts)
  const lines = meaningLines(parts)
  assert.deepEqual(lines.map(line => line.map(part => part.text).join('')), [
    'adj. 热的，热量的；', '保暖的；', '温热的；', 'n. 保暖内衣裤；', '上升的热气流',
  ])
  const styledCharacters = spans => spans.flatMap(part => [...part.text].map(char => ({ char, bold: part.bold })))
  assert.deepEqual(styledCharacters(lines.flat()), styledCharacters(parts))
  assert.equal(JSON.stringify(parts), original)
  assert.deepEqual(meaningLines([{ text: 'first;second;', bold: true }]).map(line => line.map(part => part.text).join('')), ['first;', 'second;'])
  assert.deepEqual(meaningLines([]), [])
})

const viewId = '401b7127-7273-80a1-96f9-000c4cc7c28f'
const queryId = '00000000-0000-4000-8000-000000000001'
const firstId = '00000000-0000-4000-8000-000000000002'
const secondId = '00000000-0000-4000-8000-000000000003'
const batch = {
  viewId, viewName: '每日复习', loadedAt: '2026-10-22T08:00:00.000Z',
  words: [
    { id: firstId, word: 'sample', meaning: [{ text: 'n. 样本', bold: false }] },
    { id: secondId, word: 'example', meaning: [{ text: 'n. 例子', bold: true }] },
  ],
}

test('fresh rounds shuffle without losing words or mutating the source and avoid the preceding first word', () => {
  const source = { ...batch, words: Array.from({ length: 5 }, (_, index) => ({ ...batch.words[0], id: `word-${index}` })) }
  const original = JSON.stringify(source)
  const ids = source.words.map(word => word.id)
  const identity = createSession(source, { random: () => 0.999999 })
  const shuffled = createSession(source, { random: () => 0 })
  assert.notDeepEqual(shuffled.queue, identity.queue)
  assert.deepEqual([...shuffled.queue].sort(), [...ids].sort())
  const next = createSession(source, { random: () => 0.999999, avoidFirstId: ids[0] })
  assert.notEqual(next.queue[0], ids[0])
  assert.deepEqual([...next.queue].sort(), [...ids].sort())
  assert.equal(JSON.stringify(source), original)
  assert.deepEqual(createSession({ ...batch, words: [] }).queue, [])
  assert.deepEqual(createSession({ ...batch, words: [batch.words[0]] }, { avoidFirstId: firstId }).queue, [firstId])
})

test('refresh shuffles only remaining words while preserving completed judgments and their word associations', () => {
  const source = { ...batch, words: Array.from({ length: 5 }, (_, index) => ({ ...batch.words[0], id: `word-${index}` })) }
  let session = startSession(createSession(source, { random: () => 0.999999 }))
  session = answerWord(answerWord(session, true), false)
  const restored = restoreSession(JSON.stringify(session), { random: () => 0.999999 })
  assert.deepEqual(restored.queue.slice(0, 2), session.queue.slice(0, 2))
  assert.deepEqual(restored.answers, session.answers)
  assert.deepEqual(markedIds(restored), markedIds(session))
  assert.notEqual(restored.queue[2], session.queue[2])
  assert.deepEqual(restored.queue.slice(2).sort(), session.queue.slice(2).sort())
  const repeated = repeatSession({ ...session, answers: [true, false, true, false, true], stage: 'complete' }, true, { random: () => 0.999999 })
  assert.deepEqual([...repeated.queue].sort(), ['word-0', 'word-2', 'word-4'])
  assert.notEqual(repeated.queue[0], session.queue[0])
  assert.deepEqual(repeated.answers, [])
  assert.equal(repeated.round, 2)
})

test('two-choice recall commits only after checking, combines unclear and wrong, and clears recovered words on practice', (t) => {
  const saved = new Map()
  const previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: key => saved.get(key) ?? null,
    setItem: (key, value) => saved.set(key, value),
    removeItem: key => saved.delete(key),
  } })
  const renderer = createRenderer({
    createElement: () => ({}), createText: () => ({}), createComment: () => ({}),
    insert() {}, remove() {}, setText() {}, setElementText() {}, patchProp() {},
    parentNode: () => null, nextSibling: () => null,
  })
  let review
  const app = renderer.createApp({ setup() { review = useWordReview(); return () => null } })
  t.after(() => {
    app.unmount()
    if (previousStorage) Object.defineProperty(globalThis, 'localStorage', previousStorage)
    else delete globalThis.localStorage
  })
  app.mount({})
  review.session.value = createSession(batch, { random: () => 0.999999 })
  review.start()
  review.answer(false)
  assert.equal(review.session.value.answers.length, 0)
  review.choose('clear')
  assert.equal(review.revealed.value, true)
  assert.equal(review.session.value.answers.length, 0)
  review.answer(false)
  assert.deepEqual(review.marked.value, [])
  review.choose('unclear')
  review.answer(false)
  assert.deepEqual(review.marked.value, [secondId])
  review.previous()
  assert.equal(review.revealed.value, false)
  assert.equal(review.choice.value, null)
  review.choose('clear')
  review.answer(true)
  assert.deepEqual(review.marked.value, [secondId])
  review.repeat(true)
  assert.deepEqual(review.session.value.queue, [secondId])
  review.choose('clear')
  review.pause()
  review.start()
  assert.equal(review.revealed.value, false)
  assert.equal(review.choice.value, null)
  review.choose('clear')
  review.answer(false)
  assert.equal(review.screen.value, 'complete')
  assert.deepEqual(review.marked.value, [])
  assert.deepEqual(restoreSession([...saved.values()][0]), review.session.value)
})

test('two-choice labels and review instructions have matching keys in all three locales', () => {
  const keys = object => Object.entries(object).flatMap(([key, value]) => typeof value === 'object' ? keys(value).map(child => `${key}.${child}`) : [key]).sort()
  assert.deepEqual(keys(enWords), keys(zhWords))
  assert.deepEqual(keys(jaWords), keys(zhWords))
})

test('a complete round can repeat only marked words or the original full batch without changing its source', () => {
  const original = JSON.stringify(batch)
  let session = startSession(createSession(batch, { random: () => 0.999999 }))
  session = answerWord(session, true)
  session = answerWord(session, false)
  assert.equal(session.stage, 'complete')
  assert.deepEqual(markedIds(session), [firstId])
  session = repeatSession(session, true)
  assert.deepEqual(session.queue, [firstId])
  session = answerWord(session, false)
  assert.deepEqual(markedIds(session), [])
  session = repeatSession(session)
  assert.deepEqual(session.queue, [secondId, firstId])
  assert.equal(JSON.stringify(batch), original)
})

test('returning to a word undoes its mark and allows a different choice, including from the summary', () => {
  let session = startSession(createSession(batch, { random: () => 0.999999 }))
  session = answerWord(session, true)
  session = previousWord(session)
  assert.deepEqual(markedIds(session), [])
  session = answerWord(session, false)
  session = answerWord(session, true)
  session = previousWord(session)
  assert.equal(session.stage, 'review')
  assert.deepEqual(markedIds(session), [])
  session = answerWord(session, false)
  assert.equal(session.stage, 'complete')
  assert.deepEqual(markedIds(session), [])
})

test('resume restores the original batch; corrupt or inconsistent saved progress is rejected', () => {
  const session = answerWord(startSession(createSession(batch, { random: () => 0.999999 })), true)
  assert.deepEqual(restoreSession(JSON.stringify(session)), session)
  assert.equal(restoreSession('{broken'), null)
  assert.equal(restoreSession(JSON.stringify({ ...session, queue: ['missing'] })), null)
  assert.equal(restoreSession(JSON.stringify({ ...session, answers: [true, false, true] })), null)
  assert.equal(restoreSession(JSON.stringify({ ...session, stage: 'complete' })), null)
  assert.equal(restoreSession(JSON.stringify({ ...session, batch: { ...batch, words: [batch.words[0], batch.words[0]] } })), null)
  const transitional = { ...session, version: 2, answers: ['fuzzy'], choice: null }
  assert.deepEqual(restoreSession(JSON.stringify(transitional)), session)
  assert.equal(restoreSession(JSON.stringify({ ...transitional, answers: ['invalid'] })), null)
})

const env = { NOTION_WORD_REVIEW_TOKEN: 'test-notion-token', WORD_REVIEW_ACCESS_KEY: 'test-access-passphrase' }
const request = (method = 'GET', key = env.WORD_REVIEW_ACCESS_KEY, headers = {}) => new Request('http://localhost:3001/api/word-review', {
  method, headers: { Authorization: `Bearer ${key}`, ...headers },
})
const response = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
const richText = (text, bold = false) => ({ plain_text: text, annotations: { bold } })
function page(id, word, meaning = [richText('n. '), richText('样本', true), richText('；例子')]) {
  return { object: 'page', id, properties: {
    单词: { type: 'title', title: [richText(word)] },
    中文释义: { id: 'meaning', type: 'rich_text', rich_text: meaning },
  } }
}

test('missing configuration, wrong passphrase, cross-origin access and write methods never call Notion', async () => {
  const fetchImpl = () => { throw new Error('must not call Notion') }
  for (const [req, config, status] of [
    [request(), {}, 503],
    [request('GET', 'wrong'), env, 401],
    [request('GET', env.WORD_REVIEW_ACCESS_KEY, { Origin: 'https://unrelated.example' }), env, 403],
    [request('POST'), env, 405], [request('PATCH'), env, 405], [request('DELETE'), env, 405],
  ]) {
    assert.equal((await handleWordReviewRequest(req, config, { fetchImpl })).status, status)
  }
})

test('hydrates page-ID-only view results across pagination in source order, preserving text and bold without updating Notion', async () => {
  const calls = []
  const fetchImpl = async (url, init) => {
    calls.push({ url, method: init.method, body: init.body })
    assert.equal(init.headers.Authorization, `Bearer ${env.NOTION_WORD_REVIEW_TOKEN}`)
    if (url.endsWith(`/views/${viewId}`)) return response({ object: 'view', name: '每日复习' })
    if (url.endsWith(`/pages/${firstId}`)) return response(page(firstId, 'sample'))
    if (url.endsWith(`/pages/${secondId}`)) return response(page(secondId, 'example'))
    if (url.endsWith('/queries')) return response({ id: queryId, results: [{ object: 'page', id: firstId }], has_more: true, next_cursor: 'next page' })
    assert.ok(url.includes('start_cursor=next%20page'))
    return response({ results: [{ object: 'page', id: firstId }, { object: 'page', id: secondId }], has_more: false })
  }
  const result = await handleWordReviewRequest(request(), env, { fetchImpl, now: () => new Date(batch.loadedAt) })
  assert.equal(result.status, 200)
  assert.equal(result.headers.get('Cache-Control'), 'private, no-store')
  const data = await result.json()
  assert.deepEqual(data.words.map(word => word.id), [firstId, secondId])
  assert.deepEqual(data.words[0].meaning, [{ text: 'n. ', bold: false }, { text: '样本', bold: true }, { text: '；例子', bold: false }])
  assert.deepEqual(calls.map(call => call.method), ['GET', 'POST', 'GET', 'GET', 'GET'])
  assert.deepEqual(JSON.parse(calls[1].body), { page_size: 100 })
  assert.deepEqual(calls.filter(call => call.url.includes('/pages/')).map(call => call.url), [
    `https://api.notion.com/v1/pages/${firstId}`,
    `https://api.notion.com/v1/pages/${secondId}`,
  ])
  assert.ok(calls.every(call => call.method === 'GET' || (call.method === 'POST' && call.url.endsWith(`/views/${viewId}/queries`))))
  assert.ok(!JSON.stringify(data).includes(env.NOTION_WORD_REVIEW_TOKEN))
})

test('full page results and page references can coexist without re-fetching complete entries', async () => {
  const details = []
  const fetchImpl = async (url) => {
    if (url.endsWith(`/views/${viewId}`)) return response({ object: 'view', name: '每日复习' })
    if (url.endsWith('/queries')) return response({ id: queryId, results: [page(firstId, 'sample'), { object: 'page', id: secondId }], has_more: false })
    details.push(url)
    return response(page(secondId, 'example'))
  }
  const result = await handleWordReviewRequest(request(), env, { fetchImpl })
  assert.equal(result.status, 200)
  assert.deepEqual((await result.json()).words.map(word => word.word), ['sample', 'example'])
  assert.deepEqual(details, [`https://api.notion.com/v1/pages/${secondId}`])
})

test('failed or mismatched page-detail reads cannot silently produce a partial or unrelated word batch', async () => {
  for (const detail of [response({ code: 'object_not_found' }, 404), response(page(firstId, 'unrelated'))]) {
    const fetchImpl = async (url) => {
      if (url.endsWith(`/views/${viewId}`)) return response({ object: 'view', name: '每日复习' })
      if (url.endsWith('/queries')) return response({ id: queryId, results: [page(firstId, 'sample'), { object: 'page', id: secondId }], has_more: false })
      return detail
    }
    const result = await handleWordReviewRequest(request(), env, { fetchImpl })
    assert.equal(result.status, 502)
    const data = await result.json()
    assert.ok(['SOURCE_ACCESS', 'SOURCE_FORMAT'].includes(data.error))
    assert.equal(data.words, undefined)
  }
})

test('long rich text is retrieved across property pages instead of silently dropping definitions', async () => {
  const long = page(firstId, 'sample', Array.from({ length: 25 }, () => richText('fragment')))
  let propertyCalls = 0
  const fetchImpl = async (url) => {
    if (url.endsWith(`/views/${viewId}`)) return response({ object: 'view', name: '每日复习' })
    if (url.endsWith('/queries')) return response({ id: queryId, results: [long], has_more: false })
    propertyCalls++
    return response(propertyCalls === 1
      ? { results: [{ rich_text: richText('n. ') }], has_more: true, next_cursor: 'remaining' }
      : { results: [{ rich_text: richText('完整释义', true) }], has_more: false })
  }
  const result = await handleWordReviewRequest(request(), env, { fetchImpl })
  const data = await result.json()
  assert.equal(propertyCalls, 2)
  assert.deepEqual(data.words[0].meaning, [{ text: 'n. ', bold: false }, { text: '完整释义', bold: true }])
})

test('empty views are valid; upstream failures and broken pagination are errors, not empty success', async () => {
  const empty = await handleWordReviewRequest(request(), env, { fetchImpl: async (url) => response(url.endsWith('/queries')
    ? { id: queryId, results: [], has_more: false }
    : { object: 'view', name: '每日复习' }) })
  assert.equal(empty.status, 200)
  assert.deepEqual((await empty.json()).words, [])

  const denied = await handleWordReviewRequest(request(), env, { fetchImpl: async () => response({ privateMessage: 'private upstream details' }, 403) })
  assert.equal(denied.status, 502)
  assert.deepEqual(await denied.json(), { error: 'SOURCE_ACCESS' })

  const broken = await handleWordReviewRequest(request(), env, { fetchImpl: async (url) => response(url.endsWith(`/views/${viewId}`)
    ? { object: 'view', name: '每日复习' }
    : { id: queryId, results: [], has_more: true, next_cursor: 'repeated' }) })
  assert.equal(broken.status, 502)
  assert.deepEqual(await broken.json(), { error: 'SOURCE_FORMAT' })
})
