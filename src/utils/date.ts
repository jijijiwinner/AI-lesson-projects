import dayjs from 'dayjs';

/**
 * 格式化日期
 */
export function formatDate(date: string | Date, format = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format);
}

/**
 * 获取当前日期
 */
export function getCurrentDate(format = 'YYYY-MM-DD'): string {
  return dayjs().format(format);
}

/**
 * 获取当前时间
 */
export function getCurrentDateTime(format = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs().format(format);
}

/**
 * 判断是否为今天
 */
export function isToday(date: string): boolean {
  return dayjs(date).isSame(dayjs(), 'day');
}

/**
 * 判断是否为本月
 */
export function isThisMonth(date: string): boolean {
  return dayjs(date).isSame(dayjs(), 'month');
}

/**
 * 获取月份的第一天
 */
export function getMonthFirstDay(date?: string): string {
  return dayjs(date).startOf('month').format('YYYY-MM-DD');
}

/**
 * 获取月份的最后一天
 */
export function getMonthLastDay(date?: string): string {
  return dayjs(date).endOf('month').format('YYYY-MM-DD');
}

/**
 * 计算日期差（天数）
 */
export function dateDiff(startDate: string, endDate: string): number {
  return dayjs(endDate).diff(dayjs(startDate), 'day');
}

/**
 * 获取星期几（中文）
 */
export function getWeekday(date: string): string {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekdays[dayjs(date).day()];
}

/**
 * 格式化日期并带上星期几
 */
export function formatDateWithWeekday(date: string): string {
  if (!date) return '';
  const weekday = getWeekday(date);
  return `${date} ${weekday}`;
}
