// Unified Permission Structure
export const PERMISSIONS = {
  DISTRIBUTOR: {
    VIEW: 'view_distributor',
    CREATE: 'create_distributor',
    EDIT: 'edit_distributor',
    DELETE: 'delete_distributor',
    APPROVE: 'approve_distributor',
  },
  ROLE: {
    VIEW: 'view_role',
    CREATE: 'create_role',
    EDIT: 'edit_role',
    DELETE: 'delete_role',
    APPROVE: 'approve_role',
  },
  SUB_DISTRIBUTOR: {
    VIEW: 'view_sub_distributor',
    CREATE: 'create_sub_distributor',
    EDIT: 'edit_sub_distributor',
    DELETE: 'delete_sub_distributor',
    APPROVE: 'approve_sub_distributor',
  },
  SR: {
    VIEW: 'view_sr',
    CREATE: 'create_sr',
    EDIT: 'edit_sr',
    DELETE: 'delete_sr',
    APPROVE: 'approve_sr',
  },
  BALANCE: {
    GENERATE: 'generate_virtual_balance',
    APPROVE: 'approve_virtual_balance',
  },
  CATEGORY: {
    VIEW: 'view_category',
    CREATE: 'create_category',
    EDIT: 'edit_category',
    DELETE: 'delete_category',
  },
  PRODUCT_BUNDLE: {
    VIEW: 'view_product_bundle',
    CREATE: 'create_product_bundle',
    EDIT: 'edit_product_bundle',
    DELETE: 'delete_product_bundle',
  },
  ADDITIONAL_CATEGORY: {
    VIEW: 'view_additional_category',
    CREATE: 'create_additional_category',
    EDIT: 'edit_additional_category',
    DELETE: 'delete_additional_category',
  },
  PRODUCT: {
    VIEW: 'view_product',
    CREATE: 'create_product',
    EDIT: 'edit_product',
    DELETE: 'delete_product',
  },
} as const;

// Type Definitions
export type IPermissionCategory = keyof typeof PERMISSIONS;
export type IPermissionAction<T extends IPermissionCategory> =
  keyof (typeof PERMISSIONS)[T];

// Create a union type of all permission string literals
type ValueOf<T> = T[keyof T];

export type IPermissionValue = ValueOf<{
  [K in IPermissionCategory]: ValueOf<(typeof PERMISSIONS)[K]>;
}>;

// Permission Check Cache
const permissionCheckCache = new Map<string, boolean>();

// Helper function to generate cache key
const getCacheKey = (
  userPermissions: readonly string[],
  requiredPermissions: readonly string[],
  type: 'any' | 'all'
): string => {
  const sortedUserPerms = [...userPermissions].sort().join(',');
  const sortedReqPerms = [...requiredPermissions].sort().join(',');
  return `${sortedUserPerms}|${sortedReqPerms}|${type}`;
};

// Permission Check Utilities
export const hasPermission = (
  userPermissions: readonly string[],
  requiredPermission: IPermissionValue
): boolean => {
  const cacheKey = getCacheKey(userPermissions, [requiredPermission], 'any');

  if (permissionCheckCache.has(cacheKey)) {
    return permissionCheckCache.get(cacheKey)!;
  }

  const result = userPermissions.includes(requiredPermission);
  permissionCheckCache.set(cacheKey, result);
  return result;
};

export const hasAnyPermission = (
  userPermissions: readonly string[],
  requiredPermissions: readonly IPermissionValue[]
): boolean => {
  if (!requiredPermissions.length) return true;

  const cacheKey = getCacheKey(userPermissions, requiredPermissions, 'any');

  if (permissionCheckCache.has(cacheKey)) {
    return permissionCheckCache.get(cacheKey)!;
  }

  const result = requiredPermissions.some((permission) =>
    userPermissions.includes(permission)
  );
  permissionCheckCache.set(cacheKey, result);
  return result;
};

export const hasAllPermissions = (
  userPermissions: readonly string[],
  requiredPermissions: readonly IPermissionValue[]
): boolean => {
  if (!requiredPermissions.length) return true;

  const cacheKey = getCacheKey(userPermissions, requiredPermissions, 'all');

  if (permissionCheckCache.has(cacheKey)) {
    return permissionCheckCache.get(cacheKey)!;
  }

  const result = requiredPermissions.every((permission) =>
    userPermissions.includes(permission)
  );
  permissionCheckCache.set(cacheKey, result);
  return result;
};

// Helper function to get all permissions for a category
export const getCategoryPermissions = (
  category: IPermissionCategory
): readonly IPermissionValue[] => {
  return Object.values(PERMISSIONS[category]) as IPermissionValue[];
};

// Helper function to check if user has any permission in a category
export const hasAnyCategoryPermission = (
  userPermissions: readonly string[],
  category: IPermissionCategory
): boolean => {
  const categoryPermissions = getCategoryPermissions(category);
  return hasAnyPermission(userPermissions, categoryPermissions);
};

// Clear permission check cache (useful when permissions change)
export const clearPermissionCache = (): void => {
  permissionCheckCache.clear();
};
