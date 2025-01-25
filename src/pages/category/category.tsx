import { sendPostRequest, sendPutRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Page from '@/components/HOC/page';
import TableBodyLoading from '@/components/loading/TableBodyLoading';
import { CategoryModal } from '@/components/modals/category-modal';
import CategoryTableRow from '@/components/pages/category/CategoryTableRow';
import Table from '@/components/table/Table';
import TableHeader from '@/components/table/TableHeader';
import TableNoData from '@/components/table/TableNoData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { routeConfig } from '@/config/routeConfig';
import { toast } from '@/hooks/use-toast';
import { useFilter } from '@/hooks/useFilter';
import usePermissions from '@/hooks/usePermissions';
import useTable from '@/hooks/useTable';
import { Category } from '@/lib/validations/category';
import { IApiResponse } from '@/types/common';
import { ITableHead } from '@/types/components/table';
import {
  CategoryFilter,
  ICategoryPayload,
  ICategoryResponse,
} from '@/types/features/category';
import { Plus } from 'lucide-react';
import QueryString from 'qs';
import { useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

export default function CategoryManagement() {
  // Table state management
  const { rowsPerPage, order, orderBy, selected, handleSort } = useTable({});
  const { getActionPermissions } = usePermissions();
  const { canCreate } = getActionPermissions('CATEGORY');

  // Define table head columns
  const TABLE_HEAD: ITableHead[] = [
    { id: 'sno', label: 'S.NO', align: 'left' },
    { id: 'name', label: 'CATEGORIES', align: 'left' },
    { id: 'status', label: 'STATUS', align: 'left' },
    { id: 'createdAt', label: 'CREATED AT', align: 'left' },
    { id: 'actions', label: 'ACTIONS', align: 'right' },
  ];

  // Modal state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: 'add' | 'edit' | 'view';
  }>({ open: false, mode: 'add' });

  // Filter state management
  const initialFilterState: CategoryFilter = {
    name: '',
  };

  const { filterState, handleFilterInputChange } =
    useFilter(initialFilterState);

  // Fetch categories using SWR
  const { data, error, mutate, isLoading } = useSWR<
    IApiResponse<ICategoryResponse>
  >(BACKEND_ENDPOINTS.CATEGORY.LIST(QueryString.stringify('')));

  const categories = data?.data?.categories || [];

  // Filter categories based on name term
  const filteredCategories = categories.filter((category: Category) => {
    if (!filterState.name) return true;

    const nameTerm = filterState.name.toLowerCase();

    return category.name.toLowerCase().includes(nameTerm);
  });

  // Modal handlers
  const handleModalOpen = (
    mode: 'add' | 'edit' | 'view',
    category?: Category
  ) => {
    setSelectedCategory(category || null);
    setModalState({ open: true, mode });
  };

  const handleModalClose = () => {
    setModalState({ open: false, mode: 'add' });
    setSelectedCategory(null);
  };

  const { trigger: createTrigger, isMutating: isCreating } = useSWRMutation(
    BACKEND_ENDPOINTS.CATEGORY.CREATE,
    sendPostRequest
  );

  const { trigger: updateTrigger, isMutating: isUpdating } = useSWRMutation(
    BACKEND_ENDPOINTS.CATEGORY.UPDATE(selectedCategory?.id || 0),
    sendPutRequest
  );

  // API handlers
  const handleSubmit = async (payload: ICategoryPayload) => {
    try {
      if (modalState.mode === 'edit' && selectedCategory) {
        await updateTrigger(payload);
        toast({
          title: 'Success',
          description: 'Category updated successfully',
        });
      } else {
        await createTrigger(payload);
        toast({
          title: 'Success',
          description: 'Category created successfully',
        });
      }
      mutate(); // Refresh the categories list
      handleModalClose();
    } catch (error) {
      console.error('Error submitting category:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const onDelete = () => {
    mutate(); // Refresh the categories list
  };

  // Check if no data is found
  const isNotFound = !filteredCategories.length && !isLoading && !error;

  return (
    <Page>
      <div className='min-h-screen bg-gray-50/50'>
        <div className=''>
          <Breadcrumbs icon={routeConfig.category.icon} />

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
              {canCreate && (
                <Button
                  onClick={() => handleModalOpen('add')}
                  size='sm'
                  className='px-4 h-10 text-white bg-rose-500 hover:bg-rose-600'
                >
                  <Plus className='mr-2 w-4 h-4' />
                  Add Category
                </Button>
              )}
            </div>

            <Table>
              <TableHeader
                order={order}
                orderBy={orderBy}
                numSelected={selected.length}
                rowCount={filteredCategories.length || 0}
                handleSort={handleSort}
                headerData={TABLE_HEAD}
              />
              <tbody>
                {!isLoading &&
                  filteredCategories.map((category, index) => (
                    <CategoryTableRow
                      key={category.id}
                      category={category}
                      index={index}
                      handleModalOpen={handleModalOpen}
                      onDelete={onDelete}
                    />
                  ))}
              </tbody>
            </Table>

            {/* Loading and No Data States */}
            <TableNoData isNotFound={isNotFound} />
            <TableBodyLoading
              isLoading={isLoading}
              tableRowPerPage={rowsPerPage}
            />
          </Card>
        </div>

        <CategoryModal
          open={modalState.open}
          onClose={handleModalClose}
          onSubmit={handleSubmit}
          mode={modalState.mode}
          category={selectedCategory || undefined}
          categories={categories || []}
          isSubmitting={isCreating || isUpdating}
        />
      </div>
    </Page>
  );
}
