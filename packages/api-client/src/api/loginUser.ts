import { LoginUserParams, LoginUserResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function loginUser(context: Context, params: LoginUserParams) {
  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/login', context.config.api);

  // Use axios to send a GET request
  const { data, headers } = await context.client.post<LoginUserResponse>(url.href, {
    username: params.username,
    password: params.password
  }, { headers: getHeaders(context) });

  // Return data from the API
  return {
    data, headers
  };
}
