import { Permission, PermissionGroup, Role } from '@/lib/validations/role';

export interface IRoleResponse {
  roles: Role[];
  // total: number;
  // totalPages: number;
  // currentPage: number;
}

export interface IPermissionResponse {
  permissions: Permission[];
}

export interface IPermissionGroupResponse {
  permissionGroups: PermissionGroup[];
}

export interface IRoleFilter {
  search?: string;
}

export interface IRoleApiQueryParams {
  search?: string;
  page?: number;
  size?: number;
}
