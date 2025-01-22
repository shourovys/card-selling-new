import api from '@/config/apiConfig';
import { IApiResponse } from '@/types/common';
import {
  IAdditionalCategoryMappingResponse,
  IAdditionalCategoryResponse,
} from '@/types/features/additional-category';
import BACKEND_ENDPOINTS from './urls';

export const additionalCategoryApi = {
  getAll: async (queryString: string = '') => {
    const response = await api.get<IApiResponse<IAdditionalCategoryResponse>>(
      BACKEND_ENDPOINTS.ADDITIONAL_CATEGORY.LIST(queryString)
    );
    return response.data;
  },

  getByPosition: async (position: string) => {
    const response = await api.get<IApiResponse<IAdditionalCategoryResponse>>(
      BACKEND_ENDPOINTS.ADDITIONAL_CATEGORY.MAPPING.GET_BY_POSITION(position)
    );
    return response.data;
  },

  getByCategoryId: async (categoryId: number) => {
    const response = await api.get<
      IApiResponse<IAdditionalCategoryMappingResponse>
    >(
      BACKEND_ENDPOINTS.ADDITIONAL_CATEGORY.MAPPING.GET_BY_CATEGORY_ID(
        categoryId
      )
    );
    return response.data;
  },

  updateMapping: async (
    additionalCategoryId: number,
    categoryIds: string[]
  ) => {
    const formData = new FormData();
    formData.append('additionalCategoryId', additionalCategoryId.toString());
    formData.append('categoryIds', categoryIds.join(','));

    const response = await api.post(
      BACKEND_ENDPOINTS.ADDITIONAL_CATEGORY.MAPPING.CREATE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  deleteMapping: async (
    additionalCategoryId: number,
    categoryIds: number[]
  ) => {
    const response = await api.delete(
      BACKEND_ENDPOINTS.ADDITIONAL_CATEGORY.MAPPING.DELETE(
        additionalCategoryId,
        categoryIds
      )
    );
    return response.data;
  },
};
