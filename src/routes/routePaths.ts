export const routePaths = {
  // Public routes
  unauthorized: '/unauthorized',
  login: '/',

  // Protected routes
  dashboard: '/dashboard',
  category: '/category',

  // Catch-all
  notFound: '*',
} as const;
