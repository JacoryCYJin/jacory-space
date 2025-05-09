'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './home.scss';

const HomePage = () => {
  return (
    <div className="home-container">
      {/* 主要介绍区域 */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-header">
            <div className="avatar-container">
              <Image
                src="/images/avatar.jpg"
                alt="芥子不才的头像"
                width={120}
                height={120}
                className="avatar-image"
              />
            </div>
            <div className="hero-title-container">
              <h1 className="hero-title">芥子不才</h1>
              <p className="hero-subtitle">文以载道，技以致用</p>
            </div>
          </div>
          <p className="hero-description">
            欢迎来到我的个人空间，这里记录着我的思考、创作与生活点滴。
          </p>
        </div>
      </section>

      {/* 导航解释区域 */}
      <section className="nav-explanation">
        <h2 className="section-title">四方之境</h2>
        <div className="explanation-grid">
          <Link href="/" className="explanation-item">
            <h3>晴窗小坐</h3>
            <p className="explanation-content">
              网站首页：展示个人简介、最新动态或精选内容，相当于网站的&quot;门面&quot;入口。
            </p>
          </Link>

          <Link href="/riyueyue" className="explanation-item">
            <h3>拙作小集</h3>
            <p className="explanation-content">
              项目展示页：列出完成的作品、项目或创作（如设计、代码、文章等），分类呈现并可跳转至详情。
            </p>
          </Link>

          <Link href="/subusuji" className="explanation-item">
            <h3>闲笔偶记</h3>
            <p className="explanation-content">
              博客/日志页：个人随笔、技术笔记、生活感悟等不定期更新的文字记录。
            </p>
          </Link>

          <Link href="/views" className="explanation-item">
            <h3>寸心之介</h3>
            <p className="explanation-content">
              关于我与联系方式：个人详细经历、技能或简历，以及邮箱、社交媒体等联系信息。
            </p>
          </Link>
        </div>
      </section>

      {/* 最新文章区域 */}
      <section className="latest-posts">
        <h2 className="section-title">近期笔记</h2>
        <div className="posts-grid">
          {/* 这里可以后续从数据源获取文章，先用静态内容 */}
          <div className="post-card">
            <div className="post-date">2023年12月15日</div>
            <h3 className="post-title">技术与人文的交融</h3>
            <p className="post-excerpt">
              探讨现代技术发展如何与传统人文思想相互影响，从而创造出更有温度的数字体验...
            </p>
            <Link href="/subusuji/1" className="read-more">
              继续阅读 →
            </Link>
          </div>

          <div className="post-card">
            <div className="post-date">2023年11月28日</div>
            <h3 className="post-title">设计中的留白艺术</h3>
            <p className="post-excerpt">
              留白不仅是视觉上的空间，更是一种哲学思考。本文探讨东方美学中的留白概念如何应用于现代设计...
            </p>
            <Link href="/subusuji/2" className="read-more">
              继续阅读 →
            </Link>
          </div>

          <div className="post-card">
            <div className="post-date">2023年10月10日</div>
            <h3 className="post-title">旅行中的偶遇</h3>
            <p className="post-excerpt">
              一次意外的旅行，一场偶然的相遇，有时最美好的记忆往往来自计划之外的惊喜...
            </p>
            <Link href="/subusuji/3" className="read-more">
              继续阅读 →
            </Link>
          </div>
        </div>
      </section>

      {/* 引言区域 */}
      <section className="quote-section">
        <blockquote>
          <p>生如夏花之绚烂，死如秋叶之静美。</p>
          <cite>— 三岛由纪夫</cite>
        </blockquote>
      </section>
    </div>
  );
};

export default HomePage;
