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
import { Category } from '@/lib/validations/category';
import {
  IProductPayload,
  Product,
  ProductFormValues,
  productFormSchema,
} from '@/lib/validations/product';
import fileToBase64 from '@/utils/fileToBase64';
import { getMetaInfo } from '@/utils/getMetaInfo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: IProductPayload) => Promise<void>;
  mode: 'add' | 'edit' | 'view';
  product?: Product;
  categories: Category[];
  isSubmitting: boolean;
}

const getInitialValues = (
  mode: 'add' | 'edit' | 'view',
  product?: Product
): ProductFormValues => {
  if (mode === 'add') {
    return {
      name: '',
      description: '',
      status: 'active',
      image: null,
      categoryId: '',
    };
  }

  return {
    name: product?.name || '',
    description: product?.description || '',
    status: product?.status ? 'active' : 'inactive',
    image: product?.image || null,
    categoryId: product?.category?.id?.toString() || '',
  };
};

export function ProductModal({
  open,
  onClose,
  onSubmit,
  mode = 'add',
  product,
  categories,
  isSubmitting,
}: ProductModalProps) {
  const isViewMode = mode === 'view';
  const modalTitle = {
    add: 'Add New Product',
    edit: 'Edit Product',
    view: 'View Product',
  }[mode];

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: getInitialValues(mode, product),
  });

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (open) {
      form.reset(getInitialValues(mode, product));
    }
  }, [open, mode, product, form]);

  const handleSubmit = async (values: ProductFormValues) => {
    if (isViewMode) return;

    try {
      const payload: IProductPayload = {
        metaInfo: getMetaInfo(),
        attribute: {
          name: values.name.trim(),
          description: values.description?.trim() || null,
          status: values.status === 'active',
          categoryId: Number(values.categoryId),
          image: null,
        },
      };

      // Convert image to base64 if it exists and is a File object
      if (values.image && values.image.type?.startsWith('image/')) {
        const imageBase64 = await fileToBase64(values.image);
        payload.attribute.image = imageBase64;
      }

      await onSubmit(payload);
      onClose();
      form.reset();
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  // Don't render if product is not loaded in edit/view mode
  if ((mode === 'edit' || mode === 'view') && !product) return null;

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
                    label='Product Name'
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
                    name='categoryId'
                    form={form}
                    label='Category'
                    options={categories.map((cat) => ({
                      label: cat.name,
                      value: cat.id.toString(),
                    }))}
                    disabled={isViewMode}
                    required
                  />
                </div>

                {/* Right Column */}
                <div className='space-y-6'>
                  <FileUploadField
                    name='image'
                    form={form}
                    label='Product Image'
                    value={form.watch('image')}
                    onChange={(file) => form.setValue('image', file)}
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
