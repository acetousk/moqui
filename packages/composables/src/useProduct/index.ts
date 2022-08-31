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
  productsSearch: async (context: Context, params) => {
    console.log('Run: useProduct.productsSearch');
    console.log('params');
    console.log(params);
    try {
      if (params.type === 'single') {
        const response = await context.$moqui.api.getProduct({
          productSlug: params.productId,
          variantSlug: params.variantId
        });
        return response;

      } else if (params.type === 'featured') {
        const response = await context.$moqui.api.getFeaturedProducts({
          pageSize: 10
        });
        return response.productList;
      } else if (params.type === 'related') {
        const response = await context.$moqui.api.getRelatedProducts({
          // categorySlug: params.categorySlug,
          productSlug: params.productSlug
        });
        return response.productList;
      } else return [];
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  }
};

export const useProduct = useProductFactory<Product, SearchParams>(params);
