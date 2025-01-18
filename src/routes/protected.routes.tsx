import React, { lazy } from 'react';
import type { AppRoute } from './routes';

const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Category = lazy(() => import('../pages/category/category'));

export const protectedRoutes: AppRoute[] = [
  {
    element: React.createElement(DashboardLayout),
    auth: true,
    children: [
      {
        path: '/',
        element: React.createElement(Dashboard),
        title: 'Dashboard',
        breadcrumb: 'Dashboard',
        roles: ['System Admin', 'Distributor', 'Sub Distributor'],
        auth: true,
      },
      {
        path: '/category',
        element: React.createElement(Category),
        title: 'Category',
        breadcrumb: 'Category',
        roles: ['System Admin', 'Distributor', 'Sub Distributor'],
        auth: true,
      },
    ],
  },
];
