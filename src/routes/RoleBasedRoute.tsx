import { routeConfig } from '@/config/routeConfig';
import { IUserRole } from '@/types/auth.types';
import React from 'react';
import { Navigate } from 'react-router-dom';

interface RoleBasedRouteProps {
  isAuthenticated: boolean;
  userRoles: IUserRole[];
  allowedRoles: IUserRole[];
  children: React.ReactNode;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  isAuthenticated,
  userRoles,
  allowedRoles,
  children,
}) => {
  if (!isAuthenticated) {
    return <Navigate to={routeConfig.login.path()} replace />;
  }

  // If no roles are specified, allow access to authenticated users
  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Check if user has any of the required roles
  const hasRequiredRole = userRoles.some((role) => allowedRoles.includes(role));

  if (!hasRequiredRole) {
    return <Navigate to={routeConfig.unauthorized.path()} replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
