import { describe, it, expect } from 'vitest';
import { cn } from './cn';

/**
 * @file cn.test.ts
 * @description `cn` 工具函式的單元測試。
 *
 * @testplan
 * 1. **基本合併**: 測試多個字串參數是否能正確合併。
 * 2. **條件式類別**: 測試物件語法，其中布林值決定類別是否被包含。
 * 3. **Falsy 值處理**: 確保 `null`, `undefined`, `false` 等值會被忽略。
 * 4. **混合參數**: 測試字串、物件和陣列混合使用時的行為。
 * 5. **Tailwind 衝突解決**: 驗證 `tailwind-merge` 是否能正確處理衝突的 utility classes。
 * 6. **邊界情況**: 測試沒有參數或只有 falsy 參數時的輸出。
 */
describe('cn', () => {
  it('應能合併多個字串類名', () => {
    // Arrange & Act & Assert
    expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz');
  });

  it('應能處理條件式類名物件', () => {
    // Arrange & Act & Assert
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });

  it('應能忽略 falsy 值 (null, undefined, false)', () => {
    // Arrange & Act & Assert
    expect(cn('foo', null, 'bar', undefined, false, 'baz')).toBe('foo bar baz');
  });

  it('應能處理混合的參數類型', () => {
    // Arrange & Act & Assert
    expect(cn('foo', { bar: true, duck: false }, 'baz', { quux: true })).toBe(
      'foo bar baz quux'
    );
  });

  it('應能解析並合併衝突的 Tailwind CSS 類名 (tailwind-merge)', () => {
    // Arrange & Act & Assert
    expect(cn('p-2', 'p-4')).toBe('p-4'); // p-4 應覆蓋 p-2
    expect(cn('px-2', 'p-4')).toBe('p-4'); // p-4 應覆蓋 px-2
    expect(cn('text-base', 'font-bold', 'text-lg')).toBe('font-bold text-lg'); // text-lg 應覆蓋 text-base
  });

  it('當沒有參數時，應回傳空字串', () => {
    // Arrange & Act & Assert
    expect(cn()).toBe('');
  });
});
