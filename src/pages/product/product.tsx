import { productApi } from '@/api/product';
import BACKEND_ENDPOINTS from '@/api/urls';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Page from '@/components/HOC/page';
import TableBodyLoading from '@/components/loading/TableBodyLoading';
import { ProductModal } from '@/components/modals/product-modal';
import ProductTableRow from '@/components/pages/product/ProductTableRow';
import Pagination from '@/components/table/pagination/Pagination';
import Table from '@/components/table/Table';
import TableEmptyRows from '@/components/table/TableEmptyRows';
import TableHeader from '@/components/table/TableHeader';
import TableNoData from '@/components/table/TableNoData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { routeConfig } from '@/config/routeConfig';
import { toast } from '@/hooks/use-toast';
import { useFilter } from '@/hooks/useFilter';
import useTable, { emptyRows } from '@/hooks/useTable';
import { Category } from '@/lib/validations/category';
import {
  IProductPayload,
  IProductResponse,
  Product,
} from '@/lib/validations/product';
import { IApiResponse } from '@/types/common';
import { ITableHead } from '@/types/components/table';
import { Plus } from 'lucide-react';
import QueryString from 'qs';
import { useCallback, useState } from 'react';
import useSWR from 'swr';

export default function ProductManagement() {
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
    { id: 'name', label: 'PRODUCTS', align: 'left' },
    { id: 'status', label: 'STATUS', align: 'left' },
    { id: 'category', label: 'CATEGORY', align: 'left' },
    { id: 'createdAt', label: 'CREATED AT', align: 'left' },
    { id: 'actions', label: 'ACTIONS', align: 'right' },
  ];

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: 'add' | 'edit' | 'view';
  }>({ open: false, mode: 'add' });

  // Filter state management
  const initialFilterState = {
    name: '',
  };

  const { filterState, debouncedFilterState, handleFilterInputChange } =
    useFilter(initialFilterState);

  // Create query params for API
  const createQueryParams = useCallback(
    (filters: { name: string }) => ({
      ...(filters.name && { name: filters.name }),
      page: page - 1,
      size: rowsPerPage,
    }),
    [page, rowsPerPage]
  );

  // Fetch products using SWR
  const { data, error, mutate, isLoading } = useSWR<
    IApiResponse<IProductResponse>
  >(
    BACKEND_ENDPOINTS.PRODUCT.LIST(
      QueryString.stringify(createQueryParams(debouncedFilterState))
    )
  );

  // Fetch categories for modal
  const { data: categoriesData } = useSWR<
    IApiResponse<{ categories: Category[] }>
  >(BACKEND_ENDPOINTS.CATEGORY.LIST(''));

  const products = data?.data?.productsData?.products || [];
  const categories = categoriesData?.data?.categories || [];

  // Modal handlers
  const handleModalOpen = (
    mode: 'add' | 'edit' | 'view',
    product?: Product
  ) => {
    setSelectedProduct(product || null);
    setModalState({ open: true, mode });
  };

  const handleModalClose = () => {
    setModalState({ open: false, mode: 'add' });
    setSelectedProduct(null);
  };

  // API handlers
  const handleSubmit = async (payload: IProductPayload) => {
    try {
      if (modalState.mode === 'edit' && selectedProduct) {
        await productApi.update(selectedProduct.id, payload);
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        await productApi.create(payload);
        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      }
      mutate(); // Refresh the products list
    } catch (error) {
      console.error('Error submitting product:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const onDelete = () => {
    mutate(); // Refresh the products list
  };

  // Check if no data is found
  const isNotFound = !products.length && !isLoading && !error;

  return (
    <Page>
      <div className='min-h-screen bg-gray-50/50'>
        <div className=''>
          <Breadcrumbs icon={routeConfig.product.icon} />

          <Card className='p-6 space-y-4 bg-white shadow-sm'>
            <div className='flex justify-between items-center pb-2'>
              <Input
                placeholder='Search by name...'
                value={filterState.name}
                onChange={(e) =>
                  handleFilterInputChange('name', e.target.value)
                }
                className='max-w-sm h-10 bg-gray-50'
              />
              <Button
                onClick={() => handleModalOpen('add')}
                size='sm'
                className='px-4 h-10 text-white bg-rose-500 hover:bg-rose-600'
              >
                <Plus className='mr-2 w-4 h-4' />
                Add Product
              </Button>
            </div>

            <Table>
              <TableHeader
                order={order}
                orderBy={orderBy}
                numSelected={selected.length}
                rowCount={products.length || 0}
                handleSort={handleSort}
                headerData={TABLE_HEAD}
              />
              <tbody>
                {!isLoading &&
                  products.map((product, index) => (
                    <ProductTableRow
                      key={product.id}
                      product={product}
                      index={(page - 1) * 10 + index}
                      handleModalOpen={handleModalOpen}
                      onDelete={onDelete}
                    />
                  ))}
                <TableEmptyRows
                  emptyRows={
                    data ? emptyRows(page, rowsPerPage, products.length) : 0
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
              totalRows={data?.data?.productsData?.totalItems || 0}
              currentPage={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </div>

        <ProductModal
          open={modalState.open}
          onClose={handleModalClose}
          onSubmit={handleSubmit}
          mode={modalState.mode}
          product={selectedProduct || undefined}
          categories={categories}
          isSubmitting={isLoading}
        />
      </div>
    </Page>
  );
}
