'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { articles } from '@/data/blog/metadata.json';

const TagPage = () => {
  const params = useParams();
  const tag = params.tag as string;
  
  // 筛选该标签下的文章
  const filteredArticles = articles.filter(article => 
    article.tags.includes(tag)
  );
  
  return (
    <div className="tag-container">
      <section className="tag-header">
        <h1 className="tag-title">标签：{tag}</h1>
        <p className="tag-description">
          共有 {filteredArticles.length} 篇文章
        </p>
      </section>
      
      {/* 文章列表 */}
      <div className="article-list">
        {filteredArticles.length > 0 ? (
          filteredArticles.map(article => (
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
                <div className="article-categories">
                  {article.categories.map(category => (
                    <Link key={category} href={`/blogs/categories/${category}`} className="category">
                      {category}
                    </Link>
                  ))}
                </div>
                <Link href={`/blogs/${article.slug}`} className="read-more">
                  继续阅读 →
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-articles">
            <p>该标签下暂无文章</p>
          </div>
        )}
      </div>
      
      <div className="back-link">
        <Link href="/blogs">返回博客首页</Link>
      </div>
    </div>
  );
};

export default TagPage;