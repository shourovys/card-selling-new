import { ISubDistributorPayload } from '@/lib/validations/sub-distributor';
import {
  sendDeleteRequest,
  sendPostRequest,
  sendPutRequest,
} from './swrConfig';
import BACKEND_ENDPOINTS from './urls';

export const subDistributorApi = {
  create: async (payload: ISubDistributorPayload) => {
    return sendPostRequest(BACKEND_ENDPOINTS.SUB_DISTRIBUTOR.CREATE, {
      arg: payload,
    });
  },
  update: async (id: string, payload: ISubDistributorPayload) => {
    return sendPutRequest(BACKEND_ENDPOINTS.SUB_DISTRIBUTOR.UPDATE(id), {
      arg: payload,
    });
  },
  delete: async (id: string) => {
    return sendDeleteRequest(BACKEND_ENDPOINTS.SUB_DISTRIBUTOR.DELETE(id));
  },
};
