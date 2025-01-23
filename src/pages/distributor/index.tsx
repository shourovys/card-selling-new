import { distributorApi } from '@/api/distributor';
import BACKEND_ENDPOINTS from '@/api/urls';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Page from '@/components/HOC/page';
import TableBodyLoading from '@/components/loading/TableBodyLoading';
import { DistributorModal } from '@/components/modals/distributor-modal';
import DistributorTableRow from '@/components/pages/distributor/DistributorTableRow';
import Table from '@/components/table/Table';
import TableHeader from '@/components/table/TableHeader';
import TableNoData from '@/components/table/TableNoData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { routeConfig } from '@/config/routeConfig';
import { toast } from '@/hooks/use-toast';
import { useFilter } from '@/hooks/useFilter';
import useTable from '@/hooks/useTable';
import {
  Distributor,
  IDistributorPayload,
  IDistributorResponse,
} from '@/lib/validations/distributor';
import { IApiResponse } from '@/types/common';
import { ITableHead } from '@/types/components/table';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import useSWR from 'swr';

export default function DistributorManagement() {
  const { page, rowsPerPage, order, orderBy, selected, handleSort } = useTable(
    {}
  );

  const TABLE_HEAD: ITableHead[] = [
    { id: 'sno', label: 'S.NO', align: 'left' },
    { id: 'firstName', label: 'FIRST NAME', align: 'left' },
    { id: 'lastName', label: 'LAST NAME', align: 'left' },
    { id: 'mobileNumber', label: 'PHONE NUMBER', align: 'left' },
    { id: 'emailAddress', label: 'EMAIL', align: 'left' },
    { id: 'status', label: 'STATUS', align: 'left' },
    { id: 'subDistributors', label: 'SUB DISTRIBUTORS', align: 'left' },
    { id: 'actions', label: 'ACTIONS', align: 'right' },
  ];

  const [selectedDistributor, setSelectedDistributor] =
    useState<Distributor | null>(null);
  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: 'add' | 'edit' | 'view';
  }>({ open: false, mode: 'add' });

  const initialFilterState = {
    name: '',
  };

  const { filterState, handleFilterInputChange } =
    useFilter(initialFilterState);

  const { data, error, mutate, isLoading } = useSWR<
    IApiResponse<IDistributorResponse>
  >(BACKEND_ENDPOINTS.DISTRIBUTOR.LIST(''));

  const distributors = data?.data?.distributors || [];

  // Filter distributors based on name term
  const filteredDistributors = distributors.filter(
    (distributor: Distributor) => {
      if (!filterState.name) return true;

      const nameTerm = filterState.name.toLowerCase();
      const fullName =
        `${distributor.firstName} ${distributor.lastName}`.toLowerCase();

      return fullName.includes(nameTerm);
    }
  );

  const handleModalOpen = (
    mode: 'add' | 'edit' | 'view',
    distributor?: Distributor
  ) => {
    setSelectedDistributor(distributor || null);
    setModalState({ open: true, mode });
  };

  const handleModalClose = () => {
    setModalState({ open: false, mode: 'add' });
    setSelectedDistributor(null);
  };

  const handleSubmit = async (payload: IDistributorPayload) => {
    try {
      if (modalState.mode === 'edit' && selectedDistributor) {
        await distributorApi.update(selectedDistributor.userId, payload);
        toast({
          title: 'Success',
          description: 'Distributor updated successfully',
        });
      } else {
        await distributorApi.create(payload);
        toast({
          title: 'Success',
          description: 'Distributor created successfully',
        });
      }
      mutate();
      handleModalClose();
    } catch (error) {
      console.error('Error submitting distributor:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (distributor: Distributor) => {
    try {
      await distributorApi.delete(distributor.userId);
      mutate();
    } catch (error) {
      console.error('Error deleting distributor:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const isNotFound = !filteredDistributors.length && !isLoading && !error;

  return (
    <Page>
      <div className='min-h-screen bg-gray-50/50'>
        <div className=''>
          <Breadcrumbs icon={routeConfig.distributor.icon} />

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
                Add Distributor
              </Button>
            </div>

            <Table>
              <TableHeader
                order={order}
                orderBy={orderBy}
                numSelected={selected.length}
                rowCount={distributors.length || 0}
                handleSort={handleSort}
                headerData={TABLE_HEAD}
              />
              <tbody>
                {!isLoading &&
                  filteredDistributors.map(
                    (distributor: Distributor, index: number) => (
                      <DistributorTableRow
                        key={distributor.id}
                        distributor={distributor}
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

        <DistributorModal
          open={modalState.open}
          onClose={handleModalClose}
          onSubmit={handleSubmit}
          mode={modalState.mode}
          distributor={selectedDistributor || undefined}
          isSubmitting={isLoading}
        />
      </div>
    </Page>
  );
}
