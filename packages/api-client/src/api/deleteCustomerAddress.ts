import { ShippingAddressDeleteParams, ShippingAddressDeleteResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function deleteCustomerAddresses(context: Context, params: ShippingAddressDeleteParams) {
  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/customer/shippingAddresses', context.config.api);

  // Use axios to send a GET request
  const { data, headers } = await context.client.delete<ShippingAddressDeleteResponse>(url.href, {
    data: { addressId: params.addressId },
    headers: getHeaders(context)
  });

  // Return data from the API
  return {
    data, headers
  };
}
