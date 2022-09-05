import { ShippingProviderGetParams, ShippingProviderGetResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function getShippingProvider(context: Context, params: ShippingProviderGetParams) {
  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/cart/shippingOptions', context.config.api);

  // Use axios to send a GET request
  const response = await context.client.get<ShippingProviderGetResponse>(url.href, { headers: getHeaders(context) });

  // Return data from the API
  return response;
}
