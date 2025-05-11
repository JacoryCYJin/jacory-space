import React from 'react';
import Link from 'next/link';
import './TagCloud.scss'; // 确保创建并导入样式文件

interface TagCloudProps {
  tags: Array<{
    name: {
      nanoid: string;
      name: string;
    } | string;
    count: number;
  }>;
}

const TagCloud: React.FC<TagCloudProps> = ({ tags }) => {
  // Get tag ID helper function - moved up before it's used
  const getTagId = (tag: any): string => {
    if (typeof tag.name === 'string') {
      return tag.name;
    }
    return tag.name.nanoid || '';
  };
  
  // Get tag name helper function - moved up before it's used
  const getTagName = (tag: any): string => {
    if (typeof tag.name === 'string') {
      return tag.name;
    }
    return tag.name.name || '';
  };
  
  // 去重处理：确保没有重复的标签ID
  const uniqueTags = React.useMemo(() => {
    const tagMap = new Map();
    
    // 遍历标签，如果有重复ID的标签，保留计数更高的那个
    tags.forEach(tag => {
      const tagId = getTagId(tag);
      if (!tagMap.has(tagId) || tagMap.get(tagId).count < tag.count) {
        tagMap.set(tagId, tag);
      }
    });
    
    return Array.from(tagMap.values());
  }, [tags]);
  
  return (
    <div className="tag-cloud-container">
      <div className="tag-cloud">
        {uniqueTags.map(tag => (
          <Link 
            key={getTagId(tag)}
            href={`/blog/tag/${encodeURIComponent(getTagName(tag))}`}
            className="tag-item"
          >
            {getTagName(tag)} <span className="tag-count">({tag.count})</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TagCloud;