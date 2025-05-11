import { get } from '../utils/request';
import { Result } from '@/types/api';
import { TagVO } from '@/types/models/tag';

/**
 * 获取所有标签列表
 * @returns 标签列表
 */
export function getTagListApi(): Promise<Result<TagVO[]>> {
  return get('/tag/list');
}