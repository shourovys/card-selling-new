import { sendDeleteRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import TableData from '@/components/table/TableData';
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
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { Role } from '@/lib/validations/role';
import { Edit, Eye, MoreVertical, Trash2 } from 'lucide-react';
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

  const { trigger, isMutating } = useSWRMutation(
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
        <TableData className='pr-1 w-1/12 text-right'>
          <div className='flex gap-1 justify-end items-center'>
            <Button
              variant='ghost'
              size='icon'
              className='w-8 h-8 hover:bg-gray-100'
              onClick={() => handleModalOpen('edit', role)}
            >
              <Edit className='w-4 h-4 text-gray-500' />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='w-8 h-8 hover:bg-gray-100'>
                  <span className='sr-only'>Open menu</span>
                  <MoreVertical className='w-4 h-4 text-gray-500' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-[160px]'>
                <DropdownMenuItem
                  onClick={() => handleModalOpen('view', role)}
                  className='text-sm'
                >
                  <Eye className='mr-2 w-4 h-4 text-primary' />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className='text-sm text-destructive focus:text-destructive'
                >
                  <Trash2 className='mr-2 w-4 h-4' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
              onClick={() => trigger()}
              disabled={isMutating}
              className='bg-red-600 focus:ring-red-600'
            >
              {isMutating ? (
                <span className='flex items-center gap-2'>
                  <span className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
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
