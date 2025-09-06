"use client";

import { motion } from "framer-motion";
import { useApp } from "@/lib/context";

/**
 * 主题切换器组件
 * 在亮色模式和暗色模式之间切换
 */
const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useApp();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={theme === "light" ? "切换到暗色模式" : "切换到亮色模式"}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "light" ? 0 : 180,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {theme === "light" ? (
          /* 月亮图标 - 点击切换到暗色模式 */
          <svg
            className="w-5 h-5 text-gray-700 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          /* 太阳图标 - 点击切换到亮色模式 */
          <svg
            className="w-5 h-5 text-gray-700 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeSwitcher;
