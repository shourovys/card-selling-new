import { productApi } from '@/api/product';
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
import { usePermissions } from '@/hooks/usePermissions';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/validations/product';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ProductTableRowProps {
  product: Product;
  index: number;
  handleModalOpen: (mode: 'edit' | 'view', product: Product) => void;
  onDelete: () => void;
}

export default function ProductTableRow({
  product,
  index,
  handleModalOpen,
  onDelete,
}: ProductTableRowProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { getActionPermissions } = usePermissions();
  const { canView, canEdit, canDelete } = getActionPermissions('PRODUCT');

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      if (!product.id) return;
      await productApi.delete(product.id);
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      onDelete();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <TableRow className='border-b hover:bg-gray-50/50'>
        <TableData className='pl-4 w-1/12'>{index + 1}</TableData>
        <TableData className='w-1/2'>
          <div className='flex gap-4 items-center'>
            <div className='flex-shrink-0'>
              <img
                src={product.image}
                alt={product.name}
                className='object-cover p-1 w-10 h-10 bg-white rounded border'
              />
            </div>
            <div className='min-w-0'>
              <p className='font-medium mb-0.5 truncate max-w-[400px]'>
                {product.name}
              </p>
              {product.description && (
                <p className='text-xs truncate max-w-[400px]'>
                  {product.description}
                </p>
              )}
            </div>
          </div>
        </TableData>
        <TableData>
          <div
            className={cn(
              'inline-flex items-center rounded-full px-1 py-1 text-xs font-semibold text-white w-[90px] justify-center',
              product.status ? 'bg-success' : 'bg-destructive'
            )}
          >
            {product.status ? 'Active' : 'Inactive'}
          </div>
        </TableData>
        <TableData>{product.category?.name}</TableData>
        <TableData>{new Date(product.createdAt).toLocaleString()}</TableData>
        <TableData className='pr-1'>
          <TableDataAction
            className='flex justify-end items-center'
            actions={[
              canEdit && {
                label: 'Edit',
                icon: <Edit className='w-4 h-4' />,
                onClick: () => handleModalOpen('edit', product),
              },
              canView && {
                label: 'View',
                icon: <Eye className='w-4 h-4' />,
                onClick: () => handleModalOpen('view', product),
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
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
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
