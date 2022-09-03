import {
  Context,
  useFacetFactory,
  FacetSearchResult
} from '@vue-storefront/core';
import type {
  UseFacetSearchParams as SearchParams
} from '../types';

const availableSortingOptions = [{
  id: 'default',
  type: 'sort',
  value: 'Relevance'
},
{
  id: 'name-asc',
  type: 'sort',
  value: 'Name A-Z'
},
{
  id: 'name-desc',
  type: 'sort',
  value: 'Name Z-A'
},
{
  id: 'price-asc',
  type: 'sort',
  value: 'Price from low to high'
},
{
  id: 'price-desc',
  type: 'sort',
  value: 'Price from high to low'
},
{
  id: 'popularity',
  type: 'sort',
  value: 'Popularity'
}];

export const useFacet = useFacetFactory<SearchParams>({
  search: async (context: Context, params: FacetSearchResult<SearchParams>) => {
    try {
      if (params?.input?.searchType === 'instant-search') {
        const response = await context.$moqui.api.getProductSearch({
          term: params.input.term,
          page: params.input.page,
          pageSize: params.input.itemsPerPage,
          sort: params.input.sort,
          filters: params.input.filters
        });
        return {
          items: response?.productSearchResults?.productList || [],
          categoryTree: response?.productSearchResults?.categoryTree || [],
          availableFilters: response?.productSearchResults?.featureList,
          category: { categorySlug: params.input.categorySlug },
          sortOptions: {
            options: availableSortingOptions,
            selected: availableSortingOptions.find(sortOption => sortOption.id === params.input.sort)?.id || 'default'
          },
          perPageOptions: [10, 20, 50],
          total: response?.productSearchResults?.productListCount,
          itemsPerPage: response?.productSearchResults?.productListPageSize,
          currentPage: response?.productSearchResults?.productListPageIndex + 1,
          totalPages: response?.productSearchResults?.productListPageMaxIndex + 1
        };
      }
      const response = await context.$moqui.api.getCategoryProducts({
        categorySlug: params.input.categorySlug,
        term: params.input.term,
        page: params.input.page,
        pageSize: params.input.itemsPerPage,
        sort: params.input.sort,
        filters: params.input.filters
      });
      return {
        items: response?.productList || [],
        categoryTree: response?.categoryTree || [],
        availableFilters: response?.featureList,
        category: { categorySlug: params.input.categorySlug },
        sortOptions: {
          options: availableSortingOptions,
          selected: availableSortingOptions.find(sortOption => sortOption.id === params.input.sort)?.id || 'default'
        },
        perPageOptions: [10, 20, 50],
        total: response?.productListCount,
        itemsPerPage: response?.productListPageSize,
        currentPage: response?.productListPageIndex + 1,
        totalPages: response?.productListPageMaxIndex + 1
      };
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  }
});
