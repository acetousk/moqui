export interface User {
    username: string;
    emailAddress: string;
    firstName: string;
    middleName?: string;
    lastName: string
    gender?: string
}

export type ShippingAddress = {
    addressId: string;
    alias?: string;
    address1: string;
    address2?: string;
    city: string;
    cityId?: string;
    stateId: string;
    countryId: string;
    postalCode: string;
    phone: {
        countryCode: number;
        areaCode: number;
        contactNumber: number;
    };
};

export type UserShippingAddressItem = {
    addressId: string;
    alias?: string;
    address1: string;
    address2?: string;
    city: string;
    cityId: string;
    stateId: string;
    countryId: string;
    cityName: string;
    stateName: string;
    countryName: string;
    postalCode: string;
    phone: {
        countryCode: number;
        areaCode: number;
        contactNumber: number;
    };
    isDefault?: boolean;
};

export type ContactRequest = {
    firstName?: string;
    lastName?: string;
    description: string;
    emailAddress?: string;
    phone?: {
        countryCode: number;
        areaCode: number;
        contactNumber: number;
    };
};

export type UserShippingAddress = UserShippingAddressItem[];

export type UserShippingAddressSearchCriteria = unknown;

