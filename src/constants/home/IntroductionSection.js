// 共享的功能特性配置
const commonFeatures = [
  {
    title: "前端开发",
    titleTw: "前端開發",
    titleEn: "Frontend Development",
    description: "React、Vue、Next.js等现代前端技术栈",
    descriptionTw: "React、Vue、Next.js等現代前端技術棧",
    descriptionEn: "React, Vue, Next.js and modern frontend tech stacks",
    icon: "💻",
  },
  {
    title: "后端设计",
    titleTw: "後端設計",
    titleEn: "Backend Design",
    description: "Node.js、Python、数据库设计与优化",
    descriptionTw: "Node.js、Python、數據庫設計與優化",
    descriptionEn: "Node.js, Python, database design and optimization",
    icon: "⚙️",
  },
  {
    title: "UI/UX设计",
    titleTw: "UI/UX設計",
    titleEn: "UI/UX Design",
    description: "用户体验设计、界面美学与交互逻辑",
    descriptionTw: "用戶體驗設計、界面美學與交互邏輯",
    descriptionEn: "User experience design, interface aesthetics and interaction logic",
    icon: "🎨",
  },
  {
    title: "技术分享",
    titleTw: "技術分享",
    titleEn: "Tech Sharing",
    description: "学习笔记、项目经验与最佳实践",
    descriptionTw: "學習筆記、項目經驗與最佳實踐",
    descriptionEn: "Learning notes, project experiences and best practices",
    icon: "📚",
  },
];

export const introductionTexts = {
  "zh-cn": {
    title: "欢迎来到我的创意空间",
    subtitle: "探索技术与设计的无限可能",
    description:
      "这里是我分享编程心得、设计理念和技术见解的地方。通过前后端开发实践，我不断探索技术与艺术的完美结合。",
    features: commonFeatures.map(f => ({
      title: f.title,
      description: f.description,
      icon: f.icon,
    })),
    cta: {
      text: "开始探索",
      action: "了解更多",
    },
  },
  "zh-tw": {
    title: "歡迎來到我的創意空間",
    subtitle: "探索技術與設計的無限可能",
    description:
      "這裡是我分享編程心得、設計理念和技術見解的地方。通過前後端開發實踐，我不斷探索技術與藝術的完美結合。",
    features: commonFeatures.map(f => ({
      title: f.titleTw,
      description: f.descriptionTw,
      icon: f.icon,
    })),
    cta: {
      text: "開始探索",
      action: "了解更多",
    },
  },
  en: {
    title: "Welcome to My Creative Space",
    subtitle: "Exploring the Infinite Possibilities of Technology & Design",
    description:
      "This is where I share programming insights, design philosophies, and technical perspectives. Through full-stack development practices, I continuously explore the perfect fusion of technology and art.",
    features: commonFeatures.map(f => ({
      title: f.titleEn,
      description: f.descriptionEn,
      icon: f.icon,
    })),
    cta: {
      text: "Start Exploring",
      action: "Learn More",
    },
  },
};
