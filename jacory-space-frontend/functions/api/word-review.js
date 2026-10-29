import { handleWordReviewRequest } from '../../server/word-review.js'

// Optional Cloudflare Pages adapter. The same handler runs in local Vite.
export function onRequest({ request, env }) {
  return handleWordReviewRequest(request, env)
}
