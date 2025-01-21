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
import { cn } from '@/lib/utils';
import { SR } from '@/lib/validations/sr';
import { routePaths } from '@/routes/routePaths';
import { Edit, Eye, MoreVertical, Trash2 } from 'lucide-react';
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
        <TableData className='pr-1 text-right'>
          <div className='flex gap-1 justify-end items-center'>
            <Button
              variant='ghost'
              size='icon'
              className='w-8 h-8 hover:bg-gray-100'
              onClick={() => navigate(routePaths.srEdit(sr.userId))}
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
                  onClick={() => navigate(routePaths.srView(sr.userId))}
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
