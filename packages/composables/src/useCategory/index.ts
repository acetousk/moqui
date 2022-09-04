import {
  Context,
  useCategoryFactory,
  UseCategoryFactoryParams
} from '@vue-storefront/core';
import type { Category } from '@vue-storefront/moqui-api';
import type {
  UseCategorySearchParams as SearchParams
} from '../types';

const params: UseCategoryFactoryParams<Category, SearchParams> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  categorySearch: async (context: Context, { customQuery, ...params }) => {
    console.log('Mocked: useCategory.categorySearch');

    return [];
  }
};

export const useCategory = useCategoryFactory<Category, SearchParams>(params);
