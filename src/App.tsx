import { Layout } from '@/components/layout/Layout';
import { ThemeProvider } from '@/components/theme-provider';
import { queryClient } from '@/lib/query';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme='light' storageKey='ui-theme'>
        <Router>
          <Layout>hello</Layout>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
