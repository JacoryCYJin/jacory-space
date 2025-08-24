"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/lib/context";
import { blogTexts, blogCategories, blogTags } from "@/constants/Blog";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const BlogPostPage = () => {
  const params = useParams();
  const router = useRouter();
  const { language } = useApp();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentTexts = blogTexts[language];

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blog/${params.slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('文章未找到');
          } else {
            setError('获取文章失败');
          }
          return;
        }
        const postData = await response.json();
        setPost(postData);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('获取文章失败');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchPost();
    }
  }, [params.slug]);

  // 获取分类信息
  const category = post && blogCategories.find(cat => cat.id === post.category);
  
  // 获取标签信息
  const articleTags = post?.tags?.map(tagId => 
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

  // Markdown 组件配置
  const markdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={tomorrow}
          language={match[1]}
          PreTag="div"
          className="rounded-lg"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code 
          className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded text-sm font-mono" 
          {...props}
        >
          {children}
        </code>
      );
    },
    h1: ({ children }) => (
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-8 mb-6 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="ml-4">{children}</li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600 dark:text-gray-400 my-4">
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => (
      <a 
        href={href} 
        className="text-primary hover:text-primary/80 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    img: ({ src, alt }) => (
      <img 
        src={src} 
        alt={alt} 
        className="w-full rounded-lg my-6 shadow-lg"
      />
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="dark:bg-gray-800">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        {children}
      </tbody>
    ),
    th: ({ children }) => (
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
        {children}
      </td>
    ),
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-8 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-4 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-20 px-8 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || '文章未找到'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            请检查链接是否正确，或返回博客首页查看所有文章
          </p>
          <button
            onClick={() => router.push('/blog')}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors"
          >
            {currentTexts.backToBlog}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-8 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={() => router.push('/blog')}
          className="flex items-center text-primary hover:text-primary/80 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {currentTexts.backToBlog}
        </button>

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* 文章封面 */}
          {post.cover && (
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={post.cover} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            {/* 文章元信息 */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {category && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                  {getCategoryName(category)}
                </span>
              )}
              <time className="text-sm text-gray-500 dark:text-gray-400">
                {currentTexts.publishedOn} {formatDate(post.date)}
              </time>
              {post.readTime && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {post.readTime}
                </span>
              )}
            </div>

            {/* 文章标题 */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {post.title}
            </h1>

            {/* 文章摘要 */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                {post.excerpt}
              </p>
            )}

            {/* 标签 */}
            {articleTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {articleTags.map((tag) => (
                  <span 
                    key={tag.id}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${tag.color}`}
                  >
                    #{getTagName(tag)}
                  </span>
                ))}
              </div>
            )}

            {/* 分割线 */}
            <hr className="border-gray-200 dark:border-gray-700 mb-8" />

            {/* 文章内容 */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* 文章底部信息 */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {post.author && (
                    <span className="text-gray-600 dark:text-gray-400">
                      作者: {post.author}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => router.push('/blog')}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors text-sm"
                >
                  查看更多文章
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPostPage;
