'use client';

import { CategoryModal } from '@/components/modals/category-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { categoryApi } from '@/lib/api/category';
import { cn } from '@/lib/utils';
import { Category, CategoryFormValues } from '@/lib/validations/category';
import { Edit, Eye, MoreVertical, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import useSWR from 'swr';

export default function CategoryManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: 'add' | 'edit' | 'view';
  }>({ open: false, mode: 'add' });

  const { toast } = useToast();

  // Fetch categories using SWR
  const { data, error, mutate } = useSWR('categories', () =>
    categoryApi.getAll().then((res) => res.data.categories)
  );

  const loading = !data && !error;

  // Filter categories based on search
  const filteredCategories = data?.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Modal handlers
  const handleModalOpen = (
    mode: 'add' | 'edit' | 'view',
    category?: Category
  ) => {
    setSelectedCategory(category || null);
    setModalState({ open: true, mode });
  };

  const handleModalClose = () => {
    setModalState({ open: false, mode: 'add' });
    setSelectedCategory(null);
  };

  // API handlers
  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      if (modalState.mode === 'edit' && selectedCategory) {
        await categoryApi.update(selectedCategory.id, values);
        toast({
          title: 'Success',
          description: 'Category updated successfully',
        });
      } else {
        await categoryApi.create(values);
        toast({
          title: 'Success',
          description: 'Category created successfully',
        });
      }
      mutate(); // Refresh the categories list
    } catch (error) {
      console.error('Error submitting category:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (category: Category) => {
    try {
      await categoryApi.delete(category.id);
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
      mutate(); // Refresh the categories list
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
    <div className='container py-6'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
          <CardTitle>Category Management</CardTitle>
          <Button onClick={() => handleModalOpen('add')} size='sm'>
            <Plus className='w-4 h-4 mr-2' />
            Add Category
          </Button>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between space-x-4 py-4'>
            <div className='flex-1 max-w-sm'>
              <Input
                placeholder='Search categories...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='h-9'
              />
            </div>
          </div>

          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[50px]'>S.NO</TableHead>
                  <TableHead>CATEGORIES</TableHead>
                  <TableHead className='w-[100px]'>STATUS</TableHead>
                  <TableHead className='w-[180px]'>CREATED AT</TableHead>
                  <TableHead className='w-[70px] text-right'>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className='h-24 text-center'>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='h-24 text-center text-muted-foreground'
                    >
                      Error loading categories
                    </TableCell>
                  </TableRow>
                ) : filteredCategories?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='h-24 text-center text-muted-foreground'
                    >
                      No categories found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories?.map((category, index) => (
                    <TableRow key={category.id}>
                      <TableCell className='font-medium'>{index + 1}</TableCell>
                      <TableCell>
                        <div className='flex items-center space-x-3'>
                          <div className='h-10 w-10 flex-shrink-0'>
                            <img
                              src={category.icon}
                              alt={category.name}
                              className='h-full w-full rounded-md border object-contain p-1'
                            />
                          </div>
                          <div className='flex-1 min-w-0'>
                            <p className='truncate font-medium'>
                              {category.name}
                            </p>
                            <p className='text-sm text-muted-foreground truncate'>
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                              <span className='sr-only'>Open menu</span>
                              <MoreVertical className='h-4 w-4' />
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
                              onClick={() => handleDelete(category)}
                              className='text-destructive focus:text-destructive'
                            >
                              <Trash2 className='mr-2 h-4 w-4' />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <CategoryModal
        open={modalState.open}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        mode={modalState.mode}
        category={selectedCategory || undefined}
        categories={data || []}
      />
    </div>
  );
}
