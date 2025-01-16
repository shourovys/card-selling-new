import React from 'react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  return (
    <div>
      <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>
      <form className='space-y-6'>
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700'
          >
            Email
          </label>
          <input
            type='email'
            id='email'
            name='email'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          />
        </div>
        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700'
          >
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          />
        </div>
        <button
          type='submit'
          className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        >
          Sign in
        </button>
      </form>
      <div className='mt-4 text-center'>
        <Link
          to='/register'
          className='text-sm text-blue-600 hover:text-blue-500'
        >
          Don't have an account? Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
