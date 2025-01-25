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

// Permission Check Utilities
export const hasPermission = (
  userPermissions: string[],
  requiredPermission: IPermissionValue
): boolean => {
  return userPermissions.includes(requiredPermission);
};

export const hasAnyPermission = (
  userPermissions: readonly string[],
  requiredPermissions: readonly IPermissionValue[]
): boolean => {
  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission)
  );
};

export const hasAllPermissions = (
  userPermissions: readonly string[],
  requiredPermissions: readonly IPermissionValue[]
): boolean => {
  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission)
  );
};
