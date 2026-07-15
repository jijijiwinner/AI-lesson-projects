/**
 * 通用响应类型
 */
export interface ResponseTypes<T = any> {
  success: boolean;
  data: T;
  message: string;
  errorCode?: string;
}

/**
 * 分页参数类型
 */
export interface PageParamsTypes {
  pageNum: number;
  pageSize: number;
}

/**
 * 分页响应类型
 */
export interface PageResponseTypes<T = any> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}

/**
 * 选项类型
 */
export interface OptionTypes {
  label: string;
  value: string | number;
}
