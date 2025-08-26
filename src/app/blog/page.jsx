"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/lib/context";
import { blogTexts, blogCategories, blogTags } from "@/constants/Blog";
import BlogList from "@/components/BlogList";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";

const BlogPage = () => {
  const { language } = useApp();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const currentTexts = blogTexts[language];

  // 获取博客文章数据
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/blog");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const postsData = await response.json();
        setPosts(postsData);
        setFilteredPosts(postsData);
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
  }, [posts, selectedCategory, selectedTag, searchQuery]);

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
        <div className="max-w-6xl mx-auto">
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
    <div className="min-h-screen pb-12">
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

        <div className="max-w-6xl mx-auto relative z-10">
          {/* 页面标题 */}
          <div className="text-center pt-12 pb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              {currentTexts.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {currentTexts.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 筛选和搜索区域 */}
      <div className="max-w-6xl mx-auto mb-8 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 搜索框 */}
            <div className="relative">
              <input
                type="text"
                placeholder={currentTexts.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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

            {/* 分类筛选 */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">{currentTexts.allCategories}</option>
              {blogCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getCategoryName(category)}
                </option>
              ))}
            </select>

            {/* 标签筛选 */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">{currentTexts.allTags}</option>
              {blogTags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {getTagName(tag)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 文章列表 */}
      <div className="max-w-6xl mx-auto">
        <BlogList
          filteredPosts={filteredPosts}
          noResultsText={currentTexts.noResults}
        />
      </div>
    </div>
  );
};

export default BlogPage;
