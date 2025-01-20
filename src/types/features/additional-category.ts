import {
  IAdditionalCategory,
  IAdditionalCategoryFormValues,
} from '@/lib/validations/additional-category';
import { IRequestMetaInfo } from '../common';

export interface AdditionalCategoryApiQueryParams {
  search?: string;
  page?: number;
  size?: number;
  name?: string;
}

export interface IAdditionalCategoryResponse {
  additionalCategoriesData: {
    additionalCategories: IAdditionalCategory[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface IAdditionalCategoryMappingResponse {
  categoryMapping: {
    additionalCategories: IAdditionalCategory[];
  };
}

export interface AdditionalCategoryFilter {
  search: string;
}

export interface IAdditionalCategoryPayload {
  metaInfo: IRequestMetaInfo;
  attribute: Omit<IAdditionalCategoryFormValues, 'status' | 'position'> & {
    position: number | null;
    status: boolean;
    categoryIds?: string[];
  };
}
