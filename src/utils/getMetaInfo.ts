import { IRequestMetaInfo } from '@/types/common';

export const getMetaInfo = (): IRequestMetaInfo => {
  return {
    deviceID: 'web',
    deviceType: 'web',
    deviceInfo: {
      deviceID: 'web',
      deviceType: 'web',
      notificationToken: '',
    },
  };
};
