import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { routePaths } from '../routes/routePaths';

const AuthLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className='flex flex-col justify-center py-12 min-h-screen bg-gray-50 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-3xl font-extrabold text-center text-gray-900'>
          {location.pathname === routePaths.login
            ? 'Sign in'
            : 'Create account'}
        </h2>
        <div className='mt-2 text-center'>
          <div className='space-x-4'>
            <Link
              to={routePaths.login}
              className={`${
                location.pathname === routePaths.login
                  ? 'text-blue-600 font-bold'
                  : 'text-gray-600'
              } hover:text-blue-500`}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
