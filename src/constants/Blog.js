// 博客相关配置和翻译文本
export const blogTexts = {
  "zh-cn": {
    title: "芥子博客",
    subtitle: "技术分享 · 学习笔记 · 生活随笔",
    allCategories: "全部分类",
    allTags: "全部标签",
    searchPlaceholder: "搜索文章...",
    noResults: "没有找到相关文章",
    readMore: "阅读更多",
    publishedOn: "发布于",
    category: "分类",
    tags: "标签",
    backToBlog: "返回博客",
    expandAll: "展开全部",
    collapse: "收起",
    clearFilters: "清除筛选",
    articlesCount: "篇文章",
    showPerPage: "每页显示",
    pageInfo: "第",
    of: "页，共",
    pages: "页",
    total: "共"
  },
  "zh-tw": {
    title: "芥子博客",
    subtitle: "技術分享 · 學習筆記 · 生活隨筆", 
    allCategories: "全部分類",
    allTags: "全部標籤",
    searchPlaceholder: "搜索文章...",
    noResults: "沒有找到相關文章",
    readMore: "閱讀更多",
    publishedOn: "發佈於",
    category: "分類",
    tags: "標籤",
    backToBlog: "返回博客",
    expandAll: "展開全部",
    collapse: "收起",
    clearFilters: "清除篩選",
    articlesCount: "篇文章",
    showPerPage: "每頁顯示",
    pageInfo: "第",
    of: "頁，共",
    pages: "頁",
    total: "共"
  },
  en: {
    title: "Jacory Blog",
    subtitle: "Tech · Learning · Life",
    allCategories: "All Categories", 
    allTags: "All Tags",
    searchPlaceholder: "Search articles...",
    noResults: "No articles found",
    readMore: "Read More",
    publishedOn: "Published on",
    category: "Category",
    tags: "Tags",
    backToBlog: "Back to Blog",
    expandAll: "Show All",
    collapse: "Show Less",
    clearFilters: "Clear Filters",
    articlesCount: "articles",
    showPerPage: "Show",
    pageInfo: "Page",
    of: "of",
    pages: "pages",
    total: "Total"
  }
};

// 分页组件多语言配置
export const paginationTexts = {
  "zh-cn": {
    goToPage: "跳转到",
    go: "确定",
    pageInfo: "第",
    of: "页，共",
    pages: "页",
    total: "共",
    articlesCount: "篇文章"
  },
  "zh-tw": {
    goToPage: "跳轉到",
    go: "確定",
    pageInfo: "第",
    of: "頁，共",
    pages: "頁",
    total: "共",
    articlesCount: "篇文章"
  },
  en: {
    goToPage: "Go to",
    go: "Go",
    pageInfo: "Page",
    of: "of",
    pages: "pages",
    total: "Total",
    articlesCount: "articles"
  }
};

// 博客分类配置
export const blogCategories = [
  {
    id: "tech",
    name: {
      "zh-cn": "技术",
      "zh-tw": "技術", 
      en: "Technology"
    },
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
  },
  {
    id: "frontend",
    name: {
      "zh-cn": "前端开发",
      "zh-tw": "前端開發",
      en: "Frontend"
    },
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
  },
  {
    id: "backend", 
    name: {
      "zh-cn": "后端开发",
      "zh-tw": "後端開發",
      en: "Backend"
    },
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
  },
  {
    id: "ai",
    name: {
      "zh-cn": "人工智能",
      "zh-tw": "人工智能",
      en: "AI & ML"
    },
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  },
  {
    id: "life",
    name: {
      "zh-cn": "生活感悟",
      "zh-tw": "生活感悟", 
      en: "Life & Thoughts"
    },
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
  },
  {
    id: "learning",
    name: {
      "zh-cn": "学习笔记",
      "zh-tw": "學習筆記", 
      en: "Learning Notes"
    },
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
  },
  {
    id: "coffee",
    name: {
      "zh-cn": "咖啡时光",
      "zh-tw": "咖啡時光", 
      en: "Coffee Time"
    },
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
  }
];

// 博客标签配置
export const blogTags = [
  {
    id: "react",
    name: "React",
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300"
  },
  {
    id: "nextjs", 
    name: "Next.js",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  },
  {
    id: "javascript",
    name: "JavaScript", 
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
  },
  {
    id: "typescript",
    name: "TypeScript",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
  },
  {
    id: "css",
    name: "CSS",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    color: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300"
  },
  {
    id: "gsap",
    name: "GSAP",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
  },
  {
    id: "animation",
    name: {
      "zh-cn": "动画",
      "zh-tw": "動畫", 
      en: "Animation"
    },
    color: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-300"
  },
  {
    id: "ui-design",
    name: {
      "zh-cn": "UI设计",
      "zh-tw": "UI設計", 
      en: "UI Design"
    },
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
  },
  {
    id: "nodejs",
    name: "Node.js", 
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
  },
  {
    id: "python",
    name: "Python",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
  },
  {
    id: "tutorial",
    name: {
      "zh-cn": "教程",
      "zh-tw": "教程", 
      en: "Tutorial"
    },
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
  },
    {
    id: "experience",
    name: {
      "zh-cn": "经验分享",
      "zh-tw": "經驗分享", 
      en: "Experience"
    },
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
  },
  {
    id: "coffee",
    name: {
      "zh-cn": "咖啡",
      "zh-tw": "咖啡", 
      en: "Coffee"
    },
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
  },
  {
    id: "mindset",
    name: {
      "zh-cn": "思维模式",
      "zh-tw": "思維模式", 
      en: "Mindset"
    },
    color: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300"
  },
  {
    id: "growth",
    name: {
      "zh-cn": "个人成长",
      "zh-tw": "個人成長", 
      en: "Personal Growth"
    },
    color: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300"
  },
  {
    id: "lifestyle",
    name: {
      "zh-cn": "生活方式",
      "zh-tw": "生活方式", 
      en: "Lifestyle"
    },
    color: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300"
  },
  {
    id: "minimalism",
    name: {
      "zh-cn": "极简主义",
      "zh-tw": "極簡主義", 
      en: "Minimalism"
    },
    color: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300"
  },
  {
    id: "reading",
    name: {
      "zh-cn": "阅读",
      "zh-tw": "閱讀", 
      en: "Reading"
    },
    color: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300"
  },
  {
    id: "digital-wellness",
    name: {
      "zh-cn": "数字健康",
      "zh-tw": "數字健康", 
      en: "Digital Wellness"
    },
    color: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300"
  }
];
