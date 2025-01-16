import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { routePaths } from '../routes/routePaths';

const ConcertsLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='bg-white shadow-sm mb-6'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <h1 className='text-3xl font-bold text-gray-900'>Concerts</h1>
          <nav className='mt-4 space-x-8'>
            <Link
              to={routePaths.concertsHome}
              className={`${
                location.pathname === routePaths.concertsHome
                  ? 'text-blue-600 font-bold'
                  : 'text-gray-600'
              } hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium`}
            >
              All Concerts
            </Link>
            <Link
              to={routePaths.trending}
              className={`${
                location.pathname === routePaths.trending
                  ? 'text-blue-600 font-bold'
                  : 'text-gray-600'
              } hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium`}
            >
              Trending
            </Link>
          </nav>
        </div>
      </div>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white shadow rounded-lg p-6'>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ConcertsLayout;
