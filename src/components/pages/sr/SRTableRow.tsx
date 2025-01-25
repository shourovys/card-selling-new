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
import { routeConfig } from '@/config/routeConfig';
import { toast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/usePermissions';
import { cn } from '@/lib/utils';
import { SR } from '@/lib/validations/sr';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';

interface SRTableRowProps {
  sr: SR;
  index: number;
  onDelete: () => void;
}

export default function SRTableRow({ sr, index, onDelete }: SRTableRowProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { getActionPermissions } = usePermissions();
  const { canView, canEdit, canDelete } = getActionPermissions('SR');

  const { trigger, isMutating: isDeleting } = useSWRMutation(
    BACKEND_ENDPOINTS.SR.DELETE(sr.userId),
    sendDeleteRequest,
    {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Sales representative deleted successfully',
        });
        setDeleteDialogOpen(false);
        onDelete();
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
      onClick: () => navigate(routeConfig.srEdit.path(sr.userId)),
    },
    canView && {
      label: 'View',
      icon: <Eye className='w-4 h-4' />,
      onClick: () => navigate(routeConfig.srView.path(sr.userId)),
    },
    canDelete && {
      label: 'Delete',
      icon: <Trash2 className='w-4 h-4' />,
      onClick: () => setDeleteDialogOpen(true),
      variant: 'destructive' as const,
    },
  ];

  return (
    <>
      <TableRow className='border-b hover:bg-gray-50/50'>
        <TableData className='pl-4 w-1/12'>{index}</TableData>
        <TableData>{sr.firstName}</TableData>
        <TableData>{sr.lastName}</TableData>
        <TableData>{sr.mobileNumber}</TableData>
        <TableData>{sr.emailAddress}</TableData>
        <TableData>{'-'}</TableData>
        <TableData>{'-'}</TableData>
        <TableData>{'-'}</TableData>
        <TableData>
          <div
            className={cn(
              'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold text-white w-[90px] justify-center',
              sr.status ? 'bg-success' : 'bg-destructive'
            )}
          >
            {sr.status ? 'Active' : 'Inactive'}
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
            <AlertDialogTitle>Delete Sales Representative</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this sales representative? This
              action cannot be undone.
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
