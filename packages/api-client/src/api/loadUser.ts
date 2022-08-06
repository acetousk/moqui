import { LoadUserParams, LoadUserResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function loadUser(context: Context, params: LoadUserParams) {
  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/customer/info', context.config.api);

  console.log(`api-client/loadUser => ${url.href}`);
  // Use axios to send a GET request
  const { data, headers } = await context.client.get<LoadUserResponse>(url.href, {
    headers: getHeaders(context)
  });

  // Return data from the API
  return {
    data, headers
  };

}
