const developmentLibraryEntries = import.meta.env.DEV ? {
  englishSpeakingPartner: {"title":"英语口语搭子","description":"以自然聊天练习日常英语口语，动态调整难度，穿插简短纠错、表达复用与复盘，让你多开口。"},
  podcastReadingSummary: { title: '播客学习笔记', description: "将播客材料整理为忠实原意、便于理解和复习的学习笔记，再提炼帮助重建知识主线的核心问答，以及可在现实场景中反复调用的判断框架与方法。" },
  podcastContentSummary: { title: '播客内容总结', description: '把口语化播客字幕整理成清晰、可阅读的内容总结与后续选题。' },
  podcastToBlog: { title: '播客转博客初稿', description: '从播客字幕中提炼一条主线，写成去标识化的中文博客初稿。' },
  learningNotesEditor: {"title":"学习笔记编辑","description":"将多种来源的文字稿整理为忠实原意、知识完整且有效压缩的学习笔记，按笔记、问答、实践帮助理解、复习和调用。"},
} : {}

const developmentLibraryDetails = import.meta.env.DEV ? {
  englishSpeakingPartner: {"about":"面向日常交流而非考试，通过闲聊、旅行、购物、工作沟通和观点讨论，练习听懂、快速组织语言与自然表达。","usage":"将完整 Prompt 粘贴到新对话中，即可从简单的英语聊天开始；也可使用语音模式，需要中文解释时明确说“用中文解释”。","notes":"正常聊天每次回复 1～3 句，每 3～5 轮简短纠正重点问题，每约 8～12 轮或话题结束时复盘。卡壳时先等待，再按需给提示；仅在确实能够判断发音时提供发音建议，不根据文字转写猜测。"},
  podcastReadingSummary: {
    about: "围绕节目的主要知识主线，按概念、因果或问题关系组织可独立理解的笔记，保留必要解释与代表性材料，合并重复解释和支线内容；完成后再提炼核心问答，最后筛选值得在现实场景中反复调用的实践内容。",
    usage: "粘贴播客转录文本、提供附件，或上传含 title、source、transcript 字段的 JSON。依次生成中文笔记、问答和实践，整体放在一个 Markdown 代码块中，从 # 笔记 开始。",
    notes: "只依据实际读取的材料，保留分歧、限定条件和不确定性，必要时区分来源；后续阶段不得压缩完整笔记，不加入节目之外的方法或建议。一级标题仅使用笔记、问答、实践，各一级标题下不得只有一个二级分组。",
  },
  podcastContentSummary: {
    about: '从播客转录中提炼可阅读的内容总结、核心观点、内容脉络与后续选题。',
    usage: '直接粘贴结构化转录内容，或上传包含 title、source、transcript 字段的 JSON 文件。',
    notes: '只依据字幕内容整理；信息不足之处会明确标注，而不是补写。',
  },
  podcastToBlog: {
    about: '将播客素材重组为一篇能独立阅读、保留个人思考边界的中文博客文章。',
    usage: '输入播客转录；模型会自行判断最适合展开的一条主线，并输出可用的博客 Markdown 初稿。',
    notes: '规则会主动去除可识别的来源与私人细节，不将原讲述者经历改写成作者亲历。',
  },
  learningNotesEditor: {"about":"以知识为主体整理视频、课程、播客、访谈、演讲、会议或读书分享等文字稿，保留核心知识、必要解释和限定条件，删除冗余并合并重复，形成可独立阅读的学习笔记。","usage":"提供原始文字稿、已有笔记或多份材料，并说明分别处理还是综合；有原文和旧笔记时，以原文为依据核对。最终将笔记、问答、实践的完整正文放在一个标注为 markdown 的代码块中。","notes":"默认只依据提供且实际读取的材料，不添加外部知识，不把主观观点写成事实。笔记独立承载重要知识，问答用于复述，实践提取有依据的可复用方法；三部分合计应短于原文，正文不含编辑过程与验收记录。"},
} : {}

export default {
  library: {
    kicker: '提示词与技能资产库',
    titleLead: '灵感',
    titleAccent: '配方',
    description: '沉淀可复用的提示词、Agent 技能与工作方法。找到一个资产，理解它，然后带走。',
    indexLabel: '资产索引',
    browseLabel: '分类筛选',
    tagsLabel: '标签筛选',
    filterAria: '资产类型筛选',
    searchLabel: '搜索资产',
    searchPlaceholder: '搜索标题或标签',
    updatedLabel: '最后更新',
    filters: { all: '全部', prompts: 'Prompts', skills: 'Skills' },
    tags: { ...(import.meta.env.DEV ? { learning: "学习", english: "英语", speaking: "口语" } : {}), relationships: "亲密关系", communication: "沟通", emotionalSupport: "情绪支持", podcast: '播客', summary: '总结', writing: '写作', markdown: 'Markdown', minecraft: 'Minecraft', imageGeneration: '图像生成', threejs: 'Three.js', webgl: 'WebGL', vue: 'Vue', gsap: 'GSAP', animation: '动画' },
    clearTags: '清除',
    expandFilters: '筛选',
    expandSearch: '搜索',
    collapseSearch: '收起搜索',
    collapseFilters: '收起筛选',
    selectedTagsCount: '{count} 个标签',
    copy: '复制',
    copied: '已复制',
    expandContent: '展开全部',
    collapseContent: '收起',
    copySuccess: '内容已复制到剪贴板',
    copyError: '复制失败，请手动选择内容',
    empty: '没有匹配的资产',
    backToLibrary: '返回资产库',
    versionLabel: '版本',
    commitLabel: 'Commit',
    licenseLabel: '许可',
    catalogedAtLabel: '收录时间',
    assetsLabel: '资产',
    promptsLabel: '提示词',
    skillsLabel: '技能',
    aboutLabel: '用途',
    contentLabel: 'Prompt 内容',
    skillContentLabel: 'SKILL 内容',
    externalSkillLabel: 'EXTERNAL SKILL',
    usageLabel: '使用方式',
    notesLabel: '备注',
    useCasesLabel: '适用场景',
    precautionsLabel: '注意事项',
    coreContentLabel: '核心内容',
    capabilityBoundaryLabel: '能力边界',
    contentOutlineLabel: '内容目录',
    sourceAndDeploymentLabel: '来源与部署',
    sourceRepositoryLabel: '来源仓库',
    deploymentCommandLabel: '部署命令',
    copyInstallCommand: '复制部署命令',
    installCommandCopied: '部署命令已复制到剪贴板',
    switchToGrid: '切换为两列排列',
    switchToList: '切换为单列索引',
    notFound: '资产不存在',
    entries: {
      goutoujunshi: { title: "狗头军师", description: "先梳理情绪，再分析关系与聊天材料，给出回复、推进、修复或退出的具体建议。" },
      ...developmentLibraryEntries,
      minecraftSkinPreview: { title: 'Minecraft 角色双视角预览', description: '为后续皮肤转换生成标准 Minecraft Java 角色的双视角预览图。' },
      threejsFundamentals: { title: 'Three.js', description: '面向 Three.js 场景、相机、渲染器与对象层级的基础能力收录。' },
      gsapCore: { title: 'GSAP', description: '面向 GSAP 核心补间、缓动、交错与响应式动画的官方能力收录。' }
    },
    details: {
      goutoujunshi: { about: "适用于心动、暧昧、邀约、关系确认、投入失衡、冲突、分手与复合等情境；可根据聊天截图、粘贴文本或已导出的记录，梳理双方互动并讨论下一步。", usage: "先梳理情绪、建立关系背景，再区分事实、推测与未知，给出首选建议、可发送回复、行动方案、观察窗口与停止条件。按需加载关系知识与沟通指南；经同意可保存有限的本地档案，也可配合 ChatLab 分析用户已提供的数据。安装后可输入：请使用狗头军师帮我梳理情绪、分析当前关系，并给出下一步建议。", notes: "不负责直接读取、解密或导出聊天软件数据库；ChatLab 为可选配套。长期记忆须先获明确同意，可查看、暂停、撤销或删除。MBTI 和主观评分不等于诊断或确定结论；不保证关系结果，不替代心理治疗、医疗或法律专业服务。" },
      ...developmentLibraryDetails,
      minecraftSkinPreview: {
        about: '为 Minecraft Java 皮肤制作流程建立长期图像生成对话，产出双联角色预览，而不是 UV 皮肤图。',
        usage: '新建图像生成对话，先上传固定双视角示例图，再粘贴长期规则；后续发送文字需求或角色参考图。',
        notes: '图片 1 只约束构图、视角和比例；角色设计由文字需求或后续上传的参考图决定。'
      },
      threejsFundamentals: {
        about: '在新建或审查 Three.js 项目时，用于处理场景、相机、渲染器、对象层级、坐标变换与资源清理等基础问题。',
        usage: '涵盖场景、相机与渲染器配置，Object3D / Group / Mesh 层级与坐标变换、常用数学工具，以及动画循环、尺寸响应、资源清理、加载与性能处理。',
        notes: '主要覆盖 Three.js 的基础实现；材质、灯光、加载器或后期处理等专项能力，可继续查看来源仓库中的对应 Skill。'
      },
      gsapCore: {
        about: '在编写或审查 GSAP 核心补间、缓动、交错动画、DOM / SVG 动画以及响应式动效时使用。',
        usage: '涵盖 `gsap.to()`、`from()`、`fromTo()` 与 `set()` 的补间写法，时长、缓动、交错与重复等配置，DOM / SVG 变换、动画实例控制，以及 `gsap.matchMedia()` 的响应式与减少动效设置。',
        notes: '主要覆盖 GSAP 的核心动画能力；滚动驱动、框架集成、插件与性能等专项内容，可继续查看来源仓库中的对应 Skill。'
      },
    }
  }
}
