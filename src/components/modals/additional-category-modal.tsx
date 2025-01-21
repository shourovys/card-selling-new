import { additionalCategoryApi } from '@/api/additional-category';
import BACKEND_ENDPOINTS from '@/api/urls';
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
import { MultiSelectField } from '@/components/ui/form/multi-select-field';
import { RadioGroupField } from '@/components/ui/form/radio-group-field';
import { ServerSelectField } from '@/components/ui/form/server-select-field';
import {
  IAdditionalCategory,
  IAdditionalCategoryFormValues,
  additionalCategoryFormSchema,
} from '@/lib/validations/additional-category';
import { Category } from '@/lib/validations/category';
import { IApiResponse } from '@/types/common';
import {
  IAdditionalCategoryPayload,
  IAdditionalCategoryResponse,
} from '@/types/features/additional-category';
import fileToBase64 from '@/utils/fileToBase64';
import { getMetaInfo } from '@/utils/getMetaInfo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

interface AdditionalCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: IAdditionalCategoryPayload) => Promise<void>;
  mode: 'add' | 'edit' | 'view';
  category?: IAdditionalCategory;
  categories?: Category[];
  isSubmitting: boolean;
}

const getInitialValues = (
  mode: 'add' | 'edit' | 'view',
  category?: IAdditionalCategory
): IAdditionalCategoryFormValues => {
  if (mode === 'add') {
    return {
      name: '',
      description: '',
      position: null,
      status: 'active',
      icon: null,
      categoryIds: [],
    };
  }

  return {
    name: category?.name || '',
    description: category?.description || '',
    position: null,
    status: category?.status ? 'active' : 'inactive',
    icon: category?.icon || null,
    categoryIds: category?.categoryIds.map((id) => id.toString()) || [],
  };
};

export function AdditionalCategoryModal({
  open,
  onClose,
  onSubmit,
  mode = 'add',
  category,
  categories = [],
  isSubmitting,
}: AdditionalCategoryModalProps) {
  const isViewMode = mode === 'view';
  const modalTitle = {
    add: 'Add Additional Category',
    edit: 'Edit Additional Category',
    view: 'View Additional Category',
  }[mode];

  const form = useForm({
    resolver: zodResolver(additionalCategoryFormSchema),
    defaultValues: getInitialValues(mode, category),
  });

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (open) {
      form.reset(getInitialValues(mode, category));
    }
  }, [open, mode, category, form]);

  const { isLoading: isLoadingPreviousCategory } = useSWR<
    IApiResponse<IAdditionalCategoryResponse>
  >(
    category?.position
      ? BACKEND_ENDPOINTS.ADDITIONAL_CATEGORY.MAPPING.GET_BY_POSITION(
          String(category?.position - 1)
        )
      : null,
    {
      onSuccess: (data) => {
        const previousCategory =
          data.data.additionalCategoriesData.additionalCategories[0];
        form.setValue('position', {
          value: previousCategory.id.toString(),
          label: previousCategory.name,
        });
      },
    }
  );

  const handleSubmit = async (values: IAdditionalCategoryFormValues) => {
    if (isViewMode) return;

    try {
      const payload: IAdditionalCategoryPayload = {
        metaInfo: getMetaInfo(),
        attribute: {
          name: values.name.trim(),
          description: values.description?.trim(),
          status: values.status === 'active',
          position: null,
          icon: null,
          categoryIds: values.categoryIds || [],
        },
      };

      // Handle position based on display order selection
      if (values.position) {
        const response = await additionalCategoryApi.getByPosition(
          values.position.value
        );
        const selectedCategory =
          response.data.additionalCategoriesData.additionalCategories[0];
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

      // Handle category mappings in edit mode
      if (mode === 'edit' && category) {
        const existingCategoryIds = category.categoryIds || [];
        const newCategoryIds = values.categoryIds || [];

        // Find categories to remove and add
        const removedCategoryIds = existingCategoryIds.filter(
          (id) => !newCategoryIds.includes(id)
        );
        const addedCategoryIds = newCategoryIds.filter(
          (id) => !existingCategoryIds.includes(id)
        );

        // Delete removed mappings
        if (removedCategoryIds.length > 0) {
          await additionalCategoryApi.deleteMapping(
            category.id,
            removedCategoryIds.map(Number)
          );
        }

        // Add new mappings
        if (addedCategoryIds.length > 0) {
          await additionalCategoryApi.updateMapping(
            category.id,
            addedCategoryIds
          );
        }
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

  const loadOptions = async ({ search }: { search: string }) => {
    const response = await additionalCategoryApi.getAll(`name=${search}`);
    return response.data.additionalCategoriesData.additionalCategories.map(
      (item) => ({
        value: item.id.toString(),
        label: item.name,
      })
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-[800px] p-0'>
        <DialogHeader className='px-8 py-6 border-b'>
          <DialogTitle className='text-lg font-medium'>
            {modalTitle}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className='px-8 py-4 pb-8 max-h-[calc(100vh-200px)] overflow-y-auto'>
              <div className='grid grid-cols-1 gap-10 md:grid-cols-2'>
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

                  <ServerSelectField
                    name='position'
                    form={form}
                    label='Display Order'
                    smallLabel='(Select previous category)'
                    loadOptions={loadOptions}
                    disabled={isViewMode || isLoadingPreviousCategory}
                    minCharacters={3}
                    debounceTimeout={300}
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
                    onChange={(file) => {
                      form.setValue('icon', file);
                      form.trigger('icon');
                    }}
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

                {/* Categories Multi-Select */}
                <div className='col-span-2'>
                  <MultiSelectField
                    name='categoryIds'
                    form={form}
                    label='Select Categories'
                    options={categories.map((cat) => ({
                      value: cat.id.toString(),
                      label: cat.name,
                    }))}
                    required
                    disabled={isViewMode}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className='gap-2 px-8 py-6 border-t'>
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
