import {
  Context,
  useMakeOrderFactory,
  UseMakeOrderFactoryParams
} from '@vue-storefront/core';
import type { Order } from '@vue-storefront/moqui-api';

const factoryParams: UseMakeOrderFactoryParams<Order> = {
  make: async (context: Context, { customQuery }) => {
    try {
      const response = await context.$moqui.api.makeOrder({
        paymentMethodId: customQuery.paymentMethodId
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

export const useMakeOrder = useMakeOrderFactory<Order>(factoryParams);
