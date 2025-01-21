import { getMetaInfo } from '@/utils/getMetaInfo';
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add meta info to all POST requests
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.method === 'post') {
      const metaInfo = getMetaInfo();
      config.data = {
        metaInfo,
        ...(config.data || {}),
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
