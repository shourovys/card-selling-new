import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & { isError?: boolean }
>(({ className, type, isError, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex px-3.5 py-2 w-full h-10 text-base rounded-md border hover:border-input-borderHover bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        isError
          ? 'border-destructive focus-visible:ring-destructive'
          : 'border-input focus-visible:ring-ring',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
