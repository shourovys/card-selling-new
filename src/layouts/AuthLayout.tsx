import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className='min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-[420px]'>
        <div className='bg-white py-10 px-14 shadow-sm sm:rounded-lg border border-gray-100 space-y-4'>
          <div className='flex justify-center items-center'>
            <img src='/logo/full_logo.svg' alt='logo' className='h-10 w-auto' />
          </div>
          <Outlet />
        </div>
        {/* <div className='mt-6 text-center text-sm'>
          <p className='text-gray-500'>
            By signing in, you agree to our{' '}
            <a href='#' className='text-rose-500 hover:text-rose-600'>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href='#' className='text-rose-500 hover:text-rose-600'>
              Privacy Policy
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default AuthLayout;
