import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Button } from '../button';

export interface RadioOption {
  label: React.ReactNode;
  value: string;
  description?: string;
  disabled?: boolean;
  color?: 'error' | 'success' | 'warning' | 'default';
}

type BaseFieldProps<T extends FieldValues> = {
  name: Path<T>;
  form: UseFormReturn<T>;
  label?: string;
  smallLabel?: string;
  description?: string;
  className?: string;
  required?: boolean;
};

interface RadioGroupFieldProps<T extends FieldValues>
  extends BaseFieldProps<T> {
  options: RadioOption[];
  fullWidth?: boolean;
  disabled?: boolean;
}

export function RadioGroupField<T extends FieldValues>({
  name,
  form,
  label,
  smallLabel,
  description,
  className,
  required = false,
  options,
  fullWidth = true,
  disabled = false,
}: RadioGroupFieldProps<T>) {
  const error = form.formState.errors[name];

  const getButtonVariant = (option: RadioOption, value: string) => {
    const isSelected = value === option.value;
    if (!isSelected) return 'outline';

    switch (option.color) {
      case 'error':
        return 'destructive';
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className='flex gap-1 items-center'>
              {label}
              {smallLabel && (
                <span className='text-small text-muted-foreground leading-none'>
                  {smallLabel}
                </span>
              )}
              {required && <span className='text-destructive'>*</span>}
            </FormLabel>
          )}
          <div className='flex flex-wrap gap-2'>
            {options.map((option) => (
              <Button
                key={option.value}
                type='button'
                variant={getButtonVariant(option, field.value)}
                onClick={() => field.onChange(option.value)}
                disabled={disabled || option.disabled}
                className={cn(
                  'h-10 px-4 transition-colors',
                  fullWidth && 'flex-1',
                  error && 'border-destructive focus-visible:ring-destructive',
                  option.disabled && 'opacity-50',
                  !disabled &&
                    !option.disabled &&
                    field.value !== option.value &&
                    'hover:border-input-borderHover',
                  disabled && 'cursor-not-allowed',
                  field.value === option.value &&
                    !disabled &&
                    'hover:bg-secondary/90',
                  'focus-visible:ring-1 focus-visible:ring-offset-0',
                  disabled &&
                    field.value === option.value &&
                    'disabled:opacity-60',
                  disabled &&
                    field.value !== option.value &&
                    'bg-input-disabled-background disabled:opacity-100 disabled:text-input-disabled-text'
                )}
                aria-checked={field.value === option.value}
                role='radio'
              >
                {option.label}
              </Button>
            ))}
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
