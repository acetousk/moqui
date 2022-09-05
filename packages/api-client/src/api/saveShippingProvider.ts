import { ShippingProviderSaveParams, ShippingProviderSaveResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function saveShippingProvider(context: Context, params: ShippingProviderSaveParams) {
  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/cart/shippingOptions', context.config.api);

  // Use axios to send a GET request
  const response = await context.client.post<ShippingProviderSaveResponse>(url.href, {
    carrierPartyId: params.carrierId,
    shipmentMethodEnumId: params.shipmentMethodId
  }, { headers: getHeaders(context) });

  // Return data from the API
  return response;
}
