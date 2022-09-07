import {
  Context,
  useCartFactory,
  UseCartFactoryParams
} from '@vue-storefront/core';
import type { Cart, CartItem, Product } from '@vue-storefront/moqui-api';

const params: UseCartFactoryParams<Cart, CartItem, Product> = {
  load: async (context: Context /* , { customQuery }*/) => {
    try {
      const { data } = await context.$moqui.api.getCart();
      if (!data?.orderHeader?.orderId) return null;
      return data;
    } catch (error) {
      // If we run into a 401, we got to return null so that the cart state is reset
      if ((error.response?.data?.code || error.code) === 401) return null;
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  addItem: async (
    context: Context,
    { product, quantity /* , currentCart, customQuery */ }
  ) => {
    try {
      const { data } = await context.$moqui.api.addItemToCart({
        productId: product.productId,
        quantity: quantity
      });
      return data;
    } catch (error) {
      // If we run into a 401, we got to return null so that the cart state is reset
      if ((error.response?.data?.code || error.code) === 401) return null;
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  removeItem: async (
    context: Context,
    { product /* , currentCart, customQuery */ }
  ) => {
    try {
      const { data } = await context.$moqui.api.removeCartItem({
        productId: product?.product.productId
      });
      return data;
    } catch (error) {
      // If we run into a 401, we got to return null so that the cart state is reset
      if ((error.response?.data?.code || error.code) === 401) return null;
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  updateItemQty: async (
    context: Context,
    { product, quantity /* ,currentCart , customQuery */ }
  ) => {
    try {
      const { data } = await context.$moqui.api.updateCartItemQty({
        productId: product.product.productId,
        quantity
      });
      return data;
    } catch (error) {
      // If we run into a 401, we got to return null so that the cart state is reset
      if ((error.response?.data?.code || error.code) === 401) return null;
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  applyCoupon: async (
    context: Context,
    { couponCode /* , currentCart, customQuery */ }
  ) => {
    try {
      const { data } = await context.$moqui.api.addCartPromo({
        promoCode: couponCode
      });
      return {
        updatedCart: data,
        updatedCoupon: {}
      };
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  removeCoupon: async (
    context: Context,
    { couponCode /* , currentCart, customQuery */ }
  ) => {
    try {
      const { data } = await context.$moqui.api.removeCartPromo({
        promoCodeId: couponCode
      });
      return {
        updatedCart: data
      };
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  isInCart: (context: Context, { currentCart, product }) => {
    const productList = currentCart?.orderItemProductList;
    const itemIndex = productList?.findIndex(
      (item) => item.product.productId === product.productId
    );
    return (itemIndex && itemIndex !== -1) || false;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clear: async (context: Context, { currentCart }) => {
    console.log('Mocked: useCart.clear');
    return null;
  }
};

export const useCart = useCartFactory<Cart, CartItem, Product>(params);
