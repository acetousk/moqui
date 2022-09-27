/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Context,
  FactoryParams,
  PlatformApi,
  Composable,
  CustomQuery,
  configureFactoryParams,
  sharedRef,
  ComputedProperty,
  Logger
} from '@vue-storefront/core';
import { computed, Ref } from '@nuxtjs/composition-api';

export interface UseGeoErrors {
  getCountryList: Error;
  getAreaList: Error;
  getCityList: Error;
}
export interface UseGeo<GEO, API extends PlatformApi = any>
  extends Composable<API> {
  error: ComputedProperty<UseGeoErrors>;
  loading: ComputedProperty<boolean>;
  countryList: Ref<GEO[]>;
  areaList: Ref<GEO[]>;
  cityList: Ref<GEO[]>;

  getCountryList(): Promise<GEO[]>;
  getAreaList(countryGeoId: string): Promise<GEO[]>;
  getCityList(areaGeoId: string): Promise<GEO[]>;
}

export interface UseGeoFactoryParams<GEO, API extends PlatformApi = any>
  extends FactoryParams<API> {
  getCountryList: (
    context: Context,
    params: { customQuery?: CustomQuery }
  ) => Promise<GEO[]>;
  getAreaList: (
    context: Context,
    params: { countryGeoId: string; customQuery?: CustomQuery }
  ) => Promise<GEO[]>;
  getCityList: (
    context: Context,
    params: { areaGeoId: string; customQuery?: CustomQuery }
  ) => Promise<GEO[]>;
}

export const useGeoFactory = <GEO, API extends PlatformApi = any>(
  factoryParams: UseGeoFactoryParams<GEO, API>
) =>
    function useGeo(id: string): UseGeo<GEO, API> {
      const ssrKey = id || 'useGeo';
      const _factoryParams = configureFactoryParams(factoryParams);

      const countryList = sharedRef(null, `${ssrKey}-countryList`);
      const areaList = sharedRef(null, `${ssrKey}-areaList`);
      const cityList = sharedRef(null, `${ssrKey}-cityList`);

      const loading = sharedRef<boolean>(false, `${ssrKey}-loading`);
      const error = sharedRef<UseGeoErrors>(
        {
          getCountryList: null,
          getAreaList: null,
          getCityList: null
        },
        `${ssrKey}-error`
      );

      const getCountryList = async (): Promise<GEO[]> => {
        try {
          loading.value = true;
          const response = await _factoryParams.getCountryList();
          countryList.value = response;
          areaList.value = [];
          cityList.value = [];
          error.value.getCountryList = null;
          return response;
        } catch (err) {
          error.value.getCountryList = err;
          Logger.error(`useGeo/${id}/getCountryList`, err);
        } finally {
          loading.value = false;
        }
      };
      const getAreaList = async (params): Promise<GEO[]> => {
        try {
          loading.value = true;
          const response = await _factoryParams.getAreaList(params);
          areaList.value = response;
          cityList.value = [];
          error.value.getAreaList = null;
          return response;
        } catch (err) {
          error.value.getAreaList = err;
          Logger.error(`useGeo/${id}/getAreaList`, err);
        } finally {
          loading.value = false;
        }
      };
      const getCityList = async (params): Promise<GEO[]> => {
        try {
          loading.value = true;
          const response = await _factoryParams.getCityList(params);
          cityList.value = response;
          error.value.getCityList = null;
          return response;
        } catch (err) {
          error.value.getCityList = err;
          Logger.error(`useGeo/${id}/getCityList`, err);
        } finally {
          loading.value = false;
        }
      };

      return {
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        countryList,
        areaList,
        cityList,
        getCountryList,
        getAreaList,
        getCityList
      };
    };
