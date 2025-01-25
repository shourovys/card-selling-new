import { sendDeleteRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import { SubDistributorListModal } from '@/components/modals/sub-distributor-list-modal';
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
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/usePermissions';
import { cn } from '@/lib/utils';
import { Distributor } from '@/lib/validations/distributor';
import { Edit, Eye, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';

interface DistributorTableRowProps {
  distributor: Distributor;
  index: number;
  handleModalOpen: (mode: 'edit' | 'view', distributor: Distributor) => void;
  onDelete: (distributor: Distributor) => Promise<void>;
}

export default function DistributorTableRow({
  distributor,
  index,
  handleModalOpen,
  onDelete,
}: DistributorTableRowProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subDistributorModalOpen, setSubDistributorModalOpen] = useState(false);
  const { getActionPermissions } = usePermissions();
  const { canView, canEdit, canDelete } = getActionPermissions('DISTRIBUTOR');

  const { trigger, isMutating: isDeleting } = useSWRMutation(
    BACKEND_ENDPOINTS.DISTRIBUTOR.DELETE(distributor.userId),
    sendDeleteRequest,
    {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Distributor deleted successfully',
        });
        onDelete(distributor);
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
        <TableData>{distributor.firstName}</TableData>
        <TableData>{distributor.lastName}</TableData>
        <TableData>{distributor.mobileNumber}</TableData>
        <TableData>{distributor.emailAddress}</TableData>
        <TableData>
          <div
            className={cn(
              'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold text-white w-[90px] justify-center',
              distributor.status ? 'bg-success' : 'bg-destructive'
            )}
          >
            {distributor.status ? 'Active' : 'Inactive'}
          </div>
        </TableData>
        <TableData>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
            onClick={() => setSubDistributorModalOpen(true)}
            disabled={!canView}
          >
            <Users className='w-4 h-4' />
            Show Sub Distributors
          </Button>
        </TableData>
        <TableData className='pr-1'>
          <TableDataAction
            className='flex justify-end items-center'
            actions={[
              canEdit && {
                label: 'Edit',
                icon: <Edit className='w-4 h-4' />,
                onClick: () => handleModalOpen('edit', distributor),
              },
              canView && {
                label: 'View',
                icon: <Eye className='w-4 h-4' />,
                onClick: () => handleModalOpen('view', distributor),
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
            <AlertDialogTitle>Delete Distributor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this distributor? This action
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

      <SubDistributorListModal
        open={subDistributorModalOpen}
        onClose={() => setSubDistributorModalOpen(false)}
        distributor={distributor}
      />
    </>
  );
}
