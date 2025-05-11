'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { queryArticlesApi } from '@/api/articleApi';
import ArticleList from '@/components/Blog/ArticleList';
import Pagination from '@/components/Elements/Pagination';
import { ArticleVO } from '@/types/models/article';

const CategoryPage = () => {
  const params = useParams();
  const category = params.category as string;
  const [articles, setArticles] = useState<ArticleVO[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 添加分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10; // 每页显示的文章数量
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        
        // 使用查询API获取特定分类的文章
        const res = await queryArticlesApi({
          categoryNanoid: category,
          pageNum: currentPage,
          pageSize: pageSize,
          fetchAll: false
        });
        
        if (res.code === 200) {
          setArticles(res.data.list || []);
          setTotalPages(res.data.pages || 1);
          setTotalItems(res.data.total || 0);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        // 使用更好的错误处理方式
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, [category, currentPage]);
  
  // 处理页码变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

    // 监听 currentPage 的变化并触发滚动
    useEffect(() => {
      console.log('currentPage 更新，滚动到顶部:', currentPage);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, [currentPage]);
  
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
          共有 {totalItems} 篇文章
        </p>
      </section>
      
      {/* 文章列表 */}
      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <>
          <ArticleList articles={displayArticles} />
          
          {/* 添加分页组件 */}
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showPageInfo={true}
              totalItems={totalItems}
              pageSize={pageSize}
            />
          )}
        </>
      )}
      
      <div className="back-link">
        <Link href="/blog">返回博客首页</Link>
      </div>
    </div>
  );
};

export default CategoryPage;