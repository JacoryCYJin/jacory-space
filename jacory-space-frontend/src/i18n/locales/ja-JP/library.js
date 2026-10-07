const developmentLibraryEntries = import.meta.env.DEV ? {
  podcastReadingSummary: { title: 'ポッドキャスト学習ノート', description: "ポッドキャストの資料を原意に忠実で理解・復習しやすい学習ノートに整理し、知識の主要な流れを再構成する核心的な問いと回答、現実の場面で繰り返し使える判断の枠組みと方法を抽出します。" },
  podcastContentSummary: { title: 'ポッドキャスト内容要約', description: '話し言葉の字幕を、読みやすい内容要約と次の企画候補に整理します。' },
  podcastToBlog: { title: 'ポッドキャストからブログ下書き', description: 'ポッドキャスト字幕から一本の軸を取り出し、匿名化した中国語ブログ下書きにします。' },
  blogMarkdownPolish: { title: 'ブログ Markdown の推敲', description: '既存の下書きを Jacory Space 形式に沿った正式なブログ Markdown に整えます。' },
} : {}

const developmentLibraryDetails = import.meta.env.DEV ? {
  podcastReadingSummary: {
    about: "知識そのものを中心に、概念・因果・問いの関係に沿って十分なノートを構成し、必要な説明と代表的な資料を残します。その後、核心となる問いと回答を抽出し、現実の場面で繰り返し使える実践内容を厳選します。",
    usage: "文字起こしを貼り付けるか、添付資料、または title・source・transcript フィールドを持つ JSON を渡します。ノート、問いと回答、実践をこの順で中国語で生成し、# 笔记 から始まる一つの Markdown コードブロックにまとめます。",
    notes: "実際に読めた資料だけを使い、意見の相違、適用条件、不確実性を残し、必要に応じて出典を区別します。後の段階のために十分なノートを短縮せず、番組にない方法や助言を追加しません。第1レベルの見出しは笔记・问答・实践のみとし、その下に第2レベルのグループを一つだけ置く構成は避けます。",
  },
  podcastContentSummary: { about: 'ポッドキャスト字幕から、読みやすい要約、主要な考え、話の流れ、次の企画を抽出します。', usage: '構造化した字幕を貼り付けるか、title・source・transcript フィールドを持つ JSON をアップロードします。', notes: '字幕に基づいて整理し、不足箇所は補わずに不確実性として示します。' },
  podcastToBlog: { about: 'ポッドキャスト素材を、個人的な視点の境界を保った、独立して読める中国語ブログ記事に再構成します。', usage: '字幕を入力します。モデルが最も強い軸を選び、利用可能な Markdown ブログ下書きを出力します。', notes: '識別できる出典と私的な詳細を取り除き、元の話者の経験を著者の経験には書き換えません。' },
  blogMarkdownPolish: { about: '著者の中心的な考えを変えずに、下書きの文章リズム、frontmatter、ファイル名、サイトの Markdown 形式を整えます。', usage: '中国語ブログの下書きを一つまたは複数貼り付けます。仮のファイル名や未完成の frontmatter を含めても構いません。', notes: 'まったく別の記事に書き換えるのではなく、編集と整理を行う Prompt です。' },
} : {}

export default {
  library: {
    kicker: 'PROMPT / SKILL ライブラリ', titleLead: 'アイデア', titleAccent: 'レシピ',
    description: '再利用できるプロンプト、Agent Skill、仕事の方法をまとめた個人の資産庫です。見つけ、理解し、持ち帰れます。',
    indexLabel: 'アセット索引', browseLabel: 'カテゴリから探す', tagsLabel: 'タグ一覧', filterAria: 'アセットを絞り込む', searchLabel: 'アセットを検索', searchPlaceholder: 'タイトルまたはタグを検索', updatedLabel: '最終更新',
    filters: { all: 'すべて', prompts: 'PROMPTS', skills: 'SKILLS' }, copy: 'コピー', copied: 'コピー済み', expandContent: 'すべて表示', collapseContent: '折りたたむ', copySuccess: 'クリップボードにコピーしました', copyError: 'コピーに失敗しました。手動で選択してください。', empty: '一致するアセットはありません', backToLibrary: 'ライブラリに戻る', versionLabel: 'バージョン', commitLabel: 'COMMIT', licenseLabel: 'ライセンス', catalogedAtLabel: '収録日', assetsLabel: 'アセット', promptsLabel: 'PROMPTS', skillsLabel: 'SKILLS', aboutLabel: '用途', contentLabel: 'PROMPT CONTENT', skillContentLabel: 'SKILL CONTENT', externalSkillLabel: 'EXTERNAL SKILL', usageLabel: '使い方', notesLabel: 'メモ', useCasesLabel: '利用シーン', precautionsLabel: '注意事項', coreContentLabel: '主要内容', capabilityBoundaryLabel: '対象範囲', contentOutlineLabel: '内容目次', sourceAndDeploymentLabel: 'ソースと導入', sourceRepositoryLabel: 'ソースリポジトリ', deploymentCommandLabel: '導入コマンド', copyInstallCommand: '導入コマンドをコピー', installCommandCopied: '導入コマンドをコピーしました', switchToGrid: '2列表示に切り替え', switchToList: 'リスト表示に切り替え', notFound: 'アセットが見つかりません',
    tags: { podcast: 'ポッドキャスト', summary: '要約', writing: '執筆', markdown: 'Markdown', minecraft: 'Minecraft', imageGeneration: '画像生成', threejs: 'Three.js', webgl: 'WebGL', vue: 'Vue', gsap: 'GSAP', animation: 'アニメーション' },
    clearTags: 'クリア',
    entries: {
      ...developmentLibraryEntries,
      minecraftSkinPreview: { title: 'Minecraft キャラクター両視点プレビュー', description: '後続のスキン変換工程向けに、標準 Minecraft Java キャラクターの両視点プレビューを生成します。' },
      threejsFundamentals: { title: 'Three.js', description: 'Three.js のシーン、カメラ、レンダラー、オブジェクト階層のための外部 Skill を収録します。' },
      gsapCore: { title: 'GSAP', description: 'GSAP のコア Tween、イージング、Stagger、レスポンシブアニメーションの公式 Skill を収録します。' }
    },
    details: {
      ...developmentLibraryDetails,
      minecraftSkinPreview: { about: 'Minecraft Java スキン制作フロー用の長期的な画像生成対話を設定します。UV スキン図ではなく、両視点のキャラクタープレビューを生成します。', usage: '新しい画像生成チャットを開始し、固定の両視点参照画像をアップロードしてから、長期ルールを貼り付けます。続けてテキスト要望またはキャラクター参照画像を送ります。', notes: '画像 1 は構図、視点、比率だけを決めます。キャラクターデザインは要望または後から送る参照画像で決まります。' },
      threejsFundamentals: { about: 'Three.js プロジェクトを新規作成または確認するときに、シーン、カメラ、レンダラー、オブジェクト階層、座標変換、リソース解放などの基礎課題に使います。', usage: 'シーン、カメラ、レンダラーの設定、Object3D / Group / Mesh の階層、座標変換と主要な数学ユーティリティに加え、アニメーションループ、サイズ対応、リソース解放、読み込み、パフォーマンス処理を扱います。', notes: 'Three.js の基礎実装を主に扱います。マテリアル、照明、ローダー、ポストプロセスなどの専門領域は、ソースリポジトリ内の対応する Skill を参照してください。' },
      gsapCore: { about: 'GSAP のコア Tween、イージング、Stagger、DOM / SVG アニメーション、レスポンシブなモーションを実装・確認するときに使います。', usage: '`gsap.to()`、`from()`、`fromTo()`、`set()` による Tween の書き方、時間、イージング、Stagger、繰り返しの設定、DOM / SVG の変換、Tween インスタンスの制御、`gsap.matchMedia()` によるレスポンシブとモーション低減の設定を扱います。', notes: 'GSAP のコアアニメーションを主に扱います。スクロール連動、フレームワーク連携、プラグイン、パフォーマンスなどの専門領域は、ソースリポジトリ内の対応する Skill を参照してください。' },
    }
  }
}
