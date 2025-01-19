import api from '@/config/apiConfig';
import {
  IProductBundlePayload,
  IProductBundleResponse,
} from '@/lib/validations/product-bundle';
import { IApiResponse } from '@/types/common';
import BACKEND_ENDPOINTS from './urls';

export const productBundleApi = {
  list: async (
    queryString: string
  ): Promise<IApiResponse<IProductBundleResponse>> => {
    const response = await api.get(
      BACKEND_ENDPOINTS.PRODUCT_BUNDLE.LIST(queryString)
    );
    return response.data;
  },

  create: async (
    payload: IProductBundlePayload
  ): Promise<IApiResponse<unknown>> => {
    const response = await api.post(
      BACKEND_ENDPOINTS.PRODUCT_BUNDLE.CREATE,
      payload
    );
    return response.data;
  },

  update: async (
    id: number,
    payload: IProductBundlePayload
  ): Promise<IApiResponse<unknown>> => {
    const response = await api.put(
      BACKEND_ENDPOINTS.PRODUCT_BUNDLE.UPDATE(id),
      payload
    );
    return response.data;
  },

  delete: async (id: number): Promise<IApiResponse<unknown>> => {
    const response = await api.delete(
      BACKEND_ENDPOINTS.PRODUCT_BUNDLE.DELETE(id)
    );
    return response.data;
  },
};
