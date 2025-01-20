import { Permission, PermissionGroup, Role } from '@/lib/validations/role';

export interface IRoleResponse {
  roles: Role[];
  // total: number;
  // totalPages: number;
  // currentPage: number;
}

export interface IPermissionResponse {
  data: Permission[];
}

export interface IPermissionGroupResponse {
  data: PermissionGroup[];
}

export interface IRoleFilter {
  search?: string;
}

export interface IRoleApiQueryParams {
  search?: string;
  page?: number;
  size?: number;
}
