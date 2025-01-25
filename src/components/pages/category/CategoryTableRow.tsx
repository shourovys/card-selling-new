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
import { cn } from '@/lib/utils';
import { Category } from '@/lib/validations/category';
import { Edit, Eye, Trash2 } from 'lucide-react';
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
    BACKEND_ENDPOINTS.CATEGORY.DELETE(category.id),
    sendDeleteRequest,
    {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Category deleted successfully',
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
              <p className='font-medium mb-0.5 max-w-[400px] truncate'>
                {category.name}
              </p>
              <p className='text-xs max-w-[400px] truncate'>
                {category?.description}
              </p>
            </div>
          </div>
        </TableData>
        <TableData>
          <div
            className={cn(
              'inline-flex items-center rounded-full px-1 py-1 text-xs font-semibold text-white w-[90px] justify-center',
              category.status ? 'bg-success' : 'bg-destructive'
            )}
          >
            {category.status ? 'Active' : 'Inactive'}
          </div>
        </TableData>
        <TableData>{new Date(category.createdAt).toLocaleString()}</TableData>
        <TableData className='pr-1'>
          <TableDataAction
            className='flex justify-end items-center'
            actions={[
              {
                label: 'Edit',
                icon: <Edit className='w-4 h-4' />,
                onClick: () => handleModalOpen('edit', category),
              },
              {
                label: 'View',
                icon: <Eye className='w-4 h-4' />,
                onClick: () => handleModalOpen('view', category),
              },
              {
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
