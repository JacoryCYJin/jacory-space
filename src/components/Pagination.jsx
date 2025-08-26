"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { paginationTexts } from "@/constants/Blog";

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems 
}) => {
  const { language } = useApp();
  const [inputPage, setInputPage] = useState("");
  const currentTexts = paginationTexts[language];

  // 生成页码数组
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // 如果总页数少于等于5页，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 如果总页数大于5页，智能显示页码
      if (currentPage <= 3) {
        // 当前页在前3页，显示1-5页
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        if (totalPages > 5) {
          pages.push("...");
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        // 当前页在后3页，显示最后5页
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 当前页在中间，显示当前页前后各2页
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // 处理手动输入页码
  const handleInputPageChange = (e) => {
    const value = e.target.value;
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= totalPages)) {
      setInputPage(value);
    }
  };

  const handleInputPageSubmit = (e) => {
    e.preventDefault();
    if (inputPage && parseInt(inputPage) >= 1 && parseInt(inputPage) <= totalPages) {
      onPageChange(parseInt(inputPage));
      setInputPage("");
    }
  };

  // 处理键盘事件
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleInputPageSubmit(e);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* 页码导航和手动输入页码 - 放在同一行 */}
      <div className="flex items-center space-x-6">
        {/* 页码导航 - 现代简约风格 */}
        <div className="flex items-center space-x-1">
          {/* 上一页按钮 */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50"
            aria-label="上一页"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* 页码按钮 */}
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={page === "..."}
              className={`min-w-[44px] h-11 px-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                page === currentPage
                  ? "bg-primary text-white shadow-lg shadow-primary/25 scale-105"
                  : page === "..."
                  ? "text-gray-400 dark:text-gray-500 cursor-default hover:bg-transparent"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50"
              }`}
            >
              {page}
            </button>
          ))}

          {/* 下一页按钮 */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50"
            aria-label="下一页"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* 手动输入页码 - 简约设计 */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentTexts.goToPage}
          </span>
          <form onSubmit={handleInputPageSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={inputPage}
              onChange={handleInputPageChange}
              onKeyPress={handleKeyPress}
              placeholder="页码"
              className="w-16 h-10 px-3 text-sm text-center border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
            <button
              type="submit"
              className="h-10 px-4 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 transform hover:scale-105"
            >
              {currentTexts.go}
            </button>
          </form>
        </div>
      </div>

      {/* 分页信息 - 放在页码和选择页码的下面 */}
      <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
        <span className="font-medium text-gray-900 dark:text-white">{currentPage}</span>
        <span className="mx-2">/</span>
        <span className="text-gray-600 dark:text-gray-300">{totalPages}</span>
        <span className="mx-3 text-gray-300 dark:text-gray-600">•</span>
        <span className="text-gray-600 dark:text-gray-300">{totalItems} {currentTexts.articlesCount}</span>
      </div>
    </div>
  );
};

export default Pagination;
