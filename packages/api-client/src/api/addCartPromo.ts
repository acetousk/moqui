import { CartAddPromoParams, CartAddPromoResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function addCartPromo(context: Context, params: CartAddPromoParams) {

  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/cart/promo', context.config.api);

  // Use axios to send a POST request
  const { data, headers } = await context.client.post<CartAddPromoResponse>(url.href, {
    productStoreId: context.config.defaultStoreId,
    promoCode: params.promoCode
  }, {
    headers: getHeaders(context)
  });

  // Return data from the API
  return {
    data, headers
  };
}
