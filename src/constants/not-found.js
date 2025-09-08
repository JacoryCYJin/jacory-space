/**
 * 404错误页面内容
 * 支持多语言的内容配置
 */
export const notFoundContent = {
  "zh-cn": {
    title: "页面未找到",
    subtitle: "抱歉，您访问的页面不存在",
    description: "可能是页面已被删除、链接错误或您没有访问权限。",
    button: "返回首页",
    suggestions: [
      "检查URL是否正确",
      "返回首页浏览其他内容",
      "使用搜索功能查找内容",
      "联系管理员获取帮助"
    ]
  },
  "zh-tw": {
    title: "頁面未找到",
    subtitle: "抱歉，您存取的頁面不存在",
    description: "可能是頁面已被刪除、連結錯誤或您沒有存取權限。",
    button: "返回首頁",
    suggestions: [
      "檢查URL是否正確",
      "返回首頁瀏覽其他內容",
      "使用搜尋功能查找內容",
      "聯絡管理員獲取幫助"
    ]
  },
  en: {
    title: "Page Not Found",
    subtitle: "Sorry, the page you're looking for doesn't exist",
    description: "The page may have been deleted, the link is incorrect, or you don't have access permissions.",
    button: "Back to Home",
    suggestions: [
      "Check if the URL is correct",
      "Return to homepage to browse other content",
      "Use search function to find content",
      "Contact administrator for help"
    ]
  }
};
