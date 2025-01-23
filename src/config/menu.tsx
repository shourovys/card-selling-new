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
  roles?: string[];
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

export const menuItems: MenuItem[] = [
  routeConfig.dashboard,
  routeConfig.role,
  {
    title: 'Virtual Money',
    icon: CircleDollarSign,
    roles: ['System Admin', 'Distributor', 'Sub Distributor'],
    subMenu: [
      routeConfig.virtualMoneyRequest,
      routeConfig.virtualMoneyPending,
      routeConfig.virtualMoneyHistory,
    ],
  },

  {
    title: 'User',
    icon: Users,
    roles: ['System Admin'],
    subMenu: [
      routeConfig.systemUser,
      routeConfig.distributor,
      routeConfig.subDistributor,
      routeConfig.sr,
    ],
  },
  {
    title: 'Category',
    icon: Tags,
    roles: ['System Admin', 'Distributor', 'Sub Distributor'],
    subMenu: [routeConfig.category, routeConfig.additionalCategory],
  },
  {
    title: 'Product',
    icon: ShoppingBag,
    roles: ['System Admin', 'Distributor', 'Sub Distributor'],
    subMenu: [routeConfig.product, routeConfig.productBundle],
  },
];
