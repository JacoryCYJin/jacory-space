export default {
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
    },
    fieldNotes: {
      journalLabel: '02 — 手记',
      archiveOpen: '{count} 篇 / 归档已开放',
      titleLead: '观察',
      titleAccent: '手记',
      subtitleLead: 'Personal OS 的公开日志',
      subtitleBody: '所有记录都是未寄出的信，所有归档都是未完成的自证。',
      readEntry: '阅读全文',
      archiveAll: '归档 — 全部条目',
      filterLabel: '筛选',
      filterCategory: '分类',
      filterTopic: '主题',
      filterYear: '年份',
      filterAria: '筛选博客归档',
    },
    post: {
      onThisNote: '本篇目录',
      backToFieldNotes: '返回日志列表',
      previousEntry: '上一篇',
      nextEntry: '下一篇',
      fieldNote: '现场笔记',
      headerLabel: '№ {index} — {category}',
      navAria: '文章导航',
      notFoundBadge: 'Error 404 / 条目未找到',
      notFoundTitle: '这篇笔记不存在'
    },
    entryCategories: {
      WEEKLY: '周刊',
      RESEARCH: '调研',
      THINKING: '思考',
      METHOD: '方法'
    },
    entryTopics: {
      PRODUCT: '产品'
    }
  }
}
