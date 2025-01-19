export const routePaths = {
  // Public routes
  unauthorized: '/unauthorized',
  login: '/',

  // Protected routes
  dashboard: '/dashboard',
  category: '/category',
  additionalCategory: '/additional-category',

  // Catch-all
  notFound: '*',
} as const;
