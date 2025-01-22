import { IRequestMetaInfo } from '@/types/common';
import { z } from 'zod';

export const productBundleFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Bundle name must be at least 2 characters' })
      .max(100, { message: 'Bundle name must be less than 100 characters' }),
    description: z
      .string()
      .max(500, { message: 'Description must be less than 500 characters' })
      .optional(),
    status: z.enum(['active', 'inactive']).default('active'),
    image: z.any().refine((file) => file !== null, {
      message: 'Bundle Image is required',
    }),
    facePrice: z.string().min(1, { message: 'Face price is required' }),
    purchasePrice: z.string().min(1, { message: 'Purchase price is required' }),
    salePrice: z.string(),
    currency: z.string().min(1, { message: 'Currency is required' }),
    gpType: z.enum(['percentage', 'fixed']).default('percentage'),
    gpValue: z.string().min(1, { message: 'GP value is required' }),
    gpAmount: z.string().optional(),
    product: z.object({
      value: z.string().min(1, { message: 'Product is required' }),
      label: z.string(),
    }),
    additionalCategoryId: z.string().optional(),
    inventoryProductId: z
      .string()
      .min(1, { message: 'Inventory Product ID is required' }),
  })
  .superRefine((data, ctx) => {
    if (Number(data.facePrice) < Number(data.salePrice)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Face price must be greater than sale price',
        path: ['facePrice'],
      });
    }
  });

export const productBundleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  status: z.boolean(),
  image: z.string(),
  facePrice: z.number(),
  purchasePrice: z.number(),
  salePrice: z.number(),
  currency: z.string(),
  gpType: z.enum(['percentage', 'fixed']),
  gpValue: z.number(),
  gpAmount: z.number(),
  products: z.object({
    id: z.number(),
    name: z.string(),
    categoryId: z.number(),
  }),
  additionalCategory: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable(),
  inventoryProductId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export type ProductBundle = z.infer<typeof productBundleSchema>;
export type ProductBundleFormValues = z.infer<typeof productBundleFormSchema>;

export interface IProductBundleResponse {
  productBundlesData: {
    productBundles: ProductBundle[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface IProductBundlePayload {
  metaInfo: IRequestMetaInfo;
  attribute: {
    name: string;
    description?: string | null;
    status: boolean;
    image: string | null;
    facePrice: number;
    purchasePrice: number;
    salePrice: number;
    currency: string;
    gpType: string;
    gpValue: number;
    gpAmount: number;
    productId: number;
    additionalCategoryId?: number;
    inventoryProductId: string;
  };
}

export interface ProductBundleFilter {
  search?: string;
}

export interface ProductBundleApiQueryParams {
  search?: string;
  page?: number;
  size?: number;
}
