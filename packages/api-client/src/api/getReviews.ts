import { ReviewsGetParams, ReviewsGetResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function getReviews(context: Context, params: ReviewsGetParams) {

  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/products/reviews', context.config.api);

  // Add parameters passed from composable as query strings to the URL
  url.searchParams.set('productId', params.productId);
  url.searchParams.set('productStoreId', context.config.defaultStoreId);
  params.pageIndex && url.searchParams.set('pageIndex', String(params.pageIndex - 1));
  params.pageSize && url.searchParams.set('pageSize', String(params.pageSize));

  // Use axios to send a GET request
  const { data, headers } = await context.client.get<ReviewsGetResponse>(url.href, {
    headers: getHeaders(context)
  });
  // Return data from the API
  return {
    data, headers
  };
}
