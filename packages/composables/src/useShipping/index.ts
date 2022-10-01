import {
  Context,
  useShippingFactory,
  UseShippingParams
} from '@vue-storefront/core';
import type { ShippingAddress } from '@vue-storefront/moqui-api';
import { useCart } from 'src/useCart';
import type { UseShippingAddParams as AddParams } from '../types';

const params: UseShippingParams<ShippingAddress, AddParams> = {
  provide() {
    return useCart();
  },

  load: async (context: Context) => {
    try {
      const { data } = await context.$moqui.api.getCart();
      context.setCart(data);

      const shippingAddress = context.cart?.value?.postalAddress || {};

      return shippingAddress;
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  save: async (context: Context, { shippingDetails }) => {
    try {
      if (!context.cart.value?.orderHeader?.orderId) {
        await context.load();
      }
      const { data } = await context.$moqui.api.setCartShippingAddress({
        addressId: shippingDetails.addressId
      });

      // Refetch cart since to get our shipping charge
      const { data: updatedCart } = await context.$moqui.api.getCart();
      context.setCart(updatedCart);

      return data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  }
};

export const useShipping = useShippingFactory<ShippingAddress, AddParams>(
  params
);
