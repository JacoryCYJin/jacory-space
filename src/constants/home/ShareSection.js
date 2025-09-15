// Jacory's Share 区域配置和翻译文本
export const shareTexts = {
  "zh-cn": {
    title: "JACORY SHARES",
    subtitle: "作品 · 思考 · 生活",
    portfolioTitle: "精选作品",
    portfolioDescription: "精选作品展示",
    blogTitle: "最新博客",
    blogDescription: "最新技术分享",
    mediaTitle: "视觉记录",
    mediaDescription: "视觉故事记录",
    readMore: "阅读更多",
    viewProject: "查看项目",
    minRead: "分钟阅读",
  },
  "zh-tw": {
    title: "JACORY SHARES",
    subtitle: "作品 · 思考 · 生活",
    portfolioTitle: "精選作品",
    portfolioDescription: "精選作品展示",
    blogTitle: "最新博客",
    blogDescription: "最新技術分享",
    mediaTitle: "視覺記錄",
    mediaDescription: "視覺故事記錄",
    readMore: "閱讀更多",
    viewProject: "查看項目",
    minRead: "分鐘閱讀",
  },
  en: {
    title: "JACORY SHARES",
    subtitle: "Works · Thoughts · Life",
    portfolioTitle: "Featured Works",
    portfolioDescription: "Featured Works Showcase",
    blogTitle: "Latest Blog",
    blogDescription: "Latest Tech Insights",
    mediaTitle: "Visual Stories",
    mediaDescription: "Visual Story Records",
    readMore: "Read More",
    viewProject: "View Project",
    minRead: "min read",
  },
};

// 作品集项目数据
export const portfolioProjects = {
  "zh-cn": [
    {
      id: "portfolio-website",
      title: "个人作品集网站重构",
      description: "基于 Next.js 的现代化个人网站，融合创新设计与流畅交互",
      image: "/images/projects/portfolio-preview.jpg",
      tags: ["React", "Next.js", "Tailwind", "GSAP"],
      link: "https://github.com/JacoryCYJin",
      category: "frontend",
    },
    {
      id: "blog-system",
      title: "动态博客系统",
      description: "支持多语言的现代博客平台，内容管理与阅读体验并重",
      image: "/images/projects/blog-preview.jpg",
      tags: ["Next.js", "MDX", "TypeScript"],
      link: "/blog",
      category: "fullstack",
    },
    {
      id: "ui-components",
      title: "UI 组件库设计",
      description: "可复用的现代化组件系统，注重设计一致性与开发效率",
      image: "/images/projects/ui-preview.jpg",
      tags: ["React", "Tailwind", "Storybook"],
      link: "#",
      category: "ui-design",
    },
    {
      id: "animation-showcase",
      title: "交互动画展示",
      description: "GSAP 驱动的网页动画集合，探索视觉表达的无限可能",
      image: "/images/projects/animation-preview.jpg",
      tags: ["GSAP", "CSS", "JavaScript"],
      link: "#",
      category: "animation",
    },
  ],
  "zh-tw": [
    {
      id: "portfolio-website",
      title: "個人作品集網站重構",
      description: "基於 Next.js 的現代化個人網站，融合創新設計與流暢交互",
      image: "/images/projects/portfolio-preview.jpg",
      tags: ["React", "Next.js", "Tailwind", "GSAP"],
      link: "https://github.com/JacoryCYJin",
      category: "frontend",
    },
    {
      id: "blog-system",
      title: "動態博客系統",
      description: "支持多語言的現代博客平台，內容管理與閱讀體驗並重",
      image: "/images/projects/blog-preview.jpg",
      tags: ["Next.js", "MDX", "TypeScript"],
      link: "/blog",
      category: "fullstack",
    },
    {
      id: "ui-components",
      title: "UI 組件庫設計",
      description: "可復用的現代化組件系統，注重設計一致性與開發效率",
      image: "/images/projects/ui-preview.jpg",
      tags: ["React", "Tailwind", "Storybook"],
      link: "#",
      category: "ui-design",
    },
    {
      id: "animation-showcase",
      title: "交互動畫展示",
      description: "GSAP 驅動的網頁動畫集合，探索視覺表達的無限可能",
      image: "/images/projects/animation-preview.jpg",
      tags: ["GSAP", "CSS", "JavaScript"],
      link: "#",
      category: "animation",
    },
  ],
  en: [
    {
      id: "portfolio-website",
      title: "Portfolio Website Rebuild",
      description:
        "Modern personal website built with Next.js, combining innovative design with smooth interactions",
      image: "/images/projects/portfolio-preview.jpg",
      tags: ["React", "Next.js", "Tailwind", "GSAP"],
      link: "https://github.com/JacoryCYJin",
      category: "frontend",
    },
    {
      id: "blog-system",
      title: "Dynamic Blog System",
      description:
        "Modern multilingual blog platform focusing on content management and reading experience",
      image: "/images/projects/blog-preview.jpg",
      tags: ["Next.js", "MDX", "TypeScript"],
      link: "/blog",
      category: "fullstack",
    },
    {
      id: "ui-components",
      title: "UI Component Library",
      description:
        "Reusable modern component system emphasizing design consistency and development efficiency",
      image: "/images/projects/ui-preview.jpg",
      tags: ["React", "Tailwind", "Storybook"],
      link: "#",
      category: "ui-design",
    },
    {
      id: "animation-showcase",
      title: "Interactive Animation Showcase",
      description:
        "GSAP-powered web animation collection exploring infinite possibilities of visual expression",
      image: "/images/projects/animation-preview.jpg",
      tags: ["GSAP", "CSS", "JavaScript"],
      link: "#",
      category: "animation",
    },
  ],
};

// 媒体内容数据（摄影/视频）
export const mediaContent = {
  "zh-cn": [
    {
      id: "city-sunset",
      type: "photo",
      title: "城市日落",
      date: "2023.10",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "都市黄昏时分的温柔光影",
    },
    {
      id: "coding-timelapse",
      type: "video",
      title: "代码时光",
      date: "2023.09",
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "深夜编程的专注时刻",
      videoUrl: "/videos/coding-timelapse.mp4",
      isEmpty: true,
    },
    {
      id: "morning-coffee",
      type: "photo",
      title: "晨间咖啡",
      date: "2023.11",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "新一天的开始仪式",
    },
    {
      id: "design-process",
      type: "video",
      title: "设计过程",
      date: "2023.08",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "从想法到实现的创作历程",
      videoUrl: "/videos/design-process.mp4",
    },
    {
      id: "street-photography",
      type: "photo",
      title: "街头瞬间",
      date: "2023.12",
      image:
        "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "捕捉生活中的美好片段",
    },
    {
      id: "workspace-tour",
      type: "video",
      title: "工作空间",
      date: "2023.07",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "我的创作环境分享",
      videoUrl: "/videos/workspace-tour.mp4",
    },
    {
      id: "nature-walk",
      type: "photo",
      title: "自然漫步",
      date: "2023.06",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "森林中的宁静时光",
      isEmpty: true,
    },
    {
      id: "creative-process",
      type: "photo",
      title: "创作过程",
      date: "2023.05",
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "灵感迸发的瞬间",
      isEmpty: true,
    },
  ],
  "zh-tw": [
    {
      id: "city-sunset",
      type: "photo",
      title: "城市日落",
      date: "2023.10",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "都市黃昏時分的溫柔光影",
    },
    {
      id: "coding-timelapse",
      type: "video",
      title: "代碼時光",
      date: "2023.09",
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "深夜編程的專注時刻",
      videoUrl: "/videos/coding-timelapse.mp4",
      isEmpty: true,
    },
    {
      id: "morning-coffee",
      type: "photo",
      title: "晨間咖啡",
      date: "2023.11",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "新一天的開始儀式",
    },
    {
      id: "design-process",
      type: "video",
      title: "設計過程",
      date: "2023.08",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "從想法到實現的創作歷程",
      videoUrl: "/videos/design-process.mp4",
    },
    {
      id: "street-photography",
      type: "photo",
      title: "街頭瞬間",
      date: "2023.12",
      image:
        "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "捕捉生活中的美好片段",
    },
    {
      id: "workspace-tour",
      type: "video",
      title: "工作空間",
      date: "2023.07",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "我的創作環境分享",
      videoUrl: "/videos/workspace-tour.mp4",
    },
    {
      id: "nature-walk",
      type: "photo",
      title: "自然漫步",
      date: "2023.06",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "森林中的寧靜時光",
      isEmpty: true,
    },
    {
      id: "creative-process",
      type: "photo",
      title: "創作過程",
      date: "2023.05",
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "靈感迸發的瞬間",
      isEmpty: true,
    },
  ],
  en: [
    {
      id: "city-sunset",
      type: "photo",
      title: "City Sunset",
      date: "2023.10",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "Gentle light and shadow at urban dusk",
    },
    {
      id: "coding-timelapse",
      type: "video",
      title: "Coding Time",
      date: "2023.09",
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "Focused moments of late-night programming",
      videoUrl: "/videos/coding-timelapse.mp4",
      isEmpty: true,
    },
    {
      id: "morning-coffee",
      type: "photo",
      title: "Morning Coffee",
      date: "2023.11",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "The ritual of starting a new day",
    },
    {
      id: "design-process",
      type: "video",
      title: "Design Process",
      date: "2023.08",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "Creative journey from idea to implementation",
      videoUrl: "/videos/design-process.mp4",
    },
    {
      id: "street-photography",
      type: "photo",
      title: "Street Moments",
      date: "2023.12",
      image:
        "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "Capturing beautiful fragments of life",
    },
    {
      id: "workspace-tour",
      type: "video",
      title: "Workspace",
      date: "2023.07",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "Sharing my creative environment",
      videoUrl: "/videos/workspace-tour.mp4",
    },
    {
      id: "nature-walk",
      type: "photo",
      title: "Nature Walk",
      date: "2023.06",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "Peaceful moments in the forest",
      isEmpty: true,
    },
    {
      id: "creative-process",
      type: "photo",
      title: "Creative Process",
      date: "2023.05",
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop&crop=entropy&auto=format",
      description: "Moments of inspiration bursting forth",
      isEmpty: true,
    },
  ],
};
