import React, { lazy } from 'react';
import type { AppRoute } from './routes';

const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Category = lazy(() => import('../pages/category/category'));
const AdditionalCategory = lazy(
  () => import('../pages/category/additional-category')
);
const Product = lazy(() => import('../pages/product/product'));
const ProductBundle = lazy(
  () => import('../pages/product-bundle/product-bundle')
);

export const protectedRoutes: AppRoute[] = [
  {
    element: React.createElement(DashboardLayout),
    auth: true,
    children: [
      {
        path: '/dashboard',
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
      {
        path: '/additional-category',
        element: React.createElement(AdditionalCategory),
        title: 'Additional Category',
        breadcrumb: 'Additional Category',
        roles: ['System Admin', 'Distributor', 'Sub Distributor'],
        auth: true,
      },
      {
        path: '/product',
        element: React.createElement(Product),
        title: 'Product',
        breadcrumb: 'Product',
        roles: ['System Admin', 'Distributor', 'Sub Distributor'],
        auth: true,
      },
      {
        path: '/product-bundle',
        element: React.createElement(ProductBundle),
        title: 'Product Bundle',
        breadcrumb: 'Product Bundle',
        roles: ['System Admin', 'Distributor', 'Sub Distributor'],
        auth: true,
      },
    ],
  },
];
