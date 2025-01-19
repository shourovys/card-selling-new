import api from '@/config/apiConfig';
import { IApiResponse } from '@/types/common';
import { IAdditionalCategoryResponse } from '@/types/features/additional-category';

export const additionalCategoryApi = {
  getAll: async (queryString: string = '') => {
    const response = await api.get<IApiResponse<IAdditionalCategoryResponse>>(
      `/api/v1/private/all/additionalCategories${
        queryString ? `?${queryString}` : ''
      }`
    );
    return response.data;
  },

  getByPosition: async (position: string) => {
    const response = await api.get<IApiResponse<IAdditionalCategoryResponse>>(
      `/api/v1/private/all/additionalCategories?position=${position}`
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
      '/api/v1/private/save/additionalCategoryMapping',
      formData
    );
    return response.data;
  },

  deleteMapping: async (
    additionalCategoryId: number,
    categoryIds: number[]
  ) => {
    const response = await api.delete(
      `/api/v1/private/delete/additionalCategoryMapping?additionalCategoryId=${additionalCategoryId}&categoryIds=${categoryIds.join(
        ','
      )}`
    );
    return response.data;
  },
};
