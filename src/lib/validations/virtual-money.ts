import { IRequestMetaInfo } from '@/types/common';
import { z } from 'zod';

export const virtualMoneyFormSchema = z.object({
  amount: z.string().min(1, { message: 'Amount is required' }),
  remarks: z.string().optional(),
  approverUserCode: z.string().min(1, { message: 'Approver is required' }),
});

export const virtualMoneySchema = z.object({
  id: z.number(),
  transactionId: z.string(),
  amount: z.number(),
  remarks: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  approverUserCode: z.string(),
  approverName: z.string(),
  initiatorUserCode: z.string(),
  initiatorName: z.string().optional(),
  createdAt: z.string(),
  approvedAt: z.string().nullable(),
  updatedAt: z.string().optional(),
});

export type VirtualMoney = z.infer<typeof virtualMoneySchema>;
export type VirtualMoneyFormValues = z.infer<typeof virtualMoneyFormSchema>;

export interface Transaction {
  id: number;
  initiatorUserCode: string;
  approverUserCode: string;
  amount: number;
  transactionId: string;
  status: {
    name: string;
  };
  remarks: string;
  createdAt: string;
  approvedAt: string | null;
}

interface Sort {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface IVirtualMoneyResponse {
  content: Transaction[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface IVirtualMoneyPayload {
  metaInfo: IRequestMetaInfo;
  attribute: {
    amount: number;
    approverUserCode: string;
    remarks: string;
  };
}

export interface IApproveVirtualMoneyPayload {
  metaInfo: IRequestMetaInfo;
  attribute: {
    id: number;
    status: 'APPROVED' | 'REJECTED';
    remarks?: string;
  };
}

export interface IApproverResponse {
  approverList: {
    userCode: string;
    name: string;
  }[];
}
