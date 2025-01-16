import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { routePaths } from '../routes/routePaths';

const AuthLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
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
            <Link
              to={routePaths.register}
              className={`${
                location.pathname === routePaths.register
                  ? 'text-blue-600 font-bold'
                  : 'text-gray-600'
              } hover:text-blue-500`}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
