import { Context } from './context';
import { Store } from './models/store';
import { AxiosResponseHeaders } from 'axios';
import { UserShippingAddress, User } from './models/user';

/*
    getStore
*/
export interface GetStoreParams {
    productStoreId?: string;
}

export type GetStoreResponse = Store;

/*
    Register
*/
export interface UserRegisterParams {
    emailAddress: string;
    firstName: string;
    lastName: string;
    password: string;
}
export type UserRegisterResponse = User;

/*
    Login
*/
export interface UserLoginParams {
    username: string;
    password: string;
}
export type UserLoginResponse = User;

/*
    Logout
*/
export type UserLogoutParams = Record<string, never>;
export type UserLogoutResponse = Record<string, never>;

/*
    Load
*/
export type UserLoadParams = Record<string, never>;
export type UserLoadResponse = User;

/*
    Login
*/
export interface UserChangePasswordParams {
    username: string;
    oldPassword: string;
    newPassword: string;
}
export type UserChangePasswordResponse = User;

/*
    Login
*/
export interface UserUpdateParams {
    firstName: string;
    lastName: string;
}
export type UserUpdateResponse = User;

/*
    GET customerInfo/shippingAddresses
*/
export type ShippingAddressGetParams = Record<string, never>;
export type ShippingAddressGetResponse = {
    postalAddressList: UserShippingAddress
};

/*
    PUT customerInfo/shippingAddress
*/
export type ShippingAddressAddParams = {
    alias?: string;
    address1: string;
    address2?: string;
    city: string;
    stateId: string;
    countryId: string;
    postalCode: string;
    countryCode: number;
    areaCode: number;
    contactNumber: number;
    isDefault?: boolean;
};
export type ShippingAddressAddResponse = {
    postalAddressList: UserShippingAddress
};

/*
    PATCH customerInfo/shippingAddress
*/
export type ShippingAddressUpdateParams = {
    addressId: string;
    alias?: string;
    address1: string;
    address2?: string;
    city: string;
    stateId: string;
    countryId: string;
    postalCode: string;
    countryCode: number;
    areaCode: number;
    contactNumber: number;
    isDefault?: boolean;
};
export type ShippingAddressUpdateResponse = {
    postalAddressList: UserShippingAddress
};

/*
    DELETE customerInfo/shippingAddresses
*/
export type ShippingAddressDeleteParams = {
    addressId: string;
};
export type ShippingAddressDeleteResponse = {
    postalAddressList: UserShippingAddress
};

/*
    POST customerInfo/shippingAddresses/setDefault
*/
export type ShippingAddressSetDefaultParams = {
    addressId: string;
};

export type ShippingAddressSetDefaultResponse = {
    postalAddressList: UserShippingAddress
};

export type Endpoints = {
    getStore: (context: Context, params: GetStoreParams) => Promise<{
        headers: AxiosResponseHeaders,
        data: GetStoreResponse
    }>,
    registerUser: (context: Context, params: UserRegisterParams) => Promise<{
        headers: AxiosResponseHeaders,
        data: UserRegisterResponse
    }>,
    loginUser: (context: Context, params: UserLoginParams) => Promise<{
        headers: AxiosResponseHeaders,
        data: UserLoginResponse
    }>,
    logoutUser: (context: Context, params: UserLogoutParams) => Promise<{
        headers: AxiosResponseHeaders,
        data: UserLogoutResponse
    }>
    loadUser: (context: Context, params: UserLoadParams) => Promise<{
        headers: AxiosResponseHeaders,
        data: UserLoadResponse
    }>
    updateUser: (context: Context, params: UserUpdateParams) => Promise<{
        headers: AxiosResponseHeaders,
        data: UserUpdateResponse
    }>
    changePassword: (context: Context, params: UserChangePasswordParams) => Promise<{
        headers: AxiosResponseHeaders,
        data: UserChangePasswordResponse
    }>
    getCustomerAddresses: (context: Context, params: ShippingAddressGetParams) => Promise<{
        headers: AxiosResponseHeaders,
        data: ShippingAddressGetResponse
    }>
    createCustomerAddress: (context: Context, params: ShippingAddressAddParams) => Promise<{
        headers: AxiosResponseHeaders,
        data: ShippingAddressAddResponse
    }>
    updateCustomerAddress: (context: Context, params: ShippingAddressUpdateParams) => Promise<{
        headers: AxiosResponseHeaders,
        data: ShippingAddressUpdateResponse
    }>
    deleteCustomerAddress: (context: Context, params: ShippingAddressDeleteParams) => Promise<{
        headers: AxiosResponseHeaders,
        data: ShippingAddressDeleteResponse
    }>
    setDefaultCustomerAddress: (context: Context, params: ShippingAddressSetDefaultParams) => Promise<{
        headers: AxiosResponseHeaders,
        data: ShippingAddressSetDefaultResponse
    }>
}
