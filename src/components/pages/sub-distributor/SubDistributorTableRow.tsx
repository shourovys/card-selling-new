import { sendDeleteRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import { SRListModal } from '@/components/modals/sr-list-modal';
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
import usePermissions from '@/hooks/usePermissions';
import { cn } from '@/lib/utils';
import { SubDistributor } from '@/lib/validations/sub-distributor';
import { Edit, Eye, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';

interface SubDistributorTableRowProps {
  subDistributor: SubDistributor;
  index: number;
  handleModalOpen: (
    mode: 'edit' | 'view',
    subDistributor: SubDistributor
  ) => void;
  onDelete: () => void;
}

export default function SubDistributorTableRow({
  subDistributor,
  index,
  handleModalOpen,
  onDelete,
}: SubDistributorTableRowProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [srModalOpen, setSrModalOpen] = useState(false);
  const { getActionPermissions } = usePermissions();
  const { canView, canEdit, canDelete } =
    getActionPermissions('SUB_DISTRIBUTOR');

  const { trigger, isMutating: isDeleting } = useSWRMutation(
    BACKEND_ENDPOINTS.SUB_DISTRIBUTOR.DELETE(subDistributor.userId),
    sendDeleteRequest,
    {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Sub distributor deleted successfully',
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

  const actions = [
    canEdit && {
      label: 'Edit',
      icon: <Edit className='w-4 h-4' />,
      onClick: () => handleModalOpen('edit', subDistributor),
    },
    canView && {
      label: 'View',
      icon: <Eye className='w-4 h-4' />,
      onClick: () => handleModalOpen('view', subDistributor),
    },
    canDelete && {
      label: 'Delete',
      icon: <Trash2 className='w-4 h-4' />,
      onClick: () => setDeleteDialogOpen(true),
      variant: 'destructive' as const,
    },
  ].filter(Boolean);

  return (
    <>
      <TableRow className='border-b hover:bg-gray-50/50'>
        <TableData className='pl-4 w-1/12'>{index}</TableData>
        <TableData>{subDistributor.firstName}</TableData>
        <TableData>{subDistributor.lastName}</TableData>
        <TableData>{subDistributor.mobileNumber}</TableData>
        <TableData>{subDistributor.emailAddress}</TableData>
        <TableData>
          <Button
            variant='outline'
            size='sm'
            className='flex gap-2 items-center'
            onClick={() => setSrModalOpen(true)}
            disabled={!canView}
          >
            <Users className='w-4 h-4' />
            Show SR
          </Button>
        </TableData>
        <TableData>
          <div
            className={cn(
              'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold text-white w-[90px] justify-center',
              subDistributor.status ? 'bg-success' : 'bg-destructive'
            )}
          >
            {subDistributor.status ? 'Active' : 'Inactive'}
          </div>
        </TableData>
        <TableData className='pr-1'>
          <TableDataAction
            className='flex justify-end items-center'
            actions={actions}
          />
        </TableData>
      </TableRow>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sub Distributor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this sub distributor? This action
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

      <SRListModal
        open={srModalOpen}
        onClose={() => setSrModalOpen(false)}
        subDistributor={subDistributor}
      />
    </>
  );
}
