import { UserLogoutResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function logoutUser(context: Context /* , params: UserLogoutParams */) {

  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/logout', context.config.api);

  // Use axios to send a GET request
  const { data, headers } = await context.client.get<UserLogoutResponse>(url.href, {
    headers: getHeaders(context)
  });
  context.config.state.setCustomerLoggedIn(false);
  // Return data from the API
  return {
    data, headers
  };
}
