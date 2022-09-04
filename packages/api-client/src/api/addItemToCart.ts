import { CartAddParams, CartAddResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function addItemToCart(context: Context, params: CartAddParams) {

  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/cart/add', context.config.api);

  // Use axios to send a POST request
  const { data, headers } = await context.client.post<CartAddResponse>(url.href, {
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
