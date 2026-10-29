export const STORAGE_KEY = 'jacory-word-review-v1'

export function isBatch(batch) {
  if (!batch || typeof batch.viewId !== 'string' || typeof batch.viewName !== 'string' || !Number.isFinite(Date.parse(batch.loadedAt)) || !Array.isArray(batch.words)) return false
  const ids = new Set()
  return batch.words.every(word => {
    if (!word || typeof word.id !== 'string' || !word.id || ids.has(word.id) || typeof word.word !== 'string' || !word.word.trim() || !Array.isArray(word.meaning)) return false
    ids.add(word.id)
    return word.meaning.every(part => part && typeof part.text === 'string' && typeof part.bold === 'boolean')
  })
}

function shuffleIds(ids, { random = Math.random, avoidFirstId } = {}) {
  const shuffled = [...ids]
  for (let index = shuffled.length - 1; index > 0; index--) {
    const target = Math.floor(random() * (index + 1))
    ;[shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]]
  }
  if (shuffled.length > 1 && shuffled[0] === avoidFirstId) {
    const target = 1 + Math.floor(random() * (shuffled.length - 1))
    ;[shuffled[0], shuffled[target]] = [shuffled[target], shuffled[0]]
  }
  return shuffled
}

export function createSession(batch, options) {
  if (!isBatch(batch)) throw new Error('Invalid batch')
  return { version: 1, batch, queue: shuffleIds(batch.words.map(word => word.id), options), answers: [], round: 1, stage: 'ready' }
}

export function restoreSession(raw, options) {
  try {
    let session = JSON.parse(raw)
    if (session?.version === 2 && Array.isArray(session.answers)) {
      if (session.answers.some(value => !['clear', 'fuzzy', 'unclear', 'wrong'].includes(value))) return null
      const { choice, ...saved } = session
      session = { ...saved, version: 1, answers: session.answers.map(value => value !== 'clear') }
    }
    if (session?.version !== 1 || !isBatch(session.batch) || !Number.isInteger(session.round) || session.round < 1) return null
    if (!['ready', 'review', 'complete'].includes(session.stage) || !Array.isArray(session.queue) || !Array.isArray(session.answers)) return null
    const ids = new Set(session.batch.words.map(word => word.id))
    if (session.queue.some(id => !ids.has(id)) || new Set(session.queue).size !== session.queue.length) return null
    if (session.answers.length > session.queue.length || session.answers.some(value => typeof value !== 'boolean')) return null
    if (session.stage === 'ready' && session.answers.length !== 0) return null
    if (session.stage === 'review' && session.answers.length >= session.queue.length) return null
    if (session.stage === 'complete' && session.answers.length !== session.queue.length) return null
    const done = session.answers.length
    const remaining = session.queue.slice(done)
    return {
      ...session,
      queue: [...session.queue.slice(0, done), ...shuffleIds(remaining, { ...options, avoidFirstId: remaining[0] })],
    }
  } catch { return null }
}

export function startSession(session) {
  return { ...session, stage: session.queue.length ? 'review' : 'complete' }
}

export function answerWord(session, again) {
  if (session.stage !== 'review' || session.answers.length >= session.queue.length) return session
  const answers = [...session.answers, Boolean(again)]
  return { ...session, answers, stage: answers.length === session.queue.length ? 'complete' : 'review' }
}

export function previousWord(session) {
  if (!session.answers.length) return session
  return { ...session, answers: session.answers.slice(0, -1), stage: 'review' }
}

export function markedIds(session) {
  return session.queue.filter((id, index) => session.answers[index] === true)
}

export function repeatSession(session, onlyMarked = false, options) {
  const queue = onlyMarked ? markedIds(session) : session.batch.words.map(word => word.id)
  if (!queue.length) return session
  return {
    ...session,
    queue: shuffleIds(queue, { ...options, avoidFirstId: session.queue[0] }),
    answers: [], round: session.round + 1, stage: 'review',
  }
}
