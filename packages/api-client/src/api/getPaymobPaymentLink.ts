import { PaymobLinkGetParams, PaymobLinkGetResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function getPaymobPaymentLink(
  context: Context,
  params: PaymobLinkGetParams
) {
  // Create URL object containing full endpoint URL
  const url = new URL(
    context.config.gatewayBasePath + '/gateway/order/pay',
    context.config.api
  );

  // Use axios to send a GET request
  const { data, headers } = await context.client.post<PaymobLinkGetResponse>(
    url.href,
    { orderId: params.orderId },
    { headers: getHeaders(context) }
  );

  // Return data from the API
  return {
    data,
    headers
  };
}
