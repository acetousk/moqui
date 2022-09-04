import { Translation } from './common';

type CategoryTranslatableFields = {
    categoryName: string;
    description: string;
}
export type Category = CategoryTranslatableFields & {
    categoryId: string;
    slug: string;
    categoryName: string;
    description?: string;
    sequenceNum: string | null;
    translations?: {
        [TKey in keyof CategoryTranslatableFields]?: Translation[];
    }
    children?: Category[];
}
