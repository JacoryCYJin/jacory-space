import { buildToc, finalizeFigures, hydrateBlocks, parseFrontmatter } from './blog-extensions.js'
import { parseBlocks } from './blocks.js'

export function parseDocument(raw, { linkPreviews = {}, postMentions = {}, normalizeBlogHeadings = false } = {}) {
  const { frontmatter, body } = parseFrontmatter(raw)
  const blocks = hydrateBlocks(parseBlocks(body), { linkPreviews, postMentions })
  const hasTopLevelGroups = normalizeBlogHeadings && blocks.some((block) => block.type === 'heading' && block.level === 1)
  if (hasTopLevelGroups) {
    for (const block of blocks) {
      if (block.type !== 'heading') continue
      block.sourceLevel = block.level
      block.level = Math.min(6, block.level + 1)
    }
  }
  finalizeFigures(blocks)
  const toc = buildToc(blocks, { maxLevel: hasTopLevelGroups ? 4 : 3 })
  return { frontmatter, blocks, toc }
}
