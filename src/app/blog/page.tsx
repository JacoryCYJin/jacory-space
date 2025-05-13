'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// import Image from 'next/image';
import './blog.scss';
import PageHeader from '@/components/PageHeader/PageHeader';
import { queryArticlesApi, getArticleListApi } from '@/api/articleApi';
import { getCategoryListApi } from '@/api/categoryApi';
import TagCloud from '@/components/Blog/TagCloud';
import CategoryList from '@/components/Blog/CategoryList';
import ArticleList from '@/components/Blog/ArticleList';
import Pagination from '@/components/Pagination/Pagination';
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
  const [allArticles, setAllArticles] = useState<ArticleVO[]>([]); // 新增：存储所有文章
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<Tag[]>([]);
  
  // 添加分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10; // 每页显示的文章数量

  // 获取所有文章数据（用于侧边栏）
  useEffect(() => {
    const fetchAllArticles = async () => {
      try {
        const allArticlesRes = await getArticleListApi();
        if (allArticlesRes.code === 200) {
          setAllArticles(allArticlesRes.data || []);
          
          // 从所有文章中提取标签并计算每个标签的文章数量
          const tagMap = new Map<string, number>();
          allArticlesRes.data.forEach((article: ArticleVO) => {
            article.tags.forEach((tag: any) => {
              const tagName = typeof tag === 'string' ? tag : tag.name;
              tagMap.set(tagName, (tagMap.get(tagName) || 0) + 1);
            });
          });
  
          // 转换为标签云组件需要的格式并取前 10 个
          const tagList = Array.from(tagMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)  // 按文章数降序排列
            .slice(0, 15);                      // 取前10个
  
          setTags(tagList);
        }
      } catch (error) {
        console.error('获取所有文章数据失败:', error);
      }
    };
  
    fetchAllArticles();
  }, []);

  // 获取分页文章和分类数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 构建查询参数
        const queryParams = {
          pageNum: currentPage,
          pageSize: pageSize,
          categoryNanoid: selectedCategoryId,
          fetchAll: false
        };
        
        // 获取文章列表（分页）
        const articleRes = await queryArticlesApi(queryParams);
        
        if (articleRes.code === 200) {
          setArticles(articleRes.data.list || []);
          setTotalPages(articleRes.data.pages || 1);
          setTotalItems(articleRes.data.total || 0);
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
    console.log('当前页码:', currentPage);
    console.log('父组件页码变化:', page);
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

          {/* 热门标签 - 使用所有文章的标签 */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">热门标签</h3>
            <div className="tag-cloud">
              {loading && allArticles.length === 0 ? (
                <div className="loading">加载中...</div>
              ) : (
                <TagCloud tags={tags} />
              )}
            </div>
          </div>

          {/* 最近文章 - 使用所有文章中的最新文章 */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">最近文章</h3>
            {loading && allArticles.length === 0 ? (
              <div className="loading">加载中...</div>
            ) : (
              <ul className="recent-posts">
                {allArticles
                  .sort((a, b) => new Date(b.publishedDate || 0).getTime() - new Date(a.publishedDate || 0).getTime())
                  .slice(0, 8)
                  .map((article) => (
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
