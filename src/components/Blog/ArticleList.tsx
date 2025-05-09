import React from 'react';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
  articles: Array<{
    id: string;
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    coverImage?: string;
    readingTime: string;
    categories: string[];
    tags: string[];
  }>;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
  return (
    <div className="article-list">
      {articles.length > 0 ? (
        articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))
      ) : (
        <div className="no-articles">
          <p>暂无文章</p>
        </div>
      )}
    </div>
  );
};

export default ArticleList;