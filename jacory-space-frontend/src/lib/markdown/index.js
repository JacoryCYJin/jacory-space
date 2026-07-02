import { buildToc, finalizeFigures, hydrateBlocks, parseFrontmatter } from './blog-extensions.js'
import { parseBlocks } from './blocks.js'

export function parseDocument(raw, { linkPreviews = {}, postMentions = {} } = {}) {
  const { frontmatter, body } = parseFrontmatter(raw)
  const blocks = hydrateBlocks(parseBlocks(body), { linkPreviews, postMentions })
  finalizeFigures(blocks)
  const toc = buildToc(blocks)
  return { frontmatter, blocks, toc }
}
