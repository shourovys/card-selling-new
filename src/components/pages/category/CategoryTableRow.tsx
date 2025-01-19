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
import { Category } from '@/lib/validations/category';
import { Edit, Eye, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';

interface CategoryTableRowProps {
  category: Category;
  index: number;
  handleModalOpen: (mode: 'edit' | 'view', category: Category) => void;
  onDelete: () => void;
}

export default function CategoryTableRow({
  category,
  index,
  handleModalOpen,
  onDelete,
}: CategoryTableRowProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { trigger: deleteCategory, isMutating: isDeleting } = useSWRMutation(
    BACKEND_ENDPOINTS.ADDITIONAL_CATEGORY.DELETE(category.id),
    sendDeleteRequest,
    {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Additional category deleted successfully',
        });
        onDelete();
      },
    }
  );

  return (
    <>
      <TableRow className='border-b hover:bg-gray-50/50'>
        <TableData className='pl-4 w-1/12'>{index + 1}</TableData>
        <TableData className='w-1/2'>
          <div className='flex gap-4 items-center'>
            <div className='flex-shrink-0'>
              <img
                src={category.icon}
                alt={category.name}
                className='object-contain p-1 w-10 h-10 bg-white rounded border'
              />
            </div>
            <div className='min-w-0'>
              <p className='font-medium mb-0.5 truncate'>{category.name}</p>
              <p className='text-xs truncate'>Category for {category.type}</p>
            </div>
          </div>
        </TableData>
        <TableData>
          <div
            className={cn(
              'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white w-[90px] justify-center',
              category.status ? 'bg-success' : 'bg-destructive'
            )}
          >
            {category.status ? 'Active' : 'Inactive'}
          </div>
        </TableData>
        <TableData>{new Date(category.createdAt).toLocaleString()}</TableData>
        <TableData className='pr-4 text-right'>
          <div className='flex gap-1 justify-end items-center'>
            <Button
              variant='ghost'
              size='icon'
              className='w-8 h-8 hover:bg-gray-100'
              onClick={() => handleModalOpen('edit', category)}
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
                  onClick={() => handleModalOpen('view', category)}
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
            <AlertDialogTitle>Delete Additional Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this additional category? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCategory()}
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
