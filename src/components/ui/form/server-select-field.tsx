import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { debounce } from 'lodash';
import { ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import {
  type FieldValues,
  type Path,
  type UseFormReturn,
} from 'react-hook-form';
import Select, {
  type DropdownIndicatorProps,
  type InputActionMeta,
  type StylesConfig,
  type Theme,
  components,
} from 'react-select';

export interface ServerSelectOption {
  label: string;
  value: string;
}

type BaseFieldProps<T extends FieldValues> = {
  name: Path<T>;
  form: UseFormReturn<T>;
  label?: string;
  description?: string;
  required?: boolean;
};

interface ServerSelectFieldProps<T extends FieldValues>
  extends BaseFieldProps<T> {
  placeholder?: string;
  disabled?: boolean;
  loadingMessage?: string;
  noOptionsMessage?: string;
  isClearable?: boolean;
  menuPlacement?: 'auto' | 'bottom' | 'top';
  minCharacters?: number;
  debounceTimeout?: number;
  onInputChange?: (value: string, actionMeta: InputActionMeta) => void;
  fetchOptions: (params: { search: string }) => Promise<ServerSelectOption[]>;
}

const DropdownIndicator = (
  props: DropdownIndicatorProps<ServerSelectOption, false>
) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronsUpDown className='w-4 h-4 opacity-50' />
    </components.DropdownIndicator>
  );
};

const selectStyles: StylesConfig<ServerSelectOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: '40px',
    backgroundColor: state.isDisabled
      ? 'hsl(var(--muted))'
      : 'hsl(var(--background))',
    border: state.isFocused
      ? '1px solid hsl(var(--ring))'
      : '1px solid hsl(var(--input-border))',
    borderRadius: 'var(--radius)',
    boxShadow: state.isFocused ? '0 0 0 1px hsl(var(--ring))' : 'none',
    '&:hover': {
      borderColor: state.isFocused
        ? 'hsl(var(--ring))'
        : 'hsl(var(--input-border-hover))',
    },
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'hsl(var(--background))',
    border: '1px solid hsl(var(--border))',
    boxShadow: 'var(--shadow)',
    borderRadius: 'var(--radius)',
    marginTop: '8px',
    zIndex: 50,
  }),
  option: (base, state) => ({
    ...base,
    padding: '8px 16px',
    backgroundColor: state.isSelected
      ? 'hsl(var(--accent))'
      : state.isFocused
      ? 'hsl(var(--accent))'
      : 'transparent',
    color: state.isSelected
      ? 'hsl(var(--accent-foreground))'
      : 'hsl(var(--foreground))',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'hsl(var(--accent))',
    },
  }),
  input: (base) => ({
    ...base,
    color: 'hsl(var(--foreground))',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'hsl(var(--foreground))',
  }),
  placeholder: (base) => ({
    ...base,
    color: 'hsl(var(--muted-foreground))',
  }),
  loadingMessage: (base) => ({
    ...base,
    color: 'hsl(var(--muted-foreground))',
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: 'hsl(var(--muted-foreground))',
  }),
};

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

export function ServerSelectField<T extends FieldValues>({
  name,
  form,
  label,
  description,
  required = false,
  placeholder = 'Type to search...',
  disabled = false,
  loadingMessage = 'Loading...',
  noOptionsMessage = 'No options found',
  isClearable = false,
  menuPlacement = 'auto',
  minCharacters = 3,
  debounceTimeout = 300,
  onInputChange,
  fetchOptions,
}: ServerSelectFieldProps<T>) {
  const [items, setItems] = React.useState<ServerSelectOption[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleNoOptionsMessage = React.useCallback(
    ({ inputValue }: { inputValue: string }): React.ReactNode => {
      if (!inputValue) {
        return 'Type to search...';
      }
      if (inputValue.length < minCharacters) {
        return `Please enter at least ${minCharacters} characters to search`;
      }
      return noOptionsMessage;
    },
    [minCharacters, noOptionsMessage]
  );

  const handleLoadingMessage = React.useCallback(
    (): React.ReactNode => loadingMessage,
    [loadingMessage]
  );

  const handleSearch = React.useCallback(
    async (search: string) => {
      if (search.length < minCharacters) {
        setItems([]);
        return;
      }

      setLoading(true);
      try {
        const result = await fetchOptions({ search });
        setItems(result);
      } catch (error) {
        console.error('Error fetching options:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [fetchOptions, minCharacters]
  );

  const debouncedSearch = React.useMemo(
    () => debounce(handleSearch, debounceTimeout),
    [handleSearch, debounceTimeout]
  );

  const handleInputChange = React.useCallback(
    (value: string, actionMeta: InputActionMeta) => {
      if (onInputChange) {
        onInputChange(value, actionMeta);
      }
      debouncedSearch(value);
    },
    [onInputChange, debouncedSearch]
  );

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel className='flex gap-1 items-center'>
              {label}
              {required && <span className='text-destructive'>*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Select<ServerSelectOption, false>
              {...field}
              options={items}
              isDisabled={disabled}
              isLoading={loading}
              placeholder={placeholder}
              isClearable={isClearable}
              menuPlacement={menuPlacement}
              noOptionsMessage={handleNoOptionsMessage}
              loadingMessage={handleLoadingMessage}
              value={field.value}
              onChange={(newValue) => field.onChange(newValue ?? null)}
              onInputChange={handleInputChange}
              components={{
                DropdownIndicator,
              }}
              styles={selectStyles}
              theme={customTheme}
              backspaceRemovesValue={true}
              blurInputOnSelect={true}
            />
          </FormControl>
          {description && (
            <p className='text-sm text-muted-foreground'>{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
