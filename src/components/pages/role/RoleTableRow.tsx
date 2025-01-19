import { roleApi } from '@/api/role';
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
import { useToast } from '@/hooks/use-toast';
import { Role } from '@/lib/validations/role';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

interface RoleTableRowProps {
  role: Role;
  index: number;
  handleModalOpen: (mode: 'edit' | 'view', role: Role) => void;
  onDelete: (id: number) => void;
}

export const RoleTableRow = ({
  role,
  index,
  handleModalOpen,
  onDelete,
}: RoleTableRowProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await roleApi.delete(role.id);
      toast({
        title: 'Success',
        description: 'Role deleted successfully',
      });
      onDelete(role.id);
    } catch (err) {
      console.error('Error deleting role:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete role',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <TableRow>
        <TableData>{index + 1}</TableData>
        <TableData>{role.roleName}</TableData>
        <TableData>{role.permissions?.length}</TableData>
        <TableData>{new Date(role.createdAt).toLocaleDateString()}</TableData>
        <TableData>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='p-0 w-8 h-8'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='w-4 h-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => handleModalOpen('view', role)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleModalOpen('edit', role)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className='text-red-600'
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableData>
      </TableRow>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              role.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className='bg-red-600 focus:ring-red-600'
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
