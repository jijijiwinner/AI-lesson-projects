/**
 * 课程类型枚举
 */
export enum CourseTypeEnum {
  COGNITION = 'cognition', // 认知课程
  SENSORY = 'sensory', // 感统课程
  SPEECH = 'speech', // 言语课程
  OTHER = 'other', // 其他课程
}

/**
 * 记录类型枚举
 */
export enum RecordTypeEnum {
  CONSUME = 'consume', // 消耗学时
  LEAVE = 'leave', // 请假
  CANCEL = 'cancel', // 取消
}

/**
 * 课程包类型
 */
export interface CoursePackageTypes {
  id: string; // 课程包ID
  courseType: CourseTypeEnum; // 课程类型
  courseName: string; // 课程名称
  totalHours: number; // 总学时
  remainingHours: number; // 剩余学时
  purchaseDate: string; // 购买日期 yyyy-MM-dd
  price?: number; // 价格（选填）
  sortOrder: number; // 排序序号
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
}

/**
 * 学时记录类型
 */
export interface LessonRecordTypes {
  id: string; // 记录ID
  packageId: string; // 课程包ID
  courseType: CourseTypeEnum; // 课程类型
  courseName: string; // 课程名称
  recordType: RecordTypeEnum; // 记录类型
  consumeHours: number; // 消耗学时（请假为0）
  recordDate: string; // 记录日期 yyyy-MM-dd
  remark: string; // 备注
  createTime: string; // 创建时间
}

/**
 * 统计数据类型
 */
export interface StatisticsTypes {
  totalPackages: number; // 总课程包数
  totalHours: number; // 总学时
  totalRemainingHours: number; // 总剩余学时
  totalConsumedHours: number; // 总已消耗学时
  todayRecords: number; // 今日记录数
  monthRecords: number; // 本月记录数
  totalPayment?: number; // 总支付金额
}

/**
 * 费用记录类型
 */
export interface PaymentRecordTypes {
  id: string; // 记录ID
  paymentDate: string; // 付款日期 yyyy-MM-dd
  amount: number; // 金额
  packages: Array<{
    courseType: CourseTypeEnum;
    courseName: string;
    hours: number;
    price: number;
  }>; // 购买的课程包列表
  remark: string; // 备注
  createTime: string; // 创建时间
}
