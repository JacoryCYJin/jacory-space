"use client";

import Link from "next/link";
import { useApp } from "@/lib/context";
import { blogCategories, blogTags } from "@/constants/Blog";

const BlogCard = ({ article }) => {
  const { language } = useApp();
  
  // 获取分类信息
  const category = blogCategories.find(cat => cat.id === article.category);
  
  // 获取标签信息
  const articleTags = article.tags?.map(tagId => 
    blogTags.find(tag => tag.id === tagId)
  ).filter(Boolean) || [];

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (language === 'en') {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCategoryName = (category) => {
    if (!category) return '';
    return typeof category.name === 'object' ? category.name[language] : category.name;
  };

  const getTagName = (tag) => {
    if (!tag) return '';
    return typeof tag.name === 'object' ? tag.name[language] : tag.name;
  };

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* 文章封面图 */}
      {article.cover && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={article.cover} 
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        {/* 分类和日期 */}
        <div className="flex items-center justify-between mb-3">
          {category && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
              {getCategoryName(category)}
            </span>
          )}
          <time className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(article.date)}
          </time>
        </div>

        {/* 文章标题 */}
        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white hover:text-primary transition-colors">
          <Link href={`/blog/${article.slug}`}>
            {article.title}
          </Link>
        </h2>

        {/* 文章摘要 */}
        {article.excerpt && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {article.excerpt}
          </p>
        )}

        {/* 标签 */}
        {articleTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {articleTags.slice(0, 3).map((tag) => (
              <span 
                key={tag.id}
                className={`px-2 py-1 rounded text-xs font-medium ${tag.color}`}
              >
                #{getTagName(tag)}
              </span>
            ))}
            {articleTags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{articleTags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* 阅读更多 */}
        <Link 
          href={`/blog/${article.slug}`}
          className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm transition-colors"
        >
          阅读更多
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
