import useAuth from '@/hooks/useAuth';
import React from 'react';
import PageLayout from '../components/common/PageLayout';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  console.log('🚀 ~ user:', user);
  return (
    <PageLayout showBreadcrumbs>
      <div className='space-y-6'>
        <div className='overflow-hidden bg-white rounded-lg shadow'>
          <div className='px-4 py-5 sm:p-6'>
            <h1 className='mb-4 text-3xl font-bold text-gray-900'>Dashboard</h1>
            <p className='text-lg text-gray-600'>
              Welcome to your personalized dashboard!
            </p>
          </div>
        </div>

        {/* <div className='overflow-hidden bg-white rounded-lg shadow'>
          <div className='px-4 py-5 sm:p-6'>
            <h2 className='mb-4 text-xl font-semibold text-gray-900'>
              Quick Links
            </h2>
          </div>
        </div> */}
      </div>
      {/* <div className='container py-6'>
        <TestForm />
      </div> */}
    </PageLayout>
  );
};

export default Dashboard;
