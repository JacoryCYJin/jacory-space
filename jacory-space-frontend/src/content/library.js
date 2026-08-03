import minecraftSkinPreview from './library/prompts/minecraft-skin-preview.md?raw'

export const libraryEntries = [
  {
    id: 'minecraft-skin-preview',
    type: 'prompt',
    no: '001',
    titleKey: 'library.entries.minecraftSkinPreview.title',
    descriptionKey: 'library.entries.minecraftSkinPreview.description',
    detailKey: 'minecraftSkinPreview',
    content: minecraftSkinPreview,
    tags: ['minecraft', 'imageGeneration'],
    version: 'v1.0.0',
    updated: '2026.08.03',
  },
]

export function getLibraryEntry(id) {
  return libraryEntries.find((entry) => entry.id === id) || null
}
