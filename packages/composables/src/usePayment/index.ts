import { Context } from '@vue-storefront/core';
import {
  PaymentProvider,
  PaymentLinkResponse,
  PaymentConfirmationResponse
} from '@vue-storefront/moqui-api';
import {
  usePaymentFactory,
  UsePaymentFactoryParams
} from '../factories/usePaymentFactory';
import { useCart } from '../useCart';

const factoryParams: UsePaymentFactoryParams<
  PaymentProvider,
  PaymentLinkResponse,
  PaymentConfirmationResponse
> = {
  provide() {
    return {
      useCart: useCart()
    };
  },

  getPaymentProviderList: async (
    context: Context
  ): Promise<PaymentProvider[]> => {
    try {
      const { data } = await context.$moqui.api.getPaymentProviders();
      return data?.paymentOptions;
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  getPaymentLink: async (context: Context): Promise<PaymentLinkResponse> => {
    try {
      const orderId = context.useCart.cart.value?.orderHeader?.orderId;
      if (!orderId)
        throw {
          message: 'Invalid order.',
          code: 301
        };
      const { data } = await context.$moqui.api.getPaymobPaymentLink({
        orderId: context.useCart.cart.value.orderHeader.orderId
      });
      // context.useCart.cart.value = data.paymentConfirmation;
      return data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  getPaymentConfirmation: async (
    context: Context,
    params
  ): Promise<PaymentConfirmationResponse> => {
    try {
      const { data } = await context.$moqui.api.getPaymobPaymentConfirmation({
        ...params
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

export const usePayment = usePaymentFactory<
  PaymentProvider,
  PaymentLinkResponse,
  PaymentConfirmationResponse
>(factoryParams);
