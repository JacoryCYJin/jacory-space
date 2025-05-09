import React from 'react';
import Link from 'next/link';

interface CategoryListProps {
  categories: string[];
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ 
  categories, 
  selectedCategory = '全部',
  onCategorySelect 
}) => {
  // 添加"全部"分类
  const allCategories = ['全部', ...categories];
  
  return (
    <div className="category-filter">
      {allCategories.map(category => (
        onCategorySelect ? (
          // 如果提供了选择回调，使用按钮
          <button 
            key={category}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategorySelect(category)}
          >
            {category}
          </button>
        ) : (
          // 否则使用链接
          <Link 
            key={category}
            href={category === '全部' ? '/blogs' : `/blogs/categories/${category}`}
            className={`category-link ${selectedCategory === category ? 'active' : ''}`}
          >
            {category}
          </Link>
        )
      ))}
    </div>
  );
};

export default CategoryList;