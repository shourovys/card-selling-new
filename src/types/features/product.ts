import { Product } from '@/lib/validations/product';
import { IRequestMetaInfo } from '../common';

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
