import { CustomerOrderGetParams, CustomerOrderGetResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function getCustomerOrders(context: Context, params: CustomerOrderGetParams) {

  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/customer/orders', context.config.api);

  params.page && url.searchParams.set('pageIndex', String(params.page - 1));
  params.itemsPerPage && url.searchParams.set('pageSize', String(params.itemsPerPage));

  // Use axios to send a GET request
  const { data, headers } = await context.client.get<CustomerOrderGetResponse>(url.href, {
    headers: getHeaders(context)
  });
  // Return data from the API
  return {
    data, headers
  };
}
