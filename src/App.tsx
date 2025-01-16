import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <DashboardLayout>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Welcome to Dashboard</h1>
          <p className="text-muted-foreground">
            Select an option from the sidebar to get started.
          </p>
        </div>
      </DashboardLayout>
    </ErrorBoundary>
  );
}

export default App;