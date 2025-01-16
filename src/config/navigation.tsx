import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Settings,
  FolderTree,
} from 'lucide-react';
import { MenuItem } from '@/types/navigation';

export const navigationItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />,
    path: '/dashboard',
  },
  {
    id: 'categories',
    label: 'Categories',
    icon: <FolderTree className="h-4 w-4" />,
    path: '/categories',
    children: [
      {
        id: 'categories-list',
        label: 'All Categories',
        path: '/categories/list',
      },
      {
        id: 'categories-new',
        label: 'Add Category',
        path: '/categories/new',
      },
    ],
  },
  {
    id: 'users',
    label: 'User Management',
    icon: <Users className="h-4 w-4" />,
    path: '/users',
    children: [
      {
        id: 'users-list',
        label: 'All Users',
        path: '/users/list',
      },
      {
        id: 'roles',
        label: 'Roles & Permissions',
        path: '/users/roles',
      },
    ],
  },
  {
    id: 'products',
    label: 'Products',
    icon: <ShoppingCart className="h-4 w-4" />,
    path: '/products',
    children: [
      {
        id: 'products-list',
        label: 'All Products',
        path: '/products/list',
      },
      {
        id: 'products-new',
        label: 'Add Product',
        path: '/products/new',
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="h-4 w-4" />,
    path: '/settings',
  },
];