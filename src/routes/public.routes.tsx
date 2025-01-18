import React, { lazy } from 'react';
import { routePaths } from './routePaths';
import type { AppRoute } from './routes';

const PublicLayout = lazy(() => import('../layouts/PublicLayout'));
const AuthLayout = lazy(() => import('../layouts/AuthLayout'));

const Unauthorized = lazy(() => import('../pages/Unauthorized'));
const Login = lazy(() => import('../pages/auth/Login'));

export const publicRoutes: AppRoute[] = [
  {
    element: React.createElement(PublicLayout),
    isLayout: true,
    children: [
      {
        path: routePaths.unauthorized,
        element: React.createElement(Unauthorized),
        title: 'Unauthorized',
        breadcrumb: 'Unauthorized',
      },
    ],
  },
  {
    element: React.createElement(AuthLayout),
    isLayout: true,
    children: [
      {
        path: routePaths.login,
        element: React.createElement(Login),
        title: 'Login',
        breadcrumb: 'Login',
      },
    ],
  },
];
