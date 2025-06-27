import React from 'react';
import { cn } from '@utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
}

const buttonVariants = {
  default:
    'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400',
  outline:
    'border border-indigo-600 text-indigo-600 hover:bg-indigo-100 disabled:text-gray-400 disabled:border-gray-300',
  secondary:
    'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100',
  ghost: 'hover:bg-gray-100',
  link: 'text-indigo-600 underline-offset-4 hover:underline',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          buttonVariants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
