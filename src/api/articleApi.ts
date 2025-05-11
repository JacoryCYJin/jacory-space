import { get } from '../utils/request';
import { Result, PageDTO } from '@/types/api';
import { ArticleVO, ArticleQueryParams } from '@/types/models/article';

/**
 * 获取所有文章列表
 * @returns 文章列表
 */
export function getArticleListApi(): Promise<Result<ArticleVO[]>> {
  return get('/article/list');
}

/**
 * 查询文章列表（分页）
 * @param params 查询参数
 * @returns 分页文章数据
 */
export function queryArticlesApi(params: ArticleQueryParams): Promise<Result<PageDTO<ArticleVO>>> {
  return get('/article/query', params);
}