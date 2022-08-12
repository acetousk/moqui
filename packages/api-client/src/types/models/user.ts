export interface User {
    emailAddress: string;
    firstName: string;
    lastName: string
    gender?: string
}

/*
* User Shipping Address
*
*/
export type UserShippingAddressItem = {
    addressId: string;
    alias?: string;
    address1: string;
    address2?: string;
    city: string;
    stateId: string;
    countryId: string;
    postalCode: string;
    phone: {
        countryCode: number;
        areaCode: number;
        contactNumber: number;
    };
    isDefault?: boolean;
};

export type UserShippingAddress = UserShippingAddressItem[];

export type UserShippingAddressSearchCriteria = unknown;

/*
*
*
*/
