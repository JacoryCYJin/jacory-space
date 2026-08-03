export const libraryEntries = [
  {
    id: 'structured-prompt-builder',
    type: 'prompt',
    no: '001',
    titleKey: 'library.entries.structuredPromptBuilder.title',
    descriptionKey: 'library.entries.structuredPromptBuilder.description',
    detailKey: 'structuredPromptBuilder',
    tags: ['Prompt Design', 'Writing'],
    platform: 'ChatGPT / Claude / Codex',
    version: 'v0.1.0',
    updated: '2026.08.03',
  },
  {
    id: 'field-note-editor',
    type: 'prompt',
    no: '002',
    titleKey: 'library.entries.fieldNoteEditor.title',
    descriptionKey: 'library.entries.fieldNoteEditor.description',
    detailKey: 'fieldNoteEditor',
    tags: ['Writing', 'Research'],
    platform: 'ChatGPT / Claude',
    version: 'v0.1.0',
    updated: '2026.07.28',
  },
  {
    id: 'research-synthesis',
    type: 'skill',
    no: '003',
    titleKey: 'library.entries.researchSynthesis.title',
    descriptionKey: 'library.entries.researchSynthesis.description',
    detailKey: 'researchSynthesis',
    tags: ['Agent Skill', 'Research'],
    platform: 'Claude / Codex',
    version: 'v0.1.0',
    updated: '2026.08.01',
  },
]

export function getLibraryEntry(id) {
  return libraryEntries.find((entry) => entry.id === id) || null
}
