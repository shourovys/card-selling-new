import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import { routePaths } from '../routes/routePaths';

const NotFound: React.FC = () => {
  return (
    <PageLayout showBreadcrumbs={false}>
      <div className='min-h-[80vh] flex items-center justify-center bg-white'>
        <div className='text-center'>
          <h1 className='text-6xl font-bold text-indigo-600'>404</h1>
          <h2 className='mt-4 text-3xl font-bold text-gray-900'>
            Page Not Found
          </h2>
          <p className='mt-4 text-lg text-gray-600'>
            Sorry, the page you are looking for does not exist.
          </p>
          <div className='mt-8'>
            <Link
              to={routePaths.home}
              className='inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700'
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;
