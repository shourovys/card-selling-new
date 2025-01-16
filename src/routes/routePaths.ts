export const routePaths = {
  // Public routes
  unauthorized: '/unauthorized',
  login: '/',

  // Protected routes
  dashboard: '/dashboard',

  // Catch-all
  notFound: '*',
} as const;
