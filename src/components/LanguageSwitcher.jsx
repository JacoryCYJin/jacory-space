"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/context";

/**
 * 语言切换器组件 - 多语言切换功能
 * 作者：JacoryJin
 */
const LanguageSwitcher = () => {
  const { language, changeLanguage, languages } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  // 获取当前选中的语言信息
  const currentLang = languages.find(lang => lang.code === language);

  /**
   * 处理语言切换
   * @param {string} langCode - 语言代码
   */
  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`语言选择，当前：${currentLang?.name}`}
      >
        <span className="text-xl">
          {currentLang?.emoji}
        </span>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-[120px] z-50"
          >
            {languages.map((lang, index) => (
              <motion.button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                  language === lang.code
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}

              >
                <span className="text-lg">{lang.emoji}</span>
                <span className="text-sm">{lang.name}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 点击外部区域关闭下拉菜单 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSwitcher;
