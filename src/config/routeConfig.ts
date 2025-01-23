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

// Define roles for easy reference
export const ROLES = {
  SYSTEM_ADMIN: 'System Admin',
  DISTRIBUTOR: 'Distributor',
  SUB_DISTRIBUTOR: 'Sub Distributor',
} as const;

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
    roles: [ROLES.SYSTEM_ADMIN, ROLES.DISTRIBUTOR, ROLES.SUB_DISTRIBUTOR],
  },
  // Role Management
  role: {
    routePath: '/role',
    path: () => '/role',
    title: 'Role',
    icon: UserCog,
    roles: [ROLES.SYSTEM_ADMIN],
  },
  // Virtual Money Section

  requestVirtualMoney: {
    routePath: '/virtual-money/request',
    path: () => '/virtual-money/request',
    title: 'Request Virtual Money',
    icon: Wallet,
    roles: [ROLES.SYSTEM_ADMIN, ROLES.DISTRIBUTOR, ROLES.SUB_DISTRIBUTOR],
  },
  pendingVirtualMoney: {
    routePath: '/virtual-money/pending',
    path: () => '/virtual-money/pending',
    title: 'Pending Virtual Money',
    icon: CircleDollarSign,
    roles: [ROLES.SYSTEM_ADMIN, ROLES.DISTRIBUTOR, ROLES.SUB_DISTRIBUTOR],
  },
  virtualMoneyHistory: {
    routePath: '/virtual-money',
    path: () => '/virtual-money',
    title: 'Virtual Money History',
    icon: Wallet,
    roles: [ROLES.SYSTEM_ADMIN, ROLES.DISTRIBUTOR, ROLES.SUB_DISTRIBUTOR],
  },
  // User Management Section

  systemUser: {
    routePath: '/system-user',
    path: () => '/system-user',
    title: 'System Users',
    icon: UserCog,
    roles: [ROLES.SYSTEM_ADMIN],
  },
  distributor: {
    routePath: '/distributor',
    path: () => '/distributor',
    title: 'Distributors',
    icon: Building2,
    roles: [ROLES.SYSTEM_ADMIN],
  },
  subDistributor: {
    routePath: '/sub-distributor',
    path: () => '/sub-distributor',
    title: 'Sub Distributors',
    icon: Store,
    roles: [ROLES.SYSTEM_ADMIN],
  },
  sr: {
    routePath: '/sales-representative',
    path: () => '/sales-representative',
    title: 'Sales Representatives (SR)',
    icon: Users,
    roles: [ROLES.SYSTEM_ADMIN],
  },
  srAdd: {
    routePath: '/sales-representative/add',
    path: () => '/sales-representative/add',
    title: 'Add Sales Representative (SR)',
    icon: Users,
    roles: [ROLES.SYSTEM_ADMIN],
  },
  srEdit: {
    routePath: '/sales-representative/edit/:id',
    path: (id?: string) => `/sales-representative/edit/${id}`,
    title: 'Edit Sales Representative (SR)',
    icon: Users,
    roles: [ROLES.SYSTEM_ADMIN],
  },
  srView: {
    routePath: '/sales-representative/view/:id',
    path: (id?: string) => `/sales-representative/view/${id}`,
    title: 'View Sales Representative (SR)',
    icon: Users,
    roles: [ROLES.SYSTEM_ADMIN],
  },
  // Category Section

  category: {
    routePath: '/category',
    path: () => '/category',
    title: 'Categories',
    icon: Tags,
    roles: [ROLES.SYSTEM_ADMIN, ROLES.DISTRIBUTOR, ROLES.SUB_DISTRIBUTOR],
  },
  additionalCategory: {
    routePath: '/additional-category',
    path: () => '/additional-category',
    title: 'Additional Categories',
    icon: Tag,
    roles: [ROLES.SYSTEM_ADMIN, ROLES.DISTRIBUTOR, ROLES.SUB_DISTRIBUTOR],
  },
  // Product Section

  product: {
    routePath: '/product',
    path: () => '/product',
    title: 'Products',
    icon: Package,
    roles: [ROLES.SYSTEM_ADMIN, ROLES.DISTRIBUTOR, ROLES.SUB_DISTRIBUTOR],
  },
  productBundle: {
    routePath: '/product-bundle',
    path: () => '/product-bundle',
    title: 'Product Bundles',
    icon: Package,
    roles: [ROLES.SYSTEM_ADMIN, ROLES.DISTRIBUTOR, ROLES.SUB_DISTRIBUTOR],
  },
  // Not Found Route
  notFound: {
    routePath: '*',
    path: () => '*',
    title: 'Not Found',
  },
};
