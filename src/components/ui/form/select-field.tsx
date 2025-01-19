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
  maxMenuHeight?: number;
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
  maxMenuHeight = 200,
  ...props
}: SelectFieldProps<T>) {
  const hasError = !!form.formState.errors[name];
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
        zIndex: 9999,
      }),
      menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
      }),
      menuList: (base) => ({
        ...base,
        maxHeight: maxMenuHeight,
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
                <span className='text-small text-muted-foreground leading-none'>
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
              maxMenuHeight={maxMenuHeight}
              menuPortalTarget={portalTarget}
              menuPosition='fixed'
              closeMenuOnScroll={false}
              captureMenuScroll={false}
              blurInputOnSelect={true}
              value={
                options.find((option) => option.value === field.value) || null
              }
              onChange={(newValue) => field.onChange(newValue?.value)}
              components={{ DropdownIndicator }}
              styles={selectStyles}
              classNames={{
                control: () => 'select__control',
                menu: () => 'select__menu',
                menuList: () => 'select__menu-list',
                option: () => 'select__option',
              }}
              classNamePrefix='select'
              theme={customTheme}
              aria-label={label}
              aria-invalid={hasError}
              aria-errormessage={hasError ? `${name}-error` : undefined}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage id={`${name}-error`} />
        </FormItem>
      )}
    />
  );
}
