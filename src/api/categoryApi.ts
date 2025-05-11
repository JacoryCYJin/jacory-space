import { get } from '../utils/request';
import { Result } from '@/types/api';
import { CategoryVO } from '@/types/models/category';

/**
 * 获取所有分类列表
 * @returns 分类列表
 */
export function getCategoryListApi(): Promise<Result<CategoryVO[]>> {
  return get('/category/list');
}