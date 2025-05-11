import React from 'react';
import './Pagination.scss';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  prevText?: string;
  nextText?: string;
  maxPagesToShow?: number;
  showPageInfo?: boolean;
  totalItems?: number;
  pageSize?: number;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  prevText = '上一页',
  nextText = '下一页',
  maxPagesToShow = 5,
  showPageInfo = false,
  totalItems = 0,
  pageSize = 10,
  className = ''
}) => {
  // 生成页码数组
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= maxPagesToShow) {
      // 如果总页数小于等于最大显示数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // 否则，显示当前页附近的页码
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // 添加省略号
      if (startPage > 1) {
        pageNumbers.unshift('...');
        pageNumbers.unshift(1);
      }
      
      if (endPage < totalPages) {
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };
  
  return (
    <div className={`pagination ${className}`}>
      {showPageInfo && totalItems > 0 && (
        <div className="pagination-info">
          显示 {(currentPage - 1) * pageSize + 1} 至 {Math.min(currentPage * pageSize, totalItems)} 条，共 {totalItems} 条
        </div>
      )}
      
      <div className="pagination-controls">
        <button 
          className="pagination-button prev" 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {prevText}
        </button>
        
        <div className="pagination-numbers">
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <button 
                key={index}
                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="pagination-ellipsis">{page}</span>
            )
          ))}
        </div>
        
        <button 
          className="pagination-button next" 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {nextText}
        </button>
      </div>
    </div>
  );
};

export default Pagination;