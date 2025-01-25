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
import usePermissions from '@/hooks/usePermissions';
import { cn } from '@/lib/utils';
import { ProductBundle } from '@/lib/validations/product-bundle';
import { Edit, Eye, Trash2 } from 'lucide-react';
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
  const { getActionPermissions } = usePermissions();
  const { canView, canEdit, canDelete } =
    getActionPermissions('PRODUCT_BUNDLE');

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
        },
      }
    );

  const actions = [
    canEdit && {
      label: 'Edit',
      icon: <Edit className='w-4 h-4' />,
      onClick: () => handleModalOpen('edit', bundle),
    },
    canView && {
      label: 'View',
      icon: <Eye className='w-4 h-4' />,
      onClick: () => handleModalOpen('view', bundle),
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
        <TableData className='pl-4 w-1/12'>{index + 1}</TableData>
        <TableData className='w-1/2'>
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
                <p className='text-xs truncate max-w-[400px]'>
                  {bundle.description}
                </p>
              )}
            </div>
          </div>
        </TableData>
        <TableData>
          <div
            className={cn(
              'inline-flex items-center rounded-full px-1 py-1 text-xs font-semibold text-white w-[90px] justify-center',
              bundle.status ? 'bg-success' : 'bg-destructive'
            )}
          >
            {bundle.status ? 'Active' : 'Inactive'}
          </div>
        </TableData>
        <TableData>{new Date(bundle.createdAt).toLocaleString()}</TableData>
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
