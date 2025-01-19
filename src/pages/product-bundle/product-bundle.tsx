import { productApi } from '@/api/product';
import { productBundleApi } from '@/api/product-bundle';
import BACKEND_ENDPOINTS from '@/api/urls';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import TableBodyLoading from '@/components/loading/TableBodyLoading';
import { ProductBundleModal } from '@/components/modals/product-bundle-modal';
import ProductBundleTableRow from '@/components/pages/product-bundle/ProductBundleTableRow';
import Pagination from '@/components/table/pagination/Pagination';
import Table from '@/components/table/Table';
import TableEmptyRows from '@/components/table/TableEmptyRows';
import TableHeader from '@/components/table/TableHeader';
import TableNoData from '@/components/table/TableNoData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useFilter } from '@/hooks/useFilter';
import useTable, { emptyRows } from '@/hooks/useTable';
import { Product } from '@/lib/validations/product';
import {
  IProductBundlePayload,
  IProductBundleResponse,
  ProductBundle,
} from '@/lib/validations/product-bundle';
import { routePaths } from '@/routes/routePaths';
import { IApiResponse } from '@/types/common';
import { ITableHead } from '@/types/components/table';
import { Plus } from 'lucide-react';
import QueryString from 'qs';
import { useState } from 'react';
import useSWR from 'swr';

export default function ProductBundleManagement() {
  // Table state management
  const {
    page,
    rowsPerPage,
    order,
    orderBy,
    selected,
    handleChangePage,
    handleSort,
    handleChangeRowsPerPage,
  } = useTable({});

  // Define table head columns
  const TABLE_HEAD: ITableHead[] = [
    { id: 'sno', label: 'S.NO', align: 'left' },
    { id: 'name', label: 'PRODUCT BUNDLES', align: 'left' },
    { id: 'price', label: 'PRICE', align: 'left' },
    { id: 'profit', label: 'PROFIT', align: 'left' },
    { id: 'status', label: 'STATUS', align: 'left' },
    { id: 'createdAt', label: 'CREATED AT', align: 'left' },
    { id: 'actions', label: 'ACTIONS', align: 'right' },
  ];

  // Modal state
  const [selectedBundle, setSelectedBundle] = useState<ProductBundle | null>(
    null
  );
  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: 'add' | 'edit' | 'view';
  }>({ open: false, mode: 'add' });

  // Filter state management
  const initialFilterState = {
    search: '',
  };

  const { filterState, handleFilterInputChange } =
    useFilter(initialFilterState);

  // Create query params for API
  const apiQueryParamsString = QueryString.stringify({
    ...(filterState.search && { search: filterState.search }),
    page: page - 1,
    size: rowsPerPage,
  });

  // Fetch product bundles using SWR
  const { data, error, mutate, isLoading } = useSWR<
    IApiResponse<IProductBundleResponse>
  >(BACKEND_ENDPOINTS.PRODUCT_BUNDLE.LIST(apiQueryParamsString));

  // Fetch currencies for modal
  const { data: currencyData } = useSWR<
    IApiResponse<{
      currencies: { id: number; name: string; exchangeRate: number }[];
    }>
  >(BACKEND_ENDPOINTS.CURRENCY.LIST);

  const productBundles = data?.data?.productBundlesData?.productBundles || [];
  const currencies = currencyData?.data?.currencies || [];

  // Modal handlers
  const handleModalOpen = (
    mode: 'add' | 'edit' | 'view',
    bundle?: ProductBundle
  ) => {
    setSelectedBundle(bundle || null);
    setModalState({ open: true, mode });
  };

  const handleModalClose = () => {
    setModalState({ open: false, mode: 'add' });
    setSelectedBundle(null);
  };

  // Load products for modal
  const loadProducts = async ({ search }: { search: string }) => {
    try {
      const response = await productApi.list(
        QueryString.stringify({ search, page: 0, size: 10 })
      );
      return (
        response.data?.productsData?.products.map((product: Product) => ({
          value: product.id.toString(),
          label: product.name,
        })) || []
      );
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
  };

  // API handlers
  const handleSubmit = async (payload: IProductBundlePayload) => {
    try {
      if (modalState.mode === 'edit' && selectedBundle) {
        await productBundleApi.update(selectedBundle.id, payload);
        toast({
          title: 'Success',
          description: 'Product bundle updated successfully',
        });
      } else {
        await productBundleApi.create(payload);
        toast({
          title: 'Success',
          description: 'Product bundle created successfully',
        });
      }
      mutate(); // Refresh the product bundles list
    } catch (error) {
      console.error('Error submitting product bundle:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const onDelete = () => {
    mutate(); // Refresh the product bundles list
  };

  // Check if no data is found
  const isNotFound = !productBundles.length && !isLoading && !error;

  const breadcrumbItems = [
    { label: 'Dashboard', href: routePaths.dashboard },
    { label: 'Product Bundles' },
  ];

  return (
    <div className='min-h-screen bg-gray-50/50'>
      <div className=''>
        <Breadcrumbs
          items={breadcrumbItems}
          title='Product Bundles Management'
        />

        <Card className='p-6 space-y-4 bg-white shadow-sm'>
          <div className='flex justify-between items-center pb-2'>
            <Input
              placeholder='Search product bundles...'
              value={filterState.search}
              onChange={(e) =>
                handleFilterInputChange('search', e.target.value)
              }
              className='max-w-sm h-10 bg-gray-50'
            />
            <Button
              onClick={() => handleModalOpen('add')}
              size='sm'
              className='px-4 h-10 text-white bg-rose-500 hover:bg-rose-600'
            >
              <Plus className='mr-2 w-4 h-4' />
              Add Product Bundle
            </Button>
          </div>

          <Table>
            <TableHeader
              order={order}
              orderBy={orderBy}
              numSelected={selected.length}
              rowCount={productBundles.length || 0}
              handleSort={handleSort}
              headerData={TABLE_HEAD}
            />
            <tbody>
              {!isLoading &&
                productBundles.map((bundle, index) => (
                  <ProductBundleTableRow
                    key={bundle.id}
                    bundle={bundle}
                    index={(page - 1) * 10 + index}
                    handleModalOpen={handleModalOpen}
                    onDelete={onDelete}
                  />
                ))}
              <TableEmptyRows
                emptyRows={
                  data ? emptyRows(page, rowsPerPage, productBundles.length) : 0
                }
              />
            </tbody>
          </Table>

          {/* Loading and No Data States */}
          <TableNoData isNotFound={isNotFound} />
          <TableBodyLoading
            isLoading={isLoading}
            tableRowPerPage={rowsPerPage}
          />

          <Pagination
            totalRows={data?.data?.productBundlesData?.totalItems || 0}
            currentPage={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </div>

      <ProductBundleModal
        open={modalState.open}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        mode={modalState.mode}
        bundle={selectedBundle || undefined}
        loadProducts={loadProducts}
        currencies={currencies}
        additionalCategories={[]} // This will be populated when a product is selected
        isSubmitting={isLoading}
      />
    </div>
  );
}
