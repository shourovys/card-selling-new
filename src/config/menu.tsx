import { routePaths } from '@/routes/routePaths';
import {
  LayoutDashboard,
  Package,
  PackageSearch,
  Tag,
  Tags,
  User,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

export interface MenuItem {
  path?: string;
  label: string;
  icon: LucideIcon;
  subMenu?: MenuItem[];
  roles?: string[];
}

export const menuItems: MenuItem[] = [
  {
    path: routePaths.dashboard,
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['System Admin', 'Distributor', 'Sub Distributor'],
  },
  {
    path: routePaths.role,
    label: 'Role',
    icon: User,
    roles: ['System Admin'],
  },
  {
    label: 'Virtual Money',
    icon: Wallet,
    roles: ['System Admin', 'Distributor', 'Sub Distributor'],
    subMenu: [
      {
        path: routePaths.requestVirtualMoney,
        label: 'Request Virtual Money',
        icon: Wallet,
        roles: ['System Admin', 'Distributor', 'Sub Distributor'],
      },
      {
        path: routePaths.pendingVirtualMoney,
        label: 'Pending Virtual Money',
        icon: Wallet,
        roles: ['System Admin', 'Distributor', 'Sub Distributor'],
      },
      {
        path: routePaths.virtualMoney,
        label: 'Virtual Money History',
        icon: Wallet,
        roles: ['System Admin', 'Distributor', 'Sub Distributor'],
      },
    ],
  },

  {
    label: 'User',
    icon: User,
    roles: ['System Admin'],
    subMenu: [
      {
        path: routePaths.systemUser,
        label: 'System Users',
        icon: User,
        roles: ['System Admin'],
      },
      {
        path: routePaths.distributor,
        label: 'Distributors',
        icon: User,
        roles: ['System Admin'],
      },
      {
        path: routePaths.subDistributor,
        label: 'Sub Distributors',
        icon: User,
        roles: ['System Admin'],
      },
      {
        path: routePaths.sr,
        label: 'SR',
        icon: User,
        roles: ['System Admin'],
      },
    ],
  },
  {
    label: 'Category',
    icon: Tags,
    roles: ['System Admin', 'Distributor', 'Sub Distributor'],
    subMenu: [
      {
        path: routePaths.category,
        label: 'Categories',
        icon: Tags,
        roles: ['System Admin', 'Distributor', 'Sub Distributor'],
      },
      {
        path: routePaths.additionalCategory,
        label: 'Additional Categories',
        icon: Tag,
        roles: ['System Admin', 'Distributor', 'Sub Distributor'],
      },
    ],
  },
  {
    label: 'Product',
    icon: Package,
    roles: ['System Admin', 'Distributor', 'Sub Distributor'],
    subMenu: [
      {
        path: routePaths.product,
        label: 'Products',
        icon: Package,
        roles: ['System Admin', 'Distributor', 'Sub Distributor'],
      },
      {
        path: routePaths.productBundle,
        label: 'Product Bundles',
        icon: PackageSearch,
        roles: ['System Admin', 'Distributor', 'Sub Distributor'],
      },
    ],
  },
];
