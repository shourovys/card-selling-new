import { routeConfig } from '@/config/routeConfig';
import { toast } from '@/hooks/use-toast';
import authReducer, { initialState } from '@/reducers/authReducer';
import {
  IAuthState,
  IAuthStatus,
  ILoginCredentials,
  IUser,
} from '@/types/auth.types';
import { authService } from '@/utils/authService';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './authContext';

export interface IAuthContextType extends IAuthState {
  login: (credentials: ILoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: IUser) => void;
  setAuthenticationStatus: (status: IAuthStatus) => void;
  clearError: () => void;
  initialize: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(authReducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const user = authService.getUser();
      if (user) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    } finally {
      dispatch({ type: 'INITIALIZE' });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = useCallback(
    async (credentials: ILoginCredentials) => {
      try {
        dispatch({ type: 'LOGIN_REQUEST' });
        const user = await authService.login(credentials);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
        toast({
          title: 'Login Success',
          description: 'You have successfully logged in.',
          variant: 'default',
        });
        navigate(routeConfig.dashboard.path());
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An error occurred during login.';
        dispatch({ type: 'LOGIN_FAILURE', payload: { error: errorMessage } });
        toast({
          title: 'Login Failed',
          description: errorMessage,
          variant: 'destructive',
        });
        throw error;
      }
    },
    [navigate]
  );

  const logout = useCallback(async () => {
    try {
      dispatch({ type: 'LOGOUT_REQUEST' });
      await authService.logout();
      dispatch({ type: 'LOGOUT_SUCCESS' });
      navigate(routeConfig.login.path());
      toast({
        title: 'Logout Success',
        description: 'Your session has been logged out.',
        duration: 3000,
        variant: 'default',
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred during logout.';
      dispatch({ type: 'LOGOUT_FAILURE', payload: { error: errorMessage } });
      toast({
        title: 'Logout Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [navigate]);

  const updateUser = useCallback((user: IUser) => {
    try {
      dispatch({ type: 'UPDATE_USER', payload: { user } });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update user information.';
      toast({
        title: 'Update Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, []);

  const setAuthenticationStatus = useCallback((status: IAuthStatus) => {
    dispatch({ type: 'SET_STATUS', payload: { status } });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const contextValue = useMemo(
    () => ({
      ...state,
      login,
      logout,
      updateUser,
      setAuthenticationStatus,
      clearError,
      initialize,
    }),
    [
      state,
      login,
      logout,
      updateUser,
      setAuthenticationStatus,
      clearError,
      initialize,
    ]
  );

  if (!state.isInitialized) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
