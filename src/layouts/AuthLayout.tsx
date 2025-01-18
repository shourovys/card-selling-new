import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className='flex flex-col justify-center py-12 min-h-screen bg-gray-50 sm:px-6 lg:px-8'>
      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
