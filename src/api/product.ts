import { IProductPayload } from '@/lib/validations/product';
import {
  sendDeleteRequest,
  sendPostRequest,
  sendPutRequest,
} from './swrConfig';
import BACKEND_ENDPOINTS from './urls';

export const productApi = {
  getAll: async (queryString: string = '') => {
    const response = await sendPostRequest(
      BACKEND_ENDPOINTS.PRODUCT.LIST(queryString),
      {
        arg: {
          metaInfo: {
            requestId: '1234234234234',
            source: 'Android / iOS',
            versionCode: '3.1.4',
            versionName: '10',
            networkType: 'Wifi / Mobile',
            deviceID: 'IMEI / DEVICE_ID / UDID',
            deviceOSCode: 27,
            deviceOSName: '8.1.0',
            deviceName: 'Galaxy Ace',
            language: 'en',
            latitude: 11.3344,
            longitude: 54.5645645,
          },
        },
      }
    );
    return response;
  },

  create: async (payload: IProductPayload) => {
    const response = await sendPostRequest(BACKEND_ENDPOINTS.PRODUCT.CREATE, {
      arg: payload,
    });
    return response;
  },

  update: async (id: number, payload: IProductPayload) => {
    const response = await sendPutRequest(
      BACKEND_ENDPOINTS.PRODUCT.UPDATE(id),
      {
        arg: payload,
      }
    );
    return response;
  },

  delete: async (id: number) => {
    const response = await sendDeleteRequest(
      BACKEND_ENDPOINTS.PRODUCT.DELETE(id)
    );
    return response;
  },
};
