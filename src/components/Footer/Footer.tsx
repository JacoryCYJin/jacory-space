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
              {/* <p className="link-description">网站首页：展示个人简介、最新动态或精选内容</p> */}
            </li>
            <li>
              <Link href="/">拙作小集</Link>
              {/* <p className="link-description">项目展示：列出完成的作品、项目或创作</p> */}
            </li>
            <li>
              <Link href="/">闲笔偶记</Link>
              {/* <p className="link-description">博客/日志：个人随笔、技术笔记、生活感悟</p> */}
            </li>
            <li>
              <Link href="/">寸心之介</Link>
              {/* <p className="link-description">关于我与联系方式：个人经历、技能及联系信息</p> */}
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
      </div>
    </footer>
  );
};

export default Footer;