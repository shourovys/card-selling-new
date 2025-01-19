import { IRequestMetaInfo } from '@/types/common';
import { z } from 'zod';

export const productFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Product name must be at least 2 characters' })
    .max(100, { message: 'Product name must be less than 100 characters' }),
  description: z
    .string()
    .max(500, { message: 'Description must be less than 500 characters' })
    .optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  image: z.any().nullable(),
  categoryId: z.string({ required_error: 'Category is required' }),
});

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  status: z.boolean(),
  image: z.string(),
  categoryId: z.number(),
  category: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export type Product = z.infer<typeof productSchema>;
export type ProductFormValues = z.infer<typeof productFormSchema>;

export interface IProductResponse {
  productsData: {
    products: Product[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface IProductPayload {
  metaInfo: IRequestMetaInfo;
  attribute: {
    name: string;
    description?: string | null;
    status: boolean;
    image: string | null;
    categoryId: number;
  };
}

export interface ProductFilter {
  search?: string;
}

export interface ProductApiQueryParams {
  search?: string;
  page?: number;
  size?: number;
}
