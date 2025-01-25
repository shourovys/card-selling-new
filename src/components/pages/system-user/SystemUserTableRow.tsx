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
import { usePermissions } from '@/hooks/usePermissions';
import { cn } from '@/lib/utils';
import { SystemUser } from '@/lib/validations/system-user';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';

interface SystemUserTableRowProps {
  user: SystemUser;
  index: number;
  handleModalOpen: (mode: 'edit' | 'view', user: SystemUser) => void;
  onDelete: () => void;
}

export default function SystemUserTableRow({
  user,
  index,
  handleModalOpen,
  onDelete,
}: SystemUserTableRowProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { getActionPermissions } = usePermissions();
  const { canView, canEdit, canDelete } = getActionPermissions('SYSTEM_USER');

  const { trigger, isMutating: isDeleting } = useSWRMutation(
    BACKEND_ENDPOINTS.SYSTEM_USER.DELETE(user.userId),
    sendDeleteRequest,
    {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'System user deleted successfully',
        });
        onDelete();
        setDeleteDialogOpen(false);
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      },
    }
  );

  return (
    <>
      <TableRow className='border-b hover:bg-gray-50/50'>
        <TableData className='pl-4 w-1/12'>{index}</TableData>
        <TableData>{user.firstName}</TableData>
        <TableData>{user.lastName}</TableData>
        <TableData>{user.mobileNumber}</TableData>
        <TableData>{user.emailAddress}</TableData>
        <TableData>{user.type}</TableData>
        <TableData>
          <div
            className={cn(
              'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold text-white w-[90px] justify-center',
              user.status ? 'bg-success' : 'bg-destructive'
            )}
          >
            {user.status ? 'Active' : 'Inactive'}
          </div>
        </TableData>
        <TableData className='pr-1'>
          <TableDataAction
            className='flex justify-end items-center'
            actions={[
              canEdit && {
                label: 'Edit',
                icon: <Edit className='w-4 h-4' />,
                onClick: () => handleModalOpen('edit', user),
              },
              canView && {
                label: 'View',
                icon: <Eye className='w-4 h-4' />,
                onClick: () => handleModalOpen('view', user),
              },
              canDelete && {
                label: 'Delete',
                icon: <Trash2 className='w-4 h-4' />,
                onClick: () => setDeleteDialogOpen(true),
                variant: 'destructive',
              },
            ]}
          />
        </TableData>
      </TableRow>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete System User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this system user? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => trigger()}
              disabled={isDeleting}
              className='bg-destructive hover:bg-destructive/90'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
