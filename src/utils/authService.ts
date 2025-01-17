import BACKEND_ENDPOINTS from '@/api/urls';
import { LOCAL_STORAGE_KEYS } from '@/config/config';
import {
  ILoginCredentials,
  IRefreshTokenResponse,
  ITokenData,
  IUser,
} from '@/types/auth.types';
import { IApiResponse } from '@/types/common';
import { localStorageUtil } from '@/utils/localStorageUtil';
import axios, { AxiosInstance } from 'axios';

class AuthService {
  private static instance: AuthService;
  private isRefreshing = false;
  private refreshQueue: Array<{
    resolve: (token: ITokenData) => void;
    reject: (error: Error) => void;
  }> = [];
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL:
        import.meta.env.VITE_BACKEND_BASE_URL || 'http://34.244.192.41/api/v1',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Auth Methods
  public async login(credentials: ILoginCredentials): Promise<IUser> {
    try {
      const response = await this.axiosInstance.post<
        IApiResponse<{ user: IUser }>
      >(BACKEND_ENDPOINTS.LOGIN, {
        attributes: {
          ...credentials,
          client_id: import.meta.env.VITE_CLIENT_ID || 'mobile-app',
          client_secret:
            import.meta.env.VITE_CLIENT_SECRET ||
            'buNPXnZxttP26Sccmi4S65S0pys3lFK5',
          grant_type: 'password',
        },
      });

      const { user } = response.data.data;
      this.saveUser(user);
      return user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Login failed');
      }
      throw error;
    }
  }

  // Token Management
  public saveTokens(tokenData: ITokenData): void {
    const accessTokenExpirationTime = Date.now() / 1000 + tokenData.expires_in;
    const refreshTokenExpirationTime =
      Date.now() / 1000 + tokenData.refresh_expires_in;

    localStorageUtil.setItem(
      LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
      tokenData.access_token
    );
    localStorageUtil.setItem(
      LOCAL_STORAGE_KEYS.REFRESH_TOKEN,
      tokenData.refresh_token
    );
    localStorageUtil.setItem(
      LOCAL_STORAGE_KEYS.TOKEN_EXPIRY,
      accessTokenExpirationTime
    );
    localStorageUtil.setItem(
      LOCAL_STORAGE_KEYS.REFRESH_EXPIRY,
      refreshTokenExpirationTime
    );
  }

  public clearTokens(): void {
    localStorageUtil.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    localStorageUtil.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
    localStorageUtil.removeItem(LOCAL_STORAGE_KEYS.TOKEN_EXPIRY);
    localStorageUtil.removeItem(LOCAL_STORAGE_KEYS.REFRESH_EXPIRY);
  }

  public clearUser(): void {
    localStorageUtil.removeItem(LOCAL_STORAGE_KEYS.USER);
    this.clearTokens();
  }

  public async logout(): Promise<void> {
    try {
      await this.axiosInstance.post(BACKEND_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.clearUser();
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
  }

  public getTokenDetails() {
    return {
      accessToken: localStorageUtil.getItem<string>(
        LOCAL_STORAGE_KEYS.ACCESS_TOKEN
      ),
      refreshToken: localStorageUtil.getItem<string>(
        LOCAL_STORAGE_KEYS.REFRESH_TOKEN
      ),
      expiresAt:
        localStorageUtil.getItem<number>(LOCAL_STORAGE_KEYS.TOKEN_EXPIRY) ?? 0,
      refreshExpiresAt:
        localStorageUtil.getItem<number>(LOCAL_STORAGE_KEYS.REFRESH_EXPIRY) ??
        0,
    };
  }

  public isTokenExpired(expiresAt?: number): boolean {
    if (!expiresAt) return true;
    const buffer = 120; // 2 minutes buffer
    return Date.now() >= (expiresAt - buffer) * 1000;
  }

  public isRefreshTokenExpired(refreshExpiresAt?: number): boolean {
    if (!refreshExpiresAt) return true;
    const buffer = 300; // 5 minutes buffer
    return Date.now() >= (refreshExpiresAt - buffer) * 1000;
  }

  // Auth State Management
  public saveUser(user: IUser): void {
    localStorageUtil.setItem(LOCAL_STORAGE_KEYS.USER, user);
    this.saveTokens({
      access_token: user.access_token,
      refresh_token: user.refresh_token,
      expires_in: user.expires_in,
      refresh_expires_in: user.refresh_expires_in,
    });
  }

  public getUser(): IUser | null {
    return localStorageUtil.getItem<IUser>(LOCAL_STORAGE_KEYS.USER);
  }

  // Token Refresh Logic
  public async refreshToken(): Promise<ITokenData> {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.refreshQueue.push({ resolve, reject });
      });
    }

    const { refreshToken, refreshExpiresAt } = this.getTokenDetails();

    // Check if refresh token is expired
    if (this.isRefreshTokenExpired(refreshExpiresAt)) {
      this.logout();
      throw new Error('Refresh token has expired. Please login again.');
    }

    this.isRefreshing = true;

    try {
      const response = await this.axiosInstance.post<
        IApiResponse<IRefreshTokenResponse>
      >(BACKEND_ENDPOINTS.REFRESH_TOKEN, {
        attributes: {
          grant_type: 'refresh_token',
          client_id: import.meta.env.VITE_CLIENT_ID || 'mobile-app',
          client_secret:
            import.meta.env.VITE_CLIENT_SECRET ||
            'buNPXnZxttP26Sccmi4S65S0pys3lFK5',
          refresh_token: refreshToken,
        },
      });

      const { accessTokenResponse } = response.data.data;
      this.saveTokens(accessTokenResponse);

      // Process queue
      this.refreshQueue.forEach(({ resolve }) => resolve(accessTokenResponse));

      return accessTokenResponse;
    } catch (error) {
      // Handle specific error cases
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          this.logout();
          throw new Error('Invalid refresh token');
        }
        if (!error.response) {
          throw new Error('Network error during token refresh');
        }
      }

      this.refreshQueue.forEach(({ reject }) =>
        reject(
          error instanceof Error ? error : new Error('Token refresh failed')
        )
      );
      throw error;
    } finally {
      this.isRefreshing = false;
      this.refreshQueue = [];
    }
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export const authService = AuthService.getInstance();
