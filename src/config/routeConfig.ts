import {
  Building2,
  CircleDollarSign,
  LayoutDashboard,
  Package,
  Store,
  Tag,
  Tags,
  UserCog,
  Users,
  Wallet,
} from 'lucide-react';
import { PERMISSIONS } from './permission';

// interface RouteConfig {
//   routePath: string;
//   path: (id?: string) => string;
//   title: string;
//   icon?: React.ElementType;
//   requiredPermissions?: IPermissionValue[];
//   isPublic?: boolean;
// }

// Main route configuration
export const routeConfig = {
  unauthorized: {
    routePath: '/unauthorized',
    path: () => '/unauthorized',
    title: 'Unauthorized',
    isPublic: true,
  },
  login: {
    routePath: '/',
    path: () => '/',
    title: 'Login',
    isPublic: true,
  },

  // Dashboard
  dashboard: {
    routePath: '/dashboard',
    path: () => '/dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    requiredPermissions: [],
  },

  // Role Management
  role: {
    routePath: '/role',
    path: () => '/role',
    title: 'Role',
    icon: UserCog,
    requiredPermissions: [PERMISSIONS.ROLE.VIEW],
  },

  // Virtual Money Section
  virtualMoneyRequest: {
    routePath: '/virtual-money/request',
    path: () => '/virtual-money/request',
    title: 'Request Virtual Money',
    icon: Wallet,
    requiredPermissions: [PERMISSIONS.BALANCE.GENERATE],
  },
  virtualMoneyPending: {
    routePath: '/virtual-money/pending',
    path: () => '/virtual-money/pending',
    title: 'Pending Virtual Money',
    icon: CircleDollarSign,
    requiredPermissions: [PERMISSIONS.BALANCE.APPROVE],
  },
  virtualMoneyHistory: {
    routePath: '/virtual-money',
    path: () => '/virtual-money',
    title: 'Virtual Money History',
    icon: Wallet,
    requiredPermissions: [
      PERMISSIONS.BALANCE.GENERATE,
      PERMISSIONS.BALANCE.APPROVE,
    ],
  },

  // User Management Section
  systemUser: {
    routePath: '/system-user',
    path: () => '/system-user',
    title: 'System Users',
    icon: UserCog,
    requiredPermissions: [PERMISSIONS.ROLE.VIEW],
  },
  distributor: {
    routePath: '/distributor',
    path: () => '/distributor',
    title: 'Distributors',
    icon: Building2,
    requiredPermissions: [PERMISSIONS.DISTRIBUTOR.VIEW],
  },
  subDistributor: {
    routePath: '/sub-distributor',
    path: () => '/sub-distributor',
    title: 'Sub Distributors',
    icon: Store,
    requiredPermissions: [PERMISSIONS.SUB_DISTRIBUTOR.VIEW],
  },
  sr: {
    routePath: '/sales-representative',
    path: () => '/sales-representative',
    title: 'Sales Representatives (SR)',
    icon: Users,
    requiredPermissions: [PERMISSIONS.SR.VIEW],
  },
  srAdd: {
    routePath: '/sales-representative/add',
    path: () => '/sales-representative/add',
    title: 'Add Sales Representative (SR)',
    icon: Users,
    requiredPermissions: [PERMISSIONS.SR.CREATE],
  },
  srEdit: {
    routePath: '/sales-representative/edit/:id',
    path: (id?: string) => `/sales-representative/edit/${id}`,
    title: 'Edit Sales Representative (SR)',
    icon: Users,
    requiredPermissions: [PERMISSIONS.SR.EDIT],
  },
  srView: {
    routePath: '/sales-representative/view/:id',
    path: (id?: string) => `/sales-representative/view/${id}`,
    title: 'View Sales Representative (SR)',
    icon: Users,
    requiredPermissions: [PERMISSIONS.SR.VIEW],
  },

  // Category Section
  category: {
    routePath: '/category',
    path: () => '/category',
    title: 'Categories',
    icon: Tags,
    requiredPermissions: [PERMISSIONS.CATEGORY.VIEW],
  },
  additionalCategory: {
    routePath: '/additional-category',
    path: () => '/additional-category',
    title: 'Additional Categories',
    icon: Tag,
    requiredPermissions: [PERMISSIONS.ADDITIONAL_CATEGORY.VIEW],
  },

  // Product Section
  product: {
    routePath: '/product',
    path: () => '/product',
    title: 'Products',
    icon: Package,
    requiredPermissions: [PERMISSIONS.PRODUCT.VIEW],
  },
  productBundle: {
    routePath: '/product-bundle',
    path: () => '/product-bundle',
    title: 'Product Bundles',
    icon: Package,
    requiredPermissions: [PERMISSIONS.PRODUCT_BUNDLE.VIEW],
  },

  // Not Found Route
  notFound: {
    routePath: '*',
    path: () => '*',
    title: 'Not Found',
    isPublic: true,
  },
};
