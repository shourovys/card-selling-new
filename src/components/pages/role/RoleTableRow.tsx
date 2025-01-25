import { sendDeleteRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import TableData from '@/components/table/TableData';
import TableDataAction from '@/components/table/TableDataAction';
import TableRow from '@/components/table/TableRow';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import usePermissions from '@/hooks/usePermissions';
import { Role } from '@/lib/validations/role';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';

interface RoleTableRowProps {
  role: Role;
  index: number;
  handleModalOpen: (mode: 'edit' | 'view', role: Role) => void;
  onDelete: () => void;
}

export const RoleTableRow = ({
  role,
  index,
  handleModalOpen,
  onDelete,
}: RoleTableRowProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { getActionPermissions } = usePermissions();
  const { canView, canEdit, canDelete } = getActionPermissions('ROLE');

  const { trigger: deleteRole, isMutating } = useSWRMutation(
    BACKEND_ENDPOINTS.ROLE.DELETE(role.id),
    sendDeleteRequest,
    {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Role deleted successfully',
        });
        onDelete();
      },
      onError: (error) => {
        console.error('Error deleting role:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete role. Please try again.',
          variant: 'destructive',
        });
        setShowDeleteDialog(false);
      },
    }
  );

  const actions = [
    canEdit && {
      label: 'Edit',
      icon: <Edit className='w-4 h-4' />,
      onClick: () => handleModalOpen('edit', role),
    },
    canView && {
      label: 'View',
      icon: <Eye className='w-4 h-4' />,
      onClick: () => handleModalOpen('view', role),
    },
    canDelete && {
      label: 'Delete',
      icon: <Trash2 className='w-4 h-4' />,
      onClick: () => setShowDeleteDialog(true),
      variant: 'destructive' as const,
    },
  ];

  return (
    <>
      <TableRow>
        <TableData className='pl-4 w-1/12'>{index}</TableData>
        <TableData className='w-1/4'>
          <div className='flex flex-col'>
            <span className='font-medium'>{role.roleName}</span>
          </div>
        </TableData>
        <TableData>
          <div className='flex flex-col'>
            <span className='text-sm text-muted-foreground'>
              {role.permissions?.length} Permission
              {role.permissions?.length !== 1 && 's'}
            </span>
            <span className='text-xs text-muted-foreground'>
              {role.permissions
                ?.slice(0, 2)
                ?.map((p) => p.displayName)
                ?.join(', ')}
              {role.permissions?.length > 2 &&
                ` +${role.permissions?.length - 2} more`}
            </span>
          </div>
        </TableData>
        <TableData>
          {new Date(role.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </TableData>
        <TableData className='pr-1 w-1/12'>
          <TableDataAction
            className='flex justify-end items-center'
            actions={actions}
          />
        </TableData>
      </TableRow>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the role "{role.roleName}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMutating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteRole()}
              disabled={isMutating}
              className='bg-destructive hover:bg-destructive/90'
            >
              {isMutating ? (
                <span className='flex gap-2 items-center'>
                  <span className='w-4 h-4 rounded-full border-2 border-current animate-spin border-t-transparent' />
                  Deleting...
                </span>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
