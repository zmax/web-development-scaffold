import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合併 Tailwind CSS 類名，並解決衝突。
 * @param inputs - 要合併的類名，可以是字串、陣列或物件。
 * @returns 合併後的類名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
