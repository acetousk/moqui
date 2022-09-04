import {
  ProductsSearchParams
} from '@vue-storefront/core';
import { Category, Product, ProductFilter } from '@vue-storefront/moqui-api';

export type TODO = any;
export type UseBillingAddParams = TODO;
export type UseCategorySearchParams = TODO;
export type UseShippingAddParams = TODO;
export type UseStoreFilterParams = TODO;

export type UseFacetSearchParams = {
  searchType?: string;
  items: Product[];
  categoryTree: Category;
  availableFilters: ProductFilter[];
  category: { categorySlug: string },
  sortOptions: {
    options: {
      id: string;
      type: string;
      value: string;
    }[],
    selected: string;
  };
  perPageOptions: Array<number>;
  total: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
};

export type UseProductSearchParams = ProductsSearchParams;

export type UseReviewSearchParams = {
  productId: string;
  page: number;
  itemsPerPage: number;
};

export type UseReviewAddParams = {
  productId: string;
  rating: string;
  review: string;
};

export type UseUserUpdateParams = {
  firstName: string;
  lastName: string;
  gender: string;
};

export interface UseUserRegisterParams {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
export type useUserOrderSearchParams = {
  page: number;
  itemsPerPage: number;
};
