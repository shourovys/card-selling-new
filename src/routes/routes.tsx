import React, { lazy } from 'react';
import { protectedRoutes } from './protected.routes';
import { publicRoutes } from './public.routes';
import { routePaths } from './routePaths';

const NotFound = lazy(() => import('../pages/NotFound'));

export type UserRole = 'admin' | 'user' | 'manager';

type BaseRoute = {
  element?: React.ReactNode;
  title?: string;
  breadcrumb?: string;
  auth?: boolean;
  roles?: UserRole[];
  children?: AppRoute[];
};

type LayoutRoute = BaseRoute & {
  isLayout: true;
  path?: never;
  index?: never;
};

type PathRoute = BaseRoute & {
  isLayout?: never;
  path?: string;
  index?: boolean;
};

export type AppRoute = LayoutRoute | PathRoute;

export const routeConfig: AppRoute[] = [
  ...publicRoutes,
  ...protectedRoutes,
  {
    path: routePaths.notFound,
    element: React.createElement(NotFound),
    title: 'Not Found',
    breadcrumb: 'Not Found',
  },
];
