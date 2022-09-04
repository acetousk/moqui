import { CartSetShippingParams, CartSetShippingResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function setCartShippingAddress(context: Context, params: CartSetShippingParams) {

  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/cart/shippingAddress', context.config.api);

  // Use axios to send a POST request
  const { data, headers } = await context.client.post<CartSetShippingResponse>(url.href, {
    shippingPostalContactMechId: params.addressId
  }, {
    headers: getHeaders(context)
  });
  // Return data from the API
  return {
    data, headers
  };
}
