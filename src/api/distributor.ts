import { IDistributorPayload } from '@/lib/validations/distributor';
import {
  sendDeleteRequest,
  sendPostRequest,
  sendPutRequest,
} from './swrConfig';
import BACKEND_ENDPOINTS from './urls';

export const distributorApi = {
  create: async (payload: IDistributorPayload) => {
    return sendPostRequest(BACKEND_ENDPOINTS.DISTRIBUTOR.CREATE, {
      arg: payload,
    });
  },
  update: async (id: string, payload: IDistributorPayload) => {
    return sendPutRequest(BACKEND_ENDPOINTS.DISTRIBUTOR.UPDATE(id), {
      arg: payload,
    });
  },
  delete: async (id: string) => {
    return sendDeleteRequest(BACKEND_ENDPOINTS.DISTRIBUTOR.DELETE(id));
  },
};
