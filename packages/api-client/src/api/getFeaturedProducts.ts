import { FeaturedProductsGetParams, FeaturedProductsGetResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function getFeaturedProducts(context: Context, params: FeaturedProductsGetParams) {

  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/products/featured', context.config.api);

  // Add parameters passed from composable as query strings to the URL
  url.searchParams.set('productStoreId', context.config.defaultStoreId);
  params.pageSize && url.searchParams.set('pageSize', String(params.pageSize));

  console.log(`api-client/getFeaturedProducts => ${url.href}`);
  // Use axios to send a GET request
  const { data, headers } = await context.client.get<FeaturedProductsGetResponse>(url.href, {
    headers: getHeaders(context)
  });
  // Return data from the API
  return {
    data, headers
  };
}
