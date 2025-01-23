import { routeConfig } from '@/config/routeConfig';
import { IUserRole } from '@/types/auth.types';
import React, { lazy } from 'react';
import { protectedRoutes } from './protected.routes';
import { publicRoutes } from './public.routes';

const NotFound = lazy(() => import('../pages/NotFound'));

type BaseRoute = {
  element?: React.ReactNode;
  title?: string;
  auth?: boolean;
  roles?: IUserRole[];
  children?: AppRoute[];
};

type LayoutRoute = BaseRoute & {
  isLayout: true;
  path?: never;
  index?: never;
};

type PathRoute = BaseRoute & {
  isLayout?: never;
  routePath?: string;
  index?: boolean;
};

export type AppRoute = LayoutRoute | PathRoute;

export const reactRoutes: AppRoute[] = [
  ...publicRoutes,
  ...protectedRoutes,
  {
    routePath: routeConfig.notFound.path(),
    element: React.createElement(NotFound),
    title: 'Not Found',
  },
];
