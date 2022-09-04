import { CartGetResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function getCart(context: Context /* , params: CartGetParams*/) {

  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/cart', context.config.api);

  // Use axios to send a GET request
  const { data, headers } = await context.client.get<CartGetResponse>(url.href, {
    headers: getHeaders(context)
  });
  // Return data from the API
  return {
    data, headers
  };
}
