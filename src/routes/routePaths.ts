export const routePaths = {
  // Public routes
  unauthorized: '/unauthorized',
  login: '/',

  // Role
  role: 'role',

  // Protected routes
  dashboard: '/dashboard',
  category: '/category',
  additionalCategory: '/additional-category',

  product: '/product',
  productBundle: '/product-bundle',

  // Catch-all
  notFound: '*',
} as const;
