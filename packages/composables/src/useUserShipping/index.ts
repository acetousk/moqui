import {
  Context,
  useUserShippingFactory,
  UseUserShippingFactoryParams
} from '@vue-storefront/core';
import type {
  UserShippingAddress as Address,
  UserShippingAddressItem as AddressItem
} from '@vue-storefront/moqui-api';

const params: UseUserShippingFactoryParams<Address, AddressItem> = {
  addAddress: async (context: Context, params) => {
    try {
      const { data } = await context.$moqui.api.createCustomerAddress({
        alias: params.address.alias,
        address1: params.address.address1,
        address2: params.address.address2,
        countryId: params.address.countryId,
        stateId: params.address.stateId,
        city: params.address.city,
        countryCode: params.address.phone?.countryCode,
        areaCode: params.address.phone?.areaCode,
        contactNumber: params.address.phone?.contactNumber,
        postalCode: params.address.postalCode
      });

      return data.postalAddressList;
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  deleteAddress: async (context: Context, params) => {
    try {
      const { data } = await context.$moqui.api.deleteCustomerAddress({
        addressId: params.address.addressId
      });
      return data.postalAddressList;
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  updateAddress: async (context: Context, params) => {
    try {
      const { data } = await context.$moqui.api.updateCustomerAddress({
        addressId: params.address.addressId,
        alias: params.address.alias,
        address1: params.address.address1,
        address2: params.address.address2,
        countryId: params.address.countryId,
        stateId: params.address.stateId,
        city: params.address.city,
        countryCode: params.address.phone?.countryCode,
        areaCode: params.address.phone?.areaCode,
        contactNumber: params.address.phone?.contactNumber,
        postalCode: params.address.postalCode
      });
      return data.postalAddressList;
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  load: async (context: Context, params) => {
    try {
      const { data } = await context.$moqui.api.getCustomerAddresses(params);
      return data.postalAddressList;
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  // @ts-expect-error Not Implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDefaultAddress: async (context: Context, params) => {
    console.log('Mocked: useUserShipping.setDefaultAddress');
    return {};
  }
};

export const useUserShipping = useUserShippingFactory<Address, AddressItem>(params);
