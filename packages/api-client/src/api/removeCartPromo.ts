import { CartRemovePromoParams, CartRemovePromoResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function removeCartPromo(context: Context, params: CartRemovePromoParams) {

  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/cart/promo', context.config.api);

  // Use axios to send a POST request
  const { data, headers } = await context.client.delete<CartRemovePromoResponse>(url.href, {
    data: {
      productStoreId: context.config.defaultStoreId,
      promoCodeId: params.promoCodeId
    },
    headers: getHeaders(context)
  });
  // Return data from the API
  return {
    data, headers
  };
}
