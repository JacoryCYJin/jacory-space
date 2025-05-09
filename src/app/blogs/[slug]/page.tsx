'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { articles } from '@/data/blog/metadata.json';
import './slug.scss';

const ArticlePage = () => {
  const params = useParams();
  const slug = params.slug as string;
  
  // 查找对应的文章
  const article = articles.find(article => article.slug === slug);
  
  // 如果找不到文章，显示错误信息
  if (!article) {
    return (
      <div className="article-not-found">
        <h1>文章未找到</h1>
        <p>抱歉，您请求的文章不存在。</p>
        <Link href="/blogs" className="back-to-blog">
          返回博客列表
        </Link>
      </div>
    );
  }
  
  return (
    <div className="article-container">
      <div className="article-header">
        <h1 className="article-title">{article.title}</h1>
        <div className="article-meta">
          <span className="article-date">{article.date}</span>
          <span className="reading-time">{article.readingTime}</span>
        </div>
        
        {/* 文章分类和标签 */}
        <div className="article-taxonomy">
          <div className="article-categories">
            {article.categories.map(category => (
              <Link key={category} href={`/blogs/categories/${category}`} className="category">
                {category}
              </Link>
            ))}
          </div>
          <div className="article-tags">
            {article.tags.map(tag => (
              <Link key={tag} href={`/blogs/tags/${tag}`} className="tag">
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* 文章封面图 */}
      {article.coverImage && (
        <div className="article-cover">
          <Image 
            src={article.coverImage} 
            alt={article.title}
            width={800}
            height={400}
            className="cover-image"
          />
        </div>
      )}
      
      {/* 文章内容 - 实际项目中可能需要从Markdown文件加载 */}
      <div className="article-content">
        <div dangerouslySetInnerHTML={{ __html: article.content || '文章内容加载中...' }} />
      </div>
      
      {/* 文章底部 */}
      <div className="article-footer">
        <div className="article-navigation">
          {/* 上一篇文章 */}
          <div className="prev-article">
            {article.prevArticle ? (
              <Link href={`/blogs/${article.prevArticle.slug}`}>
                <span className="nav-label">上一篇</span>
                <span className="nav-title">{article.prevArticle.title}</span>
              </Link>
            ) : (
              <span className="nav-disabled">已是第一篇</span>
            )}
          </div>
          
          {/* 下一篇文章 */}
          <div className="next-article">
            {article.nextArticle ? (
              <Link href={`/blogs/${article.nextArticle.slug}`}>
                <span className="nav-label">下一篇</span>
                <span className="nav-title">{article.nextArticle.title}</span>
              </Link>
            ) : (
              <span className="nav-disabled">已是最后一篇</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;