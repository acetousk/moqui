import {
  Context,
  useCartFactory,
  UseCartFactoryParams
} from '@vue-storefront/core';
import type {
  Cart,
  CartItem,
  Product
} from '@vue-storefront/moqui-api';

const params: UseCartFactoryParams<Cart, CartItem, Product> = {
  load: async (context: Context /* , { customQuery }*/) => {
    try {
      const response = await context.$moqui.api.getCart();
      if (!response?.orderHeader?.orderId) return null;
      return response;

    } catch (error) {
      // If we run into a 401, we got to return null so that the cart state is reset
      if ((error.response?.data?.code || error.code) === 401) return null;
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  addItem: async (context: Context, { product, quantity /* , currentCart, customQuery */ }) => {
    try {
      const response = await context.$moqui.api.addItemToCart({
        productId: product.productId,
        quantity: quantity
      });
      return response;

    } catch (error) {
      // If we run into a 401, we got to return null so that the cart state is reset
      if ((error.response?.data?.code || error.code) === 401) return null;
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  removeItem: async (context: Context, { product /* , currentCart, customQuery */ }) => {
    try {
      const response = await context.$moqui.api.removeCartItem({
        productId: product?.product.productId
      });
      return response;

    } catch (error) {
      // If we run into a 401, we got to return null so that the cart state is reset
      if ((error.response?.data?.code || error.code) === 401) return null;
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  updateItemQty: async (context: Context, { product, quantity /* ,currentCart , customQuery */ }) => {
    try {
      const response = await context.$moqui.api.updateCartItemQty({
        productId: product.product.productId,
        quantity
      });
      return response;

    } catch (error) {
      // If we run into a 401, we got to return null so that the cart state is reset
      if ((error.response?.data?.code || error.code) === 401) return null;
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  applyCoupon: async (context: Context, { couponCode /* , currentCart, customQuery */ }) => {
    try {
      const response = await context.$moqui.api.addCartPromo({
        promoCode: couponCode
      });
      return {
        updatedCart: response,
        updatedCoupon: {}
      };

    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  removeCoupon: async (context: Context, { couponCode /* , currentCart, customQuery */ }) => {
    try {
      const response = await context.$moqui.api.removeCartPromo({
        promoCodeId: couponCode
      });
      return {
        updatedCart: response
      };

    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  isInCart: (context: Context, { currentCart, product }) => {
    return ((currentCart?.orderItemProductList?.findIndex(item => item.product.productId === product.productId) !== -1) || false);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clear: async (context: Context, { currentCart }) => {
    console.log('Mocked: useCart.clear');
    return null;
  }
};

export const useCart = useCartFactory<Cart, CartItem, Product>(params);
