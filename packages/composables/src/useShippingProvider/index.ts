import {
  useShippingProviderFactory,
  UseShippingProviderParams,
  Context
} from '@vue-storefront/core';
import type {
  ShippingProvider,
  ShippingMethod
} from '@vue-storefront/moqui-api';
import { useCart } from 'src/useCart';

const params: UseShippingProviderParams<ShippingProvider, ShippingMethod> = {
  provide() {
    return useCart();
  },
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

      // Refetch cart since to get our shipping charge
      const { data: updatedCart } = await context.$moqui.api.getCart();
      context.setCart(updatedCart);

      return data?.shippingOptions || [];
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  }
};

export const useShippingProvider = useShippingProviderFactory<
  ShippingProvider,
  ShippingMethod
>(params);
