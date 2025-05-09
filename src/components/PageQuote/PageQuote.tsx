import React from 'react';
import './page-quote.scss';

interface PageQuoteProps {
  text: string;
  author?: string;
  className?: string;
}

const PageQuote: React.FC<PageQuoteProps> = ({ 
  text, 
  author = '芥子不才',
  className = '' 
}) => {
  return (
    <section className={`page-quote ${className}`}>
      <blockquote>
        <p>{text}</p>
        {author && <cite>— {author}</cite>}
      </blockquote>
    </section>
  );
};

export default PageQuote;