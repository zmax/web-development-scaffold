/**
 * 將日期格式化為本地化的日期字串。
 * @param date - 要格式化的日期，可以是 Date 物件、字串或數字。
 * @param locale - BCP 47 語言標籤，例如 'zh-TW' 或 'en-US'。預設為 'zh-TW'。
 * @param options - Intl.DateTimeFormat 的選項。
 * @returns 格式化後的日期字串。
 */
export function formatDate(
  date: Date | string | number,
  locale: string = 'zh-TW',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return '無效日期';
  }

  try {
    return new Intl.DateTimeFormat(locale, options).format(d);
  } catch (error) {
    // 捕獲其他潛在錯誤 (例如無效的 locale)，並返回一個友好的訊息
    return '無效日期';
  }
}
