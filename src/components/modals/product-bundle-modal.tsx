import { additionalCategoryApi } from '@/api/additional-category';
import { productApi } from '@/api/product';
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
import { InputLabel } from '@/components/ui/form/input-label';
import { RadioGroupField } from '@/components/ui/form/radio-group-field';
import { SelectField } from '@/components/ui/form/select-field';
import {
  ServerSelectField,
  ServerSelectOption,
} from '@/components/ui/form/server-select-field';
import { toast } from '@/hooks/use-toast';
import {
  IProductBundlePayload,
  ProductBundle,
  ProductBundleFormValues,
  productBundleFormSchema,
} from '@/lib/validations/product-bundle';
import { IApiResponse } from '@/types/common';
import fileToBase64 from '@/utils/fileToBase64';
import { getMetaInfo } from '@/utils/getMetaInfo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

interface ProductBundleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: IProductBundlePayload) => Promise<void>;
  mode: 'add' | 'edit' | 'view';
  bundle?: ProductBundle;
  isSubmitting: boolean;
}

interface AdditionalCategory {
  id: number;
  name: string;
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
}: ProductBundleModalProps) {
  // State for managing additional data
  const [additionalCategories, setAdditionalCategories] = useState<
    AdditionalCategory[]
  >([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Fetch currencies using SWR
  const { data: currencyData } = useSWR<
    IApiResponse<{
      currencies: { id: number; name: string; exchangeRate: number }[];
    }>
  >(BACKEND_ENDPOINTS.CURRENCY.LIST);

  const currencies = currencyData?.data?.currencies || [];

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

  // Load products function
  const loadProducts = useCallback(
    async ({ search }: { search: string }): Promise<ServerSelectOption[]> => {
      try {
        const response = await productApi.getAll(
          `${search ? `?search=${search}` : ''}`
        );

        return (
          response.data?.productsData?.products.map((product) => ({
            value: product.id.toString(),
            label: product.name,
            categoryId: product.category?.id,
          })) || []
        );
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          title: 'Error',
          description: 'Failed to load products. Please try again.',
          variant: 'destructive',
        });
        return [];
      }
    },
    []
  );

  // Function to fetch additional categories
  const fetchAdditionalCategories = useCallback(async (categoryId: number) => {
    setIsLoadingCategories(true);
    try {
      const data = await additionalCategoryApi.getByCategoryId(categoryId);
      setAdditionalCategories(
        data.data?.categoryMapping?.additionalCategories || []
      );
    } catch (error) {
      console.error('Error fetching additional categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load additional categories',
        variant: 'destructive',
      });
      setAdditionalCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  // Handle product selection
  const handleProductSelect = useCallback(
    async (productId: string, categoryId?: number) => {
      if (categoryId) {
        await fetchAdditionalCategories(categoryId);
      } else {
        setAdditionalCategories([]);
      }
    },
    [fetchAdditionalCategories]
  );

  // Calculate IQD price
  const calculateEqdPrice = useCallback(
    (facePrice: string, currencyId: string) => {
      if (!facePrice || !currencyId) return '';

      const price = parseFloat(facePrice);
      if (isNaN(price)) return '';

      const selectedCurrency = currencies.find(
        (c) => c.id === Number(currencyId)
      );
      if (!selectedCurrency) return '';

      if (selectedCurrency.name === 'IQD') {
        return price.toFixed(2);
      }

      return (price * selectedCurrency.exchangeRate).toFixed(2);
    },
    [currencies]
  );

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (open) {
      form.reset(getInitialValues(mode, bundle));
      setAdditionalCategories([]);

      // If editing/viewing and bundle has a product with category, fetch additional categories
      if (bundle?.products?.categoryId) {
        fetchAdditionalCategories(bundle.products.categoryId);
      }
    }
  }, [open, mode, bundle, form, fetchAdditionalCategories]);

  // Watch product selection for additional categories
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'product' && value.product) {
        const product = value.product as { value: string; categoryId?: number };
        handleProductSelect(product.value, product.categoryId);

        // Reset additional category when product changes
        if (form.getValues('additionalCategoryId')) {
          form.setValue('additionalCategoryId', '');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, handleProductSelect]);

  // Calculate GP Amount and Sale Price
  const calculateGPAmount = useCallback(
    (purchasePrice: string, gpType: string, gpValue: string) => {
      if (!purchasePrice || !gpType || !gpValue) return '';

      const price = parseFloat(purchasePrice);
      const value = parseFloat(gpValue);

      if (isNaN(price) || isNaN(value)) return '';

      if (gpType === 'percentage') {
        return ((price * value) / 100).toFixed(2);
      }
      return value.toFixed(2);
    },
    []
  );

  const calculateSalePrice = useCallback(
    (purchasePrice: string, gpAmount: string) => {
      if (!purchasePrice || !gpAmount) return '';

      const price = parseFloat(purchasePrice);
      const amount = parseFloat(gpAmount);

      if (isNaN(price) || isNaN(amount)) return '';

      return (price + amount).toFixed(2);
    },
    []
  );

  // Watch form values for calculations
  const purchasePrice = form.watch('purchasePrice');
  const gpType = form.watch('gpType');
  const gpValue = form.watch('gpValue');
  const facePrice = form.watch('facePrice');
  const currency = form.watch('currency');

  // Calculate derived values
  const gpAmount = calculateGPAmount(purchasePrice, gpType, gpValue);
  const salePrice = calculateSalePrice(purchasePrice, gpAmount);
  const iqdPriceValue = calculateEqdPrice(facePrice, currency);

  // Update gpAmount and salePrice when dependencies change
  useEffect(() => {
    if (gpAmount) {
      form.setValue('gpAmount', gpAmount);
    }
    if (salePrice) {
      form.setValue('salePrice', salePrice);
    }
  }, [purchasePrice, gpType, gpValue, form, gpAmount, salePrice]);

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
              <div className='grid grid-cols-1 gap-10 md:grid-cols-2'>
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
                    loadOptions={loadProducts}
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
                    disabled={
                      isViewMode ||
                      !form.watch('product.value') ||
                      isLoadingCategories
                    }
                    placeholder={
                      isLoadingCategories
                        ? 'Loading categories...'
                        : form.watch('product.value') &&
                          !additionalCategories.length
                        ? 'No additional categories available'
                        : ''
                    }
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
                    <InputLabel
                      name='facePriceIQD'
                      label='Face Price (IQD)'
                      value={iqdPriceValue}
                      type='number'
                      disabled
                      description={
                        currency &&
                        currencies.find((c) => c.id === Number(currency)) &&
                        `1 ${
                          currencies.find((c) => c.id === Number(currency))
                            ?.name
                        } = ${
                          currencies.find((c) => c.id === Number(currency))
                            ?.exchangeRate
                        } IQD`
                      }
                    />
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
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={isSubmitting}
              >
                {isViewMode ? 'Close' : mode === 'add' ? 'Cancel' : 'Cancel'}
              </Button>
              {!isViewMode && (
                <Button
                  disabled={isSubmitting}
                  type='submit'
                  className='min-w-[120px] min-h-[36px]'
                >
                  {isSubmitting ? (
                    <span className='flex items-center gap-2'>
                      <span className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                      {mode === 'add' ? 'Creating...' : 'Updating...'}
                    </span>
                  ) : mode === 'add' ? (
                    'Create'
                  ) : (
                    'Update'
                  )}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
