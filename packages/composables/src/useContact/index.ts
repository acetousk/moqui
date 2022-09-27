import { ContactRequest } from '@vue-storefront/moqui-api';
import { Context, CustomQuery } from '@vue-storefront/core';
import { useContactFactory } from '../factories/useContactFactory';

export const useContact = useContactFactory<ContactRequest>({
  async sendContactRequest(
    context: Context,
    params: { request: ContactRequest; customQuery?: CustomQuery }
  ) {
    try {
      console.log('params');
      console.log(params);
      await context.$moqui.api.addContactRequest(params.request);
      return null;
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  }
});
