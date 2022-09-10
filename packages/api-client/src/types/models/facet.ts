import { Category } from './category';
import { Product, ProductFilter } from './product';

export type Facet = {
    items: Product[];
    categories: Category[];
    categoryTree: Category;
    availableFilters: ProductFilter[];
    category: { categorySlug: string },
    sortOptions: {
        options: {
            id: string;
            type: string;
            value: string;
        }[],
        selected: string;
    };
    perPageOptions: Array<number>;
    total: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
};

export type FacetSearchCriteria = {
    [filterId: string]: string[]
};
