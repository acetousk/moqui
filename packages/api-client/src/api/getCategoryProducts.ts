import { CategoryProductsGetParams, CategoryProductsGetResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function getCategoryProducts(context: Context, params: CategoryProductsGetParams) {

  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/products/category', context.config.api);

  // Add parameters passed from composable as query strings to the URL
  url.searchParams.set('productStoreId', context.config.defaultStoreId);
  url.searchParams.set('categorySlug', params.categorySlug);
  params.page && url.searchParams.set('pageIndex', String(params.page));
  params.pageSize && url.searchParams.set('pageSize', String(params.pageSize));
  params.sort && url.searchParams.set('orderBy', String(params.sort));

  console.log(`api-client/getCategoryProducts => ${url.href}`);
  // Use axios to send a GET request
  const { data, headers } = await context.client.get<CategoryProductsGetResponse>(url.href, {
    headers: getHeaders(context)
  });
  // Return data from the API
  return {
    data, headers
  };
}
