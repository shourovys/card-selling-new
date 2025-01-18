import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { categoryApi } from '@/lib/api/category';
import { cn } from '@/lib/utils';
import { Category } from '@/lib/validations/category';
import { Edit, Eye, MoreVertical, Trash2 } from 'lucide-react';

interface CategoryTableRowProps {
  category: Category;
  handleModalOpen: (mode: 'edit' | 'view', category: Category) => void;
  onDelete: () => void;
}

export default function CategoryTableRow({
  category,
  handleModalOpen,
  onDelete,
}: CategoryTableRowProps) {
  const handleDelete = async () => {
    try {
      await categoryApi.delete(category.id);
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
      onDelete();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <TableRow className='transition-colors hover:bg-muted/50'>
      <TableCell>
        <div className='flex items-center space-x-3'>
          <div className='flex-shrink-0 w-10 h-10'>
            <img
              src={category.icon}
              alt={category.name}
              className='object-contain p-1 w-full h-full rounded-md border'
            />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='font-medium truncate'>{category.name}</p>
            <p className='text-sm truncate text-muted-foreground'>
              Category for {category.type}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div
          className={cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
            category.status
              ? 'bg-success/10 text-success'
              : 'bg-destructive/10 text-destructive'
          )}
        >
          {category.status ? 'Active' : 'Inactive'}
        </div>
      </TableCell>
      <TableCell className='text-muted-foreground'>
        {new Date(category.createdAt).toLocaleString()}
      </TableCell>
      <TableCell className='text-right'>
        <div className='flex gap-1 justify-end items-center'>
          <Button
            variant='ghost'
            size='icon'
            className='w-8 h-8'
            onClick={() => handleModalOpen('edit', category)}
          >
            <Edit className='w-4 h-4' />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='w-8 h-8'>
                <span className='sr-only'>Open menu</span>
                <MoreVertical className='w-4 h-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                onClick={() => handleModalOpen('view', category)}
              >
                <Eye className='mr-2 w-4 h-4' />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className='text-destructive focus:text-destructive'
              >
                <Trash2 className='mr-2 w-4 h-4' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}
