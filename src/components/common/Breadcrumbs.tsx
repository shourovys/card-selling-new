import generateBreadcrumbs, { IRouteMetadata } from '@/utils/routeMaker';
import { ChevronRight, LucideIcon } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card } from '../ui/card';

interface BreadcrumbsProps {
  routeMetadata?: IRouteMetadata;
  icon?: LucideIcon;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  routeMetadata,
  icon: Icon,
}) => {
  const location = useLocation();
  const { title: pageTitle, pageRoutes } = generateBreadcrumbs(
    location.pathname + location.search,
    routeMetadata
  );

  return (
    <Card className='p-6 mb-6'>
      <div className='flex items-center gap-4 mb-2'>
        {Icon && (
          <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0'>
            <Icon className='w-6 h-6 text-gray-500' />
          </div>
        )}
        <div>
          <h1 className='text-xl font-semibold mb-1'>{pageTitle}</h1>
          <nav aria-label='breadcrumb' className='text-sm'>
            <ol
              className='flex flex-wrap items-center gap-2 text-xs'
              role='list'
            >
              {pageRoutes.map((item, index) => {
                const isLast = index === pageRoutes.length - 1;

                return (
                  <li
                    key={item.text}
                    className='flex items-center'
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {isLast ? (
                      <span className='text-rose-500 font-medium truncate max-w-[200px]'>
                        {item.text}
                      </span>
                    ) : (
                      <>
                        <Link
                          to={item.href || '/'}
                          className='text-gray-500 hover:text-gray-700 font-medium truncate max-w-[200px]'
                        >
                          {item.text}
                        </Link>
                        <span className='text-gray-400 ml-2 flex-shrink-0'>
                          <ChevronRight className='w-4 h-4' />
                        </span>
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>
    </Card>
  );
};

export default Breadcrumbs;
