import { UserUpdateParams, UserUpdateResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function updateUser(context: Context, params: UserUpdateParams) {
  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/customer/info', context.config.api);

  url.searchParams.set('productStoreId', context.config.defaultStoreId);

  // Use axios to send a GET request
  const { data, headers } = await context.client.put<UserUpdateResponse>(url.href, { ...params }, {
    headers: getHeaders(context)
  });

  // Return data from the API
  return {
    data, headers
  };

}
