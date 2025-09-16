
"use client";

import Link from "next/link";
import { useApp } from "@/lib/context";
import { blogCategories, blogTags } from "@/constants/Blog";

/**
 * 博客文章卡片组件 - 文章预览和导航
 * 作者：JacoryJin
 *
 * @param {Object} props - 组件属性
 * @param {Object} props.article - 文章数据对象
 * @returns {JSX.Element} 渲染的博客文章卡片组件
 */
const BlogCard = ({ article }) => {
  const { language } = useApp();

  // 根据分类ID查找对应的分类信息
  const category = blogCategories.find((cat) => cat.id === article.category);

  // 根据标签ID数组获取对应的标签信息
  const articleTags =
    article.tags
      ?.map((tagId) => blogTags.find((tag) => tag.id === tagId))
      .filter(Boolean) || [];

  /**
   * 根据语言设置格式化日期
   * @param {string} dateString - 日期字符串
   * @returns {string} 格式化后的日期
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (language === "en") {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  /**
   * 获取分类名称（支持多语言）
   * @param {Object} category - 分类对象
   * @returns {string} 分类名称
   */
  const getCategoryName = (category) => {
    if (!category) return "";
    return typeof category.name === "object"
      ? category.name[language]
      : category.name;
  };

  /**
   * 获取标签名称（支持多语言）
   * @param {Object} tag - 标签对象
   * @returns {string} 标签名称
   */
  const getTagName = (tag) => {
    if (!tag) return "";
    return typeof tag.name === "object" ? tag.name[language] : tag.name;
  };

  return (
    <Link href={`/blog/${article.slug}`} className="block group h-full">
      <article className="bg-card border border-border rounded-xl hover:shadow-lg hover:shadow-primary/5 transition-all duration-500 overflow-hidden cursor-pointer group-hover:border-primary/20 h-full flex flex-col backdrop-blur-sm">
        {/* 文章封面图片区域 */}
        <div className="aspect-[16/10] w-full overflow-hidden flex-shrink-0 relative">
          {article.cover ? (
            <img
              src={article.cover}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0-1.125.504-1.125 1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
            </div>
          )}
          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          {/* 文章元信息：分类标签和发布日期 */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            {category && (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="py-1.5 text-xs font-semibold text-primary backdrop-blur-sm">
                  {getCategoryName(category)}
                </span>
              </div>
            )}
            <time className="text-xs text-muted-foreground font-medium">
              {formatDate(article.date)}
            </time>
          </div>

          {/* 文章标题 */}
          <h2 className="text-lg font-semibold mb-3 text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2 flex-shrink-0 leading-tight">
            {article.title}
          </h2>

          {/* 文章摘要内容 */}
          <div className="flex-grow mb-5">
            {article.excerpt && (
              <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </div>

          {/* 文章标签列表 */}
          <div className="flex-shrink-0">
            {articleTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {articleTags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                  >
                    #{getTagName(tag)}
                  </span>
                ))}
                {articleTags.length > 3 && (
                  <span className="text-xs text-muted-foreground/70 px-2 py-1">
                    +{articleTags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 底部装饰线 */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </article>
    </Link>
  );
};

export default BlogCard;
