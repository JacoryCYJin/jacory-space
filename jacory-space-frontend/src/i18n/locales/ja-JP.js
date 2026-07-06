export default {
  nav: {
    home: 'ホーム',
    tools: 'ツール',
    videoParser: '動画解析',
    blog: 'ブログ',
    about: 'プロフィール'
  },
  language: {
    label: '言語を切り替える',
    zh: '中文',
    en: 'English',
    ja: '日本語'
  },
  home: {
    title: 'Jacory Space へようこそ',
    subtitle: '技術を共有し、日々を記録し、可能性を探る',
    hero: {
      description: '作品、ツール、ノート、アーカイブをまとめるための個人的なデジタル空間。',
      keywords: '作品 · ツール · ノート · アーカイブ'
    },
    actions: {
      videoParser: '動画解析を試す',
      about: '詳しく見る'
    },
    cards: {
      video: {
        title: '動画解析ツール',
        description: '複数の動画プラットフォームに対応し、画質を選んでダウンロードできます。',
        action: 'ツールを開く'
      },
      blog: {
        title: 'ブログ',
        description: '技術、学び、日々の気づきを記録しています。',
        action: '記事を読む'
      },
      tools: {
        title: 'そのほかのツール',
        description: '新しいアイデアを少しずつ形にしています。',
        status: '準備中'
      }
    }
  },
  tools: {
    interfaceIndex: {
      kicker: '01 — インターフェース索引',
      description: '自作ツール、作品、インターフェース実験、システム部品をまとめた索引。',
      categoriesAria: 'インターフェースのカテゴリー',
      summaryLabel: '概要',
      lastUpdateLabel: '最終更新',
      filters: {
        all: 'すべて',
        tools: 'ツール',
        works: '作品',
        experiments: '実験',
        archived: 'アーカイブ'
      },
      categoryDescriptions: {
        all: '空間全体と、ここに収められたすべての項目。',
        tools: '日々のための基礎ツールとインターフェース部品。',
        works: '公開済みのプロジェクトとケーススタディ。',
        experiments: '調査、試作、まだ名前のない探求。'
      },
      summary: {
        entries: '項目',
        live: '公開中',
        wipBeta: '制作中 / ベータ',
        archived: 'アーカイブ'
      }
    }
  },
  blog: {
    badge: 'Jacory Blog',
    title: '個人ブログ',
    subtitle: '開発、ツールづくり、日々の観察を、あとから読み返せる文章に整えて残します。',
    readMore: '続きを読む',
    directionTitle: 'テーマ',
    writingPlanTitle: '執筆予定',
    writingPlanDescription: 'プロジェクトの振り返り、開発ノート、ツールづくりで得た知見を蓄積していきます。記事ページや Markdown ベースの公開環境も順次整える予定です。',
    posts: {
      site: {
        title: '個人サイトをつくる、最初の一歩',
        readingTime: '読了目安 5分',
        summary: 'Jacory Space のページ構成、配色、ツールへの導線を整理し、個人サイトの土台を形にしていきます。',
        tags: ['個人サイト', 'Vue', 'Tailwind']
      },
      parser: {
        title: '動画解析ツールの設計ノート',
        readingTime: '読了目安 7分',
        summary: 'URL の入力から形式の選択、保存先の設定まで。動画解析ツールの流れと、次に改善したい点をまとめます。',
        tags: ['ツール開発', 'Node.js', 'yt-dlp']
      },
      workflow: {
        title: 'ワークフローにルールが必要な理由',
        readingTime: '読了目安 4分',
        summary: 'ブランチ、コミット、PR、マージの決めごとを言葉にすると、確認の往復が減り、共同作業を振り返りやすくなります。',
        tags: ['Git', 'コラボレーション', 'ワークフロー']
      },
      writing: {
        title: '断片的なアイデアを公開できる文章へ',
        readingTime: '読了目安 6分',
        summary: '思いつきを拾い、選び、推敲する。軽やかな流れをつくることで、書くことを無理なく続けられます。',
        tags: ['文章', '制作', '振り返り']
      }
    },
    categories: {
      project: 'プロジェクトの振り返り',
      development: '開発ノート',
      workflow: 'ワークフロー',
      life: '日々の観察'
    },
    fieldNotes: {
      journalLabel: '01 — ジャーナル',
      archiveOpen: '{count}件 / アーカイブ公開中',
      titleLead: 'Field',
      titleAccent: ' Notes',
      subtitle: 'インターフェース、システム、時間についての記録。頻度ではなく、残しておきたいものだけを。',
      readEntry: '記事を読む',
      archiveAll: 'アーカイブ — すべての記事',
      filterLabel: 'フィルター',
      filterCategory: '分類',
      filterYear: '年',
      filterAria: 'ブログアーカイブを絞り込む',
      endOfIndex: 'Jacory Space',
      footerNote: '仕組みが整ったら、次はページそのものへ。文章、ツール、ポートフォリオを、このクールホワイトの言語でひとつにつないでいきます。',
      footer: {
        system: 'システム',
        systemValue: 'Personal OS / v.01',
        surface: '入口',
        surfaceValue: 'ツール / ブログ / プロフィール',
        accent: '連絡',
        accentValue: 'Email / GitHub',
        status: '状態',
        statusValue: '公開しながら構築中'
      }
    },
    post: {
      onThisNote: 'この記事の目次',
      backToFieldNotes: 'Field Notes に戻る',
      previousEntry: '前の記事',
      nextEntry: '次の記事',
      fieldNote: 'FIELD NOTE',
      headerLabel: '№ {index} — {category}',
      navAria: '記事ナビゲーション',
      notFoundBadge: 'Error 404 / 記事が見つかりません',
      notFoundTitle: 'この記事は存在しません'
    },
    entryCategories: {
      WEEKLY: '週刊',
      RESEARCH: 'リサーチ',
      ESSAY: 'エッセイ',
      METHOD: 'メソッド'
    }
  },
  about: {
    sheet: {
      subtitle: 'Jacory',
      revision: 'ファイル 03 / 改訂 01',
      identityIllustrationAlt: 'Jacory のアイデンティティ線画'
    },
    slogan: {
      line1: '海は',
      line2Prefix: 'いまも',
      line2Emphasis: 'はるかに広い',
      line2Suffix: '。'
    },
    statement: 'ここは、私の個人的なデジタル空間です。\n作品を記録し、ツールを磨き、ノートを整理する。\n考え、つくり続けるための開かれたシステムでもあります。\n長く更新し、進化し続けます。',
    identity: {
      roleLabel: '自己定義',
      role: 'デザイナー · 開発者 · 書き手 · クリエイター',
      baseLabel: '実践領域',
      base: 'ソフトウェア開発 · Web体験設計 · Agentシステム · 動画制作',
      focusLabel: 'システム',
      focus: '個人サイト · 動画 · ナレッジベース · ワークフロー',
      statusLabel: '状態',
      status: '公開しながら構築中'
    },
    principles: {
      courage: '勇気',
      order: '秩序',
      curiosity: '好奇心',
      expression: '表現',
      refinement: '磨き上げ'
    },
    contact: {
      ariaLabel: '連絡先',
      label: '/ 連絡',
      rssStatus: '準備中',
      thanks: 'ご訪問ありがとうございます。'
    },
  },
  podcastParser: {
    sections: {
      toolIndex: '01 — ツール',
      input: '入力',
      result: '結果'
    },
    hero: {
      titleLead: 'Podcast',
      titleAccent: 'parser',
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
      manual: 'サーバーに保存した cookies.txt を使用します。ブラウザの Cookie を読み込めない場合に便利です。',
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
    cookiesSavedTip: 'Cookie はサーバーに保存されるため、ページを再読み込みしても保持されます。',
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
