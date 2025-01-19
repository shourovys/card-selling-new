import { sendPostRequest, sendPutRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import TableBodyLoading from '@/components/loading/TableBodyLoading';
import { RoleModal } from '@/components/modals/role-modal';
import { RoleTableRow } from '@/components/pages/role/RoleTableRow';
import Table from '@/components/table/Table';
import TableHeader from '@/components/table/TableHeader';
import TableNoData from '@/components/table/TableNoData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useFilter } from '@/hooks/useFilter';
import useTable from '@/hooks/useTable';
import { Role, RoleFormValues } from '@/lib/validations/role';
import { routePaths } from '@/routes/routePaths';
import { IApiResponse } from '@/types/common';
import { ITableHead } from '@/types/components/table';
import {
  IPermissionGroupResponse,
  IPermissionResponse,
  IRoleResponse,
} from '@/types/features/role';
import { Plus } from 'lucide-react';
import QueryString from 'qs';
import { useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

export default function RoleManagement() {
  // Table state management
  const { rowsPerPage, order, orderBy, selected, handleSort } = useTable({});

  // Define table head columns
  const TABLE_HEAD: ITableHead[] = [
    { id: 'sno', label: 'S.NO', align: 'left' },
    { id: 'roleName', label: 'ROLE NAME', align: 'left' },
    { id: 'permissions', label: 'PERMISSIONS', align: 'left' },
    { id: 'createdAt', label: 'CREATED AT', align: 'left' },
    { id: 'actions', label: 'ACTIONS', align: 'right' },
  ];

  // Modal state
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
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
  });

  // Fetch roles using SWR
  const {
    data: rolesData,
    mutate: mutateRoles,
    isLoading,
  } = useSWR<IApiResponse<IRoleResponse>>(
    BACKEND_ENDPOINTS.ROLE.LIST(apiQueryParamsString)
  );

  const { data: permissionsData } = useSWR<IApiResponse<IPermissionResponse>>(
    BACKEND_ENDPOINTS.ROLE.PERMISSIONS
  );

  const { data: permissionGroupsData } = useSWR<
    IApiResponse<IPermissionGroupResponse>
  >(BACKEND_ENDPOINTS.ROLE.PERMISSION_GROUPS);

  const roles = rolesData?.data?.roles || [];
  const permissions = permissionsData?.data?.permissions || [];
  const permissionGroups = permissionGroupsData?.data?.permissionGroups || [];

  // Modal handlers
  const handleModalOpen = (mode: 'add' | 'edit' | 'view', role?: Role) => {
    setSelectedRole(role || null);
    setModalState({ open: true, mode });
  };

  const handleModalClose = () => {
    setModalState({ open: false, mode: 'add' });
    setSelectedRole(null);
  };

  const { trigger: createTrigger, isMutating: isCreating } = useSWRMutation(
    BACKEND_ENDPOINTS.ROLE.CREATE,
    sendPostRequest
  );

  const { trigger: updateTrigger, isMutating: isUpdating } = useSWRMutation(
    selectedRole ? BACKEND_ENDPOINTS.ROLE.UPDATE(selectedRole.id) : null,
    sendPutRequest
  );

  // API handlers
  const handleSubmit = async (formData: RoleFormValues) => {
    try {
      const payload = {
        metaInfo: {
          deviceID: 'web',
          deviceType: 'web',
          deviceInfo: {
            deviceID: 'web',
            deviceType: 'web',
            notificationToken: '',
          },
        },
        attribute: {
          roleName: formData.roleName,
          permissions: formData.permissions,
        },
      };

      if (modalState.mode === 'edit' && selectedRole) {
        await updateTrigger(payload);
        toast({
          title: 'Success',
          description: 'Role updated successfully',
        });
      } else {
        await createTrigger(payload);
        toast({
          title: 'Success',
          description: 'Role created successfully',
        });
      }
      mutateRoles();
      handleModalClose();
    } catch (error) {
      console.error('Error submitting role:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const onDelete = () => {
    mutateRoles();
  };

  // Check if no data is found
  const isNotFound = !roles.length && !isLoading;

  const breadcrumbItems = [
    { label: 'Dashboard', href: routePaths.dashboard },
    { label: 'Role' },
  ];

  return (
    <div className='min-h-screen bg-gray-50/50'>
      <div>
        <Breadcrumbs items={breadcrumbItems} title='Role Management' />

        <Card className='p-6 space-y-4 bg-white shadow-sm'>
          <div className='flex justify-between items-center pb-2'>
            <Input
              placeholder='Search roles...'
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
              Add Role
            </Button>
          </div>

          <Table>
            <TableHeader
              order={order}
              orderBy={orderBy}
              numSelected={selected.length}
              rowCount={roles.length || 0}
              handleSort={handleSort}
              headerData={TABLE_HEAD}
            />
            <tbody>
              {!isLoading &&
                roles.map((role: Role, index: number) => (
                  <RoleTableRow
                    key={role.id}
                    role={role}
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

      <RoleModal
        open={modalState.open}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        mode={modalState.mode}
        role={
          selectedRole
            ? {
                roleName: selectedRole.roleName,
                permissions: selectedRole.permissions.map(
                  (p) => p.permissionName
                ),
              }
            : undefined
        }
        isSubmitting={isCreating || isUpdating}
        permissions={permissions}
        permissionGroups={permissionGroups}
      />
    </div>
  );
}
