import { Category } from './category';

export type Store = {
    productStoreId: string;
    storeName: string | null;
    storeDomain: string | null;
    defaultLocale: string | null;
    defaultCurrencyUomId: string | null;
    menuCategoryList: Category[];
}
