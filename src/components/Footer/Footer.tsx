import React from 'react';
import Link from 'next/link';
import './footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">芥子不才</h3>
          <p className="footer-quote">「海纳百川，有容乃大」</p>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">导航</h3>
          <ul className="footer-links">
            <li>
              <Link href="/">晴窗小坐</Link>
            </li>
            <li>
              <Link href="/work">拙作小集</Link>
            </li>
            <li>
              <Link href="/video">流光片羽</Link>
            </li>
            <li>
              <Link href="/blog">闲笔偶记</Link>
            </li>
            <li>
              <Link href="/view">寸心之介</Link>
            </li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">联系方式</h3>
          <ul className="footer-contact">
            <li>邮箱：<a href="mailto:your-email@example.com">chengyue.jin@outlook.com</a></li>
            <li>微信：J_acory_cy</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {currentYear} 芥子不才 | 文以载道，技以致用</p>
        <div className="visitor-count">
          <span className="visitor-number">1024</span>
          <span className="visitor-text">访客</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;