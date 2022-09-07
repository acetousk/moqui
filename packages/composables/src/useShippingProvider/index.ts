import { useShippingProviderFactory, UseShippingProviderParams, Context } from '@vue-storefront/core';
import type { ShippingProvider, ShippingMethod } from '@vue-storefront/moqui-api';

const params: UseShippingProviderParams<ShippingProvider, ShippingMethod> = {
  load: async (context: Context /* , {  customQuery } */) => {
    try {
      const { data } = await context.$moqui.api.getShippingProvider();
      return data?.shippingOptions || [];

    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  save: async (context: Context, { shippingMethod /* , customQuery  */ }) => {
    try {
      const { data } = await context.$moqui.api.saveShippingProvider({
        carrierId: shippingMethod.carrierId,
        shipmentMethodId: shippingMethod.shipmentMethodId
      });
      return data?.shippingOptions || [];

    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  }
};

export const useShippingProvider = useShippingProviderFactory<ShippingProvider, ShippingMethod>(params);
