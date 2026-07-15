/**
 * 课程包类型定义
 */
export interface CoursePackageTypes {
  id: string;
  courseName: string; // 课程名称
  totalHours: number; // 总学时
  remainingHours: number; // 剩余学时
  purchaseDate: string; // 购买时间
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
  isActive: boolean; // 是否启用
}

/**
 * 记录类型枚举
 */
export enum RecordTypeEnum {
  CONSUME = 'consume', // 消耗
  LEAVE = 'leave', // 请假
}

/**
 * 学时记录类型定义
 */
export interface RecordTypes {
  id: string;
  coursePackageId: string; // 课程包ID
  courseName: string; // 课程名称
  recordDate: string; // 记录日期
  recordType: RecordTypeEnum; // 记录类型
  consumeHours: number; // 消耗学时
  remainingHours: number; // 剩余学时
  remark: string; // 备注
  createTime: string; // 创建时间
}

/**
 * 统计数据类型定义
 */
export interface StatisticsTypes {
  totalPackages: number; // 总课程包数
  totalHours: number; // 总学时数
  consumedHours: number; // 已消耗学时
  remainingHours: number; // 剩余学时
  recentRecords: RecordTypes[]; // 最近记录
}

/**
 * 分页参数类型
 */
export interface PaginationTypes {
  current: number;
  pageSize: number;
  total: number;
}

/**
 * 列表查询参数
 */
export interface QueryParamsTypes {
  keyword?: string;
  startDate?: string;
  endDate?: string;
  recordType?: RecordTypeEnum;
}

