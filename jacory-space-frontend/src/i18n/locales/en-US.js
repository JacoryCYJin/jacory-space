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
      parseFailed: 'Parse failed: {message}',
      downloadFailed: 'Download failed: {message}',
      loadSettingsFailed: 'Failed to load settings',
      saveDefaultDirFailed: 'Failed to save default download directory',
      folderDialogFailed: 'Failed to open system folder picker',
      saveCookieSettingsFailed: 'Failed to save Cookie mode',
      loadCookiesFailed: 'Failed to load cookies status',
      saveFailed: 'Save failed',
      deleteFailed: 'Delete failed',
      platformExists: 'Platform already exists'
    },
    messages: {
      downloadingResolution: 'Downloading {resolution} version...',
      downloadComplete: 'Download complete! File saved at: {path}',
      defaultDirSaved: 'Default download directory saved: {path}',
      cookieUsageSaved: 'Cookie mode saved',
      confirmDeleteCookies: 'Delete Cookies for {platform}?'
    }
  }
}
