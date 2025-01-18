import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FileUploadField } from '@/components/ui/form/file-upload-field';
import { InputField } from '@/components/ui/form/input-field';
import { RadioGroupField } from '@/components/ui/form/radio-group-field';
import { SelectField } from '@/components/ui/form/select-field';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Category,
  CategoryFormValues,
  categoryFormSchema,
} from '@/lib/validations/category';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  mode: 'add' | 'edit' | 'view';
  category?: Category;
  categories?: Category[];
}

const getInitialValues = (
  mode: 'add' | 'edit' | 'view',
  category?: Category
): CategoryFormValues => {
  if (mode === 'add') {
    return {
      name: '',
      description: '',
      position: '',
      status: 'active',
      icon: null,
    };
  }

  return {
    name: category?.name || '',
    description: category?.description || '',
    position: '',
    status: category?.status ? 'active' : 'inactive',
    icon: category?.icon || null,
  };
};

export function CategoryModal({
  open,
  onClose,
  onSubmit,
  mode = 'add',
  category,
  categories = [],
}: CategoryModalProps) {
  const isViewMode = mode === 'view';
  const modalTitle = {
    add: 'Add New Category',
    edit: 'Edit Category',
    view: 'View Category',
  }[mode];

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: getInitialValues(mode, category),
  });

  const handleSubmit = async (values: CategoryFormValues) => {
    if (isViewMode) return;

    try {
      await onSubmit(values);
      onClose();
      form.reset();
    } catch (error) {
      console.error('Error submitting category:', error);
    }
  };

  // Don't render if category is not loaded in edit/view mode
  if ((mode === 'edit' || mode === 'view') && !category) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className='w-full sm:max-w-xl'>
        <SheetHeader>
          <SheetTitle>{modalTitle}</SheetTitle>
          <SheetDescription>
            {mode === 'add'
              ? 'Add a new category to your catalog.'
              : mode === 'edit'
              ? 'Make changes to your category.'
              : 'View category details.'}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='py-6 space-y-6'
          >
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* Left Column */}
              <div className='space-y-4'>
                <InputField
                  name='name'
                  form={form}
                  label='Category Name'
                  required
                  disabled={isViewMode}
                />

                <InputField
                  name='description'
                  form={form}
                  label='Description'
                  multiline
                  rows={3}
                  disabled={isViewMode}
                />

                <SelectField
                  name='position'
                  form={form}
                  label='Display Order'
                  description={
                    mode === 'edit'
                      ? 'Leave empty to keep current position'
                      : undefined
                  }
                  options={categories
                    .filter((cat) => cat.id !== category?.id)
                    .map((cat) => ({
                      label: cat.name,
                      value: cat.id.toString(),
                    }))}
                  disabled={isViewMode}
                  isClearable
                  placeholder='Select previous category'
                />
              </div>

              {/* Right Column */}
              <div className='space-y-4'>
                <FileUploadField
                  name='icon'
                  form={form}
                  label='Icon'
                  value={form.watch('icon')}
                  onChange={(file) => form.setValue('icon', file)}
                  preview
                  required={mode === 'add'}
                  disabled={isViewMode}
                  className='h-[154px]'
                />

                <RadioGroupField
                  name='status'
                  form={form}
                  label='Status'
                  required
                  disabled={isViewMode}
                  options={[
                    { label: 'Active', value: 'active' },
                    {
                      label: 'Inactive',
                      value: 'inactive',
                      color: 'error',
                    },
                  ]}
                />
              </div>
            </div>

            <SheetFooter>
              {isViewMode ? (
                <Button
                  type='button'
                  variant='outline'
                  onClick={onClose}
                  className='min-w-[120px]'
                >
                  Close
                </Button>
              ) : (
                <>
                  <Button type='button' variant='outline' onClick={onClose}>
                    {mode === 'add' ? 'Clear' : 'Cancel'}
                  </Button>
                  <Button type='submit' className='min-w-[120px]'>
                    {mode === 'add' ? 'Confirm' : 'Update'}
                  </Button>
                </>
              )}
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
