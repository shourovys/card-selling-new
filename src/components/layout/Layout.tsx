import { MenuItem } from '@/types/navigation';
import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
  },
  {
    id: 'categories',
    label: 'Categories',
    path: '/categories',
    children: [
      {
        id: 'category-list',
        label: 'All Categories',
        path: '/categories',
      },
      {
        id: 'add-category',
        label: 'Add Category',
        path: '/categories/add',
      },
    ],
  },
  {
    id: 'products',
    label: 'Products',
    path: '/products',
    children: [
      {
        id: 'product-list',
        label: 'All Products',
        path: '/products',
      },
      {
        id: 'add-product',
        label: 'Add Product',
        path: '/products/add',
      },
    ],
  },
];

export function Layout({ children }: LayoutProps) {
  return (
    <div className='flex h-screen bg-background'>
      <Sidebar items={menuItems} />
      <main className='flex-1 overflow-y-auto p-8'>
        <div className='mx-auto max-w-7xl'>{children}</div>
      </main>
    </div>
  );
}
