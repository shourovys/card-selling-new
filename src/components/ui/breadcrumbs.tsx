import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';
import * as React from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
  homeHref?: string;
}

export function Breadcrumbs({
  items,
  className,
  separator = <ChevronRight className='w-4 h-4' />,
  homeHref = '/',
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label='Breadcrumb'
      className={cn(
        'flex items-center text-sm text-muted-foreground',
        className
      )}
    >
      <ol className='flex items-center space-x-2'>
        <li>
          <Link
            to={homeHref}
            className='flex items-center transition-colors hover:text-foreground'
          >
            <Home className='w-4 h-4' />
            <span className='sr-only'>Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className='flex items-center space-x-2'>
              <span
                className='flex-shrink-0 text-muted-foreground'
                aria-hidden='true'
              >
                {separator}
              </span>
              {isLast || !item.href ? (
                <span
                  className={cn(
                    'truncate',
                    isLast ? 'font-medium text-foreground' : ''
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon && (
                    <span className='inline-block mr-1'>{item.icon}</span>
                  )}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className='truncate transition-colors hover:text-foreground'
                >
                  {item.icon && (
                    <span className='inline-block mr-1'>{item.icon}</span>
                  )}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
