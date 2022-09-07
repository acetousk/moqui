import {
  PaymobConfirmationGetParams,
  PaymobConfirmationGetResponse
} from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function getPaymobPaymentConfirmation(
  context: Context,
  params: PaymobConfirmationGetParams
) {
  // Create URL object containing full endpoint URL
  const url = new URL(
    context.config.gatewayBasePath + '/gateway/verify',
    context.config.api
  );

  // Add query params
  for (const key in params) {
    url.searchParams.set(key, params[key]);
  }

  // Use axios to send a GET request
  const { data, headers } =
    await context.client.get<PaymobConfirmationGetResponse>(url.href, {
      headers: getHeaders(context)
    });

  // Return data from the API
  return {
    data,
    headers
  };
}
