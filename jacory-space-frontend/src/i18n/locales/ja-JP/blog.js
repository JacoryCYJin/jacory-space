export default {
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
      journalLabel: '02 — ノート',
      archiveOpen: '{count}件 / アーカイブ公開中',
      titleLead: 'Field',
      titleAccent: ' Notes',
      subtitleLead: 'Personal OS の公開日誌',
      subtitleBody: 'すべての記録は送られなかった手紙であり、すべてのアーカイブは未完の自己証明です。',
      readEntry: '記事を読む',
      archiveAll: 'アーカイブ — すべての記事',
      filterLabel: 'フィルター',
      filterCategory: '分類',
      filterTopic: 'テーマ',
      filterYear: '年',
      filterAria: 'ブログアーカイブを絞り込む',
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
      THINKING: '思考',
      METHOD: 'メソッド'
    },
    entryTopics: {
      PRODUCT: 'プロダクト'
    }
  }
}
