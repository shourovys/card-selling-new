import api from '@/config/apiConfig';
import { Category, CategoryFormValues } from '@/lib/validations/category';
import { ICategoryPayload } from '@/types/features/category';

export interface CategoryResponse {
  categories: Category[];
}

const defaultMetaInfo = {
  requestId: '1234234234234',
  source: 'Web',
  versionCode: '3.1.4',
  versionName: '10',
  networkType: 'Wifi',
  deviceID: 'WEB_APP',
  deviceOSCode: 27,
  deviceOSName: '8.1.0',
  deviceName: 'Web Browser',
  language: 'en',
  latitude: 11.3344,
  longitude: 54.5645645,
};

export const categoryApi = {
  getAll: async () => {
    const response = await api.get<CategoryResponse>(
      '/api/v1/private/all/categories'
    );
    return response.data;
  },

  create: async (values: CategoryFormValues) => {
    const payload: ICategoryPayload = {
      metaInfo: defaultMetaInfo,
      attribute: {
        name: values.name,
        description: values.description,
        status: values.status === 'active',
        icon: values.icon,
        position: values.position ? parseInt(values.position) + 1 : null,
      },
    };

    const response = await api.post('/api/v1/private/save/category', payload);
    return response.data;
  },

  update: async (id: number, values: CategoryFormValues) => {
    const payload: ICategoryPayload = {
      metaInfo: defaultMetaInfo,
      attribute: {
        name: values.name,
        description: values.description,
        status: values.status === 'active',
        icon: values.icon,
        position: values.position ? parseInt(values.position) + 1 : null,
      },
    };

    const response = await api.put(
      `/api/v1/private/update/category/${id}`,
      payload
    );
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/api/v1/private/delete/category/${id}`);
    return response.data;
  },
};
