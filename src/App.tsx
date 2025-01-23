import { HelmetProvider } from 'react-helmet-async';
import 'react-loading-skeleton/dist/skeleton.css';
import { SWRConfig } from 'swr';
import { swrConfig } from './api/swrConfig';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './contexts/auth/authContextProvider';
import useScrollToTop from './hooks/useScrollToTop';
import AppRoutes from './routes/AppRoutes';

function App() {
  useScrollToTop();
  return (
    <SWRConfig value={swrConfig}>
      <HelmetProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </HelmetProvider>
    </SWRConfig>
  );
}

export default App;
