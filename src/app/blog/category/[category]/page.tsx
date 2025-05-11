'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getArticleListApi } from '@/api/articleApi';
import ArticleList from '@/components/Blog/ArticleList';
import { ArticleVO } from '@/types/models/article';

// // 定义前端使用的文章类型（与ArticleList组件兼容）
// interface ArticleForDisplay {
//   id: string;
//   slug: string;
//   title: string;
//   date: string;
//   excerpt: string;
//   coverImage?: string;
//   readingTime: string;
//   categories: string[];
//   tags: string[];
// }

const CategoryPage = () => {
  const params = useParams();
  const category = params.category as string;
  const [articles, setArticles] = useState<ArticleVO[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await getArticleListApi();
        if (res.code === 200) {
          // 筛选该分类下的文章
          const filteredArticles = res.data.filter(article => 
            article.categories.some(cat => 
              typeof cat === 'string' 
                ? cat === category 
                : cat.name === category
            )
          );
          setArticles(filteredArticles);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        // 使用更好的错误处理方式
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, [category]);
  
  // 转换为显示格式
  const displayArticles = articles.map(article => ({
    id: article.nanoid || '',
    slug: article.slug || '',
    title: article.title || '',
    date: article.publishedDate ? new Date(article.publishedDate).toLocaleDateString() : '',
    excerpt: article.excerpt || '',
    coverImage: article.coverImage,
    readingTime: article.readingTime || '',
    categories: article.categories?.map(cat => typeof cat === 'string' ? cat : cat.name) || [],
    tags: article.tags?.map(tag => typeof tag === 'string' ? tag : tag.name) || []
  }));
  
  return (
    <div className="category-container">
      <section className="category-header">
        <h1 className="category-title">分类：{category}</h1>
        <p className="category-description">
          共有 {articles.length} 篇文章
        </p>
      </section>
      
      {/* 文章列表 */}
      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <ArticleList articles={displayArticles} />
      )}
      
      <div className="back-link">
        <Link href="/blog">返回博客首页</Link>
      </div>
    </div>
  );
};

export default CategoryPage;