'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// import Image from 'next/image';
import './blog.scss';
import PageHeader from '@/components/PageHeader/PageHeader';
import { getArticleListApi } from '@/api/articleApi';
import { getCategoryListApi } from '@/api/categoryApi';
import TagCloud from '@/components/Blog/TagCloud';
import CategoryList from '@/components/Blog/CategoryList';
import ArticleList from '@/components/Blog/ArticleList';
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

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [articles, setArticles] = useState<ArticleVO[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<Tag[]>([]);

  // 获取文章和分类数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 获取文章列表
        const articleRes = await getArticleListApi();
        console.log(articleRes);
        if (articleRes.code === 200) {
          setArticles(articleRes.data || []);
          
          // 从文章中提取所有标签并计算每个标签的文章数量
          const tagMap = new Map();
          articleRes.data.forEach(article => {
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
          console.log(tagList);
        }
        
        // 获取分类列表
        const categoryRes = await getCategoryListApi();
        if (categoryRes.code === 200) {
          setCategories(categoryRes.data.map(cat => cat.name) || []);
        }
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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

  // 筛选文章
  const filteredArticles =
    selectedCategory === '全部'
      ? articles
      : articles.filter((article) =>
          // 检查分类是否包含所选分类（处理不同的数据结构）
          article.categories?.some(cat => 
            typeof cat === 'string' 
              ? cat === selectedCategory 
              : cat.name === selectedCategory
          )
        );

  // 转换为显示格式
  const displayArticles = filteredArticles.map(convertToDisplayFormat);

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
                categories={categories} 
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
              />
              
              {/* 文章列表 - 使用转换后的格式 */}
              <ArticleList articles={displayArticles} />
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
