import TableData from '@/components/table/TableData';
import TableRow from '@/components/table/TableRow';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { categoryApi } from '@/lib/api/category';
import { cn } from '@/lib/utils';
import { Category } from '@/lib/validations/category';
import { Edit, Eye, MoreVertical, Trash2 } from 'lucide-react';

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
    <TableRow className='hover:bg-gray-50/50 border-b'>
      <TableData className='pl-6 py-4 text-sm w-1/12'>{index + 1}</TableData>
      <TableData className='py-4 w-1/2'>
        <div className='flex items-center gap-4'>
          <div className='flex-shrink-0'>
            <img
              src={category.icon}
              alt={category.name}
              className='object-contain p-1 w-10 h-10 rounded border bg-white'
            />
          </div>
          <div className='min-w-0'>
            <p className='font-medium text-sm mb-0.5 truncate'>
              {category.name}
            </p>
            <p className='text-xs truncate text-muted-foreground'>
              Category for {category.type}
            </p>
          </div>
        </div>
      </TableData>
      <TableData className='py-4'>
        <div
          className={cn(
            'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white w-[90px] justify-center',
            category.status ? 'bg-success' : 'bg-destructive'
          )}
        >
          {category.status ? 'Active' : 'Inactive'}
        </div>
      </TableData>
      <TableData className='py-4 text-sm text-muted-foreground'>
        {new Date(category.createdAt).toLocaleString()}
      </TableData>
      <TableData className='text-right pr-6 py-4'>
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
                onClick={handleDelete}
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
  );
}
