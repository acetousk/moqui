import { ProductSearchGetParams, ProductSearchGetResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function getProductSearch(context: Context, params: ProductSearchGetParams) {

  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/products/search', context.config.api);

  // Add parameters passed from composable as query strings to the URL
  url.searchParams.set('searchParameter', params.term || '*');
  url.searchParams.set('productStoreId', context.config.defaultStoreId);
  // back-end page indexing is zero-based  - 1
  params.page && url.searchParams.set('pageIndex', String(params.page - 1));
  params.pageSize && url.searchParams.set('pageSize', String(params.pageSize));
  params.sort && url.searchParams.set('orderBy', String(params.sort));

  // Use axios to send a GET request
  const response = await context.client.get<ProductSearchGetResponse>(url.href, {
    headers: getHeaders(context)
  });
  // Return data from the API
  return {data: response?.data, headers: response?.headers};
}
