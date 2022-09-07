import { UserChangePasswordParams, UserChangePasswordResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function changePassword(context: Context, params: UserChangePasswordParams) {
  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/customer/updatePassword', context.config.api);

  // Use axios to send a GET request
  const { data, headers } = await context.client.put<UserChangePasswordResponse>(url.href, { ...params }, {
    headers: getHeaders(context)
  });

  // Return data from the API
  return {
    data, headers
  };

}
