'use client';

import React, { useEffect, useState } from 'react';
import './blog.scss';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 页面加载后设置状态，触发动画
    setIsLoaded(true);
  }, []);

  return (
    <div className={`blog-layout ${isLoaded ? 'loaded' : ''}`}>
      <div className="blog-layout-container">
        {children}
      </div>
    </div>
  );
}