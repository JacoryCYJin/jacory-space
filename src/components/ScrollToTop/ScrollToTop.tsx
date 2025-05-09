'use client';

import React, { useState, useEffect } from 'react';
import './scroll-to-top.scss';

interface ScrollToTopProps {
  threshold?: number; // 滚动多少距离后显示按钮，默认为一个屏幕高度
  smooth?: boolean; // 是否使用平滑滚动
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ 
  threshold = typeof window !== 'undefined' ? window.innerHeight : 500, 
  smooth = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // 监听滚动事件
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    // 初始检查
    toggleVisibility();

    // 清理事件监听
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);

  // 滚动到顶部
  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <button 
      className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="回到顶部"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  );
};

export default ScrollToTop;