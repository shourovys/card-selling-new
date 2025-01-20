import { Sidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  const [expanded, setExpanded] = React.useState(true);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className='min-h-screen bg-background'>
      <Sidebar
        organizationName='Card Selling'
        organizationType='Enterprise'
        expanded={expanded}
        onToggle={handleToggle}
      />
      <div
        className={cn(
          'transition-[padding] duration-300',
          expanded ? 'lg:pl-64' : 'lg:pl-16'
        )}
      >
        <main className='py-6 px-4 sm:px-6 lg:px-8'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
