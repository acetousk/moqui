import { Cart } from '@vue-storefront/moqui-api';

const canEnterCheckout = (cart: Cart) => cart?.orderItemProductList?.length > 0;
const canEnterShipping = (cart: Cart) =>
  canEnterCheckout(cart) && cart?.postalAddress?.addressId;
const canEnterPayment = (cart: Cart) =>
  canEnterShipping(cart) &&
  cart?.orderPart &&
  cart.orderPart.carrierPartyId &&
  cart.orderPart.shipmentMethodEnumId;

export default async ({ app, $vsf }) => {
  const homepage = app.context.localeRoute({ name: 'home' });
  const currentPath = app.context.route.fullPath.split('/checkout/')[1];

  if (!currentPath || currentPath.startsWith('thank-you')) return;

  const cart = await $vsf.$moqui.api.getCart();
  if (!cart?.data?.orderHeader?.orderId) {
    app.context.redirect('/');
  }

  switch (currentPath) {
    case 'shipping':
      if (!canEnterShipping(cart?.data)) {
        console.warn('Not authorized for shipping, redirecting...');
        return app.context.redirect(homepage);
      }
      break;
    case 'payment':
      if (!canEnterPayment(cart?.data)) {
        console.warn('Not authorized for payment, redirecting...');
        return app.context.redirect(homepage);
      }
      break;
  }
};
