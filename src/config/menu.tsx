import { routePaths } from '@/routes/routePaths';
import {
  Boxes,
  Building2,
  CircleDollarSign,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  Tag,
  Tags,
  UserCog,
  Users,
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
    icon: UserCog,
    roles: ['System Admin'],
  },
  {
    label: 'Virtual Money',
    icon: CircleDollarSign,
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
        icon: CircleDollarSign,
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
    icon: Users,
    roles: ['System Admin'],
    subMenu: [
      {
        path: routePaths.systemUser,
        label: 'System Users',
        icon: UserCog,
        roles: ['System Admin'],
      },
      {
        path: routePaths.distributor,
        label: 'Distributors',
        icon: Building2,
        roles: ['System Admin'],
      },
      {
        path: routePaths.subDistributor,
        label: 'Sub Distributors',
        icon: Store,
        roles: ['System Admin'],
      },
      {
        path: routePaths.sr,
        label: 'Sales Representatives (SR)',
        icon: Users,
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
    icon: ShoppingBag,
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
        icon: Boxes,
        roles: ['System Admin', 'Distributor', 'Sub Distributor'],
      },
    ],
  },
];
