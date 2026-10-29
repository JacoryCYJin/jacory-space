import { loadEnv } from 'vite'
import { handleWordReviewRequest } from './word-review.js'

export function wordReviewPlugin() {
  let env
  function install(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url?.split('?')[0] !== '/api/word-review') return next()
      try {
        const request = new Request(`http://${req.headers.host}${req.url}`, {
          method: req.method,
          headers: req.headers,
        })
        const response = await handleWordReviewRequest(request, env)
        res.writeHead(response.status, Object.fromEntries(response.headers))
        res.end(await response.text())
      } catch {
        res.writeHead(500, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
        res.end(JSON.stringify({ error: 'SOURCE_UNAVAILABLE' }))
      }
    })
  }
  return {
    name: 'word-review-read-only',
    configResolved(config) {
      env = { ...loadEnv(config.mode, config.envDir, ''), ...process.env }
    },
    configureServer: install,
    configurePreviewServer: install,
  }
}
