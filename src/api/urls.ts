const BACKEND_ENDPOINTS = {
  // Auth
  LOGIN: '/api/v1/public/auth/signin',
  REFRESH_TOKEN: '/api/v1/public/auth/refresh-token',

  // Role
  ROLE: {
    LIST: (queryString: string) =>
      `/api/v1/private/roles${queryString ? `?${queryString}` : ''}`,
    CREATE: 'api/v1/private/roles',
    UPDATE: (id: number) => `/api/v1/private/role?id=${id}`,
    DELETE: (id: number) => `/api/v1/private/role?id=${id}`,
    PERMISSIONS: '/api/v1/private/get-all-app-permissions',
    PERMISSION_GROUPS: '/api/v1/private/get-all-app-groups',
  },

  // Virtual Money
  VIRTUAL_MONEY: {
    GENERATE: '/api/v1/private/generate-virtual-money',
    LIST: (queryString: string = '') =>
      `/api/v1/private/all-virtual-money-requests${
        queryString ? `?${queryString}` : ''
      }`,
    APPROVE: '/api/v1/private/approve-virtual-money-request',
    APPROVER_LIST: '/api/v1/private/approver-list',
  },

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

  SYSTEM_USER: {
    LIST: (queryString: string) =>
      `/api/v1/private/get-all-system-users${queryString}`,
    CREATE: '/api/v1/private/create-system-user',
    UPDATE: (id: number) => `/api/v1/private/update-system-user/${id}`,
    DELETE: (id: number) => `/api/v1/private/delete-system-user/${id}`,
    CHECKERS:
      '/api/v1/private/users/get-all-checker-by-user-type?userTypeString=System Admin',
  },

  // Distributors
  DISTRIBUTOR: {
    LIST: (queryString: string) => `/api/v1/private/distributors${queryString}`,
    CREATE: '/api/v1/private/create-distributor',
    UPDATE: (id: string) => `/api/v1/private/update-distributor/${id}`,
    DELETE: (id: string) => `/api/v1/private/delete-distributor/${id}`,
    SUB_DISTRIBUTORS: (id: string) => `/api/v1/private/users/associated/${id}`,
    CHECKERS:
      '/api/v1/private/users/get-all-checker-by-user-type?userTypeString=Distributor',
  },

  // Sub Distributors
  SUB_DISTRIBUTOR: {
    LIST: (queryString: string) =>
      `/api/v1/private/sub-distributors${queryString}`,
    CREATE: '/api/v1/private/create-sub-distributor',
    UPDATE: (id: string) => `/api/v1/private/update-sub-distributor/${id}`,
    DELETE: (id: string) => `/api/v1/private/delete-sub-distributor/${id}`,
    CHECKERS:
      '/api/v1/private/users/get-all-checker-by-user-type?userTypeString=Sub Distributor',
    SR_LIST: (id: string) => `/api/v1/private/users/associated/${id}`,
  },

  // Sales Representatives
  SR: {
    LIST: (queryString: string) => `api/v1/private/get-all-sr${queryString}`,
    CREATE: '/api/v1/private/create-sr',
    UPDATE: (id: string) => `/api/v1/private/update-sr/${id}`,
    DELETE: (id: string) => `/api/v1/private/delete-sr/${id}`,
    DETAILS: (id: string) => `/api/v1/private/sr/${id}`,
    CHECKERS:
      '/api/v1/private/users/get-all-checker-by-user-type?userTypeString=Sales Representative',
  },

  // Location
  LOCATION: {
    COUNTRIES: '/api/v1/public/countries',
    CITIES: (countryId: string) =>
      `/api/v1/public/cities?countryId=${countryId}`,
    AREAS: (cityId: string) => `/api/v1/public/areas?cityId=${cityId}`,
  },

  // Documents
  DOCUMENT: {
    TYPES: '/api/v1/public/documents?type=documents',
  },
} as const;

export default BACKEND_ENDPOINTS;
