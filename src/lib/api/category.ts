import { Category, CategoryFormValues } from '@/lib/validations/category';

export interface CategoryResponse {
  data: {
    categories: Category[];
  };
}

export interface CategoryPayload {
  metaInfo: {
    requestId: string;
    source: string;
    versionCode: string;
    versionName: string;
    networkType: string;
    deviceID: string;
    deviceOSCode: number;
    deviceOSName: string;
    deviceName: string;
    language: string;
    latitude: number;
    longitude: number;
  };
  attribute: Omit<CategoryFormValues, 'position'> & {
    parentCategoryId: null;
    position: number | null;
  };
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
    const response = await axiosInstance.get<CategoryResponse>(
      '/api/v1/private/all/categories'
    );
    return response.data;
  },

  create: async (values: CategoryFormValues) => {
    const payload: CategoryPayload = {
      metaInfo: defaultMetaInfo,
      attribute: {
        name: values.name,
        description: values.description,
        status: values.status === 'active',
        icon: values.icon,
        parentCategoryId: null,
        position: values.position ? parseInt(values.position) + 1 : null,
      },
    };

    const response = await axiosInstance.post(
      '/api/v1/private/save/category',
      payload
    );
    return response.data;
  },

  update: async (id: number, values: CategoryFormValues) => {
    const payload: CategoryPayload = {
      metaInfo: defaultMetaInfo,
      attribute: {
        name: values.name,
        description: values.description,
        status: values.status === 'active',
        icon: values.icon,
        parentCategoryId: null,
        position: values.position ? parseInt(values.position) + 1 : null,
      },
    };

    const response = await axiosInstance.put(
      `/api/v1/private/update/category/${id}`,
      payload
    );
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axiosInstance.delete(
      `/api/v1/private/delete/category/${id}`
    );
    return response.data;
  },
};
