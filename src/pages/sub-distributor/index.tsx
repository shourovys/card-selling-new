import { subDistributorApi } from '@/api/sub-distributor';
import BACKEND_ENDPOINTS from '@/api/urls';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import TableBodyLoading from '@/components/loading/TableBodyLoading';
import { SubDistributorModal } from '@/components/modals/sub-distributor-modal';
import SubDistributorTableRow from '@/components/pages/sub-distributor/SubDistributorTableRow';
import Table from '@/components/table/Table';
import TableHeader from '@/components/table/TableHeader';
import TableNoData from '@/components/table/TableNoData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useFilter } from '@/hooks/useFilter';
import useTable from '@/hooks/useTable';
import {
  ISubDistributorPayload,
  ISubDistributorResponse,
  SubDistributor,
} from '@/lib/validations/sub-distributor';
import { routePaths } from '@/routes/routePaths';
import { IApiResponse } from '@/types/common';
import { ITableHead } from '@/types/components/table';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import useSWR from 'swr';

export default function SubDistributorManagement() {
  const { page, rowsPerPage, order, orderBy, selected, handleSort } = useTable(
    {}
  );

  const TABLE_HEAD: ITableHead[] = [
    { id: 'sno', label: 'S.NO', align: 'left' },
    { id: 'firstName', label: 'FIRST NAME', align: 'left' },
    { id: 'lastName', label: 'LAST NAME', align: 'left' },
    { id: 'mobileNumber', label: 'PHONE NUMBER', align: 'left' },
    { id: 'emailAddress', label: 'EMAIL', align: 'left' },
    { id: 'sr', label: 'SR', align: 'left' },
    { id: 'status', label: 'STATUS', align: 'left' },
    { id: 'actions', label: 'ACTIONS', align: 'right' },
  ];

  const [selectedSubDistributor, setSelectedSubDistributor] =
    useState<SubDistributor | null>(null);
  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: 'add' | 'edit' | 'view';
  }>({ open: false, mode: 'add' });

  const initialFilterState = {
    search: '',
  };

  const { filterState, handleFilterInputChange } =
    useFilter(initialFilterState);

  const { data, error, mutate, isLoading } = useSWR<
    IApiResponse<ISubDistributorResponse>
  >(BACKEND_ENDPOINTS.SUB_DISTRIBUTOR.LIST(''));

  const subDistributors = data?.data?.distributors || [];

  // Filter sub distributors based on search term
  const filteredSubDistributors = subDistributors.filter(
    (subDistributor: SubDistributor) => {
      if (!filterState.search) return true;

      const searchTerm = filterState.search.toLowerCase();
      const fullName =
        `${subDistributor.firstName} ${subDistributor.lastName}`.toLowerCase();

      return fullName.includes(searchTerm);
    }
  );

  const handleModalOpen = (
    mode: 'add' | 'edit' | 'view',
    subDistributor?: SubDistributor
  ) => {
    setSelectedSubDistributor(subDistributor || null);
    setModalState({ open: true, mode });
  };

  const handleModalClose = () => {
    setModalState({ open: false, mode: 'add' });
    setSelectedSubDistributor(null);
  };

  const handleSubmit = async (payload: ISubDistributorPayload) => {
    try {
      if (modalState.mode === 'edit' && selectedSubDistributor) {
        await subDistributorApi.update(selectedSubDistributor.userId, payload);
        toast({
          title: 'Success',
          description: 'Sub distributor updated successfully',
        });
      } else {
        await subDistributorApi.create(payload);
        toast({
          title: 'Success',
          description: 'Sub distributor created successfully',
        });
      }
      mutate();
      handleModalClose();
    } catch (error) {
      console.error('Error submitting sub distributor:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (subDistributor: SubDistributor) => {
    try {
      await subDistributorApi.delete(subDistributor.userId);
      mutate();
    } catch (error) {
      console.error('Error deleting sub distributor:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const isNotFound = !filteredSubDistributors.length && !isLoading && !error;

  const breadcrumbItems = [
    { label: 'Dashboard', href: routePaths.dashboard },
    { label: 'Sub Distributors' },
  ];

  return (
    <div className='min-h-screen bg-gray-50/50'>
      <div className=''>
        <Breadcrumbs
          items={breadcrumbItems}
          title='Sub Distributor Management'
        />

        <Card className='p-6 space-y-4 bg-white shadow-sm'>
          <div className='flex justify-between items-center pb-2'>
            <Input
              placeholder='Search sub distributors...'
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
              Add Sub Distributor
            </Button>
          </div>

          <Table>
            <TableHeader
              order={order}
              orderBy={orderBy}
              numSelected={selected.length}
              rowCount={subDistributors.length || 0}
              handleSort={handleSort}
              headerData={TABLE_HEAD}
            />
            <tbody>
              {!isLoading &&
                filteredSubDistributors.map(
                  (subDistributor: SubDistributor, index: number) => (
                    <SubDistributorTableRow
                      key={subDistributor.id}
                      subDistributor={subDistributor}
                      index={(page - 1) * rowsPerPage + index + 1}
                      handleModalOpen={handleModalOpen}
                      onDelete={handleDelete}
                    />
                  )
                )}
            </tbody>
          </Table>

          <TableNoData isNotFound={isNotFound} />
          <TableBodyLoading
            isLoading={isLoading}
            tableRowPerPage={rowsPerPage}
          />
        </Card>
      </div>

      <SubDistributorModal
        open={modalState.open}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        mode={modalState.mode}
        subDistributor={selectedSubDistributor || undefined}
        isSubmitting={isLoading}
      />
    </div>
  );
}
