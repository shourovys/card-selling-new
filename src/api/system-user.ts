import { ISystemUserPayload } from '@/lib/validations/system-user';
import {
  sendDeleteRequest,
  sendPostRequest,
  sendPutRequest,
} from './swrConfig';
import BACKEND_ENDPOINTS from './urls';

export const systemUserApi = {
  create: async (payload: ISystemUserPayload) => {
    return sendPostRequest(BACKEND_ENDPOINTS.SYSTEM_USER.CREATE, {
      arg: payload,
    });
  },
  update: async (id: string, payload: ISystemUserPayload) => {
    return sendPutRequest(BACKEND_ENDPOINTS.SYSTEM_USER.UPDATE(id), {
      arg: payload,
    });
  },
  delete: async (id: string) => {
    return sendDeleteRequest(BACKEND_ENDPOINTS.SYSTEM_USER.DELETE(id));
  },
};
