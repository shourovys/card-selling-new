import type { IPermissionValue } from '@/config/permission';
import { routeConfig } from '@/config/routeConfig';
import {
  CircleDollarSign,
  ShoppingBag,
  Tags,
  Users,
  type LucideIcon,
} from 'lucide-react';

export type MenuItem = {
  title: string;
  icon: LucideIcon;
  requiredPermissions?: readonly IPermissionValue[];
  description?: string;
  isHidden?: boolean;
} & (
  | {
      path: () => string;
      subMenu?: never;
    }
  | {
      path?: never;
      subMenu: MenuItem[];
    }
);

// Helper function to combine permissions from multiple menu items
const combinePermissions = (items: MenuItem[]): readonly IPermissionValue[] => {
  const allPermissions = items.flatMap(
    (item) => item.requiredPermissions || []
  );
  return [...new Set(allPermissions)];
};

export const menuItems: MenuItem[] = [
  {
    ...routeConfig.dashboard,
    description: 'View dashboard statistics and analytics',
  },
  {
    ...routeConfig.role,
    description: 'Manage user roles and permissions',
  },
  {
    title: 'Virtual Money',
    icon: CircleDollarSign,
    description: 'Manage virtual money transactions and approvals',
    requiredPermissions: combinePermissions([
      routeConfig.virtualMoneyRequest,
      routeConfig.virtualMoneyPending,
      routeConfig.virtualMoneyHistory,
    ]),
    subMenu: [
      {
        ...routeConfig.virtualMoneyRequest,
        description: 'Request new virtual money transactions',
      },
      {
        ...routeConfig.virtualMoneyPending,
        description: 'View and approve pending transactions',
      },
      {
        ...routeConfig.virtualMoneyHistory,
        description: 'View transaction history',
      },
    ],
  },
  {
    title: 'User',
    icon: Users,
    description: 'Manage system users and roles',
    requiredPermissions: combinePermissions([
      routeConfig.systemUser,
      routeConfig.distributor,
      routeConfig.subDistributor,
      routeConfig.sr,
    ]),
    subMenu: [
      {
        ...routeConfig.systemUser,
        description: 'Manage system administrators',
      },
      {
        ...routeConfig.distributor,
        description: 'Manage distributors',
      },
      {
        ...routeConfig.subDistributor,
        description: 'Manage sub-distributors',
      },
      {
        ...routeConfig.sr,
        description: 'Manage sales representatives',
      },
    ],
  },
  {
    title: 'Category',
    icon: Tags,
    description: 'Manage product categories',
    requiredPermissions: combinePermissions([
      routeConfig.category,
      routeConfig.additionalCategory,
    ]),
    subMenu: [
      {
        ...routeConfig.category,
        description: 'Manage main product categories',
      },
      {
        ...routeConfig.additionalCategory,
        description: 'Manage additional categories',
      },
    ],
  },
  {
    title: 'Product',
    icon: ShoppingBag,
    description: 'Manage products and bundles',
    requiredPermissions: combinePermissions([
      routeConfig.product,
      routeConfig.productBundle,
    ]),
    subMenu: [
      {
        ...routeConfig.product,
        description: 'Manage individual products',
      },
      {
        ...routeConfig.productBundle,
        description: 'Manage product bundles',
      },
    ],
  },
];
