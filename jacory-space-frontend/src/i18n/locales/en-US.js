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
    en: 'English'
  },
  home: {
    title: 'Welcome to Jacory Space',
    subtitle: 'Sharing tech, recording life, exploring possibilities',
    actions: {
      videoParser: 'Try Video Parser',
      about: 'Learn More'
    },
    cards: {
      video: {
        title: 'Video Parser',
        description: 'Parse videos across platforms and choose from multiple download resolutions.',
        action: 'Use Now'
      },
      blog: {
        title: 'Blog Posts',
        description: 'Technical notes, learning logs, and life reflections.',
        action: 'View Posts'
      },
      tools: {
        title: 'More Tools',
        description: 'More ideas are being built. Stay tuned.',
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
    subtitle: 'Notes on development, tools, and life observations, shaped into posts worth revisiting.',
    readMore: 'Read More',
    directionTitle: 'Topics',
    writingPlanTitle: 'Writing Plan',
    writingPlanDescription: 'This space will collect project retrospectives, development notes, and tool practices. Article pages or a Markdown content system can be added later.',
    posts: {
      site: {
        title: 'The First Step in Building a Personal Site',
        readingTime: '5 min read',
        summary: 'A look at Jacory Space’s page structure, color choices, and tool entry points so the site has a clear foundation.',
        tags: ['Personal Site', 'Vue', 'Tailwind']
      },
      parser: {
        title: 'Design Notes for the Video Parser Tool',
        readingTime: '7 min read',
        summary: 'How the video parser flows from URL input to format parsing and download directory settings, plus ideas for future improvements.',
        tags: ['Tooling', 'Node.js', 'yt-dlp']
      },
      workflow: {
        title: 'Why Workflow Rules Matter',
        readingTime: '4 min read',
        summary: 'Writing down branch, commit, PR, and merge rules reduces repeated coordination and makes collaboration easier to review.',
        tags: ['Git', 'Collaboration', 'Workflow']
      },
      writing: {
        title: 'Turning Ideas into Publishable Notes',
        readingTime: '6 min read',
        summary: 'From scattered ideas to blog posts, a lightweight capture and review process helps creation happen more consistently.',
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
      subtitle: 'Notes on interface, systems, and time. Not about frequency—only about entries worth archiving.',
      readEntry: 'Read entry',
      archiveAll: 'Archive — All Entries',
      scrollHint: '↓ scroll',
      endOfIndex: 'End of index',
      footerNote: 'Once this system is ready, the next step is the pages themselves—writing, tools, portfolio—all living in this cool-white language.',
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
    role: 'Content Creator / Developer / Maker',
    introTitle: 'About Me',
    intro: 'Hi, I am Jacory, a creator who loves technology and building things. This site is my personal space for sharing tools, technical articles, and life reflections.',
    projectsTitle: 'My Projects',
    projects: {
      video: {
        title: 'Video Parser',
        description: 'Multi-platform video downloads'
      },
      blog: {
        title: 'Technical Blog',
        description: 'Development experience and learning notes (in progress)'
      },
      tools: {
        title: 'More Tools',
        description: 'Continuously updated...'
      }
    },
    contactTitle: 'Contact'
  },
  videoParser: {
    title: 'Video Parser and Downloader',
    subtitle: 'Supports video parsing from Bilibili, YouTube, and more.',
    tip: 'Tip: parse and download videos from Bilibili, YouTube, and other platforms.',
    pageDescription: 'Parse YouTube / Bilibili video links, extract available formats, and save files locally.',
    ui: {
      settings: 'SETTINGS',
      cookiesDirectory: 'COOKIES / DIRECTORY'
    },
    cookieEntry: {
      label: 'Cookie Settings',
      hint: 'This video requires cookies. Open Settings to configure cookies and try again.'
    },
    sections: {
      command: 'COMMAND',
      status: 'STATUS',
      videoInfo: 'VIDEO INFO',
      downloadRegistry: 'DOWNLOAD REGISTRY',
      outputPath: 'OUTPUT PATH',
      outlineMap: 'OUTLINE MAP',
      cookiesSettings: 'COOKIES SETTINGS',
      directorySettings: 'DIRECTORY SETTINGS'
    },
    statusRail: {
      READY: 'Ready',
      PARSING: 'Parsing',
      RESOLVED: 'Resolved',
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
      pubDate: 'PUB DATE',
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
      retry: 'Retry generation',
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
          description: 'Subtitle content is insufficient, so an outline cannot be generated.'
        },
        subtitlesAvailable: {
          title: 'Subtitles available',
          description: 'Subtitle text was detected. Generate a video outline in the current page language.'
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
          description: 'Something went wrong while generating the outline. You can retry generation.'
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
      set: 'SET',
      notSet: 'NOT SET',
      edit: 'EDIT',
      delete: 'DELETE',
      custom: '+ CUSTOM',
      cookiesUsageNote: 'Cookies are only used to access private or restricted videos that require login.',
      defaultDownloadDirectory: 'DEFAULT DOWNLOAD DIRECTORY',
      temporaryDirectory: 'TEMPORARY DIRECTORY (THIS DOWNLOAD)',
      useDefaultDirectory: 'Use default directory',
      change: 'CHANGE',
      temporaryDirectoryNote: 'The temporary directory stores in-progress download files and can be cleaned automatically after the task completes.'
    },
    thumbnailAlt: 'Video thumbnail',
    cookiesSettings: 'Cookies Settings',
    downloadSettings: 'Download Directory',
    inputPlaceholder: 'Paste a video URL (YouTube, Bilibili, and more)',
    parse: 'Parse Video',
    parsing: 'Parsing...',
    loading: 'Parsing video...',
    duration: 'Duration',
    availableResolutions: 'Available resolutions:',
    size: 'Size',
    download: 'Download',
    downloading: 'Downloading...',
    cookiesManagement: 'Cookies Management',
    cookieUsage: 'Cookie Mode',
    cookieModes: {
      manual: 'Save Cookies Manually',
      browser: 'Read from Browser',
      none: 'No Cookies'
    },
    saveUsage: 'Save Mode',
    saving: 'Saving...',
    cookieHelp: {
      browser: 'This calls yt-dlp with --cookies-from-browser {browser}. Please log in to the video platform in that browser first.',
      manual: 'Use the cookies.txt saved on the server below. This is useful when browser cookies cannot be read.',
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
    oneTimeDownloadDirectory: 'Directory for This Download (Optional)',
    oneTimeDirectoryFallback: 'Not set (default directory will be used)',
    chooseOneTimeDirectory: 'Choose Directory for This Download',
    clearOneTimeDirectory: 'Clear This Directory',
    addPlatformTitle: 'Add Custom Platform',
    platformPlaceholder: 'Enter platform name, e.g. twitter or instagram',
    setCookiesTitle: 'Set {platform} Cookies',
    cookiesSavedTip: 'Tip: Cookies are saved on the server and will remain after refresh.',
    cookiesPlaceholder: 'Paste {platform} cookies.txt content here...',
    errors: {
      emptyUrl: 'Please enter a video URL',
      invalidUrl: 'Please enter a valid video URL',
      noVisibleFormats: 'No downloadable MP4 or audio formats found.',
      parseFailed: 'Parse failed: {message}',
      downloadFailed: 'Download failed: {message}',
      loadSettingsFailed: 'Failed to load settings',
      saveDefaultDirFailed: 'Failed to save default download directory',
      folderDialogFailed: 'Failed to open system folder picker',
      outlineFailed: 'Failed to generate outline',
      saveCookieSettingsFailed: 'Failed to save Cookie mode',
      loadCookiesFailed: 'Failed to load cookies status',
      saveFailed: 'Save failed',
      deleteFailed: 'Delete failed',
      platformExists: 'Platform already exists'
    },
    messages: {
      readingMetadata: 'Reading video metadata…',
      downloadingResolution: 'Downloading {resolution} version...',
      downloadComplete: 'Download complete! File saved at: {path}',
      defaultDirSaved: 'Default download directory saved: {path}',
      cookieUsageSaved: 'Cookie mode saved',
      confirmDeleteCookies: 'Delete Cookies for {platform}?'
    }
  }
}
