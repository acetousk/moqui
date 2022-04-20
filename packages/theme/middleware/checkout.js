import { Logger } from '@vue-storefront/core';

// TODO: See https://github.com/vuestorefront-community/prestashop/blob/main/packages/theme/middleware/checkout.js for example
export default () => {
  Logger.error('Please implement vendor-specific checkout.js middleware in the \'middleware\' directory to block access to checkout steps when customer did not yet complete previous steps');
};
