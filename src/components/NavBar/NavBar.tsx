'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './nav-bar.scss';

const NavBar = () => {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);

  // 初始化时检查系统偏好
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 检查本地存储中的主题设置
      const savedTheme = localStorage.getItem('theme');
      const isDark =
        savedTheme === 'dark' ||
        (!savedTheme &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);

      setDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, []);

  // 切换主题
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  // 判断链接是否为当前活动页面
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <div>芥子不才</div>
        </div>

        <div className="navbar-links">
          <Link
            href="/"
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
          >
            晴窗小坐
          </Link>
          <Link
            href="/works"
            className={`navbar-link ${isActive('/works') ? 'active' : ''}`}
          >
            拙作小集
          </Link>
          <Link
            href="/videos"
            className={`navbar-link ${isActive('/videos') ? 'active' : ''}`}
          >
            流光片羽
          </Link>
          <Link
            href="/blogs"
            className={`navbar-link ${isActive('/blogs') ? 'active' : ''}`}
          >
            闲笔偶记
          </Link>
          <Link
            href="/views"
            className={`navbar-link ${isActive('/views') ? 'active' : ''}`}
          >
            寸心之介
          </Link>
        </div>
      </div>

      {/* 主题切换按钮 */}
      <div className="theme-toggle-container">
        <button
          className="theme-toggle-button"
          onClick={toggleDarkMode}
          aria-label={darkMode ? '切换到亮色模式' : '切换到暗色模式'}
        >
          {darkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
