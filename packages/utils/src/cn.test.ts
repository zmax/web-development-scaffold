import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn utility', () => {
  it('應該正確合併字串類名', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('應該處理條件類名', () => {
    expect(cn('base', { conditional: true })).toBe('base conditional');
    expect(cn('base', { conditional: false })).toBe('base');
  });

  it('應該處理陣列類名', () => {
    expect(cn(['p-4', 'm-2'])).toBe('p-4 m-2');
  });

  it('應該忽略 null, undefined, 和 boolean 值', () => {
    expect(cn('a', null, 'b', undefined, 'c', true, false)).toBe('a b c');
  });

  it('應該使用 tailwind-merge 解決衝突', () => {
    // p-2 會覆蓋 p-4
    expect(cn('p-4', 'p-2')).toBe('p-2');
    // text-green-500 會覆蓋 text-red-500
    expect(cn('text-red-500', 'bg-blue-500', 'text-green-500')).toBe(
      'bg-blue-500 text-green-500'
    );
  });

  it('應該處理複雜的混合輸入', () => {
    const hasMargin = true;
    const hasPadding = false;
    expect(
      cn(
        'base-class',
        ['font-bold', 'text-lg'],
        { 'm-4': hasMargin, 'p-4': hasPadding },
        'm-2' // 這個會覆蓋 'm-4'
      )
    ).toBe('base-class font-bold text-lg m-2');
  });
});
