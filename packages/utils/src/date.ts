import { format, isValid } from 'date-fns';

/**
 * 格式化日期
 * @param date - 日期物件、字串或數字
 * @param formatStr - 格式化字串，預設為 'yyyy-MM-dd HH:mm:ss'
 * @returns 格式化後的日期字串，如果日期無效則回傳空字串
 */
export function formatDate(
  date: Date | string | number,
  formatStr = 'yyyy-MM-dd HH:mm:ss'
): string {
  const dateObj = new Date(date);
  if (!isValid(dateObj)) {
    return '';
  }
  return format(dateObj, formatStr);
}
