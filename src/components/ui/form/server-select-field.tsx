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

  // Add wheel event handler for manual scrolling
  React.useEffect(() => {
    let isScrolling = false;
    let animationFrameId: number;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const handleWheel = (e: WheelEvent) => {
      const menuList = document.querySelector('.select__menu-list');
      if (!menuList || !(e.target as HTMLElement).closest('.select__menu-list'))
        return;

      e.preventDefault();
      if (isScrolling) {
        cancelAnimationFrame(animationFrameId);
      }

      const scrollSpeed = 0.8;
      const duration = 300; // ms
      const startTime = performance.now();
      const startScroll = menuList.scrollTop;
      const targetDelta = e.deltaY * scrollSpeed;
      const targetScroll = Math.max(
        0,
        Math.min(
          startScroll + targetDelta,
          menuList.scrollHeight - menuList.clientHeight
        )
      );

      const scroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeOutCubic(progress);

        menuList.scrollTop =
          startScroll + (targetScroll - startScroll) * easeProgress;

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(scroll);
          isScrolling = true;
        } else {
          isScrolling = false;
        }
      };

      animationFrameId = requestAnimationFrame(scroll);
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      document.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(animationFrameId);
    };
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
              {required && <span className='text-destructive'>*</span>}
              {smallLabel && (
                <span className='text-small text-muted-foreground leading-none'>
                  {smallLabel}
                </span>
              )}
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
              classNames={{
                control: () => 'select__control',
                menu: () => 'select__menu',
                menuList: () => 'select__menu-list',
                option: () => 'select__option',
              }}
              classNamePrefix='select'
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
