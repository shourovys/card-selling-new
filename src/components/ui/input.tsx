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
        'flex px-3.5 py-2 w-full h-10 text-base rounded-md border bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0',
        'disabled:cursor-default disabled:bg-input-disabled-background disabled:text-input-disabled-text ',
        isError
          ? 'border-destructive focus-visible:ring-destructive'
          : 'border-input focus-visible:ring-ring enabled:hover:border-input-borderHover focus-visible:border-ring enabled:focus-visible:hover:border-ring',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
