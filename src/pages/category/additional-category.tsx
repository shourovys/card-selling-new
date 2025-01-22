import { sendPostRequest, sendPutRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import TableBodyLoading from '@/components/loading/TableBodyLoading';
import { AdditionalCategoryModal } from '@/components/modals/additional-category-modal';
import AdditionalCategoryTableRow from '@/components/pages/category/AdditionalCategoryTableRow';
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
import { IAdditionalCategory } from '@/lib/validations/additional-category';
import { routePaths } from '@/routes/routePaths';
import { IApiResponse } from '@/types/common';
import { ITableHead } from '@/types/components/table';
import {
  AdditionalCategoryApiQueryParams,
  AdditionalCategoryFilter,
  IAdditionalCategoryPayload,
  IAdditionalCategoryResponse,
} from '@/types/features/additional-category';
import { ICategoryResponse } from '@/types/features/category';
import { Plus } from 'lucide-react';
import QueryString from 'qs';
import { useCallback, useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

export default function AdditionalCategoryManagement() {
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
    { id: 'name', label: 'CATEGORIES', align: 'left' },
    { id: 'status', label: 'STATUS', align: 'left' },
    { id: 'position', label: 'POSITION', align: 'center' },
    { id: 'createdBy', label: 'CREATED BY', align: 'left' },
    { id: 'actions', label: 'ACTIONS', align: 'right' },
  ];

  // Modal state
  const [selectedCategory, setSelectedCategory] =
    useState<IAdditionalCategory | null>(null);
  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: 'add' | 'edit' | 'view';
  }>({ open: false, mode: 'add' });

  // Filter state management
  const initialFilterState: AdditionalCategoryFilter = {
    search: '',
  };

  // Create query params for API
  const createQueryParams = useCallback(
    (filters: AdditionalCategoryFilter): AdditionalCategoryApiQueryParams => ({
      page: page - 1,
      size: rowsPerPage,
      ...(filters.search && { name: filters.search }),
    }),
    [page, rowsPerPage]
  );

  const { filterState, debouncedFilterState, handleFilterInputChange } =
    useFilter<AdditionalCategoryFilter>(initialFilterState);

  // Fetch categories using SWR
  const { data: categoriesData } = useSWR<IApiResponse<ICategoryResponse>>(
    BACKEND_ENDPOINTS.CATEGORY.LIST('')
  );

  const { data, error, mutate, isLoading } = useSWR<
    IApiResponse<IAdditionalCategoryResponse>
  >(
    BACKEND_ENDPOINTS.ADDITIONAL_CATEGORY.LIST(
      QueryString.stringify(createQueryParams(debouncedFilterState))
    )
  );

  const additionalCategories =
    data?.data?.additionalCategoriesData?.additionalCategories || [];
  const categories = categoriesData?.data.categories || [];

  // Modal handlers
  const handleModalOpen = (
    mode: 'add' | 'edit' | 'view',
    category?: IAdditionalCategory
  ) => {
    setSelectedCategory(category || null);
    setModalState({ open: true, mode });
  };

  const handleModalClose = () => {
    setModalState({ open: false, mode: 'add' });
    setSelectedCategory(null);
  };

  const { trigger: createTrigger, isMutating: isCreating } = useSWRMutation(
    BACKEND_ENDPOINTS.ADDITIONAL_CATEGORY.CREATE,
    sendPostRequest,
    {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Additional category created successfully',
        });
      },
    }
  );

  const { trigger: updateTrigger, isMutating: isUpdating } = useSWRMutation(
    BACKEND_ENDPOINTS.ADDITIONAL_CATEGORY.UPDATE(selectedCategory?.id || 0),
    sendPutRequest,
    {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Additional category updated successfully',
        });
      },
    }
  );

  // API handlers
  const handleSubmit = async (payload: IAdditionalCategoryPayload) => {
    if (modalState.mode === 'edit' && selectedCategory) {
      await updateTrigger(payload);
    } else {
      await createTrigger(payload);
    }
    mutate();
  };

  const onDelete = () => {
    mutate(); // Refresh the categories list
  };

  // Check if no data is found
  const isNotFound =
    !data?.data?.additionalCategoriesData?.totalItems && !isLoading && !error;

  const breadcrumbItems = [
    { label: 'Dashboard', href: routePaths.dashboard },
    { label: 'Additional Category' },
  ];

  return (
    <div className='min-h-screen bg-gray-50/50'>
      <div className=''>
        <Breadcrumbs
          items={breadcrumbItems}
          title='Additional Category Management'
        />

        <Card className='p-6 space-y-4 bg-white shadow-sm'>
          <div className='flex justify-between items-center pb-2'>
            <Input
              placeholder='Search categories...'
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
              Add Additional Category
            </Button>
          </div>

          <Table>
            <TableHeader
              order={order}
              orderBy={orderBy}
              numSelected={selected.length}
              rowCount={additionalCategories.length || 0}
              handleSort={handleSort}
              headerData={TABLE_HEAD}
            />
            <tbody>
              {!isLoading &&
                additionalCategories.map((category, index) => (
                  <AdditionalCategoryTableRow
                    key={category.id}
                    category={category}
                    index={(page - 1) * 10 + index}
                    handleModalOpen={handleModalOpen}
                    onDelete={onDelete}
                  />
                ))}
              <TableEmptyRows
                emptyRows={
                  data
                    ? emptyRows(
                        page,
                        rowsPerPage,
                        data?.data?.additionalCategoriesData?.totalItems
                      )
                    : 0
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
            totalRows={data?.data?.additionalCategoriesData?.totalItems || 0}
            currentPage={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </div>

      <AdditionalCategoryModal
        open={modalState.open}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        mode={modalState.mode}
        category={selectedCategory || undefined}
        categories={categories}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}
