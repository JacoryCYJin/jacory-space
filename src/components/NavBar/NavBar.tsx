'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './nav-bar.scss';

const NavBar = () => {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

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
      setMounted(true);
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
    if (path !== '/' && pathname && pathname.startsWith(path)) return true;
    return false;
  };

  // 处理链接点击，防止闪烁
  const handleLinkClick = (e: React.MouseEvent, isCurrentActive: boolean) => {
    if (isCurrentActive) {
      e.preventDefault(); // 如果已经在当前页面，阻止默认行为
    }
  };

  // 处理搜索提交
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 这里可以实现搜索逻辑，例如跳转到搜索结果页面
      console.log('搜索查询:', searchQuery);
      // 示例：跳转到搜索页面
      // router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // 预渲染的导航栏结构，与实际结构完全相同，但隐藏
  const renderNavContent = (visible = true) => (
    <nav className="navbar" style={{ visibility: visible ? 'visible' : 'hidden' }}>
      <div className="navbar-left">
        <div className="navbar-logo">
          <div>芥子不才</div>
        </div>

        <div className="navbar-links">
          <Link
            href="/"
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            onClick={(e) => handleLinkClick(e, isActive('/'))}
          >
            晴窗小坐
          </Link>
          <Link
            href="/work"
            className={`navbar-link ${isActive('/work') ? 'active' : ''}`}
            onClick={(e) => handleLinkClick(e, isActive('/work'))}
          >
            拙作小集
          </Link>
          <Link
            href="/video"
            className={`navbar-link ${isActive('/video') ? 'active' : ''}`}
            onClick={(e) => handleLinkClick(e, isActive('/video'))}
          >
            流光片羽
          </Link>
          <Link
            href="/blog"
            className={`navbar-link ${isActive('/blog') ? 'active' : ''}`}
            onClick={(e) => handleLinkClick(e, isActive('/blog'))}
          >
            闲笔偶记
          </Link>
          <Link
            href="/view"
            className={`navbar-link ${isActive('/view') ? 'active' : ''}`}
            onClick={(e) => handleLinkClick(e, isActive('/view'))}
          >
            寸心之介
          </Link>
        </div>
      </div>

      <div className="navbar-right">
        {/* 搜索框 */}
        <div className="search-container">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="search-input"
              placeholder="搜索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="搜索"
            />
            <button type="submit" className="search-button" aria-label="提交搜索">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
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
      </div>
    </nav>
  );

  // 如果组件尚未挂载，返回一个预渲染的导航栏以避免闪烁
  if (!mounted) {
    return renderNavContent(false);
  }

  return renderNavContent(true);
};

export default NavBar;
