// 通用响应结构
export interface Result<T> {
  code: number;
  data: T;
  message: string;
}

// 分页数据接口
export interface PageDTO<T> {
  total: number;
  pages: number;
  list: T[];
}