import { WorkVO } from '@/types/models/work';
import { Result } from '@/types/api';
import { get } from '@/utils/request';

/**
 * 获取所有作品列表
 * @returns 作品列表
 */
export function getWorkListApi(): Promise<Result<WorkVO[]>> {
  return get('/work/list');
}
