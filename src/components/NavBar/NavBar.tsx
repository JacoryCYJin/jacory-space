'use client'; // 确保这是一个客户端组件

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './nav-bar.scss'; // 使用您当前的文件命名
const NavBar = () => {
  const [darkMode, setDarkMode] = useState(false);

  // 初始化时检查系统偏好

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 检查localStorage中是否有保存的主题偏好
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // 切换主题

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };

  return (
    <nav className="navbar border-b flex justify-between">
      <div className="navbar-left">
        <div className="navbar-logo">
          <div>芥子不才</div>
        </div>
        <div className="navbar-links">
          <Link href="/" className="navbar-link">
            晴窗小坐
          </Link>
          <Link href="/" className="navbar-link">
            拙作小集
          </Link>
          <Link href="/" className="navbar-link">
            闲笔偶记
          </Link>
          <Link href="/" className="navbar-link">
            寸心之介
          </Link>
        </div>
      </div>

      {/* 主题切换按钮 */}

      <div className="flex items-center mr-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
          aria-label={darkMode ? '切换到亮色模式' : '切换到暗色模式'}
        >
          {darkMode ? (
            // 太阳图标 (亮色模式)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 group-hover:text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            // 月亮图标 (暗色模式)
            <svg
              xmlns=" http://www.w3.org/2000/svg "
              className="h-5 w-5 "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
