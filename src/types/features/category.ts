import { Category, CategoryFormValues } from '@/lib/validations/category';
import { IRequestMetaInfo } from '../common';

export interface CategoryApiQueryParams {
  // offset: number;
  // limit: number;
  // sort_by: string;
  // order: 'asc' | 'desc';
  name?: string;
}

export interface ICategoryResponse {
  categories: Category[];
}

export interface CategoryFilter {
  name: string;
}

export interface ICategoryPayload {
  metaInfo: IRequestMetaInfo;
  attribute: Omit<CategoryFormValues, 'status' | 'position'> & {
    position: number | null;
    status: boolean;
    parentCategoryId: number | null;
  };
}
