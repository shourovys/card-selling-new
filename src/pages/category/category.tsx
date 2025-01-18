import { fetcher, sendPostRequest, sendPutRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import TableBodyLoading from '@/components/loading/TableBodyLoading';
import { CategoryModal } from '@/components/modals/category-modal';
import CategoryTableRow from '@/components/pages/category/CategoryTableRow';
import Pagination from '@/components/table/pagination/Pagination';
import TableEmptyRows from '@/components/table/TableEmptyRows';
import TableHeader from '@/components/table/TableHeader';
import TableNoData from '@/components/table/TableNoData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { getMetaInfo } from '@/getMetaInfo';
import { toast } from '@/hooks/use-toast';
import { useFilter } from '@/hooks/useFilter';
import useTable, { emptyRows } from '@/hooks/useTable';
import { CategoryResponse } from '@/lib/api/category';
import { Category, CategoryFormValues } from '@/lib/validations/category';
import { IApiResponse } from '@/types/common';
import { ITableHead } from '@/types/components/table';
import {
  CategoryApiQueryParams,
  CategoryFilter,
  ICategoryPayload,
} from '@/types/features/category';
import { Plus } from 'lucide-react';
import QueryString from 'qs';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

export default function CategoryManagement() {
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
    { id: 'name', label: 'Categories' },
    { id: 'status', label: 'Status' },
    { id: 'createdAt', label: 'Created At' },
    { id: 'actions', label: 'Actions' },
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
    search: '',
  };

  const { filterState, handleFilterInputChange } =
    useFilter(initialFilterState);

  // Create query params for API
  const apiQueryParamsString: CategoryApiQueryParams = {
    // offset: (page - 1) * rowsPerPage,
    // limit: rowsPerPage,
    // sort_by: orderBy,
    // order,
    ...(filterState.search && { search: filterState.search }),
  };

  // Fetch categories using SWR
  const { data, error, mutate, isLoading } = useSWR<
    IApiResponse<CategoryResponse>
  >(
    BACKEND_ENDPOINTS.CATEGORY.LIST(
      QueryString.stringify(apiQueryParamsString)
    ),
    fetcher
  );

  const categories = data?.data?.categories || [];

  // Reset pagination when filter changes
  useEffect(() => {
    handleChangePage(1);
  }, [filterState]);

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

  const { trigger: createTrigger } = useSWRMutation(
    BACKEND_ENDPOINTS.CATEGORY.CREATE,
    sendPostRequest
  );

  const { trigger: updateTrigger } = useSWRMutation(
    BACKEND_ENDPOINTS.CATEGORY.UPDATE(selectedCategory?.id || 0),
    sendPutRequest
  );

  // API handlers
  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      if (modalState.mode === 'edit' && selectedCategory) {
        await updateTrigger(values);
        toast({
          title: 'Success',
          description: 'Category updated successfully',
        });
      } else {
        const payload: ICategoryPayload = {
          metaInfo: getMetaInfo(),
          attribute: {
            name: values.name,
            description: values.description,
            status: values.status === 'active',
            icon: values.icon,
            position: values.position ? parseInt(values.position) + 1 : null,
          },
        };
        await createTrigger(payload);
        toast({
          title: 'Success',
          description: 'Category created successfully',
        });
      }
      mutate(); // Refresh the categories list
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
  const isNotFound = !categories.length && !isLoading && !error;
  console.log(
    '🚀 ~ CategoryManagement ~ categories.length:',
    categories.length
  );

  return (
    <div className='container py-6'>
      <Card>
        <CardHeader className='flex flex-row justify-between items-center pb-4 space-y-0'>
          <CardTitle>Category Management</CardTitle>
          <Button onClick={() => handleModalOpen('add')} size='sm'>
            <Plus className='mr-2 w-4 h-4' />
            Add Category
          </Button>
        </CardHeader>
        <CardContent>
          <div className='flex justify-between items-center py-4 space-x-4'>
            <div className='flex-1 max-w-sm'>
              <Input
                placeholder='Search categories...'
                value={filterState.search}
                onChange={(e) =>
                  handleFilterInputChange('search', e.target.value)
                }
                className='h-9'
              />
            </div>
          </div>

          <div className='rounded-md border'>
            <Table>
              <TableHeader
                order={order}
                orderBy={orderBy}
                numSelected={selected.length}
                rowCount={categories.length || 0}
                handleSort={handleSort}
                headerData={TABLE_HEAD}
              />
              <TableBody>
                {isLoading ? (
                  <TableBodyLoading
                    isLoading={isLoading}
                    tableRowPerPage={rowsPerPage}
                  />
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className='h-24 text-center text-muted-foreground'
                    >
                      Error loading categories
                    </TableCell>
                  </TableRow>
                ) : isNotFound ? (
                  <TableNoData isNotFound={isNotFound} />
                ) : (
                  <>
                    {categories.map((category) => (
                      <CategoryTableRow
                        key={category.id}
                        category={category}
                        handleModalOpen={handleModalOpen}
                        onDelete={onDelete}
                      />
                    ))}
                    <TableEmptyRows
                      emptyRows={
                        data
                          ? emptyRows(page, rowsPerPage, categories.length)
                          : 0
                      }
                    />
                  </>
                )}
              </TableBody>
            </Table>
          </div>

          <Pagination
            totalRows={categories.length || 0}
            currentPage={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      <CategoryModal
        open={modalState.open}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        mode={modalState.mode}
        category={selectedCategory || undefined}
        categories={categories || []}
      />
    </div>
  );
}
