import { sendPostRequest, sendPutRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Page from '@/components/HOC/page';
import TableBodyLoading from '@/components/loading/TableBodyLoading';
import { SystemUserModal } from '@/components/modals/system-user-modal';
import SystemUserTableRow from '@/components/pages/system-user/SystemUserTableRow';
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
  ISystemUserPayload,
  ISystemUserResponse,
  SystemUser,
} from '@/lib/validations/system-user';
import { IApiResponse } from '@/types/common';
import { ITableHead } from '@/types/components/table';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

export default function SystemUserManagement() {
  const { page, rowsPerPage, order, orderBy, selected, handleSort } = useTable(
    {}
  );
  const { getActionPermissions } = usePermissions();
  const { canCreate } = getActionPermissions('SYSTEM_USER');

  const TABLE_HEAD: ITableHead[] = [
    { id: 'sno', label: 'S.NO', align: 'left' },
    { id: 'firstName', label: 'FIRST NAME', align: 'left' },
    { id: 'lastName', label: 'LAST NAME', align: 'left' },
    { id: 'mobileNumber', label: 'PHONE NUMBER', align: 'left' },
    { id: 'emailAddress', label: 'EMAIL', align: 'left' },
    { id: 'roleName', label: 'ROLE', align: 'left' },
    { id: 'status', label: 'STATUS', align: 'left' },
    { id: 'actions', label: 'ACTIONS', align: 'right' },
  ];

  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
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
    IApiResponse<ISystemUserResponse>
  >(BACKEND_ENDPOINTS.SYSTEM_USER.LIST(''));

  const users = data?.data?.users || [];

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    if (!filterState.search) return true;

    const searchTerm = filterState.search.toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();

    return fullName.includes(searchTerm);
  });

  const handleModalOpen = (
    mode: 'add' | 'edit' | 'view',
    user?: SystemUser
  ) => {
    setSelectedUser(user || null);
    setModalState({ open: true, mode });
  };

  const handleModalClose = () => {
    setModalState({ open: false, mode: 'add' });
    setSelectedUser(null);
  };

  const { trigger: createSystemUser, isMutating: isCreatingSystemUser } =
    useSWRMutation(BACKEND_ENDPOINTS.SYSTEM_USER.CREATE, sendPostRequest, {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'System user created successfully',
        });
      },
    });

  const { trigger: updateSystemUser, isMutating: isUpdatingSystemUser } =
    useSWRMutation(
      selectedUser?.userId
        ? BACKEND_ENDPOINTS.SYSTEM_USER.UPDATE(selectedUser.userId)
        : null,
      sendPutRequest,
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'System user updated successfully',
          });
        },
      }
    );

  const handleSubmit = async (payload: ISystemUserPayload) => {
    if (modalState.mode === 'edit' && selectedUser) {
      await updateSystemUser(payload);
    } else {
      await createSystemUser(payload);
    }
    mutate();
  };

  const handleDelete = () => {
    mutate();
  };

  const isNotFound = !users.length && !isLoading && !error;

  return (
    <Page>
      <div className='min-h-screen bg-gray-50/50'>
        <div className=''>
          <Breadcrumbs icon={routeConfig.systemUser.icon} />

          <Card className='p-6 space-y-4 bg-white shadow-sm'>
            <div className='flex justify-between items-center pb-2'>
              <Input
                placeholder='Search system users...'
                value={filterState.search}
                onChange={(e) =>
                  handleFilterInputChange('search', e.target.value)
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
                  Add System User
                </Button>
              )}
            </div>

            <Table>
              <TableHeader
                order={order}
                orderBy={orderBy}
                numSelected={selected.length}
                rowCount={users.length || 0}
                handleSort={handleSort}
                headerData={TABLE_HEAD}
              />
              <tbody>
                {!isLoading &&
                  filteredUsers.map((user, index) => (
                    <SystemUserTableRow
                      key={user.userId}
                      user={user}
                      index={(page - 1) * rowsPerPage + index + 1}
                      handleModalOpen={handleModalOpen}
                      onDelete={handleDelete}
                    />
                  ))}
                {/* <TableEmptyRows
                emptyRows={
                  data ? emptyRows(page, rowsPerPage, users.length) : 0
                }
              /> */}
              </tbody>
            </Table>

            <TableNoData isNotFound={isNotFound} />
            <TableBodyLoading
              isLoading={isLoading}
              tableRowPerPage={rowsPerPage}
            />

            {/* <Pagination
            totalRows={data?.data?.data.totalItems || 0}
            currentPage={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
          </Card>
        </div>

        <SystemUserModal
          open={modalState.open}
          onClose={handleModalClose}
          onSubmit={handleSubmit}
          mode={modalState.mode}
          user={selectedUser || undefined}
          isSubmitting={isCreatingSystemUser || isUpdatingSystemUser}
        />
      </div>
    </Page>
  );
}
