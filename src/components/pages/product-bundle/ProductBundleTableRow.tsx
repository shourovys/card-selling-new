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
import { ProductBundle } from '@/lib/validations/product-bundle';
import { Edit, Eye, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';

interface ProductBundleTableRowProps {
  bundle: ProductBundle;
  index: number;
  handleModalOpen: (mode: 'edit' | 'view', bundle: ProductBundle) => void;
  onDelete: () => void;
}

export default function ProductBundleTableRow({
  bundle,
  index,
  handleModalOpen,
  onDelete,
}: ProductBundleTableRowProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { trigger: deleteProductBundle, isMutating: isDeleting } =
    useSWRMutation(
      BACKEND_ENDPOINTS.PRODUCT_BUNDLE.DELETE(bundle.id),
      sendDeleteRequest,
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Product bundle deleted successfully',
          });
          onDelete();
          setDeleteDialogOpen(false);
        },
      }
    );

  return (
    <>
      <TableRow className='border-b hover:bg-gray-50/50'>
        <TableData className='pl-4 w-1/12'>{index + 1}</TableData>
        <TableData className='w-1/4'>
          <div className='flex gap-4 items-center'>
            <div className='flex-shrink-0'>
              <img
                src={bundle.image}
                alt={bundle.name}
                className='object-cover p-1 w-10 h-10 bg-white rounded border'
              />
            </div>
            <div className='min-w-0'>
              <p className='font-medium mb-0.5 truncate max-w-[400px]'>
                {bundle.name}
              </p>
              {bundle.description && (
                <p className='truncate max-w-[400px]'>{bundle.description}</p>
              )}
            </div>
          </div>
        </TableData>
        <TableData className='w-1/6'>
          <div className='space-y-1'>
            <p className='font-medium'>
              {/* {bundle.currency}  */}
              {bundle.salePrice}
            </p>
            <p className=''>
              Face:
              {/* {bundle.currency}  */}
              {bundle.facePrice}
            </p>
          </div>
        </TableData>
        <TableData className='w-1/6'>
          <div className='space-y-1'>
            <p className='font-medium'>
              {bundle.gpAmount} ({bundle.gpType})
            </p>
            <p className=''>Value: {bundle.gpValue}</p>
          </div>
        </TableData>
        <TableData className='w-1/12'>
          <div
            className={cn(
              'inline-flex items-center rounded-full px-1 py-1 text-xs font-semibold text-white w-[90px] justify-center',
              bundle.status ? 'bg-success' : 'bg-destructive'
            )}
          >
            {bundle.status ? 'Active' : 'Inactive'}
          </div>
        </TableData>
        <TableData className='w-1/6'>
          {new Date(bundle.createdAt).toLocaleString()}
        </TableData>
        <TableData className='pr-1 w-1/12 text-right'>
          <div className='flex gap-1 justify-end items-center'>
            <Button
              variant='ghost'
              size='icon'
              className='w-8 h-8 hover:bg-gray-100'
              onClick={() => handleModalOpen('edit', bundle)}
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
                  onClick={() => handleModalOpen('view', bundle)}
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
            <AlertDialogTitle>Delete Product Bundle</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product bundle? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProductBundle()}
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
