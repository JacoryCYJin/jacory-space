"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/lib/context";
import { blogTexts, blogCategories, blogTags } from "@/constants/Blog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

/**
 * 博客文章详情页面 - Markdown内容渲染
 * 作者：JacoryJin
 */

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
            setError("文章未找到");
          } else {
            setError("获取文章失败");
          }
          return;
        }
        const postData = await response.json();
        setPost(postData);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("获取文章失败");
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchPost();
    }
  }, [params.slug]);

  // 获取分类信息
  const category =
    post && blogCategories.find((cat) => cat.id === post.category);

  // 获取标签信息
  const articleTags =
    post?.tags
      ?.map((tagId) => blogTags.find((tag) => tag.id === tagId))
      .filter(Boolean) || [];

  // 格式化日期
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

  const getCategoryName = (category) => {
    if (!category) return "";
    return typeof category.name === "object"
      ? category.name[language]
      : category.name;
  };

  const getTagName = (tag) => {
    if (!tag) return "";
    return typeof tag.name === "object" ? tag.name[language] : tag.name;
  };

  // Markdown 组件配置
  const markdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={tomorrow}
          language={match[1]}
          PreTag="div"
          className="rounded-xl border border-border"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code
          className="bg-muted text-primary px-2 py-1 rounded-md text-sm font-mono border border-border/50"
          {...props}
        >
          {children}
        </code>
      );
    },
    h1: ({ children }) => (
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-8 mb-6 first:mt-0 tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-8 mb-4 tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-semibold text-foreground mt-6 mb-3 tracking-tight">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg md:text-xl font-semibold text-foreground mt-4 mb-2">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="text-foreground/90 leading-relaxed mb-4">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-foreground/90 mb-4 space-y-2 pl-4">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-foreground/90 mb-4 space-y-2 pl-4">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="ml-2">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary bg-primary/5 pl-6 py-4 rounded-r-xl italic text-muted-foreground my-6">
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-primary hover:text-primary/80 underline decoration-primary/50 underline-offset-4 transition-colors duration-200"
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
        className="w-full rounded-xl my-8 shadow-lg border border-border"
      />
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-8 rounded-xl border border-border">
        <table className="min-w-full divide-y divide-border">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
    tbody: ({ children }) => (
      <tbody className="bg-card divide-y divide-border">{children}</tbody>
    ),
    th: ({ children }) => (
      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-6 py-4 text-sm text-foreground">{children}</td>
    ),
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            {/* 返回按钮骨架 */}
            <div className="h-6 bg-muted rounded w-24 mb-8"></div>

            {/* 文章卡片骨架 */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* 封面图骨架 */}
              <div className="aspect-video bg-muted"></div>

              <div className="p-8 md:p-12">
                {/* 元信息骨架 */}
                <div className="flex gap-4 mb-6">
                  <div className="h-6 bg-muted rounded-lg w-20"></div>
                  <div className="h-6 bg-muted rounded w-32"></div>
                  <div className="h-6 bg-muted rounded w-16"></div>
                </div>

                {/* 标题骨架 */}
                <div className="h-10 bg-muted rounded-xl w-3/4 mb-6"></div>

                {/* 摘要骨架 */}
                <div className="space-y-3 mb-8">
                  <div className="h-5 bg-muted rounded w-full"></div>
                  <div className="h-5 bg-muted rounded w-2/3"></div>
                </div>

                {/* 标签骨架 */}
                <div className="flex gap-2 mb-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-6 bg-muted rounded-lg w-16"></div>
                  ))}
                </div>

                {/* 内容骨架 */}
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-4 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-20 px-6">
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="bg-card border border-border rounded-2xl p-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
              <svg
                className="w-10 h-10 text-muted-foreground"
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
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {error || "文章未找到"}
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              请检查链接是否正确，或返回博客首页查看所有文章
            </p>
            <button
              onClick={() => router.push("/blog")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg shadow-primary/25"
            >
              {currentTexts.backToBlog}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={() => router.push("/blog")}
          className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-all duration-300 group"
        >
          <svg
            className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-medium">{currentTexts.backToBlog}</span>
        </button>

        <article className="bg-card border border-border rounded-2xl shadow-lg shadow-primary/5 overflow-hidden backdrop-blur-sm">
          {/* 文章封面 */}
          {post.cover && (
            <div className="aspect-video w-full overflow-hidden relative">
              <img
                src={post.cover}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              {/* 渐变遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>
          )}

          <div className="p-8 md:p-12">
            {/* 文章元信息 */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              {category && (
                <div className="flex items-center gap-2 hover:scale-105 transition-all duration-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm"></div>
                  <span className="py-2 text-sm font-semibold text-primary backdrop-blur-sm ">
                    {getCategoryName(category)}
                  </span>
                </div>
              )}
              <time className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {currentTexts.publishedOn} {formatDate(post.date)}
              </time>
              {post.readTime && (
                <span className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {post.readTime}
                </span>
              )}
            </div>

            {/* 文章标题 */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              {post.title}
            </h1>

            {/* 文章摘要 */}
            {post.excerpt && (
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 font-medium">
                {post.excerpt}
              </p>
            )}

            {/* 标签 */}
            {articleTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {articleTags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300 cursor-pointer border border-border/50"
                  >
                    #{getTagName(tag)}
                  </span>
                ))}
              </div>
            )}

            {/* 分割线 */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8"></div>

            {/* 文章内容 */}
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* 文章底部信息 */}
            <div className="mt-16 pt-8 border-t border-border">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {post.author && (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                        <img
                          src="/images/avatar/avatar.jpg"
                          alt={post.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {currentTexts.author}
                        </div>
                        <div className="font-medium text-foreground">
                          {post.author}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => router.push("/blog")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl transition-all duration-300 text-sm font-medium shadow-lg shadow-primary/25 flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                  {currentTexts.viewMoreArticles}
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
