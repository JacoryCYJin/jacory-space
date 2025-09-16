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
    total: "共",
    author: "作者",
    viewMoreArticles: "查看更多文章"
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
    total: "共",
    author: "作者",
    viewMoreArticles: "查看更多文章"
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
    total: "Total",
    author: "Author",
    viewMoreArticles: "View More Articles"
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
    id: "frontend",
    name: {
      "zh-cn": "前端开发",
      "zh-tw": "前端開發",
      en: "Frontend"
    },
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
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
    id: "css",
    name: "CSS",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
  },
  {
    id: "tailwind-css",
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
    id: "scrolltrigger",
    name: "ScrollTrigger",
    color: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300"
  },
  {
    id: "background",
    name: {
      "zh-cn": "背景设计",
      "zh-tw": "背景設計", 
      en: "Background Design"
    },
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
  },
  {
    id: "grid",
    name: {
      "zh-cn": "网格系统",
      "zh-tw": "網格系統", 
      en: "Grid System"
    },
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300"
  },
  {
    id: "tetris",
    name: {
      "zh-cn": "俄罗斯方块",
      "zh-tw": "俄羅斯方塊", 
      en: "Tetris"
    },
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
  }
];
