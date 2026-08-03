import podcastContentSummary from './library/prompts/podcast-content-summary.md?raw'
import podcastToBlog from './library/prompts/podcast-to-blog.md?raw'
import blogMarkdownPolish from './library/prompts/blog-markdown-polish.md?raw'
import minecraftSkinPreview from './library/prompts/minecraft-skin-preview.md?raw'

export const libraryEntries = [
  {
    id: 'podcast-content-summary',
    type: 'prompt',
    no: '001',
    titleKey: 'library.entries.podcastContentSummary.title',
    descriptionKey: 'library.entries.podcastContentSummary.description',
    detailKey: 'podcastContentSummary',
    content: podcastContentSummary,
    tags: ['podcast', 'summary'],
    platforms: ['ChatGPT', 'Claude', 'Codex'],
    version: 'v1.0.0',
    updated: '2026.08.03',
  },
  {
    id: 'podcast-to-blog',
    type: 'prompt',
    no: '002',
    titleKey: 'library.entries.podcastToBlog.title',
    descriptionKey: 'library.entries.podcastToBlog.description',
    detailKey: 'podcastToBlog',
    content: podcastToBlog,
    tags: ['podcast', 'writing'],
    platforms: ['ChatGPT', 'Claude', 'Codex'],
    version: 'v1.0.0',
    updated: '2026.08.03',
  },
  {
    id: 'blog-markdown-polish',
    type: 'prompt',
    no: '003',
    titleKey: 'library.entries.blogMarkdownPolish.title',
    descriptionKey: 'library.entries.blogMarkdownPolish.description',
    detailKey: 'blogMarkdownPolish',
    content: blogMarkdownPolish,
    tags: ['writing', 'markdown'],
    platforms: ['ChatGPT', 'Claude', 'Codex'],
    version: 'v1.0.0',
    updated: '2026.08.03',
  },
  {
    id: 'minecraft-skin-preview',
    type: 'prompt',
    no: '004',
    titleKey: 'library.entries.minecraftSkinPreview.title',
    descriptionKey: 'library.entries.minecraftSkinPreview.description',
    detailKey: 'minecraftSkinPreview',
    content: minecraftSkinPreview,
    tags: ['minecraft', 'imageGeneration'],
    platforms: ['ChatGPT', 'Gemini'],
    version: 'v1.0.0',
    updated: '2026.08.03',
  },
]

export function getLibraryEntry(id) {
  return libraryEntries.find((entry) => entry.id === id) || null
}
