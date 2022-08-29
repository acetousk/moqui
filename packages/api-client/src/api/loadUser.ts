import { UserLoadParams, UserLoadResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function loadUser(context: Context, params: UserLoadParams) {
  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/customer/info', context.config.api);

  console.log(`api-client/loadUser => ${url.href}`);
  // Use axios to send a GET request
  const { data, headers, status } = await context.client.get<UserLoadResponse>(url.href, {
    headers: getHeaders(context)
  });

  console.log('context/getCustomerLoggedIn');
  console.log(context.config.state.getCustomerLoggedIn());
  // console.log(context.config.app.$cookies)
  // console.log('context.config.state.setCustomerLoggedIn');
  // console.log(context.config.state.setCustomerLoggedIn);
  if (status === 200) {
    // context.app.$cookies.set('vsf-auth', true);
    context.config.state.setCustomerLoggedIn(true);
  } else {
    context.config.state.setCustomerLoggedIn(false);

    // context.app.$cookies.set('vsf-auth', false);
  }
  // Return data from the API
  return {
    data, headers
  };

}
