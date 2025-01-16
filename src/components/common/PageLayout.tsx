import React from 'react';
import Breadcrumbs from './Breadcrumbs';

interface PageLayoutProps {
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showBreadcrumbs = true,
}) => {
  return (
    <div className='space-y-4'>
      {showBreadcrumbs && <Breadcrumbs />}
      {children}
    </div>
  );
};

export default PageLayout;
