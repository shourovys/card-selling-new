import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import Select, {
  components,
  DropdownIndicatorProps,
  GroupBase,
  Props as SelectProps,
  StylesConfig,
  Theme,
} from 'react-select';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
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

export interface SelectFieldProps<T extends FieldValues>
  extends BaseFieldProps<T>,
    Omit<
      SelectProps<SelectOption, false, GroupBase<SelectOption>>,
      'name' | 'form' | 'value' | 'onChange'
    > {
  options: SelectOption[];
  disabled?: boolean;
  placeholder?: string;
  isClearable?: boolean;
  isSearchable?: boolean;
  menuPlacement?: 'auto' | 'bottom' | 'top';
}

const DropdownIndicator = (
  props: DropdownIndicatorProps<SelectOption, false, GroupBase<SelectOption>>
) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronsUpDown className='w-4 h-4 opacity-50' />
    </components.DropdownIndicator>
  );
};

export function SelectField<T extends FieldValues>({
  name,
  form,
  label,
  smallLabel,
  description,
  className,
  required = false,
  options,
  disabled = false,
  placeholder = 'Select an option',
  isClearable = false,
  isSearchable = true,
  menuPlacement = 'auto',
  ...props
}: SelectFieldProps<T>) {
  const hasError = !!form.formState.errors[name];

  const selectStyles: StylesConfig<SelectOption, false> = React.useMemo(
    () => ({
      control: (base, state) => ({
        ...base,
        minHeight: '40px',
        backgroundColor: 'hsl(var(--background))',
        border: hasError
          ? '1px solid hsl(var(--destructive))'
          : '1px solid hsl(var(--input-border))',
        borderRadius: 'var(--radius)',
        boxShadow: 'none',
        transition: 'all 150ms ease',
        '&:hover': {
          borderColor: hasError
            ? 'hsl(var(--destructive))'
            : 'hsl(var(--input-border-hover))',
        },
        '&:focus-within': {
          outline: 'none',
          // borderColor: 'hsl(var(--ring))',
          boxShadow: hasError
            ? '0 0 0 2px hsl(var(--destructive))'
            : '0 0 0 2px hsl(var(--ring))',
        },
        ...(state.isDisabled && {
          opacity: 0.5,
          cursor: 'not-allowed',
          backgroundColor: 'hsl(var(--muted))',
        }),
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: 'hsl(var(--background))',
        border: '1px solid hsl(var(--border))',
        boxShadow: 'var(--shadow)',
        zIndex: 50,
      }),
      menuList: (base) => ({
        ...base,
        padding: '6px',
      }),
      option: (base, state) => ({
        ...base,
        padding: '8px 14px',
        borderRadius: 'var(--radius)',
        backgroundColor: state.isSelected
          ? 'hsl(var(--secondary))'
          : state.isFocused
          ? 'hsl(var(--accent))'
          : 'transparent',
        color: state.isSelected
          ? 'hsl(var(--secondary-foreground))'
          : 'hsl(var(--foreground))',
        cursor: state.isDisabled ? 'default' : 'pointer',
        fontSize: '14px',
        fontWeight: state.isSelected ? '500' : '400',
        opacity: state.isDisabled ? 0.5 : 1,
        '&:hover': {
          backgroundColor: state.isSelected
            ? 'hsl(var(--secondary))'
            : 'hsl(var(--primary))',
        },
        '&:active': {
          backgroundColor: 'hsl(var(--primary))',
        },
      }),
      singleValue: (base) => ({
        ...base,
        color: 'hsl(var(--foreground))',
        fontSize: '14px',
      }),
      input: (base) => ({
        ...base,
        color: 'hsl(var(--foreground))',
        fontSize: '14px',
        margin: '0',
        padding: '0',
      }),
      placeholder: (base) => ({
        ...base,
        color: 'hsl(var(--muted-foreground))',
        fontSize: '14px',
      }),
      valueContainer: (base) => ({
        ...base,
        padding: '2px 12px',
      }),
      indicatorsContainer: (base) => ({
        ...base,
        padding: '2px 8px',
      }),
      indicatorSeparator: () => ({
        display: 'none',
      }),
      clearIndicator: (base) => ({
        ...base,
        padding: '4px',
        color: 'hsl(var(--muted-foreground))',
        cursor: 'pointer',
        '&:hover': {
          color: 'hsl(var(--foreground))',
        },
      }),
    }),
    [hasError]
  );

  const customTheme = (theme: Theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: 'hsl(var(--primary))',
      primary75: 'hsl(var(--primary))',
      primary50: 'hsl(var(--primary))',
      primary25: 'hsl(var(--primary))',
    },
    spacing: {
      ...theme.spacing,
      controlHeight: 40,
      baseUnit: 4,
    },
    borderRadius: 6,
  });

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
                <span className='text-small text-muted-foreground'>
                  {smallLabel}
                </span>
              )}
              {required && <span className='text-destructive'>*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Select<SelectOption>
              {...field}
              {...props}
              options={options}
              isDisabled={disabled}
              placeholder={placeholder}
              isClearable={isClearable}
              isSearchable={isSearchable}
              menuPlacement={menuPlacement}
              value={
                options.find((option) => option.value === field.value) || null
              }
              onChange={(newValue) => field.onChange(newValue?.value)}
              components={{ DropdownIndicator }}
              styles={selectStyles}
              classNames={{
                control: () => 'select-field-control',
                menu: () => 'select-field-menu',
                option: () => 'select-field-option',
              }}
              theme={customTheme}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
