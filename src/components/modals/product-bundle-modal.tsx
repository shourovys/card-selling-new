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
import {
  ServerSelectField,
  ServerSelectOption,
} from '@/components/ui/form/server-select-field';
import { getMetaInfo } from '@/getMetaInfo';
import {
  IProductBundlePayload,
  ProductBundle,
  ProductBundleFormValues,
  productBundleFormSchema,
} from '@/lib/validations/product-bundle';
import fileToBase64 from '@/utils/fileToBase64';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface ProductBundleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: IProductBundlePayload) => Promise<void>;
  mode: 'add' | 'edit' | 'view';
  bundle?: ProductBundle;
  isSubmitting: boolean;
  loadProducts: (params: { search: string }) => Promise<ServerSelectOption[]>;
  currencies: { id: number; name: string; exchangeRate: number }[];
  additionalCategories: { id: number; name: string }[];
}

const getInitialValues = (
  mode: 'add' | 'edit' | 'view',
  bundle?: ProductBundle
): ProductBundleFormValues => {
  if (mode === 'add') {
    return {
      name: '',
      description: '',
      status: 'active',
      image: null,
      facePrice: '',
      purchasePrice: '',
      salePrice: '',
      currency: '',
      gpType: 'percentage',
      gpValue: '',
      gpAmount: '',
      product: {
        value: '',
        label: '',
      },
      additionalCategoryId: '',
      inventoryProductId: '',
    };
  }

  return {
    name: bundle?.name || '',
    description: bundle?.description || '',
    status: bundle?.status ? 'active' : 'inactive',
    image: bundle?.image || null,
    facePrice: bundle?.facePrice?.toString() || '',
    purchasePrice: bundle?.purchasePrice?.toString() || '',
    salePrice: bundle?.salePrice?.toString() || '',
    currency: bundle?.currency || '',
    gpType: (bundle?.gpType as 'percentage' | 'fixed') || 'percentage',
    gpValue: bundle?.gpValue?.toString() || '',
    gpAmount: bundle?.gpAmount?.toString() || '',
    product: {
      value: bundle?.products?.id?.toString() || '',
      label: bundle?.products?.name || '',
    },
    additionalCategoryId: bundle?.additionalCategory?.id?.toString() || '',
    inventoryProductId: bundle?.inventoryProductId || '',
  };
};

export function ProductBundleModal({
  open,
  onClose,
  onSubmit,
  mode = 'add',
  bundle,
  isSubmitting,
  loadProducts,
  currencies,
  additionalCategories,
}: ProductBundleModalProps) {
  const isViewMode = mode === 'view';
  const modalTitle = {
    add: 'Add New Product Bundle',
    edit: 'Edit Product Bundle',
    view: 'View Product Bundle',
  }[mode];

  const form = useForm<ProductBundleFormValues>({
    resolver: zodResolver(productBundleFormSchema),
    defaultValues: getInitialValues(mode, bundle),
  });

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (open) {
      form.reset(getInitialValues(mode, bundle));
    }
  }, [open, mode, bundle, form]);

  // Calculate GP Amount and Sale Price
  const calculateGPAmount = (
    purchasePrice: string,
    gpType: string,
    gpValue: string
  ) => {
    if (!purchasePrice || !gpType || !gpValue) return '';

    const price = parseFloat(purchasePrice);
    const value = parseFloat(gpValue);

    if (isNaN(price) || isNaN(value)) return '';

    if (gpType === 'percentage') {
      return ((price * value) / 100).toFixed(2);
    }
    return value.toFixed(2);
  };

  const calculateSalePrice = (purchasePrice: string, gpAmount: string) => {
    if (!purchasePrice || !gpAmount) return '';

    const price = parseFloat(purchasePrice);
    const amount = parseFloat(gpAmount);

    if (isNaN(price) || isNaN(amount)) return '';

    return (price + amount).toFixed(2);
  };

  const calculateEqdPrice = (facePrice: string, currencyId: string) => {
    if (!facePrice || !currencyId) return '';

    const price = parseFloat(facePrice);
    if (isNaN(price)) return '';

    const selectedCurrency = currencies.find(
      (c) => c.id === Number(currencyId)
    );
    if (!selectedCurrency) return '';

    if (selectedCurrency.name === 'EQD') {
      return price.toFixed(2);
    }

    return (price * selectedCurrency.exchangeRate).toFixed(2);
  };

  // Watch form values for calculations
  const purchasePrice = form.watch('purchasePrice');
  const gpType = form.watch('gpType');
  const gpValue = form.watch('gpValue');
  const facePrice = form.watch('facePrice');
  const currency = form.watch('currency');

  // Calculate derived values
  const gpAmount = calculateGPAmount(purchasePrice, gpType, gpValue);
  const salePrice = calculateSalePrice(purchasePrice, gpAmount);
  const eqdPriceValue = calculateEqdPrice(facePrice, currency);

  // Update gpAmount and salePrice when dependencies change
  useEffect(() => {
    if (gpAmount) {
      form.setValue('gpAmount', gpAmount);
    }
    if (salePrice) {
      form.setValue('salePrice', salePrice);
    }
  }, [purchasePrice, gpType, gpValue, form]);

  const handleSubmit = async (values: ProductBundleFormValues) => {
    if (isViewMode) return;

    try {
      const payload: IProductBundlePayload = {
        metaInfo: getMetaInfo(),
        attribute: {
          name: values.name.trim(),
          description: values.description?.trim() || null,
          status: values.status === 'active',
          facePrice: parseFloat(values.facePrice),
          purchasePrice: parseFloat(values.purchasePrice),
          salePrice: parseFloat(values.salePrice),
          currency: values.currency,
          gpType: values.gpType,
          gpValue: parseFloat(values.gpValue),
          gpAmount: parseFloat(values.gpAmount || '0'),
          productId: Number(values.product.value),
          additionalCategoryId: values.additionalCategoryId
            ? Number(values.additionalCategoryId)
            : undefined,
          inventoryProductId: values.inventoryProductId,
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
      console.error('Error submitting product bundle:', error);
    }
  };

  // Don't render if bundle is not loaded in edit/view mode
  if ((mode === 'edit' || mode === 'view') && !bundle) return null;

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
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Left Column */}
                <div className='space-y-6'>
                  <InputField
                    name='name'
                    form={form}
                    label='Bundle Name'
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
                    name='product'
                    form={form}
                    label='Product'
                    loadOptions={async ({ search }) => {
                      const options = await loadProducts({ search });
                      return options;
                    }}
                    required
                    disabled={isViewMode}
                  />

                  <InputField
                    name='purchasePrice'
                    form={form}
                    label='Purchase Price'
                    type='number'
                    required
                    disabled={isViewMode}
                  />

                  <div className='grid grid-cols-5 gap-4'>
                    <div className='col-span-2'>
                      <SelectField
                        name='gpType'
                        form={form}
                        label='GP Type'
                        options={[
                          { label: 'Percentage', value: 'percentage' },
                          { label: 'Fixed', value: 'fixed' },
                        ]}
                        disabled={isViewMode}
                      />
                    </div>
                    <div className='col-span-3'>
                      <InputField
                        name='gpValue'
                        form={form}
                        label='GP Value'
                        type='number'
                        required
                        disabled={isViewMode}
                      />
                    </div>
                  </div>

                  <InputField
                    name='gpAmount'
                    form={form}
                    label='GP Amount'
                    type='number'
                    disabled
                  />

                  <InputField
                    name='salePrice'
                    form={form}
                    label='Sale Price'
                    type='number'
                    disabled
                  />
                </div>

                {/* Right Column */}
                <div className='space-y-6'>
                  <FileUploadField
                    name='image'
                    form={form}
                    label='Bundle Image'
                    value={form.watch('image')}
                    onChange={(file) => form.setValue('image', file)}
                    preview
                    required={mode === 'add'}
                    disabled={isViewMode}
                    acceptedTypes={['image/jpeg', 'image/png']}
                    maxSize={1}
                  />

                  <SelectField
                    name='additionalCategoryId'
                    form={form}
                    label='Additional Category'
                    options={additionalCategories.map((cat) => ({
                      label: cat.name,
                      value: cat.id.toString(),
                    }))}
                    disabled={isViewMode || !form.watch('product.value')}
                  />

                  <InputField
                    name='inventoryProductId'
                    form={form}
                    label='Inventory Product ID'
                    required
                    disabled={isViewMode}
                  />

                  <div className='grid grid-cols-7 gap-4'>
                    <div className='col-span-4'>
                      <InputField
                        name='facePrice'
                        form={form}
                        label='Face Price'
                        type='number'
                        required
                        disabled={isViewMode}
                      />
                    </div>
                    <div className='col-span-3'>
                      <SelectField
                        name='currency'
                        form={form}
                        label='Currency'
                        options={currencies.map((curr) => ({
                          label: curr.name,
                          value: curr.id.toString(),
                        }))}
                        disabled={isViewMode}
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <div className='text-sm font-medium'>Face Price (EQD)</div>
                    <div className='text-lg'>{eqdPriceValue || '-'}</div>
                    {currency &&
                      currencies.find((c) => c.id === Number(currency)) && (
                        <div className='text-sm text-gray-500'>
                          1{' '}
                          {
                            currencies.find((c) => c.id === Number(currency))
                              ?.name
                          }{' '}
                          ={' '}
                          {
                            currencies.find((c) => c.id === Number(currency))
                              ?.exchangeRate
                          }{' '}
                          EQD
                        </div>
                      )}
                  </div>

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
