import { Translation } from './common';

type CategoryTranslatableFields = {
    categoryName: string;
    description: string;
}
export type Category = CategoryTranslatableFields & {
    productStoreId: string;
    productCategoryId: string;
    slug: string;
    sequenceNum: string | null;
    translations?: {
        [TKey in keyof CategoryTranslatableFields]?: Translation[];
    }
    children?: Category[];
}
