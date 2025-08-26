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
    <Link href={`/blog/${article.slug}`} className="block group h-full">
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group-hover:scale-[1.02] group-hover:shadow-xl h-full flex flex-col">
        {/* 文章封面图 */}
        <div className="aspect-video w-full overflow-hidden flex-shrink-0">
          {article.cover ? (
            <img 
              src={article.cover} 
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          {/* 分类和日期 */}
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
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
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 flex-shrink-0">
            {article.title}
          </h2>

          {/* 文章摘要 */}
          <div className="flex-grow mb-4">
            {article.excerpt && (
              <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                {article.excerpt}
              </p>
            )}
          </div>

          {/* 标签 */}
          <div className="flex-shrink-0">
            {articleTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
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
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
