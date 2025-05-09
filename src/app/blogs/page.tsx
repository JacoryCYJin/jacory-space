'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './blogs.scss';
import PageHeader from '@/components/PageHeader/PageHeader';

// 假设这是从某处导入的文章数据
import { articles } from '@/data/blog/metadata.json';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('全部');

  // 筛选文章
  const filteredArticles =
    selectedCategory === '全部'
      ? articles
      : articles.filter((article) =>
          article.categories.includes(selectedCategory)
        );

  // 获取所有分类
  const allCategories = [
    '全部',
    ...new Set(articles.flatMap((article) => article.categories)),
  ];

  return (
    <div className="blog-container">
      <PageHeader title="闲笔偶记" subtitle="记录思考与感悟，分享技术与生活" />

      <div className="blog-content">
        <div className="blog-main">
          {/* 分类筛选 */}
          <div className="category-filter">
            {allCategories.map((category) => (
              <button
                key={category}
                className={`category-button ${
                  selectedCategory === category ? 'active' : ''
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 文章列表 */}
          <div className="article-list">
            {filteredArticles.map((article) => (
              <div key={article.id} className="article-card">
                {article.coverImage && (
                  <div className="article-image">
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      width={300}
                      height={200}
                      className="cover-image"
                    />
                  </div>
                )}
                <div className="article-content">
                  <div className="article-meta">
                    <span className="article-date">{article.date}</span>
                    <span className="reading-time">{article.readingTime}</span>
                  </div>
                  <h2 className="article-title">
                    <Link href={`/blogs/${article.slug}`}>{article.title}</Link>
                  </h2>
                  <p className="article-excerpt">{article.excerpt}</p>
                  <div className="article-tags">
                    {article.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blogs/tags/${tag}`}
                        className="tag"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                  <Link href={`/blogs/${article.slug}`} className="read-more">
                    继续阅读 →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="blog-sidebar">
          {/* 关于博客 */}
          <div className="sidebar-section about-blog">
            <h3 className="sidebar-title">关于闲笔偶记</h3>
            <p>这里记录着我的思考、技术笔记与生活感悟，不定期更新。</p>
          </div>

          {/* 热门标签 */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">热门标签</h3>
            <div className="tag-cloud">{/* 这里可以展示标签云 */}</div>
          </div>

          {/* 最近文章 */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">最近文章</h3>
            <ul className="recent-posts">
              {articles.slice(0, 5).map((article) => (
                <li key={article.id}>
                  <Link href={`/blogs/${article.slug}`}>{article.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogPage;
