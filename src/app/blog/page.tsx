'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// import Image from 'next/image';
import './blog.scss';
import PageHeader from '@/components/PageHeader/PageHeader';
import { queryArticlesApi } from '@/api/articleApi';
import { getCategoryListApi } from '@/api/categoryApi';
import TagCloud from '@/components/Blog/TagCloud';
import CategoryList from '@/components/Blog/CategoryList';
import ArticleList from '@/components/Blog/ArticleList';
import Pagination from '@/components/Elements/Pagination';
import { ArticleVO } from '@/types/models/article';

// 定义标签类型
interface Tag {
  name: string;
  count: number;
}

// 定义前端使用的文章类型（与ArticleList组件兼容）
interface ArticleForDisplay {
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

// 添加分类类型定义
interface Category {
  nanoid: string;
  name: string;
}

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [articles, setArticles] = useState<ArticleVO[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<Tag[]>([]);
  
  // 添加分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10; // 每页显示的文章数量

  // 获取文章和分类数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 构建查询参数
        const queryParams = {
          pageNum: currentPage,
          pageSize: pageSize,
          categoryNanoid: selectedCategoryId, // 使用分类ID而不是名称
          fetchAll: false
        };
        
        // 获取文章列表（分页）
        const articleRes = await queryArticlesApi(queryParams);
        
        if (articleRes.code === 200) {
          setArticles(articleRes.data.list || []);
          setTotalPages(articleRes.data.pages || 1);
          setTotalItems(articleRes.data.total || 0);
          
          // 从文章中提取所有标签并计算每个标签的文章数量
          const tagMap = new Map();
          articleRes.data.list.forEach(article => {
            article.tags.forEach(tag => {
              if (tagMap.has(tag)) {
                tagMap.set(tag, tagMap.get(tag) + 1);
              } else {
                tagMap.set(tag, 1);
              }
            });
          });
          
          // 转换为标签云组件需要的格式
          const tagList = Array.from(tagMap.entries()).map(([name, count]) => ({
            name,
            count
          }));
          setTags(tagList);
        }
        
        // 获取分类列表
        const categoryRes = await getCategoryListApi();
        if (categoryRes.code === 200) {
          setCategories(categoryRes.data || []);
        }
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentPage, selectedCategoryId]); // 当页码或分类ID变化时重新获取数据

  // 处理页码变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 滚动到页面顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 处理分类选择
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // 切换分类时重置为第一页
    
    // 根据分类名称找到对应的nanoid
    if (category === '全部') {
      setSelectedCategoryId(undefined);
    } else {
      const selectedCat = categories.find(cat => cat.name === category);
      setSelectedCategoryId(selectedCat?.nanoid);
    }
  };

  // 将ArticleVO转换为前端显示需要的格式
  const convertToDisplayFormat = (article: ArticleVO): ArticleForDisplay => {
    return {
      id: article.nanoid || '', // 使用nanoid作为id
      slug: article.slug || '',
      title: article.title || '',
      date: article.publishedDate ? new Date(article.publishedDate).toLocaleDateString() : '',
      excerpt: article.excerpt || '',
      coverImage: article.coverImage,
      readingTime: article.readingTime || '',
      // 将CategoryVO数组转换为字符串数组
      categories: article.categories?.map(cat => typeof cat === 'string' ? cat : cat.name) || [],
      // 将TagVO数组转换为字符串数组
      tags: article.tags?.map(tag => typeof tag === 'string' ? tag : tag.name) || []
    };
  };

  // 转换为显示格式
  const displayArticles = articles.map(convertToDisplayFormat);

  return (
    <div className="blog-container">
      <PageHeader title="闲笔偶记" subtitle="记录思考与感悟，分享技术与生活" />

      <div className="blog-content">
        <div className="blog-main">
          {/* 分类筛选 */}
          {loading ? (
            <div className="loading">加载中...</div>
          ) : (
            <>
              <CategoryList 
                categories={categories.map(cat => cat.name)} 
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
              />
              
              {/* 文章列表 - 使用转换后的格式 */}
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
            <div className="tag-cloud">
              {loading ? (
                <div className="loading">加载中...</div>
              ) : (
                <TagCloud tags={tags} />
              )}
            </div>
          </div>

          {/* 最近文章 */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">最近文章</h3>
            {loading ? (
              <div className="loading">加载中...</div>
            ) : (
              <ul className="recent-posts">
                {articles.slice(0, 5).map((article) => (
                  <li key={article.nanoid}>
                    <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogPage;
