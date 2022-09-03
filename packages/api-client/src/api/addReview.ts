import { ReviewsAddParams, ReviewsAddResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function addReview(context: Context, params: ReviewsAddParams) {

  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/products/reviews', context.config.api);

  // Use axios to send a GET request
  const { data, headers } = await context.client.post<ReviewsAddResponse>(url.href, {
    productStoreId: context.config.defaultStoreId,
    productId: params.productId,
    productReview: params.productReview,
    productRating: params.productRating
  }, {
    headers: getHeaders(context)
  });
  // Return data from the API
  return {
    data, headers
  };
}
