import { useLocation } from 'react-router-dom';
import { routePaths } from '../routePaths';

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
      if (currentPath === routePaths.dashboard) {
        label = 'Dashboard';
      } else if (currentPath === routePaths.settings) {
        label = 'Settings';
      }
    }

    // Special case for nested concert routes
    if (currentPath.startsWith('/concerts')) {
      if (currentPath === routePaths.concerts) {
        label = 'Concerts';
      } else if (currentPath === routePaths.trending) {
        label = 'Trending';
      } else if (currentPath.includes('/city/')) {
        label = 'City Events';
      }
    }

    breadcrumbs.push({
      path: currentPath,
      label,
    });
  });

  return breadcrumbs;
};
