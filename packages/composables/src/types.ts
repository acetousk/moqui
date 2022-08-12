import {
  ProductsSearchParams
} from '@vue-storefront/core';

export type TODO = any;

export type UseBillingAddParams = TODO;

export type UseCategorySearchParams = TODO;

export type UseFacetSearchParams = TODO;

export type UseProductSearchParams = ProductsSearchParams;

export type UseReviewSearchParams = TODO;

export type UseReviewAddParams = TODO;

export type UseShippingAddParams = TODO;

export type UseStoreFilterParams = TODO;

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
export type useUserOrderSearchParams = TODO;
