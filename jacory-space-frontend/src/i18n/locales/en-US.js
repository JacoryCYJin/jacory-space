export default {
  nav: {
    home: 'Index',
    tools: 'Tools',
    videoParser: 'Video Parser',
    blog: 'Notes',
    about: 'About',
    menu: {
      open: 'Menu',
      close: 'Close'
    }
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
        all: 'A unified index of tools, works, and experiments.',
        tools: 'Practical tools built for specific needs.',
        works: 'Complete projects, products, and creative practice.',
        experiments: 'Concepts, prototypes, and systems currently being explored.'
      },
      summary: {
        entries: 'ENTRIES',
        live: 'LIVE',
        wipBeta: 'WIP / BETA',
        archived: 'ARCHIVED'
      }
    }
  },
  mediaParserSoftware: {
    kicker: '02 — LOCAL SOFTWARE / MEDIA WORKBENCH',
    titleLead: 'Media Parser ',
    titleAccent: 'Desktop',
    tagline: 'A local media parser with a downloadable macOS pre-release.',
    descriptionLead: 'Media Parser v0.2.5 is now available as desktop software. It keeps video, podcast, and personal media workflows on the local machine, with ffmpeg and yt-dlp bundled in the macOS package.',
    descriptionPoints: {
      sources: {
        title: 'A Desktop Media Entry Point',
        description: 'Bring video links, podcast feeds, and single-file downloads into one local tool instead of scattering them across scripts, web pages, and command lines.'
      },
      download: {
        title: 'Bundled Parsing Runtime',
        description: 'The macOS package includes ffmpeg and yt-dlp, so regular users can install it and start parsing, downloading, and organizing media.'
      },
      notes: {
        title: 'Local-First Workflow',
        description: 'Cookies, download folders, media files, and personal processing records stay on the device; the Release only ships the software itself.'
      }
    },
    meta: {
      type: 'OPEN SOURCE',
      typeValue: 'MIT License'
    },
    sections: {
      release: 'RELEASE v0.2.5 · macOS PRE-RELEASE'
    },
    actions: {
      releases: 'Download v0.2.5',
      github: 'View GitHub'
    },
    screenshot: {
      alt: 'Media Parser Desktop software screenshot'
    },
    modules: {
      video: {
        title: 'Video Parse & Download',
        short: 'Metadata / Downloads',
        description: 'Resolve video metadata, inspect available formats, and download single media files.'
      },
      podcast: {
        title: 'Podcast Parse & Download',
        short: 'RSS / Audio files',
        description: 'Resolve podcast RSS and audio sources, read episode metadata, and save audio files.'
      },
      transcript: {
        title: 'Packaged Runtime',
        short: 'Bundled ffmpeg / yt-dlp',
        description: 'The packaged app includes media tooling, so users do not need to install ffmpeg or yt-dlp manually.'
      },
      release: {
        title: 'Update Entry',
        short: 'Settings / About / Check Updates',
        description: 'The desktop app includes a check-for-updates action in Settings, with the update flow continuing to improve.'
      }
    },
    releaseLinks: {
      github: 'GitHub Repository',
      releases: 'v0.2.5 Release'
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
      endOfIndex: 'Jacory Space',
      footerNote: 'Once the system is in place, the pages can follow: writing, tools, and a portfolio, all held together by the same cool-white language.',
      footer: {
        system: 'System',
        systemValue: 'Personal OS / v.01',
        surface: 'Explore',
        surfaceValue: 'Tools / Blog / About',
        accent: 'Contact',
        accentValue: 'Email / GitHub',
        status: 'Status',
        statusValue: 'Building in public'
      }
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
      label: '/ CONTACT',
      rssStatus: 'Coming soon',
      thanks: 'THANKS FOR VISITING.'
    },
  },
  podcastParser: {
    sections: {
      toolIndex: '01 — TOOL',
      input: 'INPUT',
      result: 'RESULT'
    },
    hero: {
      titleLead: 'Podcast',
      titleAccent: 'parser',
      description: 'Parse Apple Podcasts, Xiaoyuzhou, RSS feeds, and audio links to extract show, episode, audio source, and transcript status.',
      editionLabel: 'EDITION'
    },
    input: {
      placeholder: 'Paste Apple Podcasts, Xiaoyuzhou, RSS or audio URL',
      parse: 'PARSE',
      parsing: 'PARSING'
    },
    status: {
      ready: 'READY',
      resolving: 'RESOLVING',
      resolved: 'RESOLVED',
      partial: 'PARTIAL',
      failed: 'PARSE FAILED',
      failedShort: 'FAILED',
      resolvingSource: 'RESOLVING SOURCE',
      missing: 'missing',
      unknown: 'unknown'
    },
    trail: {
      loading: 'reading source / checking transcript',
      failed: 'parse failed',
      audioFound: 'audio found',
      audioMissing: 'audio missing'
    },
    result: {
      coverAlt: 'Podcast cover',
      untitledEpisode: 'Untitled episode',
      source: 'SOURCE',
      audio: 'AUDIO',
      audioSource: 'AUDIO SOURCE',
      audioSize: 'AUDIO SIZE',
      transcript: 'TRANSCRIPT',
      summary: 'SUMMARY'
    },
    messages: {
      resolvingSource: 'Reading the podcast source, episode metadata, and public transcript status.',
      noAudio: 'No public audio source returned.',
      transcriptAvailable: 'Public transcript found in the source and ready for later summarization.',
      transcriptMarkerOnly: 'The source has a transcript marker, but no public transcript content is available.',
      transcriptInsufficient: 'A public transcript was found, but it is too short or too noisy to use.',
      transcriptMissing: 'No public transcript found in this source.'
    },
    actions: {
      showMore: 'SHOW ALL',
      showLess: 'COLLAPSE'
    },
    localStt: {
      action: 'LOCAL TRANSCRIBE',
      retry: 'RETRANSCRIBE',
      transcribing: 'TRANSCRIBING',
      running: 'Local transcription is running. The subtitle file will be saved when complete.',
      complete: 'Local transcription completed. The subtitle file has been saved.',
      savedTo: 'DEFAULT OUTPUT PATH',
      reveal: 'REVEAL IN FINDER',
      revealComplete: 'Local path opened',
      stages: {
        queued: 'QUEUED',
        downloading: 'DOWNLOADING AUDIO',
        transcribing: 'TRANSCRIBING',
        saving: 'SAVING',
        completed: 'COMPLETED',
        failed: 'FAILED'
      }
    },
    errors: {
      emptyUrl: 'Paste a podcast, RSS, or audio URL first.',
      invalidUrl: 'The input is not a valid URL.',
      parseFailed: 'Podcast parse failed: {message}',
      localSttFailed: 'Local transcription failed: {message}',
      revealFailed: 'Could not reveal the local path'
    }
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
      processing: 'Processing',
      rowStatus: {
        READY: 'READY',
        DOWNLOADING: 'DOWNLOADING',
        PAUSED: 'PAUSED',
        COMPLETE: 'COMPLETE',
        FAILED: 'FAILED',
        CANCELLED: 'CANCELLED',
        UNAVAILABLE: 'UNAVAILABLE'
      },
      actions: {
        download: 'DOWNLOAD',
        processing: 'PROCESSING',
        pause: 'PAUSE',
        resume: 'RESUME',
        cancel: 'CANCEL',
        redownload: 'DOWNLOAD AGAIN',
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
      manual: 'Use a locally saved cookies.txt file. This is useful when browser cookies cannot be read.',
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
    cookiesSavedTip: 'Cookies are stored locally by the desktop app and remain available after refresh.',
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
      revealFailed: 'Could not reveal the local path',
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
      revealComplete: 'Local path opened',
      defaultDirSaved: 'Default download location updated: {path}',
      cookieUsageSaved: 'Cookie mode updated',
      confirmDeleteCookies: 'Delete cookies for {platform}?'
    }
  },
  minecraftSkin: {
    title: 'Minecraft Skin Studio',
    import: 'Import PNG',
    export: 'Export Skin',
    newSkin: 'New Skin',
    newSkinConfirmTitle: 'Start a new Steve skin?',
    newSkinConfirmDetail: 'Your current local draft will be replaced. Export a PNG first if you want to keep this version.',
    startNewSkin: 'Create Skin',
    cancel: 'Cancel',
    saved: 'Saved locally',
    preview: '3D Preview',
    coordinates: 'Pixel Coordinates',
    model: 'Model',
    layers: 'Layers',
    color: 'Color',
    saturationLightness: 'Saturation and Brightness',
    hue: 'Hue',
    opacity: 'Opacity',
    hexCode: 'Hex Code',
    hexHint: 'Press Enter to confirm or Escape to cancel',
    recentColors: 'Recent Colors',
    textureMap: 'Skin Texture Map',
    classic: 'Classic model',
    slim: 'Slim model',
    base: 'Base layer',
    outer: 'Outer layer',
    brush: 'Brush',
    fill: 'Fill',
    eyedropper: 'Eyedropper',
    mirror: 'Mirror paint',
    settings: 'Settings',
    close: 'Close',
    controls: 'View controls',
    grid: 'Grid',
    undo: 'Undo',
    redo: 'Redo',
    reset: 'Reset',
    brushActive: 'Click pixels to paint',
    canvasHint: 'Click a pixel in the texture map and the 3D character will update in sync.',
    webglError: 'The 3D preview could not initialize. Check WebGL support and refresh the page.',
    ready: 'READY'
  }
}
