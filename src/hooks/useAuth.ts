import AuthContext from '@/contexts/auth/authContext';
import { IAuthContextType } from '@/contexts/auth/authContextProvider';
import { useContext } from 'react';

const useAuth = (): IAuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
