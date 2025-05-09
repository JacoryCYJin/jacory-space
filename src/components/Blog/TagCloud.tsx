import React from 'react';
import Link from 'next/link';

interface TagCloudProps {
  tags: Array<{
    name: string;
    count: number;
  }>;
}

const TagCloud: React.FC<TagCloudProps> = ({ tags }) => {
  // 根据文章数量计算标签大小
  const getTagSize = (count: number): string => {
    const min = Math.min(...tags.map(tag => tag.count));
    const max = Math.max(...tags.map(tag => tag.count));
    
    // 如果所有标签的文章数量相同，返回默认大小
    if (min === max) return '1rem';
    
    // 计算标签大小，范围从0.8rem到1.5rem
    const size = 0.8 + ((count - min) / (max - min)) * 0.7;
    return `${size}rem`;
  };
  
  return (
    <div className="tag-cloud">
      {tags.map(tag => (
        <Link 
          key={tag.name} 
          href={`/blogs/tags/${tag.name}`}
          className="tag-cloud-item"
          style={{ fontSize: getTagSize(tag.count) }}
        >
          {tag.name} <span className="tag-count">({tag.count})</span>
        </Link>
      ))}
    </div>
  );
};

export default TagCloud;