export default {
  mediaParserSoftware: {
    kicker: '02 — 本地软件 / 媒体工作台',
    titleLead: 'Media Parser ',
    titleAccent: 'Desktop',
    tagline: '已经提供 macOS 预发布包的本地媒体解析工具。',
    descriptionLead: 'Media Parser v0.2.5 已作为可下载桌面软件发布。它把视频、播客和个人内容整理流程放回本机，内置 ffmpeg 与 yt-dlp，不需要用户手动安装这些媒体依赖。',
    descriptionPoints: {
      sources: {
        title: '桌面化媒体入口',
        description: '把视频链接、播客源和单文件下载收进同一个本地工具，不再分散在脚本、网页和命令行里。'
      },
      download: {
        title: '内置解析运行时',
        description: 'macOS 包内置 ffmpeg 与 yt-dlp，普通用户安装后即可完成解析、下载和基础内容整理。'
      },
      notes: {
        title: '本地优先的工作流',
        description: 'Cookies、下载目录、媒体文件和个人处理记录保留在本机，Release 只交付软件本身。'
      }
    },
    meta: {
      type: '开源项目',
      typeValue: 'MIT License'
    },
    sections: {
      release: 'Release v0.2.5 · macOS 预发布'
    },
    actions: {
      releases: '下载 v0.2.5',
      github: '查看 GitHub'
    },
    screenshot: {
      alt: 'Media Parser Desktop 软件截图'
    },
    modules: {
      video: {
        title: '视频解析 & 下载',
        short: '解析视频信息 / 下载资源',
        description: '解析视频信息，选择可用格式，并下载单个媒体文件。'
      },
      podcast: {
        title: '播客解析 & 下载',
        short: '解析播客 RSS / 下载音频',
        description: '解析播客 RSS 与音频来源，获取单集信息并保存音频。'
      },
      transcript: {
        title: '本地运行时',
        short: '内置 ffmpeg / yt-dlp',
        description: '打包版本随附媒体工具，用户无需单独安装 ffmpeg 或 yt-dlp。'
      },
      release: {
        title: '更新入口',
        short: '设置 / 关于 / 检测更新',
        description: '桌面端设置页提供检测更新入口，后续版本会继续完善更新流程。'
      }
    },
    releaseLinks: {
      github: 'GitHub 仓库',
      releases: 'v0.2.5 Release'
    }
  },
  podcastParser: {
    sections: {
      toolIndex: '01 — 工具',
      input: '输入',
      result: '结果'
    },
    hero: {
      titleLead: 'Podcast',
      titleAccent: 'Parser',
      description: '解析 Apple Podcasts、小宇宙、RSS Feed 与音频链接，提取节目、单集、音频源与字幕状态。',
      editionLabel: '版本'
    },
    input: {
      placeholder: '粘贴 Apple Podcasts、小宇宙、RSS 或音频链接',
      parse: '解析',
      parsing: '解析中'
    },
    status: {
      ready: '就绪',
      resolving: '解析中',
      resolved: '已解析',
      partial: '部分结果',
      failed: '解析失败',
      failedShort: '失败',
      resolvingSource: '正在解析来源',
      missing: '缺失',
      unknown: 'unknown'
    },
    trail: {
      loading: '读取来源 / 检查字幕',
      failed: '解析失败',
      audioFound: '已找到音频',
      audioMissing: '未找到音频'
    },
    result: {
      coverAlt: '播客封面',
      untitledEpisode: '未命名单集',
      source: '来源',
      audio: '音频',
      audioSource: '音频源',
      audioSize: '音频大小',
      transcript: '字幕',
      summary: '总结'
    },
    messages: {
      resolvingSource: '正在读取播客来源、单集信息和公开字幕状态。',
      noAudio: '未返回公开音频源。',
      transcriptAvailable: '已找到公开字幕。',
      transcriptMarkerOnly: '来源存在字幕标记，但没有公开字幕内容。',
      transcriptInsufficient: '找到了公开字幕，但内容太短或噪声过多，暂时不可用。',
      transcriptMissing: '未找到公开字幕。'
    },
    actions: {
      showMore: '展开全部',
      showLess: '收起'
    },
    localStt: {
      action: '本地转写',
      retry: '重新转写',
      transcribing: '转写中',
      running: '正在本地转写，完成后会保存字幕。',
      complete: '本地转写完成，字幕已保存。',
      savedTo: '默认保存路径',
      reveal: '在 Finder 中显示',
      revealComplete: '已打开本地路径',
      stages: {
        queued: '排队中',
        downloading: '下载音频中',
        transcribing: '转写中',
        saving: '保存中',
        completed: '已完成',
        failed: '失败'
      }
    },
    errors: {
      emptyUrl: '请先粘贴播客、RSS 或音频链接。',
      invalidUrl: '请输入有效链接。',
      parseFailed: '播客解析失败：{message}',
      localSttFailed: '本地转写失败：{message}',
      revealFailed: '打开本地路径失败'
    }
  },
  videoParser: {
    title: '视频解析下载工具',
    subtitle: '支持 Bilibili、YouTube 等多平台视频解析',
    tip: '提示：支持 Bilibili、YouTube 等多平台视频解析与下载',
    pageDescription: '解析 YouTube / Bilibili 视频链接，获取可下载的音视频格式并保存到本地。',
    ui: {
      settings: '设置',
      cookiesDirectory: 'Cookie'
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
      processing: '处理中',
      rowStatus: {
        READY: '就绪',
        DOWNLOADING: '下载中',
        PAUSED: '已暂停',
        COMPLETE: '完成',
        FAILED: '失败',
        CANCELLED: '已取消',
        UNAVAILABLE: '不可用'
      },
      actions: {
        download: '下载',
        processing: '处理中',
        pause: '暂停',
        resume: '继续',
        cancel: '取消',
        redownload: '重新下载',
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
      generate: '生成大纲',
      retry: '重试生成',
      states: {
        idle: {
          title: '等待解析视频',
          description: '解析视频后可生成大纲。'
        },
        noSubtitles: {
          title: '暂无字幕',
          description: '未检测到平台字幕，暂时无法生成大纲。'
        },
        insufficient: {
          title: '字幕内容不足',
          description: '字幕内容不足，无法生成大纲。'
        },
        subtitlesAvailable: {
          title: '字幕可用',
          description: '已检测到字幕文本，可根据当前页面语言生成视频大纲。'
        },
        generating: {
          title: '正在生成大纲',
          description: '正在根据字幕内容生成视频大纲…'
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
      custom: '自定义',
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
      manual: '使用本地保存的 cookies.txt，适合无法读取浏览器 Cookie 的场景。',
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
    cookiesSavedTip: '提示：Cookies 已由桌面端保存在本地，刷新页面不会丢失',
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
      revealFailed: '打开本地路径失败',
      outlineFailed: '生成大纲失败',
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
      revealComplete: '已打开本地路径',
      defaultDirSaved: '默认下载目录已保存: {path}',
      cookieUsageSaved: 'Cookie 使用方式已保存',
      confirmDeleteCookies: '确定要删除 {platform} 的 Cookies 吗？'
    }
  }
}
