// 引入分类和标签接口
import { TagVO } from './tag';

// 文章VO接口定义
export interface WorkVO {
  nanoid: string;
  title: string;
  description: string;
  coverImage: string;
  link: string;
  launchDate: Date;
  status: number;
  mood: string;
  
  // 关联的分类和标签
  tags: TagVO[];
}