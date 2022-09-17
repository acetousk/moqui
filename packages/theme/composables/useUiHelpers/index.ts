
import { getCurrentInstance } from '@nuxtjs/composition-api';
import { AgnosticFacetSearchParams, AgnosticFacet, AgnosticCategoryTree } from '@vue-storefront/core';

const getContext = () => {
  const vm = getCurrentInstance();
  return vm.root.proxy;
};

const useUiHelpers = () => {
  const context = getContext();
  const nonFilters = ['page', 'sort', 'term', 'itemsPerPage'];

  const reduceFilters = (query) => (prev, curr) => {
    const makeArray = Array.isArray(query[curr]) || nonFilters.includes(curr);
    return {
      ...prev,
      [curr]: makeArray ? query[curr] : [query[curr]]
    };
  };

  const getFiltersDataFromUrl = (context, onlyFilters) => {
    const { query } = context.$router.history.current;
    return Object.keys(query)
      .filter(f => onlyFilters ? !nonFilters.includes(f) : nonFilters.includes(f))
      .reduce(reduceFilters(query), {});
  };

  const getFacetsFromURL = (): AgnosticFacetSearchParams => {
    const { query, params } = context.$router.currentRoute;
    const categorySlug = Object.keys(params).reduce((prev, curr) => params[curr] || prev, params.slug_1);

    return {
      rootCatSlug: params.slug_1,
      categorySlug,
      page: parseInt(query.page as string, 10) || 1,
      sort: Array.isArray(query.sort) ? query.sort[0] : query.sort || '',
      filters: getFiltersDataFromUrl(context, true),
      itemsPerPage: parseInt(query.itemsPerPage as string, 12) || 12,
      term: Array.isArray(query.term) ? query.term[0] : query.term || ''
    };

  };

  const getCatLink = (category: AgnosticCategoryTree): string => {
    return `/c/${category.slug}`;
  };

  const changeSorting = (sort: string) => {
    context.$router.push({
      query: {
        ...getFiltersDataFromUrl(context, false),
        sort
      }
    });
  };

  const changeFilters = (filters: AgnosticFacetSearchParams['filters']) => {
    context.$router.push({
      query: {
        ...getFiltersDataFromUrl(context, false),
        ...filters,
        // reset pagination since to avoid being out of range
        page: 1
      }
    });
  };

  const changeItemsPerPage = (itemsPerPage) => {
    context.$router.push({
      query: {
        ...getFiltersDataFromUrl(context, false),
        page: 1,
        itemsPerPage
      }
    });
  };

  const isFacetColor = (facet: AgnosticFacet): boolean => {
    return facet.id === 'PftColor';
  };

  const isFacetCheckbox = (facet: AgnosticFacet): boolean => {
    return facet.type === 'checkbox';
  };

  // eslint-disable-next-line
  const setTermForUrl = (term: string) => {
    console.warn('[VSF] please implement useUiHelpers.changeSearchTerm.');
  };

  const getSearchTermFromUrl = () => {
    console.warn('[VSF] please implement useUiHelpers.getSearchTermFromUrl.');
  };

  return {
    getFacetsFromURL,
    getCatLink,
    changeSorting,
    changeFilters,
    changeItemsPerPage,
    setTermForUrl,
    isFacetColor,
    isFacetCheckbox,
    getSearchTermFromUrl
  };
};

export default useUiHelpers;
