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

export interface MultiSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

type BaseFieldProps<T extends FieldValues> = {
  name: Path<T>;
  form: UseFormReturn<T>;
  label?: string;
  description?: string;
  required?: boolean;
};

interface MultiSelectFieldProps<T extends FieldValues>
  extends BaseFieldProps<T> {
  options: MultiSelectOption[];
  disabled?: boolean;
  error?: string;
}

export function MultiSelectField<T extends FieldValues>({
  name,
  form,
  label,
  description,
  required = false,
  options,
  disabled = false,
  error: customError,
}: MultiSelectFieldProps<T>) {
  const [availableSearch, setAvailableSearch] = React.useState('');
  const [selectedSearch, setSelectedSearch] = React.useState('');
  const [selectedAvailable, setSelectedAvailable] = React.useState<string[]>(
    []
  );
  const [selectedChosen, setSelectedChosen] = React.useState<string[]>([]);

  const formError = form.formState.errors[name];
  const error = customError || (formError?.message as string);
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
    const isSelected = selectedList.includes(item.value);
    setSelectedList(
      isSelected
        ? selectedList.filter((id) => id !== item.value)
        : [...selectedList, item.value]
    );
  };

  const handleTransfer = (direction: 'right' | 'left') => {
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
      <div className='space-y-[1px]'>
        {items.map((item) => (
          <div
            key={item.value}
            onClick={() => !disabled && !item.disabled && onSelect(item)}
            className={cn(
              'px-4 py-3 text-sm transition-colors border-b border-border',
              selectedIds.includes(item.value)
                ? 'bg-secondary/20 font-medium'
                : 'hover:bg-muted/50',
              disabled || item.disabled
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer'
            )}
          >
            {item.label}
          </div>
        ))}
        {items.length === 0 && (
          <div className='px-4 py-6 text-sm text-center text-muted-foreground'>
            No items found
          </div>
        )}
      </div>
    </ScrollArea>
  );

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          {label && (
            <FormLabel className='flex gap-1 items-center'>
              {label}
              {required && <span className='text-destructive'>*</span>}
            </FormLabel>
          )}
          <div className='space-y-4'>
            <div className='flex gap-4 rounded-lg'>
              {/* Available Items */}
              <div className='flex-1 space-y-3 rounded-lg border border-input'>
                <div className='px-4 py-3 text-sm font-medium border-b border-input text-muted-foreground'>
                  Available
                </div>
                <div className='relative px-4'>
                  <Search className='absolute left-7 top-2.5 h-4 w-4 text-muted-foreground' />
                  <Input
                    placeholder='Search...'
                    value={availableSearch}
                    onChange={(e) => setAvailableSearch(e.target.value)}
                    disabled={disabled}
                    className={cn(
                      'pl-9 h-9 rounded-full',
                      error && 'border-destructive'
                    )}
                  />
                </div>
                {renderList(filteredAvailable, selectedAvailable, (item) =>
                  handleItemClick(item, selectedAvailable, setSelectedAvailable)
                )}
              </div>

              {/* Transfer Buttons */}
              <div className='flex flex-col gap-2 justify-center'>
                <Button
                  size='icon'
                  onClick={() => handleTransfer('right')}
                  disabled={disabled || selectedAvailable.length === 0}
                  className='w-9 h-9 rounded-lg shrink-0'
                >
                  <ArrowRight className='w-4 h-4' />
                </Button>
                <Button
                  size='icon'
                  variant='destructive'
                  onClick={() => handleTransfer('left')}
                  disabled={disabled || selectedChosen.length === 0}
                  className='w-9 h-9 rounded-lg shrink-0'
                >
                  <ArrowLeft className='w-4 h-4' />
                </Button>
              </div>

              {/* Selected Items */}
              <div className='flex-1 space-y-3 rounded-lg border border-input'>
                <div className='px-4 py-3 text-sm font-medium border-b border-input text-muted-foreground'>
                  Selected
                </div>
                <div className='relative px-4'>
                  <Search className='absolute left-7 top-2.5 h-4 w-4 text-muted-foreground' />
                  <Input
                    placeholder='Search...'
                    value={selectedSearch}
                    onChange={(e) => setSelectedSearch(e.target.value)}
                    disabled={disabled}
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
          {error && <FormMessage>{error}</FormMessage>}
        </FormItem>
      )}
    />
  );
}
