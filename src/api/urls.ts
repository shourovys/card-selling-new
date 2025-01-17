const BACKEND_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  REGISTER: '/auth/register',
  VERIFY_EMAIL: '/auth/verify-email',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',

  // User endpoints
  GET_USER_PROFILE: '/user/profile',
  UPDATE_USER_PROFILE: '/user/profile',
  UPDATE_USER_PASSWORD: '/user/password',

  // Category endpoints
  GET_CATEGORIES: '/categories',
  CREATE_CATEGORY: '/categories',
  UPDATE_CATEGORY: '/categories/:id',
  DELETE_CATEGORY: '/categories/:id',
  GET_CATEGORY: '/categories/:id',

  // Product endpoints
  GET_PRODUCTS: '/products',
  CREATE_PRODUCT: '/products',
  UPDATE_PRODUCT: '/products/:id',
  DELETE_PRODUCT: '/products/:id',
  GET_PRODUCT: '/products/:id',
} as const;

export default BACKEND_ENDPOINTS;
