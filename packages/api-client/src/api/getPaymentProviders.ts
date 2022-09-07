import {
  PaymentProviderGetParams,
  PaymentProviderGetResponse
} from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function getPaymentProviders(
  context: Context,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params: PaymentProviderGetParams
) {
  // Create URL object containing full endpoint URL
  const url = new URL(
    context.config.basePath + '/cart/paymentOptions',
    context.config.api
  );

  // Use axios to send a GET request
  const { data, headers } =
    await context.client.get<PaymentProviderGetResponse>(url.href, {
      headers: getHeaders(context)
    });

  // Return data from the API
  return {
    data,
    headers
  };
}
