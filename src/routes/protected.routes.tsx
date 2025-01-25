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
        requiredPermissions: routeConfig.dashboard.requiredPermissions,
        auth: true,
      },
      {
        routePath: routeConfig.virtualMoneyRequest.routePath,
        element: React.createElement(RequestVirtualMoney),
        requiredPermissions:
          routeConfig.virtualMoneyRequest.requiredPermissions,
        auth: true,
      },
      {
        routePath: routeConfig.role.routePath,
        element: React.createElement(Role),
        requiredPermissions: routeConfig.role.requiredPermissions,
        auth: true,
      },
      {
        routePath: routeConfig.virtualMoneyHistory.routePath,
        element: React.createElement(VirtualMoney),
        requiredPermissions:
          routeConfig.virtualMoneyHistory.requiredPermissions,
        auth: true,
      },
      {
        routePath: routeConfig.virtualMoneyPending.routePath,
        element: React.createElement(PendingVirtualMoney),
        requiredPermissions:
          routeConfig.virtualMoneyPending.requiredPermissions,
        auth: true,
      },
      {
        routePath: routeConfig.systemUser.routePath,
        element: React.createElement(SystemUserManagement),
        requiredPermissions: routeConfig.systemUser.requiredPermissions,
        auth: true,
      },
      {
        routePath: routeConfig.distributor.routePath,
        element: React.createElement(Distributor),
        requiredPermissions: routeConfig.distributor.requiredPermissions,
        auth: true,
      },
      {
        routePath: routeConfig.subDistributor.routePath,
        element: React.createElement(SubDistributor),
        requiredPermissions: routeConfig.subDistributor.requiredPermissions,
        auth: true,
      },
      {
        routePath: routeConfig.sr.routePath,
        element: React.createElement(SR),
        requiredPermissions: routeConfig.sr.requiredPermissions,
        auth: true,
      },
      {
        routePath: routeConfig.srAdd.routePath,
        element: React.createElement(AddSR),
        requiredPermissions: routeConfig.srAdd.requiredPermissions,
        auth: true,
      },
      {
        routePath: routeConfig.srEdit.routePath,
        element: React.createElement(EditSR),
        requiredPermissions: routeConfig.srEdit.requiredPermissions,
        auth: true,
      },

      {
        routePath: routeConfig.category.routePath,
        element: React.createElement(Category),
        requiredPermissions: routeConfig.category.requiredPermissions,
        auth: true,
      },
      {
        routePath: routeConfig.additionalCategory.routePath,
        element: React.createElement(AdditionalCategory),
        requiredPermissions: routeConfig.additionalCategory.requiredPermissions,
        auth: true,
      },
      {
        routePath: routeConfig.product.routePath,
        element: React.createElement(Product),
        requiredPermissions: routeConfig.product.requiredPermissions,
        auth: true,
      },
      {
        routePath: routeConfig.productBundle.routePath,
        element: React.createElement(ProductBundle),
        requiredPermissions: routeConfig.productBundle.requiredPermissions,
        auth: true,
      },
    ],
  },
];
