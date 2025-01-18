import * as z from 'zod';

export const categoryFormSchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional(),
  position: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  icon: z.any().refine((file) => file !== null, {
    message: 'Icon is required',
  }),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon: string;
  status: boolean;
  position: number;
  type: string;
  createdAt: string;
}
