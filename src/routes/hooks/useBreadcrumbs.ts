import { routeConfig } from '@/config/routeConfig';
import { useLocation } from 'react-router-dom';

interface Breadcrumb {
  path: string;
  label: string;
}

export const useBreadcrumbs = (): Breadcrumb[] => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbs: Breadcrumb[] = [];
  let currentPath = '';

  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;

    // Convert path to label
    let label = segment.charAt(0).toUpperCase() + segment.slice(1);

    // Handle dynamic segments (those with parameters)
    if (segment.match(/^[0-9a-fA-F-]+$/)) {
      label = 'Details';
    }

    // Special case for nested dashboard routes
    if (currentPath.startsWith('/dashboard')) {
      if (currentPath === routeConfig.dashboard.path()) {
        label = 'Dashboard';
      }
    }

    breadcrumbs.push({
      path: currentPath,
      label,
    });
  });

  return breadcrumbs;
};
