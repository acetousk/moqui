import { Category } from './category';

export declare type Geo = {
    geoId: string;
    geoName: string;
};

export declare type Country = Geo & {
    regionList: Geo[];
};

export type Store = {
    productStoreId: string;
    storeName: string | null;
    storeDomain: string | null;
    defaultLocale: string | null;
    defaultCurrencyUomId: string | null;
    menuCategoryList: Category[];
    countryList: Country[];
}
