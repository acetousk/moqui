import {
  FacetsGetters,
  FacetSearchResult,
  AgnosticCategoryTree,
  AgnosticGroupedFacet,
  AgnosticPagination,
  AgnosticSort,
  AgnosticBreadcrumb,
  AgnosticFacet
} from '@vue-storefront/core';
import type { Facet, FacetSearchCriteria } from '@vue-storefront/moqui-api';
import populateCategoryTree from 'src/helpers/populateCategoryTree';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getAll(params: FacetSearchResult<Facet>, criteria?: FacetSearchCriteria): AgnosticFacet[] {
  return [];
}

function getGrouped(params: FacetSearchResult<Facet>, criteria?: FacetSearchCriteria): AgnosticGroupedFacet[] {
  return params.data?.availableFilters?.map(filter => {
    const options = filter.options?.map((option) => {
      return {
        id: option.id,
        type: option.type,
        value: option.label,
        count: option.count,
        selected: criteria?.[filter.id]?.includes(option.id)
      };
    }) || [];

    return {
      id: filter.id,
      label: filter.label,
      count: options.reduce((prev, cur) => cur.count + prev, 0),
      options
    };
  }) || [];
}

function getSortOptions(params: FacetSearchResult<Facet>): AgnosticSort {
  const sortOptions = params?.data?.sortOptions;

  return {
    options: sortOptions?.options || [],
    selected: sortOptions?.selected || ''
  };

}

function getCategoryTree(params: FacetSearchResult<Facet>): AgnosticCategoryTree {
  return populateCategoryTree(params?.data?.categoryTree, params?.data?.category?.categorySlug);
}

function getProducts(params: FacetSearchResult<Facet>): any {
  console.log('getProducts/params');
  return params.data?.items || [];
}

function getPagination(params: FacetSearchResult<Facet>): AgnosticPagination {
  return {
    currentPage: params.data?.currentPage || 1,
    totalPages: params.data?.totalPages || 1,
    totalItems: params.data?.total || 0,
    itemsPerPage: params.data?.itemsPerPage || 12,
    pageOptions: params.data?.perPageOptions || []
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getBreadcrumbs(params: FacetSearchResult<Facet>): AgnosticBreadcrumb[] {
  return [];
}

export const facetGetters: FacetsGetters<Facet, FacetSearchCriteria> = {
  getSortOptions,
  getGrouped,
  getAll,
  getProducts,
  getCategoryTree,
  getBreadcrumbs,
  getPagination
};
