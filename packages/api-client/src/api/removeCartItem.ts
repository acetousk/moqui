import { CartRemoveParams, CartRemoveResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function removeCartItem(context: Context, params: CartRemoveParams) {

  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/cart/remove', context.config.api);

  // Use axios to send a POST request
  const { data, headers } = await context.client.delete<CartRemoveResponse>(url.href, {
    data: {
      productStoreId: context.config.defaultStoreId,
      productId: params.productId
    },
    headers: getHeaders(context)
  });
  // Return data from the API
  return {
    data, headers
  };
}
