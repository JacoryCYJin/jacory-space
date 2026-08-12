export default {
  mediaParserSoftware: {
    kicker: '02 — ローカルソフトウェア / メディアワークベンチ',
    titleLead: 'Media Parser ',
    titleAccent: 'Desktop',
    tagline: 'macOS 向けプレリリースを配布しているローカルメディア解析ツール。',
    descriptionLead: 'Media Parser v0.2.5 は、ダウンロード可能なデスクトップソフトウェアとして公開されています。動画、Podcast、個人のメディア整理をローカル環境で扱い、macOS パッケージには ffmpeg と yt-dlp も同梱しています。',
    descriptionPoints: {
      sources: {
        title: 'デスクトップのメディア入口',
        description: '動画リンク、Podcast フィード、単体ファイルのダウンロードを、スクリプトやWebページ、コマンドラインに分散させず、ひとつのローカルツールにまとめます。'
      },
      download: {
        title: '解析ランタイムを同梱',
        description: 'macOS パッケージには ffmpeg と yt-dlp を同梱しているため、インストール後すぐに解析、ダウンロード、基本的なメディア整理を始められます。'
      },
      notes: {
        title: 'ローカル優先のワークフロー',
        description: 'Cookie、保存先、メディアファイル、個人の処理記録は手元に残り、Release はソフトウェア本体だけを届けます。'
      }
    },
    meta: {
      type: 'オープンソース',
      typeValue: 'MIT License'
    },
    sections: {
      release: 'Release v0.2.5 · macOS プレリリース'
    },
    actions: {
      releases: 'v0.2.5 をダウンロード',
      github: 'GitHub を見る'
    },
    screenshot: {
      alt: 'Media Parser Desktop のソフトウェアスクリーンショット'
    },
    modules: {
      video: {
        title: '動画解析 & ダウンロード',
        short: 'メタデータ / ダウンロード',
        description: '動画情報を解析し、利用可能な形式を確認して単体メディアファイルを保存します。'
      },
      podcast: {
        title: 'Podcast 解析 & ダウンロード',
        short: 'RSS / 音声ファイル',
        description: 'Podcast RSS と音声ソースを解析し、エピソード情報を取得して音声を保存します。'
      },
      transcript: {
        title: '同梱ランタイム',
        short: 'ffmpeg / yt-dlp 同梱',
        description: 'パッケージ版にはメディアツールを同梱しているため、ffmpeg や yt-dlp を個別にインストールする必要はありません。'
      },
      release: {
        title: '更新確認',
        short: '設定 / About / 更新確認',
        description: 'デスクトップアプリの設定画面に更新確認の入口を追加し、今後のバージョンで更新フローをさらに整えていきます。'
      }
    },
    releaseLinks: {
      github: 'GitHub リポジトリ',
      releases: 'v0.2.5 Release'
    }
  },
  podcastParser: {
    sections: {
      toolIndex: '01 — ツール',
      input: '入力',
      result: '結果'
    },
    hero: {
      titleLead: 'Podcast',
      titleAccent: 'Parser',
      description: 'Apple Podcasts、小宇宙、RSS Feed、音声リンクを解析し、番組、エピソード、音声ソース、字幕状態を取得します。',
      editionLabel: '版'
    },
    input: {
      placeholder: 'Apple Podcasts、小宇宙、RSS、または音声 URL を貼り付けてください',
      parse: '解析',
      parsing: '解析中'
    },
    status: {
      ready: '準備完了',
      resolving: '解析中',
      resolved: '解析済み',
      partial: '一部取得',
      failed: '解析失敗',
      failedShort: '失敗',
      resolvingSource: 'ソースを解析中',
      missing: 'なし',
      unknown: 'unknown'
    },
    trail: {
      loading: 'ソース取得 / 字幕確認',
      failed: '解析失敗',
      audioFound: '音声あり',
      audioMissing: '音声なし'
    },
    result: {
      coverAlt: 'Podcast カバー',
      untitledEpisode: '無題のエピソード',
      source: 'ソース',
      audio: '音声',
      audioSource: '音声ソース',
      audioSize: '音声サイズ',
      transcript: '字幕',
      summary: '要約'
    },
    messages: {
      resolvingSource: 'Podcast のソース、エピソード情報、公開字幕の状態を読み込んでいます。',
      noAudio: '公開されている音声ソースは返されませんでした。',
      transcriptAvailable: '公開字幕が見つかりました。後続の要約で利用できます。',
      transcriptMarkerOnly: 'ソースに字幕マーカーはありますが、公開字幕の内容はありません。',
      transcriptInsufficient: '公開字幕は見つかりましたが、短すぎるかノイズが多いため利用できません。',
      transcriptMissing: 'このソースには公開字幕が見つかりませんでした。'
    },
    actions: {
      showMore: 'すべて表示',
      showLess: '閉じる'
    },
    localStt: {
      action: 'ローカル文字起こし',
      retry: '再文字起こし',
      transcribing: '文字起こし中',
      running: 'ローカル文字起こしを実行中です。完了後、字幕ファイルを保存します。',
      complete: 'ローカル文字起こしが完了しました。字幕ファイルを保存しました。',
      savedTo: '既定の保存先',
      reveal: 'Finder で表示',
      revealComplete: 'ローカルパスを開きました',
      stages: {
        queued: '待機中',
        downloading: '音声をダウンロード中',
        transcribing: '文字起こし中',
        saving: '保存中',
        completed: '完了',
        failed: '失敗'
      }
    },
    errors: {
      emptyUrl: 'Podcast、RSS、または音声 URL を先に貼り付けてください。',
      invalidUrl: '有効な URL を入力してください。',
      parseFailed: 'Podcast を解析できませんでした：{message}',
      localSttFailed: 'ローカル文字起こしに失敗しました：{message}',
      revealFailed: 'ローカルパスを開けませんでした'
    }
  },
  videoParser: {
    title: '動画解析・ダウンロード',
    subtitle: 'Bilibili、YouTube などの動画を解析してダウンロードできます。',
    tip: 'Bilibili、YouTube など、対応している動画の URL を貼り付けてください。',
    pageDescription: 'YouTube / Bilibili の動画 URL を解析し、利用できる形式を取得してローカルに保存します。',
    ui: {
      settings: '設定',
      cookiesDirectory: 'COOKIE / 保存先'
    },
    cookieEntry: {
      label: 'Cookie 設定',
      hint: 'この動画の取得には Cookie が必要です。設定を開いて Cookie を登録し、もう一度お試しください。'
    },
    sections: {
      command: 'コマンド',
      status: 'ステータス',
      videoInfo: '動画情報',
      downloadRegistry: 'ダウンロード一覧',
      outputPath: '保存先',
      outlineMap: 'アウトライン',
      cookiesSettings: 'COOKIE 設定',
      directorySettings: '保存先設定'
    },
    statusRail: {
      READY: '準備完了',
      PARSING: '解析中',
      RESOLVED: '解析済み',
      DOWNLOADING: 'ダウンロード中',
      COMPLETE: '完了',
      COOKIES_REQUIRED: 'Cookie が必要',
      FAILED: '失敗'
    },
    info: {
      awaitingUrl: 'URL を待っています',
      awaitingDescription: '動画の URL を貼り付けて解析すると、サムネイル、タイトル、配信元、再生時間などの情報が表示されます。',
      source: '配信元',
      duration: '再生時間',
      uploader: '投稿者',
      pubDate: '公開日',
      formatsAvailable: '利用可能な形式'
    },
    registry: {
      items: '{count}件',
      empty: 'ダウンロードできる MP4 または音声形式が見つかりませんでした。',
      resolution: '解像度',
      format: '形式',
      size: 'サイズ',
      status: '状態',
      action: '操作',
      processing: '処理中',
      rowStatus: {
        READY: '準備完了',
        DOWNLOADING: 'ダウンロード中',
        PAUSED: '一時停止',
        COMPLETE: '完了',
        FAILED: '失敗',
        CANCELLED: 'キャンセル済み',
        UNAVAILABLE: '利用不可'
      },
      actions: {
        download: 'ダウンロード',
        processing: '処理中',
        pause: '一時停止',
        resume: '再開',
        cancel: 'キャンセル',
        redownload: '再ダウンロード',
        retry: '再試行',
        reveal: '場所を表示',
        open: '開く'
      }
    },
    output: {
      pending: 'ダウンロードが完了すると、ファイルの保存先が表示されます。',
      copyPath: 'パスをコピー',
      revealInFinder: 'Finder で表示',
      copied: 'パスをコピーしました'
    },
    outline: {
      copyOutline: 'アウトラインをコピー',
      root: '動画アウトライン',
      copied: 'コピーしました',
      generate: 'アウトラインを生成',
      retry: 'もう一度生成',
      states: {
        idle: {
          title: '動画を待っています',
          description: '動画を解析すると、アウトラインを生成できます。'
        },
        noSubtitles: {
          title: '字幕がありません',
          description: 'プラットフォーム上の字幕を検出できなかったため、現在はアウトラインを生成できません。'
        },
        insufficient: {
          title: '字幕が不足しています',
          description: 'アウトラインを生成するには字幕の内容が足りません。'
        },
        subtitlesAvailable: {
          title: '字幕を検出しました',
          description: '字幕テキストを利用して、動画のアウトラインを生成できます。'
        },
        generating: {
          title: 'アウトラインを生成中',
          description: '字幕をもとに動画のアウトラインを作成しています…'
        },
        success: {
          title: 'アウトラインを生成しました',
          description: '動画のアウトラインを確認できます。'
        },
        failed: {
          title: '生成できませんでした',
          description: 'アウトラインの生成中に問題が発生しました。時間をおいてもう一度お試しください。'
        },
        empty: {
          title: 'アウトラインがありません',
          description: 'この動画には、まだ表示できるアウトラインがありません。'
        }
      }
    },
    settings: {
      mode: '利用方法',
      cookieModes: {
        manual: '手動',
        browser: 'ブラウザ',
        none: '使用しない'
      },
      browserSource: '使用するブラウザ',
      platformCookies: 'プラットフォーム別 Cookie',
      set: '設定済み',
      notSet: '未設定',
      edit: '編集',
      delete: '削除',
      custom: 'カスタム',
      cookiesUsageNote: 'Cookie は、ログインが必要な非公開・制限付き動画にアクセスする場合にのみ使用します。',
      defaultDownloadDirectory: '既定の保存先',
      temporaryDirectory: '一時保存先（今回のみ）',
      useDefaultDirectory: '既定の保存先を使用',
      change: '変更',
      temporaryDirectoryNote: '一時保存先には処理中のファイルが置かれ、ダウンロード完了後に自動で削除できます。'
    },
    thumbnailAlt: '動画のサムネイル',
    cookiesSettings: 'Cookie 設定',
    downloadSettings: '保存先設定',
    inputPlaceholder: '動画の URL を貼り付けてください（YouTube、Bilibili など）',
    parse: '動画を解析',
    parsing: '解析中…',
    loading: '動画を解析しています…',
    duration: '再生時間',
    availableResolutions: '利用できる解像度：',
    size: 'サイズ',
    download: 'ダウンロード',
    downloading: 'ダウンロード中…',
    cookiesManagement: 'Cookie 管理',
    cookieUsage: 'Cookie の利用方法',
    cookieModes: {
      manual: 'Cookie を手動で保存',
      browser: 'ブラウザから読み込む',
      none: 'Cookie を使用しない'
    },
    saveUsage: '利用方法を保存',
    saving: '保存中…',
    cookieHelp: {
      browser: 'yt-dlp を --cookies-from-browser {browser} 付きで実行します。先にそのブラウザで動画サービスへログインしてください。',
      manual: 'ローカルに保存した cookies.txt を使用します。ブラウザの Cookie を読み込めない場合に便利です。',
      none: '公開動画は Cookie なしでも解析できる場合があります。ログインが必要な動画は解析に失敗することがあります。'
    },
    status: {
      set: '設定済み',
      unset: '未設定'
    },
    actions: {
      edit: '編集',
      set: '設定',
      delete: '削除',
      add: '追加',
      cancel: 'キャンセル',
      save: '保存'
    },
    addCustomPlatform: 'カスタムプラットフォームを追加',
    downloadDirectorySettings: '保存先設定',
    defaultDownloadDirectory: '既定の保存先',
    notSet: '未設定',
    chooseDefaultDirectory: '既定の保存先を選択',
    oneTimeDownloadDirectory: '今回の保存先（任意）',
    oneTimeDirectoryFallback: '未設定（既定の保存先を使用します）',
    chooseOneTimeDirectory: '今回の保存先を選択',
    clearOneTimeDirectory: '今回の保存先を解除',
    addPlatformTitle: 'カスタムプラットフォームを追加',
    platformPlaceholder: 'プラットフォーム名を入力（例：twitter、instagram）',
    setCookiesTitle: '{platform} の Cookie を設定',
    cookiesSavedTip: 'Cookie はデスクトップアプリによってローカルに保存され、ページを再読み込みしても保持されます。',
    cookiesPlaceholder: '{platform} の cookies.txt の内容を貼り付けてください…',
    errors: {
      emptyUrl: '動画の URL を入力してください',
      invalidUrl: '有効な動画 URL を入力してください',
      noVisibleFormats: 'ダウンロードできる MP4 または音声形式が見つかりませんでした。',
      parseFailed: '動画を解析できませんでした：{message}',
      downloadFailed: '動画をダウンロードできませんでした：{message}',
      loadSettingsFailed: '設定を読み込めませんでした',
      saveDefaultDirFailed: '既定の保存先を保存できませんでした',
      folderDialogFailed: 'フォルダ選択画面を開けませんでした',
      revealFailed: 'ローカルパスを開けませんでした',
      outlineFailed: 'アウトラインを生成できませんでした',
      saveCookieSettingsFailed: 'Cookie の利用方法を保存できませんでした',
      loadCookiesFailed: 'Cookie の状態を読み込めませんでした',
      saveFailed: '変更を保存できませんでした',
      deleteFailed: '削除できませんでした',
      platformExists: '同じプラットフォームがすでに登録されています'
    },
    messages: {
      readingMetadata: '動画情報を取得しています…',
      downloadingResolution: '{resolution} 版をダウンロードしています…',
      downloadComplete: 'ダウンロードが完了しました。保存先：{path}',
      revealComplete: 'ローカルパスを開きました',
      defaultDirSaved: '既定の保存先を変更しました：{path}',
      cookieUsageSaved: 'Cookie の利用方法を保存しました',
      confirmDeleteCookies: '{platform} の Cookie を削除しますか？'
    }
  }
}
