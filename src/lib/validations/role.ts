import { IRequestMetaInfo } from '@/types/common';
import { z } from 'zod';

export const roleFormSchema = z.object({
  roleName: z
    .string()
    .min(2, { message: 'Role name must be at least 2 characters' })
    .max(100, { message: 'Role name must be less than 100 characters' }),
  permissions: z
    .array(z.string())
    .min(1, { message: 'At least one permission must be selected' }),
});

export const roleSchema = z.object({
  id: z.number(),
  roleName: z.string(),
  permissions: z.array(
    z.object({
      permissionName: z.string(),
      displayName: z.string(),
      groupId: z.number(),
      isAssignable: z.boolean(),
      isViewable: z.boolean(),
      orderId: z.number(),
    })
  ),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const permissionGroupSchema = z.object({
  id: z.number(),
  groupName: z.string(),
  orderId: z.number(),
});

export const permissionSchema = z.object({
  permissionName: z.string(),
  displayName: z.string(),
  groupId: z.number(),
  isAssignable: z.boolean(),
  isViewable: z.boolean(),
  orderId: z.number(),
});

export type Role = z.infer<typeof roleSchema>;
export type RoleFormValues = z.infer<typeof roleFormSchema>;
export type PermissionGroup = z.infer<typeof permissionGroupSchema>;
export type Permission = z.infer<typeof permissionSchema>;

export interface IRoleResponse {
  roles: Role[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface IPermissionResponse {
  data: {
    permissions: Permission[];
  };
}

export interface IPermissionGroupResponse {
  data: {
    permissionGroups: PermissionGroup[];
  };
}

export interface IRolePayload {
  metaInfo: IRequestMetaInfo;
  attribute: {
    roleName: string;
    permissions: string[];
  };
}

export interface RoleFilter {
  search?: string;
}

export interface RoleApiQueryParams {
  search?: string;
  page?: number;
  size?: number;
}
