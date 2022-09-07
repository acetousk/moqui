import { UserLoadParams, UserLoadResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function loadUser(context: Context, params: UserLoadParams) {
  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/customer/info', context.config.api);

  // Use axios to send a GET request
  const response = await context.client.get<UserLoadResponse>(url.href, {
    headers: getHeaders(context)
  });

  if (response?.status === 200) {
    context.config.state.setCustomerLoggedIn(true);
  } else {
    context.config.state.setCustomerLoggedIn(false);
  }

  // Return data from the API
  return response;

}
