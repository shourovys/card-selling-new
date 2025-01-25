import {
  hasAllPermissions,
  hasAnyCategoryPermission,
  hasAnyPermission,
  hasPermission,
  IPermissionCategory,
  IPermissionValue,
  PERMISSIONS,
} from '@/config/permission';
import { useCallback, useMemo } from 'react';
import useAuth from './useAuth';

interface UsePermissionsReturn {
  can: (permission: IPermissionValue) => boolean;
  canAll: (permissions: IPermissionValue[]) => boolean;
  canAny: (permissions: IPermissionValue[]) => boolean;
  canInCategory: (category: IPermissionCategory) => boolean;
  getActionPermissions: (category: IPermissionCategory) => {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
}

export const usePermissions = (): UsePermissionsReturn => {
  const { user } = useAuth();
  const userPermissions = user?.permissions || [];

  const can = useCallback(
    (permission: IPermissionValue) =>
      hasPermission(userPermissions, permission),
    [userPermissions]
  );

  const canAll = useCallback(
    (permissions: IPermissionValue[]) =>
      hasAllPermissions(userPermissions, permissions),
    [userPermissions]
  );

  const canAny = useCallback(
    (permissions: IPermissionValue[]) =>
      hasAnyPermission(userPermissions, permissions),
    [userPermissions]
  );

  const canInCategory = useCallback(
    (category: IPermissionCategory) =>
      hasAnyCategoryPermission(userPermissions, category),
    [userPermissions]
  );

  const getActionPermissions = useCallback(
    (category: IPermissionCategory) => {
      const categoryPerms = PERMISSIONS[category];
      const result = {
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
      };

      // Safely check each permission
      if ('VIEW' in categoryPerms) {
        result.canView = hasPermission(
          userPermissions,
          categoryPerms['VIEW' as keyof typeof categoryPerms]
        );
      }
      if ('CREATE' in categoryPerms) {
        result.canCreate = hasPermission(
          userPermissions,
          categoryPerms['CREATE' as keyof typeof categoryPerms]
        );
      }
      if ('EDIT' in categoryPerms) {
        result.canEdit = hasPermission(
          userPermissions,
          categoryPerms['EDIT' as keyof typeof categoryPerms]
        );
      }
      if ('DELETE' in categoryPerms) {
        result.canDelete = hasPermission(
          userPermissions,
          categoryPerms['DELETE' as keyof typeof categoryPerms]
        );
      }

      return result;
    },
    [userPermissions]
  );

  return useMemo(
    () => ({
      can,
      canAll,
      canAny,
      canInCategory,
      getActionPermissions,
    }),
    [can, canAll, canAny, canInCategory, getActionPermissions]
  );
};

export default usePermissions;
