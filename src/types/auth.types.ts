export interface ITokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}

export interface ILoginResponse {
  data: ITokenData;
  type: IUserRole;
}

export interface IUser {
  // id: string;
  email: string;
  name: string;
  role: IUserRole[];
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}

export const AUTH_STATUS = {
  AUTHENTICATED: 'AUTHENTICATED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  LOADING: 'LOADING',
} as const;

export type IAuthStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS];

export const USER_ROLES = {
  SYSTEM_ADMIN: 'System Admin',
  DISTRIBUTOR: 'Distributor',
  SUB_DISTRIBUTOR: 'Sub Distributor',
} as const;

export type IUserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface IAuthState {
  user: IUser | null;
  status: IAuthStatus;
  userRoles: IUserRole[];
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface IRefreshTokenResponse {
  accessTokenResponse: ITokenData;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegistrationData extends ILoginCredentials {
  name: string;
  role?: IUserRole;
}

export interface IAuthError {
  message: string;
  code?: string;
  status?: number;
}
