'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './home.scss';
import PageQuote from '@/components/PageQuote/PageQuote';
import { getArticleListApi } from '@/api/articleApi';
import { ArticleVO } from '@/types/models/article';

// 定义博客文章的接口
interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  slug: string;
}

const HomePage = () => {
  // 添加状态来存储博客文章
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 使用 useEffect 在组件挂载时获取数据
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);
        // 使用与博客页面相同的API获取文章列表
        const res = await getArticleListApi();
        
        if (res.code === 200) {
          // 获取最新的3篇文章
          const latestArticles = res.data.slice(0, 3).map((article: ArticleVO) => ({
            id: article.nanoid || '',
            title: article.title || '',
            date: article.publishedDate ? new Date(article.publishedDate).toLocaleDateString() : '',
            excerpt: article.excerpt || '',
            slug: article.slug || ''
          }));
          
          setRecentPosts(latestArticles);
          setError(null);
        } else {
          throw new Error('获取文章失败');
        }
      } catch (err) {
        console.error('获取最近文章时出错:', err);
        setError('获取文章失败，请稍后再试');
        // 移除备用数据
        setRecentPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  return (
    <div className="home-container">
      {/* 主要介绍区域 */}
      <section className="hero-section animate-section">
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
      <section className="nav-explanation animate-section">
        <h2 className="section-title">闲庭五叙</h2>
        <div className="explanation-grid">
          <Link href="/" className="explanation-item">
            <h3>晴窗小坐</h3>
            <p className="explanation-content">
              网站首页：展示个人简介、最新动态或精选内容，相当于网站的&quot;门面&quot;入口。
            </p>
          </Link>
          
          <Link href="/work" className="explanation-item">
            <h3>拙作小集</h3>
            <p className="explanation-content">
              项目展示页：列出完成的作品、项目或创作（如设计、代码、文章等），分类呈现并可跳转至详情。
            </p>
          </Link>

          <Link href="/video" className="explanation-item">
            <h3>流光片羽</h3>
            <p className="explanation-content">
              视频创作：分享我的视频内容，记录技术分享、生活感悟和创作历程。
            </p>
          </Link>

          <Link href="/blog" className="explanation-item">
            <h3>闲笔偶记</h3>
            <p className="explanation-content">
              博客/日志页：个人随笔、技术笔记、生活感悟等不定期更新的文字记录。
            </p>
          </Link>

          <Link href="/view" className="explanation-item">
            <h3>寸心之介</h3>
            <p className="explanation-content">
              关于我与联系方式：个人详细经历、技能或简历，以及邮箱、社交媒体等联系信息。
            </p>
          </Link>
        </div>
      </section>

      {/* 最新文章区域 */}
      <section className="latest-posts animate-section">
        <h2 className="section-title">近期笔记</h2>
        
        {loading ? (
          <div className="loading-posts">
            <p>正在加载文章...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : (
          <div className="posts-grid">
            {recentPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="post-card-link">
                <div className="post-card">
                  <div className="post-date">{post.date}</div>
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-excerpt">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 引言区域 */}
      <section className="quote-section animate-section">
        <PageQuote text="生如夏花之绚烂，死如秋叶之静美。" author='三岛由纪夫'/>
      </section>
    </div>
  );
};

export default HomePage;
