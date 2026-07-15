import { CourseTypeEnum, RecordTypeEnum } from '@/types/course';
import type { OptionTypes } from '@/types/common';

/**
 * 课程类型选项
 */
export const COURSE_TYPE_OPTIONS: OptionTypes[] = [
  { label: '认知课程', value: CourseTypeEnum.COGNITION },
  { label: '感统课程', value: CourseTypeEnum.SENSORY },
  { label: '言语课程', value: CourseTypeEnum.SPEECH },
  { label: '其他课程', value: CourseTypeEnum.OTHER },
];

/**
 * 课程类型映射
 */
export const COURSE_TYPE_MAP: Record<CourseTypeEnum, string> = {
  [CourseTypeEnum.COGNITION]: '认知课程',
  [CourseTypeEnum.SENSORY]: '感统课程',
  [CourseTypeEnum.SPEECH]: '言语课程',
  [CourseTypeEnum.OTHER]: '其他课程',
};

/**
 * 记录类型选项
 */
export const RECORD_TYPE_OPTIONS: OptionTypes[] = [
  { label: '消耗学时', value: RecordTypeEnum.CONSUME },
  { label: '请假', value: RecordTypeEnum.LEAVE },
  { label: '取消', value: RecordTypeEnum.CANCEL },
];

/**
 * 记录类型映射
 */
export const RECORD_TYPE_MAP: Record<RecordTypeEnum, string> = {
  [RecordTypeEnum.CONSUME]: '消耗学时',
  [RecordTypeEnum.LEAVE]: '请假',
  [RecordTypeEnum.CANCEL]: '取消',
};

/**
 * 记录类型颜色映射
 */
export const RECORD_TYPE_COLOR_MAP: Record<RecordTypeEnum, string> = {
  [RecordTypeEnum.CONSUME]: '#3cc51f',
  [RecordTypeEnum.LEAVE]: '#ff9500',
  [RecordTypeEnum.CANCEL]: '#999',
};
