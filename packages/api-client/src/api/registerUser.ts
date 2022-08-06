import { RegisterUserParams, RegisterUserReponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function registerUser(context: Context, params: RegisterUserParams) {

  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/register', context.config.api);

  console.log(`api-client/registerUser => ${url.href}`);
  // Use axios to send a GET request
  const { data, headers } = await context.client.post<RegisterUserReponse>(url.href, {
    emailAddress: params.emailAddress,
    firstName: params.firstName,
    lastName: params.lastName,
    password: params.password
  }, { headers: getHeaders(context) });

  // Return data from the API
  return {
    data, headers
  };

}
