const BACKEND_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/v1/public/auth/signin',
  REFRESH_TOKEN: '/api/v1/public/auth/refresh-token',

  // Order endpoints
  ORDER: (queryParams: string) => `/api/v1/public/order?${queryParams}`,
} as const;

export default BACKEND_ENDPOINTS;
