import { describe, it, expect } from 'vitest';
import { formatNumber, maskEmail } from './format';

describe('formatNumber', () => {
  it('應該能正確格式化正整數', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('應該能正確格式化帶有小數的數字', () => {
    expect(formatNumber(1234.56)).toBe('1,234.56');
  });

  it('應該能處理 0', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('對於 null 或 undefined 輸入，應該回傳空字串', () => {
    expect(formatNumber(null)).toBe('');
    expect(formatNumber(undefined)).toBe('');
  });

  it('對於非數字輸入，應該回傳空字串', () => {
    // @ts-expect-error Testing invalid input
    expect(formatNumber('not a number')).toBe('');
    expect(formatNumber(NaN)).toBe('');
  });

  it('應該能接受 Intl.NumberFormat 的選項', () => {
    expect(formatNumber(50, { style: 'currency', currency: 'USD' })).toBe(
      '$50.00'
    );
  });
});

describe('maskEmail', () => {
  it('應該能正確隱藏標準長度的 email', () => {
    expect(maskEmail('johndoe@example.com')).toBe('jo***@example.com');
  });

  it('對於使用者名稱少於或等於 2 個字元的 email，應該只顯示第一個字元', () => {
    expect(maskEmail('jo@example.com')).toBe('j***@example.com');
    expect(maskEmail('j@example.com')).toBe('j***@example.com');
  });

  it('對於無效的 email 格式 (缺少 @)，應該回傳空字串', () => {
    expect(maskEmail('johndoe.example.com')).toBe('');
  });

  it('對於 null, undefined 或空字串輸入，應該回傳空字串', () => {
    expect(maskEmail(null)).toBe('');
    expect(maskEmail(undefined)).toBe('');
    expect(maskEmail('')).toBe('');
  });
});
