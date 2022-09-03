import { AgnosticCategoryTree } from '@vue-storefront/core';
import { Category } from '@vue-storefront/moqui-api';

const populateCategoryTree = (category: Category, activeCategorySlug: string): AgnosticCategoryTree => {
  return {
    label: category?.categoryName || '',
    slug: category?.slug || '',
    items: category?.children?.map(child => populateCategoryTree(child, activeCategorySlug)) || [],
    isCurrent: category?.slug === activeCategorySlug,
    count: 0
  };
};

export default populateCategoryTree;
