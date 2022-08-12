import { UserUpdateParams, UserUpdateResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function updateUser(context: Context, params: UserUpdateParams) {
  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/customer/updateInfo', context.config.api);

  console.log(`api-client/updateUser => ${url.href}`);
  // Use axios to send a GET request
  const { data, headers } = await context.client.put<UserUpdateResponse>(url.href, { ...params }, {
    headers: getHeaders(context)
  });

  // Return data from the API
  return {
    data, headers
  };

}
