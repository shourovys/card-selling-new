import { FormDescription, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import * as React from 'react';

type BaseFieldProps = {
  name: string;
  label?: string;
  value?: string;
  smallLabel?: string;
  description?: string;
  className?: string;
  required?: boolean;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

interface InputLabelProps extends BaseFieldProps {
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  placeholder?: string;
  disabled?: boolean;
}

export function InputLabel({
  name,
  label,
  value,
  smallLabel,
  description,
  className,
  required = false,
  type = 'text',
  placeholder,
  disabled,
  onChange,
  error,
}: InputLabelProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <FormLabel className='flex gap-1 items-center' htmlFor={name}>
          {label}
          {smallLabel && (
            <span className='text-small text-muted-foreground leading-none'>
              {smallLabel}
            </span>
          )}
          {required && <span className='text-destructive'>*</span>}
        </FormLabel>
      )}

      <Input
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        isError={!!error}
      />

      {description && <FormDescription>{description}</FormDescription>}
      {error && <FormMessage>{error}</FormMessage>}
    </div>
  );
}
