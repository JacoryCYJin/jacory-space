'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import './slug.scss';
import { getArticleListApi } from '@/api/articleApi';

// 扩展 ArticleVO 类型，添加可选的 prevArticle 和 nextArticle 属性
interface ArticleWithNavigation {
  nanoid: string;  // 使用 nanoid 作为唯一标识符
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  readingTime: string;
  publishedDate?: Date; // 后端返回的日期字段
  date?: string; // 前端格式化后的日期
  categories: string[];
  tags: string[];
  prevArticle?: {
    slug: string;
    title: string;
  };
  nextArticle?: {
    slug: string;
    title: string;
  };
}

const ArticlePage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<ArticleWithNavigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        // 获取所有文章
        const res = await getArticleListApi();
        if (res.code === 200) {
          // 查找当前文章
          const currentArticle = res.data.find(article => article.slug === slug);
          
          if (currentArticle) {
            // 查找上一篇和下一篇文章
            const currentIndex = res.data.findIndex(article => article.slug === slug);
            
            // 创建一个新对象，包含扩展的属性
            const articleWithNavigation: ArticleWithNavigation = {
              ...currentArticle,
              // 添加格式化的日期
              date: currentArticle.publishedDate ? new Date(currentArticle.publishedDate).toLocaleDateString() : '未知日期',
              // 将 CategoryVO[] 转换为 string[]
              categories: currentArticle.categories.map(cat => typeof cat === 'string' ? cat : cat.name),
              // 将 TagVO[] 转换为 string[]
              tags: currentArticle.tags.map(tag => typeof tag === 'string' ? tag : tag.name),
              prevArticle: undefined,
              nextArticle: undefined
            };
            
            // 如果有上一篇文章
            if (currentIndex > 0) {
              articleWithNavigation.prevArticle = {
                slug: res.data[currentIndex - 1].slug,
                title: res.data[currentIndex - 1].title
              };
            }
            
            // 如果有下一篇文章
            if (currentIndex < res.data.length - 1) {
              articleWithNavigation.nextArticle = {
                slug: res.data[currentIndex + 1].slug,
                title: res.data[currentIndex + 1].title
              };
            }
            
            setArticle(articleWithNavigation);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        // 使用更好的错误处理方式替代 console.error
        setError(true);
        // 可以考虑使用日志服务或其他方式记录错误
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [slug]);
  
  // 加载中状态
  if (loading) {
    return (
      <div className="article-loading">
        <p>文章加载中...</p>
      </div>
    );
  }
  
  // 如果找不到文章，显示错误信息
  if (error || !article) {
    return (
      <div className="article-not-found">
        <h1>文章未找到</h1>
        <p>抱歉，您请求的文章不存在。</p>
        <Link href="/blog" className="back-to-blog">
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
            {article.categories.map((category: string) => (
              <Link key={category} href={`/blog/category/${category}`} className="category">
                {category}
              </Link>
            ))}
          </div>
          <div className="article-tags">
            {article.tags.map((tag: string) => (
              <Link key={tag} href={`/blog/tag/${tag}`} className="tag bgc-tag">
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
      
      {/* 文章内容 */}
      <div className="article-content">
        <div dangerouslySetInnerHTML={{ __html: article.content || '文章内容加载中...' }} />
      </div>
      
      {/* 文章底部 */}
      <div className="article-footer">
        <div className="article-navigation">
          {/* 上一篇文章 */}
          <div className="prev-article">
            {article.prevArticle ? (
              <Link href={`/blog/${article.prevArticle.slug}`}>
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
              <Link href={`/blog/${article.nextArticle.slug}`}>
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