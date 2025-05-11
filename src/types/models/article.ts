// 引入分类和标签接口
import { CategoryVO } from './category';
import { TagVO } from './tag';

// 文章VO接口定义
export interface ArticleVO {
  nanoid: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  readingTime: string;
  publishedDate: Date;
  
  // 关联的分类和标签
  categories: CategoryVO[];
  tags: TagVO[];
}

// 文章查询参数接口
export interface ArticleQueryParams {
  title?: string;
  content?: string;
  categoryNanoid?: string;
  tagNanoid?: string;
  startDate?: string;
  endDate?: string;
  pageNum?: number;
  pageSize?: number;
  fetchAll?: boolean;
}