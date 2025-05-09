'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './nav-bar.scss';

const NavBar = () => {
  const pathname = usePathname();
  
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
          <Link href="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>
            晴窗小坐
          </Link>
          <Link href="/riyueyue" className={`navbar-link ${isActive('/riyueyue') ? 'active' : ''}`}>
            拙作小集
          </Link>
          <Link href="/subusuji" className={`navbar-link ${isActive('/subusuji') ? 'active' : ''}`}>
            闲笔偶记
          </Link>
          <Link href="/views" className={`navbar-link ${isActive('/views') ? 'active' : ''}`}>
            寸心之介
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
