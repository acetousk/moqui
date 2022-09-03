import { ShippingAddressSetDefaultParams, ShippingAddressSetDefaultResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

// WARNING: THIS HAS NOT YET BEEN IMPLEMENTED API-WISE
export default async function setDefaultCustomerAddress(context: Context, params: ShippingAddressSetDefaultParams) {
  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/customer/shippingAddresses/default', context.config.api);

  // Use axios to send a GET request
  const { data, headers } = await context.client.post<ShippingAddressSetDefaultResponse>(url.href, {
    ...params
  }, { headers: getHeaders(context) });

  // Return data from the API
  return {
    data, headers
  };
}
