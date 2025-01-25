import { sendPostRequest, sendPutRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Page from '@/components/HOC/page';
import TableBodyLoading from '@/components/loading/TableBodyLoading';
import { SubDistributorModal } from '@/components/modals/sub-distributor-modal';
import SubDistributorTableRow from '@/components/pages/sub-distributor/SubDistributorTableRow';
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
import {
  ISubDistributorPayload,
  SubDistributor,
  SubDistributorFormValues,
} from '@/lib/validations/sub-distributor';
import { IApiResponse } from '@/types/common';
import { ITableHead } from '@/types/components/table';
import { getMetaInfo } from '@/utils/getMetaInfo';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

interface ISubDistributorResponse {
  subDistributors: SubDistributor[];
}

interface SubDistributorFilter {
  name: string;
}

export default function SubDistributorManagement() {
  // Table state management
  const { rowsPerPage, order, orderBy, selected, handleSort } = useTable({});
  const { getActionPermissions } = usePermissions();
  const { canCreate } = getActionPermissions('SUB_DISTRIBUTOR');

  // Define table head columns
  const TABLE_HEAD: ITableHead[] = [
    { id: 'sno', label: 'S.NO', align: 'left' },
    { id: 'firstName', label: 'FIRST NAME', align: 'left' },
    { id: 'lastName', label: 'LAST NAME', align: 'left' },
    { id: 'mobileNumber', label: 'MOBILE', align: 'left' },
    { id: 'emailAddress', label: 'EMAIL', align: 'left' },
    { id: 'sr', label: 'SR', align: 'left' },
    { id: 'status', label: 'STATUS', align: 'left' },
    { id: 'actions', label: 'ACTIONS', align: 'right' },
  ];

  // Modal state
  const [selectedSubDistributor, setSelectedSubDistributor] =
    useState<SubDistributor | null>(null);
  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: 'add' | 'edit' | 'view';
  }>({ open: false, mode: 'add' });

  // Filter state management
  const initialFilterState: SubDistributorFilter = {
    name: '',
  };

  const { filterState, handleFilterInputChange } =
    useFilter(initialFilterState);

  // Fetch sub distributors using SWR
  const { data, error, mutate, isLoading } = useSWR<
    IApiResponse<ISubDistributorResponse>
  >(BACKEND_ENDPOINTS.SUB_DISTRIBUTOR.LIST(''));

  const subDistributors = data?.data?.subDistributors || [];

  // Filter sub distributors based on name term
  const filteredSubDistributors = subDistributors.filter(
    (subDistributor: SubDistributor) => {
      if (!filterState.name) return true;

      const nameTerm = filterState.name.toLowerCase();
      const fullName =
        `${subDistributor.firstName} ${subDistributor.lastName}`.toLowerCase();

      return fullName.includes(nameTerm);
    }
  );

  // Modal handlers
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

  const { trigger: createTrigger, isMutating: isCreating } = useSWRMutation(
    BACKEND_ENDPOINTS.SUB_DISTRIBUTOR.CREATE,
    sendPostRequest
  );

  const { trigger: updateTrigger, isMutating: isUpdating } = useSWRMutation(
    selectedSubDistributor?.userId
      ? BACKEND_ENDPOINTS.SUB_DISTRIBUTOR.UPDATE(selectedSubDistributor.userId)
      : null,
    sendPutRequest
  );

  // API handlers
  const handleSubmit = async (values: SubDistributorFormValues) => {
    try {
      const payload: ISubDistributorPayload = {
        metaInfo: getMetaInfo(),
        attribute: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          distributorId: values.distributorId,
          status: values.status === 'active',
          checkerId: values.status === 'active' ? null : values.checkerId,
        },
      };

      if (modalState.mode === 'edit' && selectedSubDistributor) {
        await updateTrigger(payload);
        toast({
          title: 'Success',
          description: 'Sub distributor updated successfully',
        });
      } else {
        await createTrigger(payload);
        toast({
          title: 'Success',
          description: 'Sub distributor created successfully',
        });
      }
      mutate(); // Refresh the sub distributors list
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

  const handleDelete = () => {
    mutate(); // Refresh the sub distributors list
  };

  // Check if no data is found
  const isNotFound = !filteredSubDistributors.length && !isLoading && !error;

  return (
    <Page>
      <div className='min-h-screen bg-gray-50/50'>
        <div className=''>
          <Breadcrumbs icon={routeConfig.subDistributor.icon} />

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
                  Add Sub Distributor
                </Button>
              )}
            </div>

            <Table>
              <TableHeader
                order={order}
                orderBy={orderBy}
                numSelected={selected.length}
                rowCount={filteredSubDistributors.length || 0}
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
                        index={index + 1}
                        handleModalOpen={handleModalOpen}
                        onDelete={handleDelete}
                      />
                    )
                  )}
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

        <SubDistributorModal
          open={modalState.open}
          onClose={handleModalClose}
          onSubmit={handleSubmit}
          mode={modalState.mode}
          subDistributor={selectedSubDistributor || undefined}
          isSubmitting={isCreating || isUpdating}
        />
      </div>
    </Page>
  );
}
