export const routePaths = {
  // Public routes
  unauthorized: '/unauthorized',
  login: '/',

  // Role
  role: '/role',

  // Protected routes
  dashboard: '/dashboard',
  category: '/category',
  additionalCategory: '/additional-category',

  product: '/product',
  productBundle: '/product-bundle',

  // Virtual Money
  requestVirtualMoney: '/virtual-money/request',
  virtualMoney: '/virtual-money',
  pendingVirtualMoney: '/virtual-money/pending',

  // Catch-all
  notFound: '*',
} as const;
