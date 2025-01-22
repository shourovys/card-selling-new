import EmptyContent from '@/components/common/EmptyContent';
import { Button } from '@/components/ui/button';
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import * as React from 'react';
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
import { Separator } from '../separator';

export interface MultiSelectOption {
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

interface MultiSelectFieldProps<T extends FieldValues>
  extends BaseFieldProps<T> {
  options: MultiSelectOption[];
  disabled?: boolean;
}

export function MultiSelectField<T extends FieldValues>({
  name,
  form,
  label,
  smallLabel,
  description,
  className,
  required = false,
  options,
  disabled = false,
}: MultiSelectFieldProps<T>) {
  const [availableSearch, setAvailableSearch] = React.useState('');
  const [selectedSearch, setSelectedSearch] = React.useState('');
  const [selectedAvailable, setSelectedAvailable] = React.useState<string[]>(
    []
  );
  const [selectedChosen, setSelectedChosen] = React.useState<string[]>([]);

  const error = form.formState.errors[name];
  const selectedValues = (form.watch(name) || []) as string[];

  const selectedItems = React.useMemo(() => {
    return options.filter((option) => selectedValues.includes(option.value));
  }, [options, selectedValues]);

  const availableItems = React.useMemo(() => {
    return options.filter((option) => !selectedValues.includes(option.value));
  }, [options, selectedValues]);

  const filteredAvailable = React.useMemo(() => {
    return availableItems.filter((item) =>
      item.label.toLowerCase().includes(availableSearch.toLowerCase())
    );
  }, [availableItems, availableSearch]);

  const filteredSelected = React.useMemo(() => {
    return selectedItems.filter((item) =>
      item.label.toLowerCase().includes(selectedSearch.toLowerCase())
    );
  }, [selectedItems, selectedSearch]);

  const handleItemClick = (
    item: MultiSelectOption,
    selectedList: string[],
    setSelectedList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (disabled) return;
    const isSelected = selectedList.includes(item.value);
    setSelectedList(
      isSelected
        ? selectedList.filter((id) => id !== item.value)
        : [...selectedList, item.value]
    );
  };

  const handleTransfer = (direction: 'right' | 'left') => {
    if (disabled) return;
    if (direction === 'right') {
      const itemsToTransfer = availableItems.filter((item) =>
        selectedAvailable.includes(item.value)
      );
      const newValues = [
        ...selectedValues,
        ...itemsToTransfer.map((item) => item.value),
      ] as PathValue<T, Path<T>>;
      form.setValue(name, newValues, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setSelectedAvailable([]);
    } else {
      const newValues = selectedValues.filter(
        (value) => !selectedChosen.includes(value)
      );
      form.setValue(name, newValues as PathValue<T, Path<T>>, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setSelectedChosen([]);
    }
  };

  const renderList = (
    items: MultiSelectOption[],
    selectedIds: string[],
    onSelect: (item: MultiSelectOption) => void
  ) => (
    <ScrollArea className='h-[200px] px-4 w-full rounded-md'>
      <div className=''>
        {items.map((item) => (
          <div key={item.value.toString()}>
            <div
              onClick={() => !item.disabled && onSelect(item)}
              className={cn(
                'px-3 py-3 text-sm transition-colors rounded-md',
                selectedIds.includes(item.value)
                  ? !disabled && 'bg-secondary/20 font-medium'
                  : !disabled && 'hover:bg-accent',
                item.disabled
                  ? 'cursor-not-allowed opacity-50'
                  : disabled
                  ? 'cursor-default text-input-disabled-text'
                  : 'cursor-pointer'
              )}
            >
              {item.label}
            </div>
            <Separator className='h-[0.5px]' />
          </div>
        ))}
        {items.length === 0 && (
          <EmptyContent title='No items found' imageClassName='w-32' />
        )}
      </div>
    </ScrollArea>
  );

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
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
          <div className='space-y-4'>
            <div className='flex gap-4'>
              {/* Available Items */}
              {!disabled && (
                <div
                  className={cn(
                    'flex-1 space-y-3 rounded-md border transition-colors',
                    error
                      ? 'border-destructive focus-within:ring-destructive'
                      : 'border-input focus-within:ring-ring ',
                    disabled
                      ? 'bg-input-disabled-background '
                      : 'hover:border-input-borderHover'
                  )}
                >
                  <div className='px-4 py-3 text-sm font-medium border-b border-input text-muted-foreground'>
                    Available
                  </div>
                  <div className='relative px-4'>
                    <Search
                      className={cn(
                        'absolute left-7 top-2.5 h-4 w-4',
                        disabled
                          ? 'text-input-disabled-text'
                          : 'text-muted-foreground'
                      )}
                    />
                    <Input
                      placeholder='Search...'
                      value={availableSearch}
                      onChange={(e) => setAvailableSearch(e.target.value)}
                      className={cn(
                        'pl-9 h-9 rounded-full'
                        // error && 'border-destructive',
                        // disabled &&
                        //   'bg-transparent border-transparent focus-visible:ring-0'
                      )}
                    />
                  </div>
                  {renderList(filteredAvailable, selectedAvailable, (item) =>
                    handleItemClick(
                      item,
                      selectedAvailable,
                      setSelectedAvailable
                    )
                  )}
                </div>
              )}

              {/* Transfer Buttons */}
              {!disabled && (
                <div className='flex flex-col gap-2 justify-center'>
                  <Button
                    size='icon'
                    onClick={() => handleTransfer('right')}
                    disabled={selectedAvailable.length === 0}
                    className='w-9 h-9 rounded-md shrink-0'
                  >
                    <ArrowRight className='w-4 h-4' />
                  </Button>
                  <Button
                    size='icon'
                    variant='destructive'
                    onClick={() => handleTransfer('left')}
                    disabled={selectedChosen.length === 0}
                    className='w-9 h-9 rounded-md shrink-0'
                  >
                    <ArrowLeft className='w-4 h-4' />
                  </Button>
                </div>
              )}

              {/* Selected Items */}
              <div
                className={cn(
                  'flex-1 space-y-3 rounded-md border transition-colors',
                  error
                    ? 'border-destructive focus-within:ring-destructive'
                    : 'border-input focus-within:ring-ring',
                  disabled
                    ? 'bg-input-disabled-background'
                    : 'hover:border-input-borderHover'
                )}
              >
                <div className='px-4 py-3 text-sm font-medium border-b border-input text-muted-foreground'>
                  Selected
                </div>
                <div className='relative px-4'>
                  <Search
                    className={cn(
                      'absolute left-7 top-2.5 h-4 w-4',
                      disabled
                        ? 'text-input-disabled-text'
                        : 'text-muted-foreground'
                    )}
                  />
                  <Input
                    placeholder='Search...'
                    value={selectedSearch}
                    onChange={(e) => setSelectedSearch(e.target.value)}
                    className={cn(
                      'pl-9 h-9 rounded-full',
                      error && 'border-destructive'
                    )}
                  />
                </div>
                {renderList(filteredSelected, selectedChosen, (item) =>
                  handleItemClick(item, selectedChosen, setSelectedChosen)
                )}
              </div>
            </div>
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          {error && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
