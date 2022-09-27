import { UserShippingGetters } from '@vue-storefront/core';
import type {
  UserShippingAddress as Address,
  UserShippingAddressItem as AddressItem
  // UserShippingAddressSearchCriteria
} from '@vue-storefront/moqui-api';

function getId(address: AddressItem): string {
  return address?.addressId || '';
}

function getAddresses(shipping: Address /* , criteria?: UserShippingAddressSearchCriteria */): AddressItem[] {
  return shipping || [];
}

function getDefault(shipping: Address): AddressItem {
  return shipping.find(addr => addr.isDefault === true) || shipping?.[0] || null;
}

function getTotal(shipping: Address): number {
  return shipping?.length || 0;
}

function getPostCode(address: AddressItem): string {
  return address?.postalCode || '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCity(address: AddressItem): string {
  return address?.cityName || address?.city || '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFirstName(address: AddressItem): string {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getLastName(address: AddressItem): string {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getEmail(address: AddressItem): string {
  return '';
}

function getCountry(address: AddressItem): string {
  return address?.countryName || address?.countryId || '';
}

function getPhone(address: AddressItem): string {
  return address?.phone ? (String(address.phone?.countryCode || '') + String(address.phone?.areaCode || '') + String(address.phone?.contactNumber || '')) : '';
}

function getProvince(address: AddressItem): string {
  return address?.stateName || address?.stateId || '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getStreetName(address: AddressItem): string {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getStreetNumber(address: AddressItem): string | number {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCompanyName(address: AddressItem): string {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTaxNumber(address: AddressItem): string {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getApartmentNumber(address: AddressItem): string | number {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isDefault(address: AddressItem): boolean {
  return false;
}

export const userShippingGetters: UserShippingGetters<Address, AddressItem> = {
  getAddresses,
  getDefault,
  getTotal,
  getPostCode,
  getStreetName,
  getStreetNumber,
  getCity,
  getFirstName,
  getLastName,
  getCountry,
  getPhone,
  getEmail,
  getProvince,
  getCompanyName,
  getTaxNumber,
  getId,
  getApartmentNumber,
  isDefault
};
