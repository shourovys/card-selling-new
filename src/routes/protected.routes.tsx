import React, { lazy } from 'react';
import { routePaths } from './routePaths';
import type { AppRoute } from './routes';

const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'));
const Dashboard = lazy(() => import('../pages/Dashboard'));

export const protectedRoutes: AppRoute[] = [
  {
    path: routePaths.dashboard,
    element: React.createElement(DashboardLayout),
    auth: true,
    children: [
      {
        index: true,
        element: React.createElement(Dashboard),
        title: 'Dashboard',
        breadcrumb: 'Dashboard',
        roles: ['admin', 'user', 'manager'],
        auth: true,
      },
    ],
  },
];
