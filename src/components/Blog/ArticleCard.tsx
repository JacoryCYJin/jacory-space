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
          <Link href={`/blogs/${article.slug}`}>{article.title}</Link>
        </h2>
        <p className="article-excerpt">{article.excerpt}</p>
        <div className="article-tags">
          {article.tags.map(tag => (
            <Link key={tag} href={`/blogs/tags/${tag}`} className="tag">
              {tag}
            </Link>
          ))}
        </div>
        <Link href={`/blogs/${article.slug}`} className="read-more">
          继续阅读 →
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;