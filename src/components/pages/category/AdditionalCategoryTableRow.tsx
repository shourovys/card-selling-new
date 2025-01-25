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
import { IAdditionalCategory } from '@/lib/validations/additional-category';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';

interface AdditionalCategoryTableRowProps {
  category: IAdditionalCategory;
  index: number;
  handleModalOpen: (
    mode: 'edit' | 'view',
    category: IAdditionalCategory
  ) => void;
  onDelete: () => void;
}

export default function AdditionalCategoryTableRow({
  category,
  index,
  handleModalOpen,
  onDelete,
}: AdditionalCategoryTableRowProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { trigger: deleteAddtionalCategory, isMutating: isDeleting } =
    useSWRMutation(
      BACKEND_ENDPOINTS.ADDITIONAL_CATEGORY.DELETE(category.id),
      sendDeleteRequest,
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Additional category deleted successfully',
          });
          onDelete();
          setDeleteDialogOpen(false);
        },
        onError: (error) => {
          console.error('Error deleting category:', error);
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
        <TableData className='pl-4 w-1/12 text-sm'>{index + 1}</TableData>
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
              <p className='font-medium mb-0.5 truncate max-w-[400px]'>
                {category.name}
              </p>
              <p className='truncate max-w-[400px]'>{category.description}</p>
            </div>
          </div>
        </TableData>
        <TableData>
          <div
            className={cn(
              'inline-flex items-center rounded-full px-3 py-1 font-semibold text-white w-[90px] justify-center',
              category.status ? 'bg-success' : 'bg-destructive'
            )}
          >
            {category.status ? 'Active' : 'Inactive'}
          </div>
        </TableData>
        <TableData className='w-[200px] text-center'>
          {category.position}
        </TableData>
        <TableData>{category.createdBy}</TableData>
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
              onClick={() => deleteAddtionalCategory()}
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
