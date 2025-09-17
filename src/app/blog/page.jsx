"use client";

import { useState, useEffect, useRef } from "react";
import { useApp } from "@/lib/context";
import { blogTexts, blogCategories, blogTags } from "@/constants/Blog";
import BlogList from "@/components/BlogList";
import Pagination from "@/components/Pagination";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 注册GSAP插件
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * 博客页面组件 - 文章列表和筛选功能
 * 作者：JacoryJin
 */

const BlogPage = () => {
  const { language } = useApp();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  // 分页状态 - 固定每页12篇文章
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // GSAP refs
  const pageRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const filterSectionRef = useRef(null);
  const blogListRef = useRef(null);
  const paginationRef = useRef(null);
  const tl = useRef(null);

  const currentTexts = blogTexts[language];

  // 获取博客文章数据
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/blogs");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const result = await response.json();
        if (result.success && result.data) {
          setPosts(result.data);
          setFilteredPosts(result.data);
        } else {
          throw new Error(result.error || "Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
        setFilteredPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 页面入场动画
  useEffect(() => {
    if (!loading && pageRef.current) {
      // 创建主时间线
      tl.current = gsap.timeline();

      // 设置初始状态
      gsap.set([titleRef.current, subtitleRef.current], {
        y: 50,
        opacity: 0,
      });

      gsap.set(filterSectionRef.current, {
        y: 30,
        opacity: 0,
      });

      gsap.set(blogListRef.current, {
        y: 40,
        opacity: 0,
      });

      gsap.set(paginationRef.current, {
        y: 30,
        opacity: 0,
      });

      // 执行入场动画
      tl.current
        .to(titleRef.current, {
          duration: 0.8,
          y: 0,
          opacity: 1,
          ease: "power3.out",
        })
        .to(
          subtitleRef.current,
          {
            duration: 0.6,
            y: 0,
            opacity: 1,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .to(
          filterSectionRef.current,
          {
            duration: 0.7,
            y: 0,
            opacity: 1,
            ease: "power2.out",
          },
          "-=0.3"
        )
        .to(
          blogListRef.current,
          {
            duration: 0.8,
            y: 0,
            opacity: 1,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .to(
          paginationRef.current,
          {
            duration: 0.6,
            y: 0,
            opacity: 1,
            ease: "power2.out",
          },
          "-=0.4"
        );

      // 添加博客卡片的stagger动画
      const blogCards =
        blogListRef.current?.querySelectorAll("[data-blog-card]");
      if (blogCards && blogCards.length > 0) {
        gsap.fromTo(
          blogCards,
          {
            y: 60,
            opacity: 0,
            scale: 0.95,
          },
          {
            duration: 0.6,
            y: 0,
            opacity: 1,
            scale: 1,
            ease: "power2.out",
            stagger: {
              amount: 0.4,
              from: "start",
            },
            delay: 0.8,
          }
        );
      }

    }

    return () => {
      if (tl.current) {
        tl.current.kill();
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [loading]);

  // 筛选变化时的动画
  useEffect(() => {
    if (!loading && blogListRef.current) {
      const blogCards =
        blogListRef.current.querySelectorAll("[data-blog-card]");
      if (blogCards && blogCards.length > 0) {
        gsap.fromTo(
          blogCards,
          {
            y: 30,
            opacity: 0,
            scale: 0.98,
          },
          {
            duration: 0.5,
            y: 0,
            opacity: 1,
            scale: 1,
            ease: "power2.out",
            stagger: {
              amount: 0.3,
              from: "start",
            },
          }
        );
      }
    }
  }, [filteredPosts, loading]);

  // 筛选文章
  useEffect(() => {
    let filtered = posts;

    // 按分类筛选
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // 按标签筛选
    if (selectedTag !== "all") {
      filtered = filtered.filter(
        (post) => post.tags && post.tags.includes(selectedTag)
      );
    }

    // 搜索筛选
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredPosts(filtered);
    // 重置到第一页
    setCurrentPage(1);
  }, [posts, selectedCategory, selectedTag, searchQuery]);

  // 分页计算
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // 分页处理函数
  const handlePageChange = (page) => {
    // 页面切换动画
    if (blogListRef.current) {
      const blogCards =
        blogListRef.current.querySelectorAll("[data-blog-card]");
      gsap.to(blogCards, {
        duration: 0.3,
        y: -20,
        opacity: 0,
        scale: 0.98,
        ease: "power2.in",
        stagger: 0.02,
        onComplete: () => {
          setCurrentPage(page);
          // 滚动到页面顶部
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      });
    } else {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 按钮hover动画
  const handleButtonHover = (e, isEntering = true) => {
    const button = e.currentTarget;
    if (isEntering) {
      gsap.to(button, {
        duration: 0.3,
        scale: 1.05,
        y: -2,
        ease: "power2.out",
      });
    } else {
      gsap.to(button, {
        duration: 0.3,
        scale: 1,
        y: 0,
        ease: "power2.out",
      });
    }
  };

  // 搜索框focus动画
  const handleSearchFocus = (e, isFocused = true) => {
    const searchContainer = e.currentTarget.parentElement;
    if (isFocused) {
      gsap.to(searchContainer, {
        duration: 0.3,
        scale: 1.02,
        ease: "power2.out",
      });
    } else {
      gsap.to(searchContainer, {
        duration: 0.3,
        scale: 1,
        ease: "power2.out",
      });
    }
  };

  const getCategoryName = (category) => {
    return typeof category.name === "object"
      ? category.name[language]
      : category.name;
  };

  const getTagName = (tag) => {
    return typeof tag.name === "object" ? tag.name[language] : tag.name;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-12 px-8">
        <div className="max-w-7.5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-300 rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="min-h-screen pb-12 pt-14">
      {/* 页面标题部分 - 带背景 */}
      <div className="relative pb-8">
        <AnimatedGridPattern
          numSquares={40}
          maxOpacity={0.08}
          duration={4}
          repeatDelay={1.5}
          className={cn(
            "absolute inset-0 h-full w-full z-0",
            "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
          )}
        />

        {/* 渐变遮罩，从上往下消失 */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background dark:to-backgroud pointer-events-none z-0"></div>

        <div className="max-w-7.5xl mx-auto relative z-10 px-4">
          {/* 页面标题 */}
          <div className="text-center pt-12 pb-8">
            <h1
              ref={titleRef}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4"
            >
              {currentTexts.title}
            </h1>
            <p
              ref={subtitleRef}
              className="text-xl text-gray-600 dark:text-gray-300"
            >
              {currentTexts.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 筛选和搜索区域 */}
      <div className="max-w-7.5xl mx-auto mb-8 relative z-10 px-4">
        <div
          ref={filterSectionRef}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 backdrop-blur-sm"
        >
          {/* 搜索框和状态栏 */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={currentTexts.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={(e) => handleSearchFocus(e, true)}
                onBlur={(e) => handleSearchFocus(e, false)}
                className="w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
              <svg
                className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* 状态和清除按钮 */}
            <div className="flex items-center gap-4">
              {/* 结果计数 */}
              <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {filteredPosts.length} {currentTexts.articlesCount}
              </div>

              {/* 清除筛选按钮 */}
              {(selectedCategory !== "all" ||
                selectedTag !== "all" ||
                searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedTag("all");
                    setSearchQuery("");
                  }}
                  onMouseEnter={(e) => handleButtonHover(e, true)}
                  onMouseLeave={(e) => handleButtonHover(e, false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-600"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  {currentTexts.clearFilters}
                </button>
              )}
            </div>
          </div>

          {/* 分类筛选 */}
          <div className="mb-6">
            <div className="mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {currentTexts.category}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === "all"
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {currentTexts.allCategories}
              </button>
              {(showAllCategories
                ? blogCategories
                : blogCategories.slice(0, 4)
              ).map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {getCategoryName(category)}
                </button>
              ))}
              {blogCategories.length > 4 && (
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-1"
                >
                  {showAllCategories ? (
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="5" cy="12" r="1" />
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* 标签筛选 */}
          <div>
            <div className="mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {currentTexts.tags}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  selectedTag === "all"
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {currentTexts.allTags}
              </button>
              {(showAllTags ? blogTags : blogTags.slice(0, 8)).map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(tag.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    selectedTag === tag.id
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {getTagName(tag)}
                </button>
              ))}
              {blogTags.length > 8 && (
                <button
                  onClick={() => setShowAllTags(!showAllTags)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-1"
                >
                  {showAllTags ? (
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="5" cy="12" r="1" />
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 文章列表 */}
      <div ref={blogListRef} className="max-w-7.5xl mx-auto px-4 pb-8">
        <BlogList
          filteredPosts={currentPosts}
          noResultsText={currentTexts.noResults}
        />
      </div>

      {/* 分页组件 */}
      {filteredPosts.length > 0 && (
        <div ref={paginationRef} className="max-w-7.5xl mx-auto px-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filteredPosts.length}
          />
        </div>
      )}
    </div>
  );
};

export default BlogPage;
