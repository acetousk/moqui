import {
  CartGetters,
  AgnosticPrice,
  AgnosticTotals,
  AgnosticCoupon,
  AgnosticDiscount,
  AgnosticAttribute
} from '@vue-storefront/core';
import type { Cart, CartItem } from '@vue-storefront/moqui-api';

function getItems(cart: Cart): CartItem[] {
  return cart?.orderItemProductList || [];
}

function getItemName(item: CartItem): string {
  return item?.itemDescription || '';
}

function getItemImage(item: CartItem): string {
  return item?.product?.coverImageUrl || '/product_placeholder.svg';
}

function getItemQty(item: CartItem): number {
  return item?.quantity || 1;
}

function getItemPrice(item: CartItem): AgnosticPrice {
  // eslint-disable-next-line eqeqeq
  const hasSpecial = ((item?.unitListPrice != null) && (item?.unitAmount != null) && (item.unitListPrice != item.unitAmount));
  return {
    regular: ((item?.unitListPrice || item?.unitAmount) * item?.quantity) || 0,
    special: hasSpecial ? (item?.unitAmount * item?.quantity) : null
  };
}

function getItemAttributes(item: CartItem /* , filterByAttributeName?: Array<string> */): Record<string, AgnosticAttribute | string> {
  if (!item) return {};

  const attributes = {};
  const featureNames = Object.keys(item.variantFeatures);

  if (featureNames?.length) {
    featureNames.forEach(attrName => {
      attributes[attrName] = item.variantFeatures[attrName];
    });
  }
  return attributes;
}

function getItemSku(item: CartItem): string {
  return item?.product?.virtual?.productSku || item?.product?.productSku || '';
}

function getTotals(cart: Cart): AgnosticTotals {
  let regularSubTotal = 0;
  let specialSubTotal = 0;
  cart?.orderItemProductList?.forEach((productItem) => {
    const itemPrice = getItemPrice(productItem);
    regularSubTotal = regularSubTotal + itemPrice.regular;
    specialSubTotal = specialSubTotal + (itemPrice.special || itemPrice.regular);
  });

  const total = cart?.orderHeader.grandTotal || cart?.orderPart.partTotal || 0;
  const taxTotal = cart?.orderItemTaxList?.reduce((prev, cur) => prev + ((cur.quantity || 1) * (cur.unitAmount || 0)), 0) || 0;
  const discountTotal = cart?.orderItemDiscountList?.reduce((prev, cur) => prev + ((cur.quantity || 1) * (cur.unitAmount || 0)), 0) || 0;
  const shippingTotal = getShippingPrice(cart);

  return {
    total: total,
    // total - discountTotal - taxTotal,
    subtotal: regularSubTotal,
    special: specialSubTotal,
    tax: taxTotal,
    shipping: shippingTotal,
    discounts: discountTotal
  };
}

function getShippingPrice(cart: Cart): number {
  return cart?.orderItemShippingList?.reduce((prev, cur) => prev + ((cur.quantity || 1) * (cur.unitAmount || 0)), 0) || 0;
}

function getTotalItems(cart: Cart): number {
  return cart?.orderItemProductList?.length || 0;
}

function getFormattedPrice(price: number): string {
  return (price || 0).toFixed(2);
}

function getCoupons(cart: Cart): AgnosticCoupon[] {
  return cart?.orderPromoCodeDetailList?.map(promoCode => {
    return {
      id: promoCode.promoCodeId,
      name: promoCode.itemDescription,
      code: promoCode.promoCode,
      value: 0
    };
  }) || [];
}

function getDiscounts(cart: Cart): AgnosticDiscount[] {
  return cart?.orderItemDiscountList?.map((discountItem, i) => {
    return {
      id: `dis-${i}`,
      name: discountItem.itemDescription,
      description: discountItem.itemDescription,
      value: discountItem.quantity * discountItem.unitAmount
    };
  });
}

export const cartGetters: CartGetters<Cart, CartItem> = {
  getTotals,
  getShippingPrice,
  getItems,
  getItemName,
  getItemImage,
  getItemPrice,
  getItemQty,
  getItemAttributes,
  getItemSku,
  getFormattedPrice,
  getTotalItems,
  getCoupons,
  getDiscounts
};
