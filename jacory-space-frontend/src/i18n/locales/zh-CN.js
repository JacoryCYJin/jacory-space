export default {
  nav: {
    home: '首页',
    tools: '工具库',
    videoParser: '视频解析',
    blog: '博客',
    about: '关于我'
  },
  language: {
    label: '切换语言',
    zh: '中文',
    en: 'English'
  },
  home: {
    title: '欢迎来到 Jacory Space',
    subtitle: '分享技术、记录生活、探索可能',
    actions: {
      videoParser: '试试视频解析工具',
      about: '了解更多'
    },
    cards: {
      video: {
        title: '视频解析工具',
        description: '支持多平台视频解析，提供多种分辨率下载选项',
        action: '立即使用'
      },
      blog: {
        title: '博客文章',
        description: '技术分享、学习笔记、生活感悟',
        action: '查看文章'
      },
      tools: {
        title: '更多工具',
        description: '持续开发中，敬请期待',
        status: '即将上线'
      }
    }
  },
  blog: {
    badge: 'Jacory Blog',
    title: '个人博客',
    subtitle: '记录开发过程、工具实践和生活观察，把零散想法整理成可复盘的文章。',
    readMore: '阅读全文',
    directionTitle: '文章方向',
    writingPlanTitle: '写作计划',
    writingPlanDescription: '这里会持续沉淀项目复盘、开发笔记和工具使用经验。后续可以继续扩展文章详情页或 Markdown 内容系统。',
    posts: {
      site: {
        title: '从零搭建个人网站的第一步',
        readingTime: '5 分钟阅读',
        summary: '梳理 Jacory Space 的前端页面结构、配色选择和工具入口，让个人网站先拥有清晰的表达框架。',
        tags: ['个人网站', 'Vue', 'Tailwind']
      },
      parser: {
        title: '视频解析工具的功能设计记录',
        readingTime: '7 分钟阅读',
        summary: '记录视频解析下载工具从输入链接、解析格式到下载目录设置的设计思路，以及后续可以优化的方向。',
        tags: ['工具开发', 'Node.js', 'yt-dlp']
      },
      workflow: {
        title: '为什么要给工作流写规则',
        readingTime: '4 分钟阅读',
        summary: '把分支、提交、PR 和合并流程写成规则，可以减少重复沟通，也让每次协作更容易复盘。',
        tags: ['Git', '协作', '工作流']
      },
      writing: {
        title: '把灵感整理成可发布内容',
        readingTime: '6 分钟阅读',
        summary: '从零散想法到博客文章，需要一个轻量的收集、筛选和整理流程，让创作更稳定地发生。',
        tags: ['写作', '创作', '复盘']
      }
    },
    categories: {
      project: '项目复盘',
      development: '开发笔记',
      workflow: '工作流',
      life: '生活观察'
    }
  },
  about: {
    role: 'UP主 / 开发者 / 创作者',
    introTitle: '关于我',
    intro: '你好！我是 Jacory，一名热爱技术和创作的 UP 主。这个网站是我的个人空间，用来分享我开发的工具、技术文章和生活感悟。',
    projectsTitle: '我的项目',
    projects: {
      video: {
        title: '视频解析工具',
        description: '支持多平台视频下载'
      },
      blog: {
        title: '技术博客',
        description: '分享开发经验和学习笔记（开发中）'
      },
      tools: {
        title: '更多工具',
        description: '持续更新中...'
      }
    },
    contactTitle: '联系方式'
  },
  videoParser: {
    title: '视频解析下载工具',
    subtitle: '支持 Bilibili、YouTube 等多平台视频解析',
    tip: '提示：支持 Bilibili、YouTube 等多平台视频解析与下载',
    pageDescription: '解析 YouTube / Bilibili 视频链接，获取可下载的音视频格式并保存到本地。',
    ui: {
      settings: '设置',
      cookiesDirectory: 'Cookie / 目录'
    },
    cookieEntry: {
      label: 'Cookie 设置',
      hint: '当前视频需要 Cookies，请打开右上角设置完成 Cookie 配置后重试。'
    },
    sections: {
      command: '命令',
      status: '状态',
      videoInfo: '视频信息',
      downloadRegistry: '下载列表',
      outputPath: '输出路径',
      outlineMap: '大纲图',
      cookiesSettings: 'COOKIE 设置',
      directorySettings: '目录设置'
    },
    statusRail: {
      READY: '就绪',
      PARSING: '解析中',
      RESOLVED: '已解析',
      DOWNLOADING: '下载中',
      COMPLETE: '完成',
      COOKIES_REQUIRED: '需要 Cookies',
      FAILED: '失败'
    },
    info: {
      awaitingUrl: '等待链接',
      awaitingDescription: '粘贴视频链接并解析后，这里会显示封面、标题、来源、时长与视频信息。',
      source: '来源',
      duration: '时长',
      uploader: '上传者',
      pubDate: '发布时间',
      formatsAvailable: 'FORMATS AVAILABLE'
    },
    registry: {
      items: '{count} 项',
      empty: '未找到可下载的 MP4 / 音频格式。',
      resolution: '分辨率',
      format: '格式',
      size: '大小',
      status: '状态',
      action: '操作',
      rowStatus: {
        READY: '就绪',
        DOWNLOADING: '下载中',
        COMPLETE: '完成',
        FAILED: '失败',
        UNAVAILABLE: '不可用'
      },
      actions: {
        download: '下载',
        pause: '暂停',
        retry: '重试',
        reveal: '显示',
        open: '打开'
      }
    },
    output: {
      pending: '下载完成后会显示本地保存路径。',
      copyPath: '复制路径',
      revealInFinder: '在 Finder 中显示',
      copied: '路径已复制'
    },
    outline: {
      copyOutline: '复制大纲',
      root: '视频大纲 / Outline',
      copied: '复制成功',
      retry: '重试生成',
      states: {
        idle: {
          title: '等待解析视频',
          description: '解析视频后可生成大纲。后续接入大模型时，将根据当前语言生成中文大纲。'
        },
        noSubtitles: {
          title: '暂无字幕',
          description: '未检测到平台字幕，暂时无法生成大纲。'
        },
        subtitlesAvailable: {
          title: '字幕可用',
          description: '已检测到字幕信息，后续可接入硅基流动大模型生成中文大纲。'
        },
        generating: {
          title: '正在生成大纲',
          description: '正在根据字幕结构生成视频大纲。'
        },
        success: {
          title: '大纲已生成',
          description: '视频大纲已生成。'
        },
        failed: {
          title: '生成失败',
          description: '生成大纲时出现问题，可以重试生成。'
        },
        empty: {
          title: '暂无大纲',
          description: '当前视频暂无可展示的大纲。'
        }
      }
    },
    settings: {
      mode: '模式',
      cookieModes: {
        manual: '手动',
        browser: '浏览器',
        none: '无'
      },
      browserSource: '浏览器来源',
      platformCookies: '平台 Cookie',
      set: '已设置',
      notSet: '未设置',
      edit: '编辑',
      delete: '删除',
      custom: '+ 自定义',
      cookiesUsageNote: 'Cookies 仅用于访问需要登录的私密或受限视频。',
      defaultDownloadDirectory: '默认下载目录',
      temporaryDirectory: '临时目录（本次下载）',
      useDefaultDirectory: '使用默认目录',
      change: '更改',
      temporaryDirectoryNote: '临时目录用于存放下载中临时文件，任务完成后可自动清理。'
    },
    thumbnailAlt: '视频缩略图',
    cookiesSettings: 'Cookies 设置',
    downloadSettings: '下载目录设置',
    inputPlaceholder: '请输入视频链接（支持 YouTube, Bilibili 等平台）',
    parse: '解析视频',
    parsing: '解析中...',
    loading: '正在解析视频...',
    duration: '时长',
    availableResolutions: '可用分辨率：',
    size: '大小',
    download: '下载',
    downloading: '下载中...',
    cookiesManagement: 'Cookies 管理',
    cookieUsage: 'Cookie 使用方式',
    cookieModes: {
      manual: '手动保存 Cookies',
      browser: '自动读取浏览器',
      none: '不使用 Cookies'
    },
    saveUsage: '保存使用方式',
    saving: '保存中...',
    cookieHelp: {
      browser: '会调用 yt-dlp 的 --cookies-from-browser {browser}，请先在对应浏览器登录视频平台。',
      manual: '使用下方保存到服务器的 cookies.txt，适合无法读取浏览器 Cookie 的场景。',
      none: '公开视频可尝试不使用 Cookies；需要登录的视频可能无法解析。'
    },
    status: {
      set: '已设置',
      unset: '未设置'
    },
    actions: {
      edit: '编辑',
      set: '设置',
      delete: '删除',
      add: '添加',
      cancel: '取消',
      save: '保存'
    },
    addCustomPlatform: '添加自定义平台',
    downloadDirectorySettings: '下载目录设置',
    defaultDownloadDirectory: '默认下载目录',
    notSet: '未设置',
    chooseDefaultDirectory: '选择默认目录',
    oneTimeDownloadDirectory: '本次下载目录（可选）',
    oneTimeDirectoryFallback: '未设置（将使用默认目录）',
    chooseOneTimeDirectory: '选择本次目录',
    clearOneTimeDirectory: '清空本次目录',
    addPlatformTitle: '添加自定义平台',
    platformPlaceholder: '输入平台名称（如：twitter、instagram）',
    setCookiesTitle: '设置 {platform} Cookies',
    cookiesSavedTip: '提示：Cookies 已保存在服务器，刷新页面不会丢失',
    cookiesPlaceholder: '粘贴 {platform} cookies.txt 内容到这里...',
    errors: {
      emptyUrl: '请输入视频链接',
      invalidUrl: '请输入有效的视频链接',
      noVisibleFormats: '未找到可下载的 MP4 / 音频格式。',
      parseFailed: '解析失败: {message}',
      downloadFailed: '下载失败: {message}',
      loadSettingsFailed: '加载设置失败',
      saveDefaultDirFailed: '保存默认下载目录失败',
      folderDialogFailed: '打开系统文件夹选择失败',
      saveCookieSettingsFailed: '保存 Cookie 使用方式失败',
      loadCookiesFailed: '加载 cookies 状态失败',
      saveFailed: '保存失败',
      deleteFailed: '删除失败',
      platformExists: '平台已存在'
    },
    messages: {
      readingMetadata: '正在读取视频元数据…',
      downloadingResolution: '正在下载 {resolution} 版本...',
      downloadComplete: '下载完成！文件保存在: {path}',
      defaultDirSaved: '默认下载目录已保存: {path}',
      cookieUsageSaved: 'Cookie 使用方式已保存',
      confirmDeleteCookies: '确定要删除 {platform} 的 Cookies 吗？'
    }
  }
}
