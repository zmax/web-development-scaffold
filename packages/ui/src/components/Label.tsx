import React from 'react';
import { cn } from '@axiom/utils';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Label.displayName = 'Label';

export { Label };
