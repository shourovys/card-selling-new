import api from '@/config/apiConfig';
import { IProductPayload, IProductResponse } from '@/lib/validations/product';
import { IApiResponse } from '@/types/common';
import BACKEND_ENDPOINTS from './urls';

export const productApi = {
  getAll: async (
    queryString?: string
  ): Promise<IApiResponse<IProductResponse>> => {
    const response = await api.post(
      BACKEND_ENDPOINTS.PRODUCT.LIST(queryString || '')
    );
    return response.data;
  },

  list: async (
    queryString: string
  ): Promise<IApiResponse<IProductResponse>> => {
    const response = await api.post(
      BACKEND_ENDPOINTS.PRODUCT.LIST(queryString)
    );
    return response.data;
  },

  create: async (
    payload: IProductPayload
  ): Promise<IApiResponse<IProductResponse>> => {
    const response = await api.post(BACKEND_ENDPOINTS.PRODUCT.CREATE, payload);
    return response.data;
  },

  update: async (
    id: number,
    payload: IProductPayload
  ): Promise<IApiResponse<IProductResponse>> => {
    const response = await api.put(
      BACKEND_ENDPOINTS.PRODUCT.UPDATE(id),
      payload
    );
    return response.data;
  },

  delete: async (id: number): Promise<IApiResponse<IProductResponse>> => {
    const response = await api.delete(BACKEND_ENDPOINTS.PRODUCT.DELETE(id));
    return response.data;
  },
};
