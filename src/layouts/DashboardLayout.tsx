import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { routePaths } from '../routes/routePaths';

const DashboardLayout: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-100'>
      <header className='bg-white shadow'>
        <nav className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex space-x-8'>
              <Link
                to={routePaths.dashboard}
                className='px-3 py-2 text-sm font-medium text-gray-900 rounded-md hover:text-gray-600'
              >
                Dashboard
              </Link>
              <Link
                to={routePaths.settings}
                className='px-3 py-2 text-sm font-medium text-gray-900 rounded-md hover:text-gray-600'
              >
                Settings
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <main className='py-6 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <div className='px-4 sm:px-0'>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
