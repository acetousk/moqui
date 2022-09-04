import {
  Context,
  useReviewFactory,
  UseReviewFactoryParams
} from '@vue-storefront/core';
import type { Review } from '@vue-storefront/moqui-api';
import type {
  UseReviewSearchParams as SearchParams,
  UseReviewAddParams as AddParams
} from '../types';

const params: UseReviewFactoryParams<Review, SearchParams, AddParams> = {
  searchReviews: async (context: Context, params) => {
    try {
      const response = await context.$moqui.api.getReviews({
        productId: params.productId,
        page: params.page,
        itemsPerPage: params.itemsPerPage
      });
      return response;

    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  addReview: async (context: Context, params) => {
    try {
      const response = await context.$moqui.api.addReview({
        productId: params.productId,
        productRating: params.rating,
        productReview: params.review
      });
      return response;

    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  }
};

export const useReview = useReviewFactory<Review, SearchParams, AddParams>(params);
