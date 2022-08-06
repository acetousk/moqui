import {
  Context,
  useProductFactory,
  UseProductFactoryParams
} from '@vue-storefront/core';
import type { Product } from '@vue-storefront/moqui-api';
import type {
  UseProductSearchParams as SearchParams
} from '../types';

const params: UseProductFactoryParams<Product, SearchParams> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productsSearch: async (context: Context, params) => {
    // const data = await context.$moqui.api.getProduct(params);

    // return data;
    console.log('Mocked: useProduct.productsSearch');

    return {};
  }
};

export const useProduct = useProductFactory<Product, SearchParams>(params);
