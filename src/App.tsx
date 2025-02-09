import { SWRConfig } from 'swr';
import { swrConfig } from './api/swrConfig';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './contexts/authContextProvider';
import useScrollToTop from './hooks/useScrollToTop';
import AppRoutes from './routes/AppRoutes';

function App() {
  useScrollToTop();
  return (
    <SWRConfig value={swrConfig}>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </SWRConfig>
  );
}

export default App;
