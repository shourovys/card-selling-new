const BACKEND_ENDPOINTS = {
  // Auth
  LOGIN: '/api/v1/public/auth/signin',
  REFRESH_TOKEN: '/api/v1/public/auth/refresh-token',

  // Categories

  CATEGORY: {
    LIST: (queryString: string) =>
      `/api/v1/private/all/categories?${queryString}`,
    CREATE: '/api/v1/private/save/category',
    UPDATE: (id: number) => `/api/v1/private/update/category/${id}`,
    DELETE: (id: number) => `/api/v1/private/delete/category/${id}`,
  },

  // Orders
  ORDER: (queryString: string) => `/api/v1/private/orders?${queryString}`,
} as const;

export default BACKEND_ENDPOINTS;
