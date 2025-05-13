import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ArticleCardProps {
  article: {
    id: string;
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    coverImage?: string;
    readingTime: string;
    categories: string[];
    tags: string[];
  };
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <Link href={`/blog/${article.slug}`} className="article-card-link">
      <div className="article-card">
        {article.coverImage && (
          <div className="article-image">
            <Image 
              src={article.coverImage} 
              alt={article.title}
              width={300}
              height={200}
              className="cover-image"
            />
          </div>
        )}
        <div className="article-content">
          <div className="article-meta">
            <span className="article-date">{article.date}</span>
            <span className="reading-time">{article.readingTime}</span>
          </div>
          <h2 className="article-title">
            {article.title}
          </h2>
          <p className="article-excerpt">{article.excerpt}</p>
          <div className="article-tags">
            {article.tags.map(tag => (
              <span key={tag} className="tag bgc-tag" onClick={(e) => {
                e.preventDefault();
                window.location.href = `/blog/tag/${tag}`;
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;