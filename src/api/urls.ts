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

  ADDITIONAL_CATEGORY: {
    LIST: (queryString: string = '') =>
      `/api/v1/private/all/additionalCategories${
        queryString ? `?${queryString}` : ''
      }`,
    CREATE: '/api/v1/private/save/additionalCategory',
    UPDATE: (id: number) => `/api/v1/private/update/additionalCategory/${id}`,
    DELETE: (id: number) => `/api/v1/private/delete/additionalCategory/${id}`,
    MAPPING: {
      CREATE: '/api/v1/private/save/additionalCategoryMapping',
      DELETE: (additionalCategoryId: number, categoryIds: number[]) =>
        `/api/v1/private/delete/additionalCategoryMapping?additionalCategoryId=${additionalCategoryId}&categoryIds=${categoryIds.join(
          ','
        )}`,
      GET_BY_POSITION: (position: string) =>
        `/api/v1/private/all/additionalCategories?position=${position}`,
      GET_BY_CATEGORY_ID: (categoryId: number) =>
        `/api/v1/private/categoryMapping/${categoryId}`,
    },
  },

  // Products
  PRODUCT: {
    LIST: (queryString: string = '') =>
      `/api/v1/private/all/products${queryString ? `?${queryString}` : ''}`,
    CREATE: '/api/v1/private/save/product',
    UPDATE: (id: number) => `/api/v1/private/update/product/${id}`,
    DELETE: (id: number) => `/api/v1/private/delete/product/${id}`,
  },

  PRODUCT_BUNDLE: {
    LIST: (queryString: string) =>
      `/api/v1/private/all/product/bundles${
        queryString ? `?${queryString}` : ''
      }`,
    CREATE: '/api/v1/private/save/product/bundles',
    UPDATE: (id: number) => `/api/v1/private/update/product/bundles/${id}`,
    DELETE: (id: number) => `/api/v1/private/delete/product/bundles/${id}`,
  },

  CURRENCY: {
    LIST: '/api/v1/private/all/currency',
  },

  ROLE: {
    LIST: (queryString: string) =>
      `/api/v1/private/roles${queryString ? `?${queryString}` : ''}`,
    CREATE: 'api/v1/private/roles',
    UPDATE: (id: number) => `/api/v1/private/role?id=${id}`,
    DELETE: (id: number) => `/api/v1/private/role?id=${id}`,
    PERMISSIONS: '/api/v1/private/get-all-app-permissions',
    PERMISSION_GROUPS: '/api/v1/private/get-all-app-groups',
  },
} as const;

export default BACKEND_ENDPOINTS;
