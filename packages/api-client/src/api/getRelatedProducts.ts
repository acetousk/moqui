import { RelatedProductsGetParams, RelatedProductsGetResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function getRelatedProducts(context: Context, params: RelatedProductsGetParams) {

  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/products/related', context.config.api);

  // Add parameters passed from composable as query strings to the URL
  url.searchParams.set('productStoreId', context.config.defaultStoreId);
  url.searchParams.set('productSlug', params.productSlug);
  url.searchParams.set('pageSize', String(params?.pageSize || 10));

  // Use axios to send a GET request
  const { data, headers } = await context.client.get<RelatedProductsGetResponse>(url.href, {
    headers: getHeaders(context)
  });
  // Return data from the API
  return {
    data, headers
  };
}
