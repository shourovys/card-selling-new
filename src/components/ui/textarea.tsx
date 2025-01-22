import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'> & { isError?: boolean }
>(({ className, isError, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md border bg-background px-3.5 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 md:text-sm',
        'disabled:cursor-default disabled:bg-input-disabled-background disabled:text-input-disabled-text',
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
Textarea.displayName = 'Textarea';

export { Textarea };
