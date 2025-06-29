import { describe, it, expect } from 'vitest';
import { formatDate } from './format';

describe('formatDate utility', () => {
  // 使用一個固定的日期以確保測試結果的一致性
  const testDate = new Date('2023-10-27T10:00:00Z');

  it('應該使用預設的 zh-TW 地區設定和格式', () => {
    // 在 Node.js 環境中，長月份的格式可能因 ICU 版本而異
    // '2023年10月27日' 是常見的格式
    const result = formatDate(testDate);
    expect(result).toBe('2023年10月27日');
  });

  it('應該使用指定的 en-US 地區設定', () => {
    const result = formatDate(testDate, 'en-US');
    expect(result).toBe('October 27, 2023');
  });

  it('應該接受自訂的格式選項', () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    // 預期 'zh-TW' 的結果
    // Intl 的輸出在不同環境中可能略有不同，因此分開檢查關鍵部分
    const resultTW = formatDate(testDate, 'zh-TW', options);
    expect(resultTW).toContain('2023');
    expect(resultTW).toContain('10');
    expect(resultTW).toContain('27');
    expect(resultTW).toContain('星期五');

    // 預期 'en-US' 的結果
    const resultUS = formatDate(testDate, 'en-US', options);
    expect(resultUS).toBe('Friday, 10/27/2023');
  });

  it('應該能處理字串格式的日期', () => {
    const result = formatDate('2023-10-27T10:00:00Z', 'en-US');
    expect(result).toBe('October 27, 2023');
  });

  it('應該能處理數字格式的日期 (timestamp)', () => {
    const result = formatDate(testDate.getTime(), 'en-US');
    expect(result).toBe('October 27, 2023');
  });

  it('對於無效的日期輸入，應該返回 "無效日期"', () => {
    const result = formatDate('not a real date');
    expect(result).toBe('無效日期');
  });
});
