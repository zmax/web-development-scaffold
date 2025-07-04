import { jsx as _jsx } from 'react/jsx-runtime';
import React from 'react';
import { cn } from '@utils/cn';
const Input = React.forwardRef(({ className, type, error, ...props }, ref) => {
  return _jsx('input', {
    type: type,
    className: cn(
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      // 當 error 為 true 時，套用錯誤狀態的樣式
      error && 'border-destructive focus-visible:ring-destructive',
      className
    ),
    ref: ref,
    ...props,
  });
});
Input.displayName = 'Input';
export { Input };
