import { routeConfig } from '@/config/routeConfig';
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
const ProductBundle = lazy(() => import('../pages/product/product-bundle'));
export const protectedRoutes: AppRoute[] = [
  {
    element: React.createElement(DashboardLayout),
    auth: true,
    children: [
      {
        routePath: routeConfig.dashboard.routePath,
        element: React.createElement(Dashboard),
        roles: routeConfig.dashboard.roles,
        auth: true,
      },
      {
        routePath: routeConfig.virtualMoneyRequest.routePath,
        element: React.createElement(RequestVirtualMoney),
        roles: routeConfig.virtualMoneyRequest.roles,
        auth: true,
      },
      {
        routePath: routeConfig.role.routePath,
        element: React.createElement(Role),
        roles: routeConfig.role.roles,
        auth: true,
      },
      {
        routePath: routeConfig.virtualMoneyHistory.routePath,
        element: React.createElement(VirtualMoney),
        roles: routeConfig.virtualMoneyHistory.roles,
        auth: true,
      },
      {
        routePath: routeConfig.virtualMoneyPending.routePath,
        element: React.createElement(PendingVirtualMoney),
        roles: routeConfig.virtualMoneyPending.roles,
        auth: true,
      },
      {
        routePath: routeConfig.systemUser.routePath,
        element: React.createElement(SystemUserManagement),
        roles: routeConfig.systemUser.roles,
        auth: true,
      },
      {
        routePath: routeConfig.distributor.routePath,
        element: React.createElement(Distributor),
        roles: routeConfig.distributor.roles,
        auth: true,
      },
      {
        routePath: routeConfig.subDistributor.routePath,
        element: React.createElement(SubDistributor),
        roles: routeConfig.subDistributor.roles,
        auth: true,
      },
      {
        routePath: routeConfig.sr.routePath,
        element: React.createElement(SR),
        roles: routeConfig.sr.roles,
        auth: true,
      },
      {
        routePath: routeConfig.srAdd.routePath,
        element: React.createElement(AddSR),
        roles: routeConfig.srAdd.roles,
        auth: true,
      },
      {
        routePath: routeConfig.srEdit.routePath,
        element: React.createElement(EditSR),
        roles: routeConfig.srEdit.roles,
        auth: true,
      },

      {
        routePath: routeConfig.category.routePath,
        element: React.createElement(Category),
        roles: routeConfig.category.roles,
        auth: true,
      },
      {
        routePath: routeConfig.additionalCategory.routePath,
        element: React.createElement(AdditionalCategory),
        roles: routeConfig.additionalCategory.roles,
        auth: true,
      },
      {
        routePath: '/product',
        element: React.createElement(Product),
        roles: routeConfig.product.roles,
        auth: true,
      },
      {
        routePath: routeConfig.productBundle.routePath,
        element: React.createElement(ProductBundle),
        roles: routeConfig.productBundle.roles,
        auth: true,
      },
    ],
  },
];
