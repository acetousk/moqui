import { Store } from '@vue-storefront/moqui-api';
import { Context, useStoreFactory } from '@vue-storefront/core';

export const useStore = useStoreFactory<Store>({
  async load(context: Context, params) {

    const response = await context.$moqui.api.getStore(params);

    return response;
  },

  // @ts-expect-error Not implemented atm.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  change(context: Context, params) {
    console.log('Mocked: useStore.change');

    return Promise.resolve({});
  }
});
