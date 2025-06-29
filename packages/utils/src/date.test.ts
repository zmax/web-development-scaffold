import { describe, it, expect } from 'vitest';
import { formatDate } from './date';

describe('formatDate', () => {
  it('應該能正確格式化 Date 物件', () => {
    const date = new Date('2024-01-01T12:30:00');
    expect(formatDate(date, 'yyyy-MM-dd')).toBe('2024-01-01');
  });

  it('應該能使用自訂格式化字串', () => {
    const date = new Date('2024-01-01T12:30:00');
    expect(formatDate(date, 'yyyy/MM/dd')).toBe('2024/01/01');
    expect(formatDate(date, 'HH:mm')).toBe('12:30');
    // 根據 date-fns 的規則，單引號用於轉義文字，引號本身不會出現在輸出中。
    // 因此，預期結果不應包含引號。
    expect(formatDate(date, "do 'of' MMMM yyyy")).toBe('1st of January 2024');
  });

  it('對於無效的日期輸入，應該回傳空字串', () => {
    expect(formatDate('這不是一個日期')).toBe('');
    expect(formatDate(NaN)).toBe('');
    expect(formatDate(new Date('invalid date'))).toBe('');
  });

  it('應該能處理時間戳數字', () => {
    // Corresponds to 2023-10-26 10:00:00 UTC
    const timestamp = 1698314400000;
    expect(formatDate(timestamp, 'yyyy-MM-dd')).toBe('2023-10-26');
  });

  it('應該能處理 ISO 日期字串', () => {
    const isoString = '2023-12-25T00:00:00.000Z';
    expect(formatDate(isoString, 'yyyy-MM-dd')).toBe('2023-12-25');
  });
});
