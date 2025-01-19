import { sendDeleteRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
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
import { IAdditionalCategory } from '@/lib/validations/additional-category';
import { Edit, Eye, MoreHorizontal, Trash } from 'lucide-react';
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

  const handleDelete = async () => {
    try {
      await deleteCategory();
      onDelete();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <tr className='hover:bg-muted/50'>
        <td className='px-6 py-4 whitespace-nowrap text-sm'>{index + 1}</td>
        <td className='px-6 py-4 whitespace-nowrap'>
          <div className='flex items-center gap-4'>
            <img
              src={category.icon}
              alt={category.name}
              className='w-10 h-10 rounded border p-0.5 object-contain'
            />
            <div className='min-w-0'>
              <p className='text-sm font-medium text-foreground truncate'>
                {category.name.slice(0, 60)}
              </p>
              <p className='text-xs text-muted-foreground truncate max-w-[300px]'>
                {category.description?.slice(0, 60)}
              </p>
            </div>
          </div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
          <div
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              category.status
                ? 'bg-success/10 text-success'
                : 'bg-destructive/10 text-destructive'
            }`}
          >
            {category.status ? 'Active' : 'Inactive'}
          </div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap text-sm'>
          {category.position}
        </td>
        <td className='px-6 py-4 whitespace-nowrap text-sm'>
          {category.createdBy}
        </td>
        <td className='px-6 py-4 whitespace-nowrap text-right'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='h-8 w-8 p-0'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                onClick={() => handleModalOpen('view', category)}
              >
                <Eye className='mr-2 h-4 w-4' />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleModalOpen('edit', category)}
              >
                <Edit className='mr-2 h-4 w-4' />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteDialogOpen(true)}
                className='text-destructive focus:text-destructive'
              >
                <Trash className='mr-2 h-4 w-4' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>

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
              onClick={handleDelete}
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
