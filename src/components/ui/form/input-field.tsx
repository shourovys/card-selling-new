import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import * as React from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Textarea } from '../textarea';

type BaseFieldProps<T extends FieldValues> = {
  name: Path<T>;
  form: UseFormReturn<T>;
  label?: string;
  smallLabel?: string;
  description?: string;
  className?: string;
  required?: boolean;
};

interface InputFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  placeholder?: string;
  disabled?: boolean;
}

export function InputField<T extends FieldValues>({
  name,
  form,
  label,
  smallLabel,
  description,
  className,
  required = false,
  multiline = false,
  rows = 1,
  maxLength,
  type = 'text',
  placeholder,
  disabled,
}: InputFieldProps<T>) {
  const [charCount, setCharCount] = React.useState(0);
  const showWordCount = multiline && rows > 1 && maxLength;
  const value = form.watch(name);

  React.useEffect(() => {
    if (typeof value === 'string') {
      setCharCount(value.length);
    }
  }, [value]);

  const error = form.formState.errors[name];
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
          <FormControl>
            {multiline ? (
              <Textarea
                className={className}
                rows={rows}
                maxLength={maxLength}
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                  setCharCount(e.target.value.length);
                }}
              />
            ) : (
              <Input
                className={className}
                type={type}
                maxLength={maxLength}
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                  setCharCount(e.target.value.length);
                }}
                isError={!!error?.message}
              />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
          {showWordCount && (
            <div className='text-right text-xxsmall text-muted-foreground'>
              {charCount} / {maxLength}
            </div>
          )}
        </FormItem>
      )}
    />
  );
}
