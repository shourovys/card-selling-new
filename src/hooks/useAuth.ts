import { useCallback, useState } from 'react';
import type { UserRole } from '../routes/routes';

interface AuthState {
  isAuthenticated: boolean;
  userRoles: UserRole[];
  user: null | {
    id: string;
    name: string;
    email: string;
  };
}

interface UseAuth extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// This is a basic implementation. In a real app, you'd want to:
// 1. Use a context provider
// 2. Persist the auth state
// 3. Handle token management
// 4. Add proper error handling
export function useAuth(): UseAuth {
  const [authState, setAuthState] = useState<AuthState>(() => ({
    isAuthenticated: true,
    userRoles: ['admin', 'user', 'manager'],
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
  }));

  const login = useCallback(async (email: string, password: string) => {
    setAuthState({
      isAuthenticated: true,
      userRoles: ['admin', 'user', 'manager'],
      user: {
        id: '1',
        name: 'John Doe',
        email,
      },
    });
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      userRoles: [],
      user: null,
    });
  }, []);

  return {
    ...authState,
    login,
    logout,
  };
}
