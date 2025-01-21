export const routePaths = {
  // Public routes
  unauthorized: '/unauthorized',
  login: '/',

  dashboard: '/dashboard',

  // Role
  role: '/role',

  // Virtual Money
  requestVirtualMoney: '/virtual-money/request',
  virtualMoney: '/virtual-money',
  pendingVirtualMoney: '/virtual-money/pending',

  // Users
  systemUser: '/system-user',
  distributor: '/distributor',
  subDistributor: '/sub-distributor',
  sr: '/sr',
  srAdd: '/sr/add',
  srView: (id: string) => `/sr/view/${id}`,
  srEdit: (id: string) => `/sr/edit/${id}`,

  // Protected routes
  category: '/category',
  additionalCategory: '/additional-category',

  product: '/product',
  productBundle: '/product-bundle',

  // Catch-all
  notFound: '*',
} as const;
