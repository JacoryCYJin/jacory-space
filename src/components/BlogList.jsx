import BlogCard from "./BlogCard";

/**
 * 博客文章列表组件
 * @param {Array} filteredPosts - 过滤后的文章列表
 * @param {string} noResultsText - 无结果时的提示文本
 */
const BlogList = ({ filteredPosts, noResultsText }) => {
  // 如果没有文章数据，显示空状态
  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {noResultsText}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          尝试调整搜索条件或筛选器
        </p>
      </div>
    );
  }

  // 渲染文章网格布局
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
      {filteredPosts.map((post) => (
        <BlogCard key={post.slug} article={post} />
      ))}
    </div>
  );
};

export default BlogList;
