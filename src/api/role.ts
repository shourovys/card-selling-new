import api from '@/config/apiConfig';
import {
  IPermissionGroupResponse,
  IPermissionResponse,
  IRolePayload,
  IRoleResponse,
} from '@/lib/validations/role';
import { IApiResponse } from '@/types/common';
import BACKEND_ENDPOINTS from './urls';

export const roleApi = {
  list: async (queryString: string): Promise<IApiResponse<IRoleResponse>> => {
    const response = await api.get(BACKEND_ENDPOINTS.ROLE.LIST(queryString));
    return response.data;
  },

  create: async (
    payload: IRolePayload
  ): Promise<IApiResponse<IRoleResponse>> => {
    const response = await api.post(BACKEND_ENDPOINTS.ROLE.CREATE, payload);
    return response.data;
  },

  update: async (
    id: number,
    payload: IRolePayload
  ): Promise<IApiResponse<IRoleResponse>> => {
    const response = await api.put(BACKEND_ENDPOINTS.ROLE.UPDATE(id), payload);
    return response.data;
  },

  delete: async (id: number): Promise<IApiResponse<IRoleResponse>> => {
    const response = await api.delete(BACKEND_ENDPOINTS.ROLE.DELETE(id));
    return response.data;
  },

  getPermissions: async (): Promise<IApiResponse<IPermissionResponse>> => {
    const response = await api.get(BACKEND_ENDPOINTS.ROLE.PERMISSIONS);
    return response.data;
  },

  getPermissionGroups: async (): Promise<
    IApiResponse<IPermissionGroupResponse>
  > => {
    const response = await api.get(BACKEND_ENDPOINTS.ROLE.PERMISSION_GROUPS);
    return response.data;
  },
};
