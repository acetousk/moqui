import { SetNewPasswordParams, SetNewPasswordResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function setNewPassword(context: Context, params: SetNewPasswordParams) {

  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/customer/setPassword', context.config.api);

  url.searchParams.set('productStoreId', context.config.defaultStoreId);

  // Use axios to send a GET request
  const { data, headers } = await context.client.post<SetNewPasswordResponse>(url.href, {
    email: params.email,
    newPassword: params.newPassword,
    token: params.token
  }, {
    headers: getHeaders(context)
  });

  // Return data from the API
  return {
    data, headers
  };

}
