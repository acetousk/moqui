import { Store } from '@vue-storefront/moqui-api';
import { AgnosticGeoLocation, AgnosticStore, UseStoreGetters } from '@vue-storefront/core';
import { UseStoreFilterParams } from '../types';

export interface UseCustomStoreGetters<STORES, CRITERIA = any> extends UseStoreGetters<STORES, CRITERIA> {
  getCountryList(stores: STORES): AgnosticGeoLocation[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItems(stores: Store, criteria: UseStoreFilterParams = {}): AgnosticStore[] {
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getSelected(stores: Store): AgnosticStore | undefined {
  return null;
}

function getCountryList(stores: Store): AgnosticGeoLocation[] {
  return stores.countryList.map(country => {
    return {
      type: '',
      id: country.geoId,
      name: country.geoName,
      regions: country.regionList.map(region => {
        return {
          id: region.geoId,
          name: region.geoName
        };
      })
      // iso: country.iso,
      // needZipCode: country.needZipCode,
      // states: country.states,
      // zipCodeFormat: country.zipCodeFormat
    };
  });
}
export const storeGetters: UseCustomStoreGetters<Store, UseStoreFilterParams> = {
  getItems,
  getSelected,
  getCountryList
};
