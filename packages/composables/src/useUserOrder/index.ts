import {
  Context,
  useUserOrderFactory,
  UseUserOrderFactoryParams
} from '@vue-storefront/core';
import type { CustomerOrders } from '@vue-storefront/moqui-api';
import type {
  useUserOrderSearchParams as SearchParams
} from '../types';

const params: UseUserOrderFactoryParams<CustomerOrders, SearchParams> = {
  searchOrders: async (context: Context, params) => {
    try {
      const response = await context.$moqui.api.getCustomerOrders({
        page: params.page || 1,
        itemsPerPage: params.itemsPerPage || 5
      });
      return response;

    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  }
};

export const useUserOrder = useUserOrderFactory<CustomerOrders, SearchParams>(params);
