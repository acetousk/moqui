import { ResetPasswordParams, ResetPasswordResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function resetPassword(context: Context, params: ResetPasswordParams) {
  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/resetPassword', context.config.api);

  url.searchParams.set('productStoreId', context.config.defaultStoreId);

  // Use axios to send a GET request
  const { data, headers } = await context.client.post<ResetPasswordResponse>(url.href, {
    email: params.email
  }, {
    headers: getHeaders(context)
  });

  // Return data from the API
  return {
    data, headers
  };

}
