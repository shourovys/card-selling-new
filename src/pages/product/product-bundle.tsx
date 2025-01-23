import { sendPostRequest, sendPutRequest } from '@/api/swrConfig';
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
import {
  IProductBundlePayload,
  IProductBundleResponse,
  ProductBundle,
} from '@/lib/validations/product-bundle';
import { IApiResponse } from '@/types/common';
import { ITableHead } from '@/types/components/table';
import { Plus } from 'lucide-react';
import QueryString from 'qs';
import { useCallback, useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

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
  const { filterState, debouncedFilterState, handleFilterInputChange } =
    useFilter({ name: '' });

  // Create query params for API
  const createQueryParams = useCallback(
    (filters: { name: string }) => ({
      ...(filters.name && { name: filters.name }),
      page: page - 1,
      size: rowsPerPage,
    }),
    [page, rowsPerPage]
  );

  // Fetch data using SWR
  const { data, error, mutate, isLoading } = useSWR<
    IApiResponse<IProductBundleResponse>
  >(
    BACKEND_ENDPOINTS.PRODUCT_BUNDLE.LIST(
      QueryString.stringify(createQueryParams(debouncedFilterState))
    )
  );

  const productBundles = data?.data?.productBundlesData?.productBundles || [];

  // Modal handlers
  const handleModalOpen = useCallback(
    async (mode: 'add' | 'edit' | 'view', bundle?: ProductBundle) => {
      setSelectedBundle(bundle || null);
      setModalState({ open: true, mode });
    },
    []
  );

  const handleModalClose = useCallback(() => {
    setModalState({ open: false, mode: 'add' });
    setSelectedBundle(null);
  }, []);

  const { trigger: createProductBundle, isMutating: isCreating } =
    useSWRMutation(BACKEND_ENDPOINTS.PRODUCT_BUNDLE.CREATE, sendPostRequest, {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Product bundle created successfully',
        });
      },
    });

  const { trigger: updateProductBundle, isMutating: isUpdating } =
    useSWRMutation(
      selectedBundle?.id
        ? BACKEND_ENDPOINTS.PRODUCT_BUNDLE.UPDATE(selectedBundle?.id)
        : null,
      sendPutRequest,
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Product bundle updated successfully',
          });
        },
      }
    );

  // Submit handler
  const handleSubmit = useCallback(
    async (payload: IProductBundlePayload) => {
      try {
        if (modalState.mode === 'edit' && selectedBundle) {
          await updateProductBundle(payload);
        } else {
          await createProductBundle(payload);
        }
        mutate();
        handleModalClose();
      } catch (error) {
        console.error('Error submitting product bundle:', error);
        toast({
          title: 'Error',
          description: 'Failed to save product bundle. Please try again.',
          variant: 'destructive',
        });
      }
    },
    [modalState.mode, selectedBundle, mutate, handleModalClose]
  );

  // Delete handler
  const handleDelete = useCallback(() => {
    mutate();
  }, [mutate]);

  const isNotFound = !productBundles.length && !isLoading && !error;

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Error Loading Data
          </h2>
          <p className='mt-2 text-gray-600'>Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50/50'>
      <div className=''>
        <Breadcrumbs />

        <Card className='p-6 space-y-4 bg-white shadow-sm'>
          <div className='flex justify-between items-center pb-2'>
            <Input
              placeholder='Search by name...'
              value={filterState.name}
              onChange={(e) => handleFilterInputChange('name', e.target.value)}
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
                    index={(page - 1) * rowsPerPage + index + 1}
                    handleModalOpen={handleModalOpen}
                    onDelete={handleDelete}
                  />
                ))}
              <TableEmptyRows
                emptyRows={emptyRows(page, rowsPerPage, productBundles.length)}
              />
            </tbody>
          </Table>

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
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}
