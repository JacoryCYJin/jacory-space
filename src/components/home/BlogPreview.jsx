/**
 * 博客预览组件 - 首页博客内容展示
 * 作者：JacoryJin
 *
 * 功能：展示精选博客文章的预览卡片，包含标题、摘要、发布日期和阅读时长
 * 特性：带有 GSAP 动画效果和 3D hover 交互
 */
"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { useApp } from "@/lib/context";
import { blogTexts } from "@/constants/Blog";
import { shareTexts } from "@/constants/home/ShareSection";
import SectionHeader from "@/components/common/SectionHeader";

/**
 * 博客预览组件
 *
 * @param {Object} props - 组件属性
 * @param {Function} props.onEnter - 鼠标进入回调
 * @param {Function} props.onLeave - 鼠标离开回调
 * @returns {JSX.Element} 博客预览卡片组件
 */
const BlogPreview = ({ onEnter, onLeave }) => {
  const { language } = useApp();
  const currentTexts = blogTexts[language];
  const shareCurrentTexts = shareTexts[language];
  const cardRef = useRef(null);
  const [featuredBlog, setFeaturedBlog] = useState(null);

  // 从 API 获取精选博客数据，失败时使用备用数据
  useEffect(() => {
    /**
     * 获取精选博客文章
     * 优先从 API 获取，失败时使用本地备用数据
     */
    const fetchFeaturedBlog = async () => {
      try {
        const response = await fetch("/api/blogs");
        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          // 取第一篇文章作为精选博客
          const blog = result.data[0];
          setFeaturedBlog({
            id: blog.slug,
            title: blog.title || blog.slug,
            excerpt:
              blog.excerpt || blog.description || "No description available",
            content: blog.content || "",
            date: blog.date || new Date().toISOString().split("T")[0],
            readTime:
              blog.readTime || Math.ceil((blog.content?.length || 1000) / 200),
            cover: blog.cover || "/images/blog/default-thumb.jpg",
          });
        } else {
          throw new Error("Failed to fetch blogs");
        }
      } catch (error) {
        console.error("Error loading blog posts:", error);
        // API 请求失败时，使用预设的备用博客数据
        setFeaturedBlog({
          id: "gsap-scroll-interaction",
          title:
            language === "en"
              ? "GSAP ScrollTrigger Advanced Interactions"
              : "GSAP ScrollTrigger 高级交互技巧",
          excerpt:
            language === "en"
              ? "Explore advanced GSAP ScrollTrigger techniques for creating immersive web experiences. Learn how to create stunning scroll-based animations that respond to user interactions and enhance the overall user experience."
              : "深入探讨 GSAP ScrollTrigger 高级技巧，创建沉浸式网页体验。学习如何创建令人惊叹的基于滚动的动画，响应用户交互并增强整体用户体验。",
          content:
            language === "en"
              ? "GSAP ScrollTrigger is a powerful plugin that allows you to create scroll-based animations with ease. In this comprehensive guide, we'll explore advanced techniques that will take your web interactions to the next level.\n\n## Getting Started with ScrollTrigger\n\nScrollTrigger works by listening to scroll events and triggering animations based on the position of elements in the viewport. The basic syntax is straightforward:\n\n```javascript\ngsap.to('.element', {\n  x: 100,\n  scrollTrigger: '.trigger'\n});\n```\n\n## Advanced Techniques\n\n### 1. Pin and Scrub Effects\nOne of the most powerful features of ScrollTrigger is the ability to pin elements and scrub animations. This creates a sticky effect where elements stay in place while content scrolls behind them.\n\n### 2. Batch Animations\nFor performance optimization, use ScrollTrigger.batch() to handle multiple elements efficiently:\n\n```javascript\nScrollTrigger.batch('.item', {\n  onEnter: (elements) => gsap.from(elements, {opacity: 0, y: 100}),\n  onLeave: (elements) => gsap.to(elements, {opacity: 0, y: -100})\n});\n```"
              : "GSAP ScrollTrigger 是一个强大的插件，让你能够轻松创建基于滚动的动画。在这个综合指南中，我们将探索能够将你的网页交互提升到新水平的高级技巧。\n\n## ScrollTrigger 入门\n\nScrollTrigger 通过监听滚动事件并根据元素在视口中的位置触发动画来工作。基本语法很简单：\n\n```javascript\ngsap.to('.element', {\n  x: 100,\n  scrollTrigger: '.trigger'\n});\n```\n\n## 高级技巧\n\n### 1. 固定和擦除效果\nScrollTrigger 最强大的功能之一是固定元素和擦除动画的能力。这创造了一个粘性效果，其中元素保持在原位，而内容在其后面滚动。\n\n### 2. 批量动画\n为了性能优化，使用 ScrollTrigger.batch() 来高效处理多个元素：\n\n```javascript\nScrollTrigger.batch('.item', {\n  onEnter: (elements) => gsap.from(elements, {opacity: 0, y: 100}),\n  onLeave: (elements) => gsap.to(elements, {opacity: 0, y: -100})\n});\n```\n\n### 3. 响应式设计考虑\n在移动设备上，滚动行为可能不同。确保你的动画在所有设备上都能正常工作。",
          date: "2023-12-15",
          readTime: 8,
          cover: "/images/blog/default-thumb.jpg",
        });
      }
    };

    fetchFeaturedBlog();
  }, [language]);

  useEffect(() => {
    if (featuredBlog && cardRef.current) {
      // 博客卡片初始化动画：从下方滑入并伴随缩放效果
      gsap.fromTo(
        cardRef.current,
        {
          y: 60,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.3,
        }
      );

      // 鼠标悬停效果：3D 变换 + 发光阴影
      const handleMouseEnter = () => {
        gsap.to(cardRef.current, {
          scale: 1.03,
          y: -12,
          rotationY: 2,
          duration: 0.5,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
          scale: 1,
          y: 0,
          rotationY: 0,
          boxShadow: "none",
          duration: 0.5,
          ease: "power2.out",
        });
      };

      cardRef.current.addEventListener("mouseenter", handleMouseEnter);
      cardRef.current.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        if (cardRef.current) {
          cardRef.current.removeEventListener("mouseenter", handleMouseEnter);
          cardRef.current.removeEventListener("mouseleave", handleMouseLeave);
        }
      };
    }
  }, [featuredBlog]);

  /**
   * 根据当前语言格式化日期显示
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const locale = language === "en" ? "en-US" : "zh-CN";
    const options = {
      month: language === "en" ? "short" : "long",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString(locale, options);
  };

  /**
   * 处理博客正文内容预览 - 去除 Markdown 语法标记
   */
  const getContentPreview = (content) => {
    if (!content) return "";

    // 清理 Markdown 语法标记
    const cleanContent = content
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`{1,3}[^`]*`{1,3}/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\n{2,}/g, "\n\n")
      .trim();

    // 提取前 3 段并控制长度
    const paragraphs = cleanContent.split("\n\n").filter((p) => p.trim());
    let preview = paragraphs.slice(0, 3).join("\n\n");

    if (preview.length > 400) {
      preview = preview.substring(0, 400).trim();
      const lastSpace = preview.lastIndexOf(" ");
      if (lastSpace > 300) {
        preview = preview.substring(0, lastSpace);
      }
      preview += "...";
    }

    return preview;
  };

  if (!featuredBlog) {
    return (
      <div
        className="w-full h-screen flex items-center justify-center"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-screen flex flex-col justify-center px-8"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* 页面标题和描述区域 */}
      <SectionHeader
        title={shareCurrentTexts.blogTitle || "Latest Blog"}
        description={
          shareCurrentTexts.blogDescription || "Latest Tech Insights"
        }
        size="large"
      />

      {/* 博客卡片主体区域 */}
      <div className="max-w-4xl mx-auto w-full">
        <div
          ref={cardRef}
          className="group cursor-pointer relative rounded-t-3xl"
        >
          <Link
            href={`/blog/${featuredBlog.id}`}
            className="block rounded-t-3xl relative"
          >
            {/* 博客卡片主体：顶部圆角边框 + 从底部升起效果 */}
            <div className="relative transition-all duration-700 border-t border-l border-r border-primary group-hover:border-primary/70 rounded-t-3xl overflow-hidden shadow-[0_-8px_16px_rgba(0,0,0,0.1)]">
              <div className="relative p-12 space-y-8 z-20">
                {/* 文章元信息：标签、发布日期、阅读时长 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-mono text-primary/80 px-4 py-2">
                      FEATURED
                    </span>
                    <span className="text-sm text-muted-foreground/60">•</span>
                    <span className="text-sm text-muted-foreground/80">
                      {formatDate(featuredBlog.date)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground/70">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      {featuredBlog.readTime}{" "}
                      {currentTexts.minRead || "min read"}
                    </span>
                  </div>
                </div>

                {/* 文章标题和内容预览区域 */}
                <div className="space-y-6">
                  <h4 className="text-4xl font-bold text-foreground group-hover:text-primary transition-colors duration-500 leading-tight">
                    {featuredBlog.title}
                  </h4>

                  {/* 文章摘要 */}
                  <p className="text-muted-foreground/90 text-lg leading-relaxed line-clamp-2 max-w-3xl">
                    {featuredBlog.excerpt}
                  </p>

                  {/* 正文内容预览：经过 Markdown 清理的纯文本 */}
                  <div className="text-muted-foreground/80 text-base leading-relaxed whitespace-pre-line max-w-4xl">
                    {getContentPreview(featuredBlog.content)}
                  </div>
                </div>
              </div>
            </div>
            {/* 渐变遮罩层：营造深度效果，hover 时淡出 */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 via-background/60 to-background pointer-events-none rounded-t-3xl z-30 transition-opacity duration-700 group-hover:opacity-0"></div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;
