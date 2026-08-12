const developmentLibraryEntries = import.meta.env.DEV ? {
  podcastContentSummary: { title: 'ポッドキャスト内容要約', description: '話し言葉の字幕を、読みやすい内容要約と次の企画候補に整理します。' },
  podcastToBlog: { title: 'ポッドキャストからブログ下書き', description: 'ポッドキャスト字幕から一本の軸を取り出し、匿名化した中国語ブログ下書きにします。' },
  blogMarkdownPolish: { title: 'ブログ Markdown の推敲', description: '既存の下書きを Jacory Space 形式に沿った正式なブログ Markdown に整えます。' },
} : {}

const developmentLibraryDetails = import.meta.env.DEV ? {
  podcastContentSummary: { about: 'ポッドキャスト字幕から、読みやすい要約、主要な考え、話の流れ、次の企画を抽出します。', usage: '構造化した字幕を貼り付けるか、title・source・transcript フィールドを持つ JSON をアップロードします。', notes: '字幕に基づいて整理し、不足箇所は補わずに不確実性として示します。' },
  podcastToBlog: { about: 'ポッドキャスト素材を、個人的な視点の境界を保った、独立して読める中国語ブログ記事に再構成します。', usage: '字幕を入力します。モデルが最も強い軸を選び、利用可能な Markdown ブログ下書きを出力します。', notes: '識別できる出典と私的な詳細を取り除き、元の話者の経験を著者の経験には書き換えません。' },
  blogMarkdownPolish: { about: '著者の中心的な考えを変えずに、下書きの文章リズム、frontmatter、ファイル名、サイトの Markdown 形式を整えます。', usage: '中国語ブログの下書きを一つまたは複数貼り付けます。仮のファイル名や未完成の frontmatter を含めても構いません。', notes: 'まったく別の記事に書き換えるのではなく、編集と整理を行う Prompt です。' },
} : {}

export default {
  library: {
    kicker: 'PROMPT / SKILL ライブラリ', titleLead: 'アイデア', titleAccent: 'レシピ',
    description: '再利用できるプロンプト、Agent Skill、仕事の方法をまとめた個人の資産庫です。見つけ、理解し、持ち帰れます。',
    indexLabel: 'アセット索引', browseLabel: 'カテゴリから探す', tagsLabel: 'タグ一覧', filterAria: 'アセットを絞り込む', searchLabel: 'アセットを検索', searchPlaceholder: 'タイトルまたはタグを検索', updatedLabel: '最終更新',
    filters: { all: 'すべて', prompts: 'PROMPTS', skills: 'SKILLS' }, copy: 'コピー', copied: 'コピー済み', expandContent: 'すべて表示', collapseContent: '折りたたむ', copySuccess: 'クリップボードにコピーしました', copyError: 'コピーに失敗しました。手動で選択してください。', empty: '一致するアセットはありません', backToLibrary: 'ライブラリに戻る', versionLabel: 'バージョン', commitLabel: 'COMMIT', licenseLabel: 'ライセンス', catalogedAtLabel: '収録日', assetsLabel: 'アセット', promptsLabel: 'PROMPTS', skillsLabel: 'SKILLS', aboutLabel: '用途', contentLabel: 'PROMPT CONTENT', skillContentLabel: 'SKILL CONTENT', externalSkillLabel: 'EXTERNAL SKILL', usageLabel: '使い方', notesLabel: 'メモ', useCasesLabel: '利用シーン', precautionsLabel: '注意事項', contentOutlineLabel: '内容目次', sourceAndDeploymentLabel: 'ソースと導入', sourceRepositoryLabel: 'ソースリポジトリ', sourcePathLabel: 'ファイルパス', deploymentCommandLabel: '導入コマンド', copyInstallCommand: '導入コマンドをコピー', installCommandCopied: '導入コマンドをコピーしました', switchToGrid: '2列表示に切り替え', switchToList: 'リスト表示に切り替え', notFound: 'アセットが見つかりません',
    tags: { podcast: 'ポッドキャスト', summary: '要約', writing: '執筆', markdown: 'Markdown', minecraft: 'Minecraft', imageGeneration: '画像生成', threejs: 'Three.js', webgl: 'WebGL', vue: 'Vue', gsap: 'GSAP', animation: 'アニメーション' },
    clearTags: 'クリア',
    entries: {
      ...developmentLibraryEntries,
      minecraftSkinPreview: { title: 'Minecraft キャラクター両視点プレビュー', description: '後続のスキン変換工程向けに、標準 Minecraft Java キャラクターの両視点プレビューを生成します。' },
      threejsFundamentals: { title: 'Three.js Fundamentals', description: 'Three.js のシーン、カメラ、レンダラー、オブジェクト階層のための外部 Skill を収録します。' },
      gsapCore: { title: 'GSAP Core', description: 'GSAP のコア Tween、イージング、Stagger、レスポンシブアニメーションの公式 Skill を収録します。' }
    },
    details: {
      ...developmentLibraryDetails,
      minecraftSkinPreview: { about: 'Minecraft Java スキン制作フロー用の長期的な画像生成対話を設定します。UV スキン図ではなく、両視点のキャラクタープレビューを生成します。', usage: '新しい画像生成チャットを開始し、固定の両視点参照画像をアップロードしてから、長期ルールを貼り付けます。続けてテキスト要望またはキャラクター参照画像を送ります。', notes: '画像 1 は構図、視点、比率だけを決めます。キャラクターデザインは要望または後から送る参照画像で決まります。' },
      threejsFundamentals: { about: 'Three.js のシーン、カメラ、レンダラー、オブジェクト階層、座標変換、リソース解放を実装・確認するときに使います。', usage: 'Vue / Vite の画面で Three.js の基礎実装を行うときに適しています。マテリアル、照明、ローダー、ポストプロセスはソースリポジトリ内の関連 Skill を参照します。' },
      gsapCore: { about: 'GSAP のコア Tween、イージング、Stagger、DOM / SVG アニメーション、レスポンシブなモーションを実装・確認するときに使います。', usage: 'タイムライン、実行時制御、`gsap.matchMedia()` によるレスポンシブ分岐が必要な画面に適しています。スクロール連動やプラグインはソースリポジトリ内の関連 Skill を参照します。' },
    }
  }
}
