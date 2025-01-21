import { IRequestMetaInfo } from '@/types/common';
import { z } from 'zod';

export const distributorFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phoneNumber: z
    .string()
    .regex(/^(\+964|964|0)?7[3-9]\d{8}$/, {
      message: 'Please enter a valid Iraq phone number',
    })
    .transform((value) => {
      if (value.startsWith('0')) return '+964' + value.slice(1);
      if (value.startsWith('964')) return '+' + value;
      if (!value.startsWith('+')) return '+964' + value;
      return value;
    }),
  status: z.string(),
  checkerId: z.string().nullable(),
});

export const distributorSchema = z.object({
  id: z.number(),
  userId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  emailAddress: z.string(),
  mobileNumber: z.string(),
  status: z.boolean(),
  checkerId: z.string().nullable(),
  checkerName: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export type Distributor = z.infer<typeof distributorSchema>;
export type DistributorFormValues = z.infer<typeof distributorFormSchema>;

export interface IDistributorResponse {
  distributors: Distributor[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface IDistributorPayload {
  metaInfo: IRequestMetaInfo;
  attribute: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    status: boolean;
    checkerId: string | null;
  };
}

export interface IChecker {
  userId: string;
  name: string;
}

export interface ICheckerResponse {
  checkerList: IChecker[];
}
