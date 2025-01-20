import api from '@/config/apiConfig';
import {
  IApproveVirtualMoneyPayload,
  IVirtualMoneyPayload,
  IVirtualMoneyResponse,
  VirtualMoney,
} from '@/lib/validations/virtual-money';
import { IApiResponse } from '@/types/common';
import BACKEND_ENDPOINTS from './urls';

export const virtualMoneyApi = {
  generateVirtualMoney: async (
    payload: IVirtualMoneyPayload
  ): Promise<IApiResponse<{ virtualMoney: VirtualMoney }>> => {
    const response = await api.post(
      BACKEND_ENDPOINTS.VIRTUAL_MONEY.GENERATE,
      payload
    );
    return response.data;
  },

  getVirtualMoneyList: async (
    page: number = 0,
    status?: string
  ): Promise<IApiResponse<IVirtualMoneyResponse>> => {
    const queryString = `page=${page}${status ? `&status=${status}` : ''}`;
    const response = await api.get(
      BACKEND_ENDPOINTS.VIRTUAL_MONEY.LIST(queryString)
    );
    return response.data;
  },

  approveVirtualMoney: async (
    payload: IApproveVirtualMoneyPayload
  ): Promise<IApiResponse<{ virtualMoney: VirtualMoney }>> => {
    const response = await api.post(
      BACKEND_ENDPOINTS.VIRTUAL_MONEY.APPROVE,
      payload
    );
    return response.data;
  },

  getApproverList: async (): Promise<
    IApiResponse<{ approverList: { userCode: string; name: string }[] }>
  > => {
    const response = await api.get(
      BACKEND_ENDPOINTS.VIRTUAL_MONEY.APPROVER_LIST
    );
    return response.data;
  },
};
