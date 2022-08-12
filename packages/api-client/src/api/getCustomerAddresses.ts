import { ShippingAddressGetParams, ShippingAddressGetResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function getCustomerAddresses(context: Context, params: ShippingAddressGetParams) {
  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/customer/shippingAddresses', context.config.api);

  // Use axios to send a GET request
  const { data, headers } = await context.client.get<ShippingAddressGetResponse>(url.href, { headers: getHeaders(context) });

  // Return data from the API
  return {
    data, headers
  };
}
