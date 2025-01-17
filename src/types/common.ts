export type IFormErrors<T> = Partial<Record<keyof T, string>> & {
  non_field_errors?: string;
};

// server response
export interface IErrorInfo {
  reason: string | null;
}

export interface IMetaData {
  requestId: string | null;
  transactionId: string;
  eventTime: string;
  status: boolean;
}

export interface IApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface IFormSubmissionResponse {
  message: string;
}

export interface IRequestMetaInfo {
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
}

export interface IApiRequestWithMetaData<T> {
  attributes: T;
  metaInfo: IRequestMetaInfo;
}

export interface IOptionResponse {
  data: {
    id: number;
    value: string;
  }[];
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface IErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export type TempData = {
  email?: string;
  password?: string;
  name?: string;
  role?: string;
  [key: string]: string | undefined;
};
