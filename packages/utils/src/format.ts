/**
 * 格式化數字，加上千分位
 * @param num - 要格式化的數字
 * @param options - Intl.NumberFormat 的選項
 * @returns 格式化後的字串，如果輸入無效則回傳空字串
 */
export function formatNumber(
  num: number | null | undefined,
  options?: Intl.NumberFormatOptions
): string {
  if (typeof num !== 'number' || !Number.isFinite(num)) {
    return '';
  }
  return num.toLocaleString('en-US', options);
}

/**
 * 隱藏電子郵件的一部分
 * @param email - 完整的電子郵件地址
 * @returns 隱藏部分後的電子郵件地址
 */
export function maskEmail(email: string | null | undefined): string {
  if (!email || email.indexOf('@') === -1) {
    return '';
  }

  const [name, domain] = email.split('@');
  const prefix = name.length > 2 ? name.substring(0, 2) : name.substring(0, 1);
  return `${prefix}***@${domain}`;
}
