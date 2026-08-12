export default {
  blog: {
    badge: 'Jacory Blog',
    title: 'Personal Blog',
    subtitle: 'Development notes, toolmaking practice, and observations from everyday life—shaped into writing worth revisiting.',
    readMore: 'Read More',
    directionTitle: 'Topics',
    writingPlanTitle: 'Writing Plan',
    writingPlanDescription: 'This space will collect project retrospectives, development notes, and practical toolmaking lessons. Dedicated article pages and a Markdown publishing system will follow.',
    posts: {
      site: {
        title: 'The First Step Toward a Personal Site',
        readingTime: '5 min read',
        summary: 'A look at the page structure, color system, and tool entry points that give Jacory Space a clear foundation.',
        tags: ['Personal Site', 'Vue', 'Tailwind']
      },
      parser: {
        title: 'Design Notes from the Video Parser',
        readingTime: '7 min read',
        summary: 'How the parser moves from a pasted URL to format selection and download settings, with notes on what could improve next.',
        tags: ['Tooling', 'Node.js', 'yt-dlp']
      },
      workflow: {
        title: 'Why Workflow Rules Matter',
        readingTime: '4 min read',
        summary: 'Documenting branch, commit, PR, and merge conventions reduces repeated coordination and makes collaboration easier to review.',
        tags: ['Git', 'Collaboration', 'Workflow']
      },
      writing: {
        title: 'Turning Fragments into Publishable Notes',
        readingTime: '6 min read',
        summary: 'A lightweight rhythm of capture, selection, and revision helps scattered ideas become publishable writing.',
        tags: ['Writing', 'Creation', 'Review']
      }
    },
    categories: {
      project: 'Project Reviews',
      development: 'Development Notes',
      workflow: 'Workflow',
      life: 'Life Notes'
    },
    fieldNotes: {
      journalLabel: '02 — Notes',
      archiveOpen: '{count} entries / archive open',
      titleLead: 'Field',
      titleAccent: ' Notes',
      subtitleLead: 'The public journal of a Personal OS',
      subtitleBody: 'Every note is an unsent letter; every archive is an unfinished proof of self.',
      readEntry: 'Read entry',
      archiveAll: 'Archive — All Entries',
      filterLabel: 'Filter',
      filterCategory: 'Category',
      filterTopic: 'Topic',
      filterYear: 'Year',
      filterAria: 'Filter blog archive',
    },
    post: {
      onThisNote: 'On this note',
      backToFieldNotes: 'Back to Field Notes',
      previousEntry: 'Previous Entry',
      nextEntry: 'Next Entry',
      fieldNote: 'FIELD NOTE',
      headerLabel: '№ {index} — {category}',
      navAria: 'Article navigation',
      notFoundBadge: 'Error 404 / entry not found',
      notFoundTitle: 'This entry does not exist'
    },
    entryCategories: {
      WEEKLY: 'WEEKLY',
      RESEARCH: 'RESEARCH',
      THINKING: 'THINKING',
      METHOD: 'METHOD'
    },
    entryTopics: {
      PRODUCT: 'PRODUCT'
    }
  }
}
