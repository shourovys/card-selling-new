export const BACKEND_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://34.241.185.137:8085';
export const CLIENT_ID = import.meta.env.VITE_API_CLIENT_ID || 'mobile-app';
export const CLIENT_SECRET =
  import.meta.env.VITE_API_CLIENT_SECRET || 'buNPXnZxttP26Sccmi4S65S0pys3lFK5';

export const ERROR_CLASS = 'input_error';

export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  TOKEN_EXPIRY: 'token_expiry',
  REFRESH_EXPIRY: 'refresh_expiry',
  USER: 'user',
  TEMP_USER: 'temp_user',
  TEMP_TOKEN: 'temp_token',
  PARTNER_FORM_STORAGE_KEY: 'partner_form_data',
} as const;

export type LocalStorageKey = keyof typeof LOCAL_STORAGE_KEYS;

export const TABLE_ROW_HEIGHT = 76;
export const TABLE_ROW_PER_PAGE = 10;
