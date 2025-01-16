import React from 'react';
import { Link } from 'react-router-dom';
import { useBreadcrumbs } from '../../routes/hooks/useBreadcrumbs';

const Breadcrumbs: React.FC = () => {
  const breadcrumbs = useBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className='flex px-5 py-3 text-gray-700 bg-gray-50 rounded-lg'>
      <ol className='inline-flex items-center space-x-1 md:space-x-3'>
        <li className='inline-flex items-center'>
          <Link
            to='/'
            className='inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600'
          >
            Home
          </Link>
        </li>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path}>
            <div className='flex items-center'>
              <svg
                className='w-6 h-6 text-gray-400'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                  clipRule='evenodd'
                />
              </svg>
              {index === breadcrumbs.length - 1 ? (
                <span className='ml-1 text-sm font-medium text-gray-500 md:ml-2'>
                  {breadcrumb.label}
                </span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className='ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2'
                >
                  {breadcrumb.label}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
