'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getArticleListApi } from '@/api/articleApi';
import ArticleList from '@/components/Blog/ArticleList';
import './tag.scss'; // 导入样式文件

// 定义文章类型
interface ArticleVO {
  nanoid: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  readingTime: string;
  publishedDate?: Date;
  categories: Array<{ name: string; nanoid: string } | string>;
  tags: Array<{ name: string; nanoid: string } | string>;
}

// 定义展示用的文章类型
interface DisplayArticle {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  readingTime: string;
  categories: string[];
  tags: string[];
}

const TagPage = () => {
  const params = useParams();
  // 解码URL中的标签名
  const tag = decodeURIComponent(params.tag as string);
  const [articles, setArticles] = useState<ArticleVO[]>([]); // 明确指定类型为 ArticleVO[]
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await getArticleListApi();
        if (res.code === 200) {
          // 筛选该标签下的文章
          const filteredArticles = res.data.filter((article: ArticleVO) => 
            article.tags.some((t: any) => 
              typeof t === 'string' 
                ? t === tag 
                : t.name === tag
            )
          );
          setArticles(filteredArticles);
        }
      } catch (error) {
        console.error('获取文章失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, [tag]);
  
  // 转换为显示格式
  const displayArticles: DisplayArticle[] = articles.map((article: ArticleVO) => ({
    id: article.nanoid || '',
    slug: article.slug || '',
    title: article.title || '',
    date: article.publishedDate ? new Date(article.publishedDate).toLocaleDateString() : '',
    excerpt: article.excerpt || '',
    coverImage: article.coverImage,
    readingTime: article.readingTime || '',
    categories: article.categories?.map((cat: any) => typeof cat === 'string' ? cat : cat.name) || [],
    tags: article.tags?.map((t: any) => typeof t === 'string' ? t : t.name) || []
  }));
  
  return (
    <div className="tag-container">
      <div className="tag-header">
        <h1 className="tag-title">标签: {tag}</h1>
        <p className="tag-description">共有 {articles.length} 篇相关文章</p>
      </div>
      
      {/* 文章列表 */}
      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <ArticleList articles={displayArticles} />
      )}
      
      <div className="back-link">
        <Link href="/blog" className="back-to-blog">返回博客首页</Link>
      </div>
    </div>
  );
};

export default TagPage;