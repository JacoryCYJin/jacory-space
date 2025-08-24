// 博客相关配置和翻译文本
export const blogTexts = {
  "zh-cn": {
    title: "我的博客",
    subtitle: "分享技术与思考",
    allCategories: "全部分类",
    allTags: "全部标签",
    searchPlaceholder: "搜索文章...",
    noResults: "没有找到相关文章",
    readMore: "阅读更多",
    publishedOn: "发布于",
    category: "分类",
    tags: "标签",
    backToBlog: "返回博客"
  },
  "zh-tw": {
    title: "我的博客",
    subtitle: "分享技術與思考", 
    allCategories: "全部分類",
    allTags: "全部標籤",
    searchPlaceholder: "搜索文章...",
    noResults: "沒有找到相關文章",
    readMore: "閱讀更多",
    publishedOn: "發佈於",
    category: "分類",
    tags: "標籤",
    backToBlog: "返回博客"
  },
  en: {
    title: "My Blogs",
    subtitle: "Sharing Tech & Thoughts",
    allCategories: "All Categories", 
    allTags: "All Tags",
    searchPlaceholder: "Search articles...",
    noResults: "No articles found",
    readMore: "Read More",
    publishedOn: "Published on",
    category: "Category",
    tags: "Tags",
    backToBlog: "Back to Blog"
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
  }
];
