export default {
  nav: {
    home: 'Home',
    tools: 'Tools',
    videoParser: 'Video Parser',
    blog: 'Blog',
    about: 'About'
  },
  language: {
    label: 'Switch language',
    zh: '中文',
    en: 'English',
    ja: '日本語'
  },
  home: {
    title: 'Welcome to Jacory Space',
    subtitle: 'Building with technology, documenting life, exploring what comes next',
    hero: {
      description: 'A digital space for personal work, tools, notes, and archives.',
      keywords: 'Works · Tools · Notes · Archive'
    },
    actions: {
      videoParser: 'Try Video Parser',
      about: 'Learn More'
    },
    cards: {
      video: {
        title: 'Video Parser',
        description: 'Parse videos across platforms and choose from multiple download resolutions.',
        action: 'Open Tool'
      },
      blog: {
        title: 'Blog Posts',
        description: 'Technical notes, learning logs, and life reflections.',
        action: 'View Posts'
      },
      tools: {
        title: 'More Tools',
        description: 'More ideas are taking shape.',
        status: 'Coming Soon'
      }
    }
  },
  tools: {
    interfaceIndex: {
      kicker: '01 — INTERFACE INDEX',
      description: 'A curated index of tools, works, interface experiments, and system components.',
      categoriesAria: 'Interface categories',
      summaryLabel: 'SUMMARY',
      lastUpdateLabel: 'LAST UPDATE',
      filters: {
        all: 'ALL',
        tools: 'TOOLS',
        works: 'WORKS',
        experiments: 'EXPERIMENTS',
        archived: 'ARCHIVED'
      },
      categoryDescriptions: {
        all: 'The complete spatial index, including every entry.',
        tools: 'Foundational utilities and interface elements.',
        works: 'Published projects and case studies.',
        experiments: 'Research, prototypes, and explorations.'
      },
      summary: {
        entries: 'ENTRIES',
        live: 'LIVE',
        wipBeta: 'WIP / BETA',
        archived: 'ARCHIVED'
      }
    }
  },
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
      journalLabel: '01 — Journal',
      archiveOpen: '{count} entries / archive open',
      titleLead: 'Field',
      titleAccent: ' Notes',
      subtitle: 'Notes on interfaces, systems, and time. Frequency is secondary; only entries worth keeping belong here.',
      readEntry: 'Read entry',
      archiveAll: 'Archive — All Entries',
      scrollHint: '↓ scroll',
      endOfIndex: 'End of index',
      footerNote: 'Once the system is in place, the pages can follow: writing, tools, and a portfolio, all held together by the same cool-white language.',
      footer: {
        system: 'System',
        systemValue: 'Personal OS / v.01',
        surface: 'Surface',
        surfaceValue: 'Cool White',
        accent: 'Accent',
        accentValue: 'Cool Blue',
        status: 'Status',
        statusValue: 'Foundation'
      }
    },
    post: {
      onThisNote: 'On this note',
      backToFieldNotes: 'Back to Field Notes',
      previousEntry: 'Previous Entry',
      nextEntry: 'Next Entry',
      fieldNote: 'FIELD NOTE',
      headerLabel: '№ {index} — {category} / {fieldNote}',
      navAria: 'Article navigation',
      notFoundBadge: 'Error 404 / entry not found',
      notFoundTitle: 'This entry does not exist'
    },
    entryCategories: {
      WEEKLY: 'WEEKLY',
      RESEARCH: 'RESEARCH',
      ESSAY: 'ESSAY',
      METHOD: 'METHOD',
      REVIEW: 'REVIEW',
      NOTE: 'NOTE'
    }
  },
  about: {
    sheet: {
      subtitle: 'Jacory',
      revision: 'File 03 / Revision 01',
      identityIllustrationAlt: 'Jacory identity line study'
    },
    slogan: {
      line1: 'The sea',
      line2Prefix: 'remains ',
      line2Emphasis: 'vast',
      line2Suffix: '.'
    },
    statement: 'This is my personal digital space.\nA place to document work, refine tools, and organize notes—\nan open system for continuous thinking and building.\nLong-term iteration. Constant evolution.',
    identity: {
      roleLabel: 'Identity',
      role: 'Designer · Developer · Writer · Creator',
      baseLabel: 'Focus',
      base: 'Software Development · Web Experience · Agent Systems · Video Creation',
      focusLabel: 'System',
      focus: 'Personal Site · Videos · Knowledge Base · Workflows',
      statusLabel: 'Status',
      status: 'Building in public'
    },
    principles: {
      courage: 'Courage',
      order: 'Order',
      curiosity: 'Curiosity',
      expression: 'Expression',
      refinement: 'Refinement'
    },
    contact: {
      ariaLabel: 'Contact links',
      rssStatus: 'Coming soon',
      thanks: 'THANKS FOR VISITING.'
    },
  },
  videoParser: {
    title: 'Video Parser and Downloader',
    subtitle: 'Parse and download videos from Bilibili, YouTube, and other platforms.',
    tip: 'Paste a Bilibili, YouTube, or other supported video link to get started.',
    pageDescription: 'Parse YouTube and Bilibili links, review the available formats, and save files locally.',
    ui: {
      settings: 'SETTINGS',
      cookiesDirectory: 'COOKIE / DIRECTORY'
    },
    cookieEntry: {
      label: 'Cookie Settings',
      hint: 'This video requires cookies. Open Settings, configure a cookie source, and try again.'
    },
    sections: {
      command: 'COMMAND',
      status: 'STATUS',
      videoInfo: 'VIDEO INFO',
      downloadRegistry: 'DOWNLOAD REGISTRY',
      outputPath: 'OUTPUT PATH',
      outlineMap: 'OUTLINE MAP',
      cookiesSettings: 'COOKIE SETTINGS',
      directorySettings: 'DIRECTORY SETTINGS'
    },
    statusRail: {
      READY: 'Ready',
      PARSING: 'Parsing',
      RESOLVED: 'Parsed',
      DOWNLOADING: 'Downloading',
      COMPLETE: 'Complete',
      COOKIES_REQUIRED: 'Cookies required',
      FAILED: 'Failed'
    },
    info: {
      awaitingUrl: 'AWAITING URL',
      awaitingDescription: 'Paste a video link and parse it to display the thumbnail, title, source, duration, and video metadata.',
      source: 'SOURCE',
      duration: 'DURATION',
      uploader: 'UPLOADER',
      pubDate: 'PUBLISHED',
      formatsAvailable: 'FORMATS AVAILABLE'
    },
    registry: {
      items: '{count} ITEMS',
      empty: 'No downloadable MP4 or audio formats found.',
      resolution: 'RESOLUTION',
      format: 'FORMAT',
      size: 'SIZE',
      status: 'STATUS',
      action: 'ACTION',
      rowStatus: {
        READY: 'READY',
        DOWNLOADING: 'DOWNLOADING',
        COMPLETE: 'COMPLETE',
        FAILED: 'FAILED',
        UNAVAILABLE: 'UNAVAILABLE'
      },
      actions: {
        download: 'DOWNLOAD',
        pause: 'PAUSE',
        retry: 'RETRY',
        reveal: 'REVEAL',
        open: 'OPEN'
      }
    },
    output: {
      pending: 'The local save path will appear after a download completes.',
      copyPath: 'COPY PATH',
      revealInFinder: 'REVEAL IN FINDER',
      copied: 'Path copied'
    },
    outline: {
      copyOutline: 'COPY OUTLINE',
      root: 'Video Outline',
      copied: 'Copied',
      generate: 'GENERATE OUTLINE',
      retry: 'GENERATE AGAIN',
      states: {
        idle: {
          title: 'Waiting for video',
          description: 'Parse a video to generate an outline.'
        },
        noSubtitles: {
          title: 'No subtitles',
          description: 'No platform subtitles were detected, so an outline cannot be generated yet.'
        },
        insufficient: {
          title: 'Insufficient subtitles',
          description: 'There is not enough subtitle text to generate an outline.'
        },
        subtitlesAvailable: {
          title: 'Subtitles available',
          description: 'Subtitle text is available. Generate an outline in the current interface language.'
        },
        generating: {
          title: 'Generating outline',
          description: 'Generating a video outline from the subtitle text…'
        },
        success: {
          title: 'Outline ready',
          description: 'The video outline is ready.'
        },
        failed: {
          title: 'Generation failed',
          description: 'The outline could not be generated. Try again when you’re ready.'
        },
        empty: {
          title: 'No outline',
          description: 'There is no outline available for this video yet.'
        }
      }
    },
    settings: {
      mode: 'MODE',
      cookieModes: {
        manual: 'MANUAL',
        browser: 'BROWSER',
        none: 'NONE'
      },
      browserSource: 'BROWSER SOURCE',
      platformCookies: 'PLATFORM COOKIES',
      set: 'CONFIGURED',
      notSet: 'NOT CONFIGURED',
      edit: 'EDIT',
      delete: 'DELETE',
      custom: 'CUSTOM',
      cookiesUsageNote: 'Cookies are used only when a private or restricted video requires you to be signed in.',
      defaultDownloadDirectory: 'DEFAULT DOWNLOAD DIRECTORY',
      temporaryDirectory: 'TEMPORARY DIRECTORY (THIS DOWNLOAD)',
      useDefaultDirectory: 'Use default directory',
      change: 'CHANGE',
      temporaryDirectoryNote: 'The temporary directory holds in-progress files and can be cleaned automatically when the download finishes.'
    },
    thumbnailAlt: 'Video thumbnail',
    cookiesSettings: 'Cookie Settings',
    downloadSettings: 'Download Directory',
    inputPlaceholder: 'Paste a video URL from YouTube, Bilibili, or another supported platform',
    parse: 'Parse Video',
    parsing: 'Parsing...',
    loading: 'Parsing video...',
    duration: 'Duration',
    availableResolutions: 'Available resolutions:',
    size: 'Size',
    download: 'Download',
    downloading: 'Downloading...',
    cookiesManagement: 'Cookie Management',
    cookieUsage: 'Cookie Mode',
    cookieModes: {
      manual: 'Save a cookies.txt File',
      browser: 'Read from Browser',
      none: 'Do Not Use Cookies'
    },
    saveUsage: 'Save Cookie Mode',
    saving: 'Saving...',
    cookieHelp: {
      browser: 'This runs yt-dlp with --cookies-from-browser {browser}. Sign in to the video platform in that browser first.',
      manual: 'Use a cookies.txt file saved on the server. This is useful when browser cookies cannot be read.',
      none: 'Public videos may work without cookies. Login-only videos may fail to parse.'
    },
    status: {
      set: 'Set',
      unset: 'Not Set'
    },
    actions: {
      edit: 'Edit',
      set: 'Set',
      delete: 'Delete',
      add: 'Add',
      cancel: 'Cancel',
      save: 'Save'
    },
    addCustomPlatform: 'Add Custom Platform',
    downloadDirectorySettings: 'Download Directory Settings',
    defaultDownloadDirectory: 'Default Download Directory',
    notSet: 'Not Set',
    chooseDefaultDirectory: 'Choose Default Directory',
    oneTimeDownloadDirectory: 'Save Location for This Download (Optional)',
    oneTimeDirectoryFallback: 'Not set (default directory will be used)',
    chooseOneTimeDirectory: 'Choose a Location for This Download',
    clearOneTimeDirectory: 'Use the Default Location',
    addPlatformTitle: 'Add Custom Platform',
    platformPlaceholder: 'Enter platform name, e.g. twitter or instagram',
    setCookiesTitle: 'Set Cookies for {platform}',
    cookiesSavedTip: 'Cookies are stored on the server and remain available after the page is refreshed.',
    cookiesPlaceholder: 'Paste the contents of the {platform} cookies.txt file here…',
    errors: {
      emptyUrl: 'Please enter a video URL',
      invalidUrl: 'Please enter a valid video URL',
      noVisibleFormats: 'No downloadable MP4 or audio formats found.',
      parseFailed: 'Could not parse the video: {message}',
      downloadFailed: 'Could not download the video: {message}',
      loadSettingsFailed: 'Could not load settings',
      saveDefaultDirFailed: 'Could not save the default download directory',
      folderDialogFailed: 'Could not open the system folder picker',
      outlineFailed: 'Could not generate the outline',
      saveCookieSettingsFailed: 'Could not save the cookie mode',
      loadCookiesFailed: 'Could not load cookie status',
      saveFailed: 'Could not save your changes',
      deleteFailed: 'Could not delete this item',
      platformExists: 'This platform has already been added'
    },
    messages: {
      readingMetadata: 'Reading video metadata…',
      downloadingResolution: 'Downloading the {resolution} version…',
      downloadComplete: 'Download complete. Saved to: {path}',
      defaultDirSaved: 'Default download location updated: {path}',
      cookieUsageSaved: 'Cookie mode updated',
      confirmDeleteCookies: 'Delete cookies for {platform}?'
    }
  }
}
