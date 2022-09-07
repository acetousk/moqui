import { MakerOrderParams, MakeOrderResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function makeOrder(
  context: Context,
  params: MakerOrderParams
) {
  // Create URL object containing full endpoint URL
  const url = new URL(
    context.config.basePath + '/cart/place',
    context.config.api
  );

  // Use axios to send a POST request
  const { data, headers } = await context.client.post<MakeOrderResponse>(
    url.href,
    {
      paymentInstrumentEnumId: params.paymentMethodId
    },
    {
      headers: getHeaders(context)
    }
  );
  // Return data from the API
  return {
    data,
    headers
  };
}
