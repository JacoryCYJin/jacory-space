const developmentLibraryEntries = import.meta.env.DEV ? {
  podcastContentSummary: { title: '播客内容总结', description: '把口语化播客字幕整理成清晰、可阅读的内容总结与后续选题。' },
  podcastToBlog: { title: '播客转博客初稿', description: '从播客字幕中提炼一条主线，写成去标识化的中文博客初稿。' },
  blogMarkdownPolish: { title: '博客 Markdown 润色', description: '将已有草稿整理为符合 Jacory Space 格式的正式博客 Markdown。' },
} : {}

const developmentLibraryDetails = import.meta.env.DEV ? {
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
  blogMarkdownPolish: {
    about: '在不改变作者核心观点的前提下，润色草稿的表达节奏、frontmatter、文件名和站内 Markdown 格式。',
    usage: '粘贴一篇或多篇中文博客草稿；可附带临时文件名或未完成的 frontmatter。',
    notes: '它是编辑与整理，不会把原文改写成另一篇全新的文章。',
  },
} : {}

export default {
  library: {
    kicker: '提示词与技能资产库',
    titleLead: '灵感',
    titleAccent: '配方',
    description: '沉淀可复用的提示词、Agent 技能与工作方法。找到一个资产，理解它，然后带走。',
    indexLabel: '资产索引',
    browseLabel: '按分类浏览',
    tagsLabel: '标签索引',
    filterAria: '资产类型筛选',
    searchLabel: '搜索资产',
    searchPlaceholder: '搜索标题或标签',
    updatedLabel: '最后更新',
    filters: { all: '全部', prompts: 'Prompts', skills: 'Skills' },
    tags: { podcast: '播客', summary: '总结', writing: '写作', markdown: 'Markdown', minecraft: 'Minecraft', imageGeneration: '图像生成', threejs: 'Three.js', webgl: 'WebGL', vue: 'Vue', gsap: 'GSAP', animation: '动画' },
    clearTags: '清除',
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
    contentOutlineLabel: '内容目录',
    sourceAndDeploymentLabel: '来源与部署',
    sourceRepositoryLabel: '来源仓库',
    sourcePathLabel: '文件路径',
    deploymentCommandLabel: '部署命令',
    copyInstallCommand: '复制部署命令',
    installCommandCopied: '部署命令已复制到剪贴板',
    switchToGrid: '切换为两列排列',
    switchToList: '切换为单列索引',
    notFound: '资产不存在',
    entries: {
      ...developmentLibraryEntries,
      minecraftSkinPreview: { title: 'Minecraft 角色双视角预览', description: '为后续皮肤转换生成标准 Minecraft Java 角色的双视角预览图。' },
      threejsFundamentals: { title: 'Three.js', description: '面向 Three.js 场景、相机、渲染器与对象层级的基础能力收录。' },
      gsapCore: { title: 'GSAP', description: '面向 GSAP 核心补间、缓动、交错与响应式动画的官方能力收录。' }
    },
    details: {
      ...developmentLibraryDetails,
      minecraftSkinPreview: {
        about: '为 Minecraft Java 皮肤制作流程建立长期图像生成对话，产出双联角色预览，而不是 UV 皮肤图。',
        usage: '新建图像生成对话，先上传固定双视角示例图，再粘贴长期规则；后续发送文字需求或角色参考图。',
        notes: '图片 1 只约束构图、视角和比例；角色设计由文字需求或后续上传的参考图决定。'
      },
      threejsFundamentals: {
        about: '在新建或审查 Three.js 场景、相机、渲染器、对象层级、坐标变换与资源清理时使用。',
        usage: '适用于 Vue / Vite 等前端界面的 Three.js 基础实现；涉及材质、灯光、加载器或后期处理时，可继续查看来源仓库中的对应专项 Skill。'
      },
      gsapCore: {
        about: '在编写或审查 GSAP 核心补间、缓动、交错动画、DOM / SVG 动画以及响应式动效时使用。',
        usage: '适合需要时间线、运行时控制或 `gsap.matchMedia()` 响应式分支的界面动效；滚动驱动与插件能力请查看来源仓库中的相关 Skill。'
      },
    }
  }
}
