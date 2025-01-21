import { ISRPayload } from '@/lib/validations/sr';
import {
  sendDeleteRequest,
  sendPostRequest,
  sendPutRequest,
} from './swrConfig';
import BACKEND_ENDPOINTS from './urls';

export const srApi = {
  create: async (payload: ISRPayload) => {
    return sendPostRequest(BACKEND_ENDPOINTS.SR.CREATE, { arg: payload });
  },
  update: async (id: string, payload: ISRPayload) => {
    return sendPutRequest(BACKEND_ENDPOINTS.SR.UPDATE(id), { arg: payload });
  },
  delete: async (id: string) => {
    return sendDeleteRequest(BACKEND_ENDPOINTS.SR.DELETE(id));
  },
};
