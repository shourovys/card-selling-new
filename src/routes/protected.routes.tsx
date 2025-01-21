import React, { lazy } from 'react';
import type { AppRoute } from './routes';

const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'));
const Dashboard = lazy(() => import('../pages/Dashboard'));

const Role = lazy(() => import('../pages/role/role'));

const RequestVirtualMoney = lazy(
  () => import('../pages/virtual-money/request')
);
const VirtualMoney = lazy(() => import('../pages/virtual-money'));
const PendingVirtualMoney = lazy(
  () => import('../pages/virtual-money/pending')
);

const SystemUserManagement = lazy(() => import('../pages/system-user/index'));
const Distributor = lazy(() => import('../pages/distributor/index'));
const SubDistributor = lazy(() => import('../pages/sub-distributor/index'));
const SR = lazy(() => import('../pages/sr/index'));
const AddSR = lazy(() => import('../pages/sr/add'));
const EditSR = lazy(() => import('../pages/sr/edit'));

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
        path: '/virtual-money/request',
        element: React.createElement(RequestVirtualMoney),
        title: 'Request Virtual Money',
        breadcrumb: 'Request Virtual Money',
        roles: ['System Admin', 'Distributor', 'Sub Distributor'],
        auth: true,
      },
      {
        path: '/role',
        element: React.createElement(Role),
        title: 'Role',
        breadcrumb: 'Role',
        roles: ['System Admin'],
        auth: true,
      },
      {
        path: '/virtual-money',
        element: React.createElement(VirtualMoney),
        title: 'Virtual Money',
        breadcrumb: 'Virtual Money',
        roles: ['System Admin', 'Distributor', 'Sub Distributor'],
        auth: true,
      },
      {
        path: '/virtual-money/pending',
        element: React.createElement(PendingVirtualMoney),
        title: 'Pending Virtual Money',
        breadcrumb: 'Pending Virtual Money',
        roles: ['System Admin', 'Distributor', 'Sub Distributor'],
        auth: true,
      },
      {
        path: '/system-user',
        element: React.createElement(SystemUserManagement),
        title: 'System User',
        breadcrumb: 'System User',
        roles: ['System Admin'],
        auth: true,
      },
      {
        path: '/distributor',
        element: React.createElement(Distributor),
        title: 'Distributor',
        breadcrumb: 'Distributor',
        roles: ['System Admin'],
        auth: true,
      },
      {
        path: '/sub-distributor',
        element: React.createElement(SubDistributor),
        title: 'Sub Distributor',
        breadcrumb: 'Sub Distributor',
        roles: ['System Admin'],
        auth: true,
      },
      {
        path: '/sr',
        element: React.createElement(SR),
        title: 'SR',
        breadcrumb: 'SR',
        roles: ['System Admin'],
        auth: true,
      },
      {
        path: '/sr/add',
        element: React.createElement(AddSR),
        title: 'Add SR',
        breadcrumb: 'Add SR',
        roles: ['System Admin'],
        auth: true,
      },
      {
        path: '/sr/edit/:id',
        element: React.createElement(EditSR),
        title: 'Edit SR',
        breadcrumb: 'Edit SR',
        roles: ['System Admin'],
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
