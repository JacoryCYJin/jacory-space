"use client";

import { createContext, useContext, useState, useEffect } from "react";

// App Context
const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState("zh-cn");
  const [theme, setTheme] = useState("light");

  // 初始化主题，检查本地存储或系统偏好
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // 检查系统偏好
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(isDark ? "dark" : "light");
    }
  }, []);

  // 更新文档类名和本地存储
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const changeLanguage = (langCode) => {
    setLanguage(langCode);
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  const value = {
    // 语言相关
    language,
    changeLanguage,
    languages: [
      { code: "zh-cn", emoji: "🇨🇳", name: "简体中文" },
      { code: "zh-tw", emoji: "🇭🇰", name: "繁體中文" },
      { code: "en", emoji: "🇺🇸", name: "English" },
    ],
    // 主题相关
    theme,
    toggleTheme,
    isDark: theme === "dark"
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
