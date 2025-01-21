import { sendDeleteRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import { SRListModal } from '@/components/modals/sr-list-modal';
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
import { cn } from '@/lib/utils';
import { SubDistributor } from '@/lib/validations/sub-distributor';
import { Edit, Eye, MoreVertical, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';

interface SubDistributorTableRowProps {
  subDistributor: SubDistributor;
  index: number;
  handleModalOpen: (
    mode: 'edit' | 'view',
    subDistributor: SubDistributor
  ) => void;
  onDelete: (subDistributor: SubDistributor) => Promise<void>;
}

export default function SubDistributorTableRow({
  subDistributor,
  index,
  handleModalOpen,
  onDelete,
}: SubDistributorTableRowProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [srModalOpen, setSrModalOpen] = useState(false);

  const { trigger, isMutating: isDeleting } = useSWRMutation(
    BACKEND_ENDPOINTS.SUB_DISTRIBUTOR.DELETE(subDistributor.userId),
    sendDeleteRequest,
    {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Sub distributor deleted successfully',
        });
        onDelete(subDistributor);
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
        <TableData>{subDistributor.firstName}</TableData>
        <TableData>{subDistributor.lastName}</TableData>
        <TableData>{subDistributor.mobileNumber}</TableData>
        <TableData>{subDistributor.emailAddress}</TableData>
        <TableData>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
            onClick={() => setSrModalOpen(true)}
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
        <TableData className='pr-1 text-right'>
          <div className='flex gap-1 justify-end items-center'>
            <Button
              variant='ghost'
              size='icon'
              className='w-8 h-8 hover:bg-gray-100'
              onClick={() => handleModalOpen('edit', subDistributor)}
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
                  onClick={() => handleModalOpen('view', subDistributor)}
                  className='text-sm'
                >
                  <Eye className='mr-2 w-4 h-4 text-primary' />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteDialogOpen(true)}
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
