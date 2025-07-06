import React from 'react';
import { cn } from '@axiom/utils';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </label>
    );
  }
);
Label.displayName = 'Label';

export { Label };
