import { GetGeoParams, GetGeoResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function getGeoList(
  context: Context,
  params: GetGeoParams
) {
  console.log('getGeoList');
  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/geo', context.config.api);

  // Add parameters passed from composable as query strings to the URL
  url.searchParams.set('productStoreId', context.config.defaultStoreId);
  params?.parentGeoId &&
    url.searchParams.set('parentGeoId', params.parentGeoId);

  // Use axios to send a GET request
  const { data, headers } = await context.client.get<GetGeoResponse>(url.href, {
    headers: getHeaders(context)
  });
  console.log('data');
  console.log(data);
  // Return data from the API
  return {
    data,
    headers
  };
}
