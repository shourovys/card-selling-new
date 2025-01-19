import { ChevronRight, User } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbsProps {
  items: {
    label: string;
    href?: string;
  }[];
  title: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, title }) => {
  return (
    <div className='bg-white rounded-md p-6 mb-6'>
      <div className='flex items-center gap-4 mb-2'>
        <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0'>
          <User className='w-6 h-6 text-gray-500' />
        </div>
        <div>
          <h1 className='text-xl font-semibold mb-1'>{title}</h1>
          <nav aria-label='breadcrumb'>
            <ol className='flex items-center gap-2 text-xs'>
              {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                  <li key={item.label} className='flex items-center'>
                    {isLast ? (
                      <span className='text-rose-500 font-medium'>
                        {item.label}
                      </span>
                    ) : (
                      <>
                        <Link
                          to={item.href || '/'}
                          className='text-gray-500 hover:text-gray-700 font-medium'
                        >
                          {item.label}
                        </Link>
                        <span className='text-gray-400 ml-2'>
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
    </div>
  );
};

export default Breadcrumbs;
