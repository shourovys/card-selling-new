import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FileUploadField } from '@/components/ui/form/file-upload-field';
import { InputField } from '@/components/ui/form/input-field';
import { RadioGroupField } from '@/components/ui/form/radio-group-field';
import { SelectField } from '@/components/ui/form/select-field';
import { getMetaInfo } from '@/getMetaInfo';
import {
  Category,
  CategoryFormValues,
  categoryFormSchema,
} from '@/lib/validations/category';
import { ICategoryPayload } from '@/types/features/category';
import fileToBase64 from '@/utils/fileToBase64';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ICategoryPayload) => Promise<void>;
  mode: 'add' | 'edit' | 'view';
  category?: Category;
  categories?: Category[];
  isSubmitting: boolean;
}

// Find the category that comes before the current one
const findPreviousCategory = (
  category: Category | undefined,
  categories: Category[]
) => {
  if (!category || !categories.length) return '';

  let previousCategory = null;
  for (let i = 0; i < categories.length; i++) {
    if (categories[i].position < category.position) {
      previousCategory = categories[i];
    }
  }
  return previousCategory?.id.toString() || '';
};

const getInitialValues = (
  mode: 'add' | 'edit' | 'view',
  category?: Category,
  categories: Category[] = []
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
    position: findPreviousCategory(category, categories),
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
  isSubmitting,
}: CategoryModalProps) {
  const isViewMode = mode === 'view';
  const modalTitle = {
    add: 'Add New Category',
    edit: 'Edit Category',
    view: 'View Category',
  }[mode];

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: getInitialValues(mode, category, categories),
  });

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (open) {
      form.reset(getInitialValues(mode, category, categories));
    }
  }, [open, mode, category, categories, form]);

  const handleSubmit = async (values: CategoryFormValues) => {
    if (isViewMode) return;

    try {
      const payload: ICategoryPayload = {
        metaInfo: getMetaInfo(),
        attribute: {
          name: values.name,
          description: values.description,
          status: values.status === 'active',
          position: null,
          icon: null,
        },
      };

      // Handle position based on display order selection
      if (values.position) {
        const selectedCategory = categories.find(
          (cat) => cat.id === Number(values.position)
        );
        if (selectedCategory) {
          payload.attribute.position = selectedCategory.position + 1;
        }
      } else if (mode === 'edit' && category) {
        payload.attribute.position = category.position || null;
      }

      // Convert icon to base64 if it exists and is a File object
      if (values.icon && values.icon.type?.startsWith('image/')) {
        const iconBase64 = await fileToBase64(values.icon);
        payload.attribute.icon = iconBase64;
      }

      await onSubmit(payload);
      onClose();
      form.reset();
    } catch (error) {
      console.error('Error submitting category:', error);
    }
  };

  // Don't render if category is not loaded in edit/view mode
  if ((mode === 'edit' || mode === 'view') && !category) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-[800px] p-0'>
        <DialogHeader className='py-6 px-8 border-b'>
          <DialogTitle className='text-lg font-medium'>
            {modalTitle}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className='px-8 py-4 pb-8 max-h-[calc(100vh-200px)] overflow-y-auto'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Left Column */}
                <div className='space-y-6'>
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
                    rows={2}
                    disabled={isViewMode}
                  />

                  <SelectField
                    name='position'
                    form={form}
                    label='Display Order'
                    smallLabel='(Select previous category)'
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
                <div className='space-y-6'>
                  <FileUploadField
                    name='icon'
                    form={form}
                    label='Icon'
                    value={form.watch('icon')}
                    onChange={(file) => form.setValue('icon', file)}
                    preview
                    required={mode === 'add'}
                    disabled={isViewMode}
                    acceptedTypes={['image/jpeg', 'image/png']}
                    maxSize={1}
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
            </div>

            <DialogFooter className='py-6 px-8 border-t gap-2'>
              {isViewMode ? (
                <Button
                  type='button'
                  variant='outline'
                  onClick={onClose}
                  className='min-w-[120px] min-h-[36px]'
                >
                  Close
                </Button>
              ) : (
                <>
                  <Button type='button' variant='outline' onClick={onClose}>
                    {mode === 'add' ? 'Clear' : 'Cancel'}
                  </Button>
                  <Button
                    disabled={isSubmitting}
                    type='submit'
                    className='min-w-[120px] min-h-[36px] bg-primary hover:bg-primary/90'
                  >
                    {mode === 'add' ? 'Confirm' : 'Update'}
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
