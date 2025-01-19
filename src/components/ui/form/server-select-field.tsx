import {
  FormControl,
  FormDescription,
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
  smallLabel?: string;
  disabled?: boolean;
  loadingMessage?: string;
  noOptionsMessage?: string;
  isClearable?: boolean;
  menuPlacement?: 'auto' | 'bottom' | 'top';
  minCharacters?: number;
  debounceTimeout?: number;
  onInputChange?: (value: string, actionMeta: InputActionMeta) => void;
  loadOptions: (params: { search: string }) => Promise<ServerSelectOption[]>;
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
    backgroundColor: 'hsl(var(--background))',
    border: '1px solid hsl(var(--input-border))',
    borderRadius: 'var(--radius)',
    boxShadow: 'none',
    transition: 'all 150ms ease',
    '&:hover': {
      borderColor: 'hsl(var(--input-border-hover))',
    },
    '&:focus-within': {
      outline: 'none',
      boxShadow: '0 0 0 2px hsl(var(--ring))',
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
    zIndex: 9999,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: '200px',
    minHeight: 35,
    overflowY: 'auto',
    paddingTop: 0,
    paddingBottom: 0,
    scrollBehavior: 'auto',
    pointerEvents: 'auto',
    '::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '::-webkit-scrollbar-track': {
      background: 'hsl(var(--muted))',
      borderRadius: '4px',
    },
    '::-webkit-scrollbar-thumb': {
      background: 'hsl(var(--muted-foreground))',
      borderRadius: '4px',
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: 'hsl(var(--foreground))',
    },
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
        : 'hsl(var(--accent))',
    },
    '&:active': {
      backgroundColor: 'hsl(var(--accent))',
    },
    userSelect: 'none',
  }),
  input: (base) => ({
    ...base,
    color: 'hsl(var(--foreground))',
    fontSize: '14px',
    margin: '0',
    padding: '0',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'hsl(var(--foreground))',
    fontSize: '14px',
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
  loadingMessage: (base) => ({
    ...base,
    color: 'hsl(var(--muted-foreground))',
    fontSize: '14px',
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: 'hsl(var(--muted-foreground))',
    fontSize: '14px',
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
  smallLabel,
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
  loadOptions,
}: ServerSelectFieldProps<T>) {
  const [items, setItems] = React.useState<ServerSelectOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [portalTarget, setPortalTarget] = React.useState<HTMLElement | null>(
    null
  );

  React.useEffect(() => {
    setPortalTarget(document.body);
  }, []);

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
        const result = await loadOptions({ search });
        setItems(result);
      } catch (error) {
        console.error('Error fetching options:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [loadOptions, minCharacters]
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
              {smallLabel && (
                <span className='leading-none text-small text-muted-foreground'>
                  {smallLabel}
                </span>
              )}
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
              menuPortalTarget={portalTarget}
              menuPosition='fixed'
              closeMenuOnScroll={false}
              captureMenuScroll={false}
              blurInputOnSelect={true}
              noOptionsMessage={handleNoOptionsMessage}
              loadingMessage={handleLoadingMessage}
              value={field.value}
              onChange={(newValue) => field.onChange(newValue ?? null)}
              onInputChange={handleInputChange}
              components={{ DropdownIndicator }}
              styles={selectStyles}
              theme={customTheme}
              classNames={{
                control: () => 'select__control',
                menu: () => 'select__menu',
                menuList: () => 'select__menu-list',
                option: () => 'select__option',
              }}
              classNamePrefix='select'
              aria-label={label}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
