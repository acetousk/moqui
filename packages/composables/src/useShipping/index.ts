import {
  Context,
  useShippingFactory,
  UseShippingParams
} from '@vue-storefront/core';
import type { ShippingAddress } from '@vue-storefront/moqui-api';
import { useCart } from 'src/useCart';
import type {
  UseShippingAddParams as AddParams
} from '../types';

const params: UseShippingParams<ShippingAddress, AddParams> = {
  provide() {
    return {
      useCart: useCart()
    };
  },

  load: async (context: Context, { customQuery }) => {
    try {
      if (!context.useCart.cart) {
        await context.useCart.load(customQuery);
      }
      const shippingAddress = context.useCart?.cart?.value?.postalAddress || {};

      return shippingAddress;
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  save: async (context: Context, { shippingDetails, customQuery }) => {
    try {
      if (!context.useCart.cart) {
        await context.useCart.load(customQuery);
      }
      const { data } = await context.$moqui.api.setCartShippingAddress({
        addressId: shippingDetails.addressId
      });
      return data;

    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  }
};

export const useShipping = useShippingFactory<ShippingAddress, AddParams>(params);
