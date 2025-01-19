import * as z from 'zod';

export const additionalCategoryFormSchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional(),
  position: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .optional()
    .nullable(),
  status: z.enum(['active', 'inactive']),
  icon: z.any().refine((file) => file !== null, {
    message: 'Icon is required',
  }),
  categoryIds: z.array(z.string()).optional(),
});

export type IAdditionalCategoryFormValues = z.infer<
  typeof additionalCategoryFormSchema
>;

export interface IAdditionalCategory {
  id: number;
  name: string;
  description?: string;
  icon: string;
  status: boolean;
  position: number;
  categoryIds: string[];
  createdBy: string;
  createdAt: string;
}
