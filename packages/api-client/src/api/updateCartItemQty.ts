import { CartUpdateParams, CartUpdateResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function updateCartItemQty(context: Context, params: CartUpdateParams) {

  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/cart/updateProductQuantity', context.config.api);

  // Use axios to send a POST request
  const { data, headers } = await context.client.post<CartUpdateResponse>(url.href, {
    productStoreId: context.config.defaultStoreId,
    productId: params.productId,
    quantity: params.quantity
  }, {
    headers: getHeaders(context)
  });
  // Return data from the API
  return {
    data, headers
  };
}
