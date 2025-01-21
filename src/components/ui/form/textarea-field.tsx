import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

interface TextareaFieldProps<T extends FieldValues> {
  name: Path<T>;
  form: UseFormReturn<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function TextareaField<T extends FieldValues>({
  name,
  form,
  label,
  placeholder,
  required,
  className,
}: TextareaFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className='text-destructive'> *</span>}
            </FormLabel>
          )}
          <FormControl>
            <Textarea
              {...field}
              placeholder={placeholder}
              className={cn('resize-none', className)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
