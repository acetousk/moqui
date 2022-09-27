import { Geo } from '@vue-storefront/moqui-api';
import { Context } from '@vue-storefront/core';
import { useGeoFactory } from '../factories/useGeoFactory';

export const useGeo = useGeoFactory<Geo>({
  async getCountryList(context: Context) {
    try {
      const { data } = await context.$moqui.api.getGeoList();
      return data?.geoList || [];
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },
  async getAreaList(context: Context, params) {
    try {
      const { data } = await context.$moqui.api.getGeoList({
        parentGeoId: params.countryGeoId
      });
      return data?.geoList || [];
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },
  async getCityList(context: Context, params) {
    try {
      const { data } = await context.$moqui.api.getGeoList({
        parentGeoId: params.areaGeoId
      });
      return data?.geoList || [];
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  }
});
