import { Category, CategoryFormValues } from '@/lib/validations/category';
import { IRequestMetaInfo } from '../common';

export interface CategoryApiQueryParams {
  // offset: number;
  // limit: number;
  // sort_by: string;
  // order: 'asc' | 'desc';
  search?: string;
}

export interface CategoryResponse {
  data: {
    categories: Category[];
    count: number;
  };
}

export interface CategoryFilter {
  search: string;
}

export interface ICategoryPayload {
  metaInfo: IRequestMetaInfo;
  attribute: Omit<CategoryFormValues, 'status' | 'position'> & {
    position: number | null;
    status: boolean;
  };
}
