export type ShippingMethod = {
    referenceId: string;
    shipmentMethodId: string;
    carrierId: string;
    carrierName: string;
    description: string;
    shippingTotal: number
};

export type ShippingProvider = ShippingMethod[];

export type PaymentProvider = {
    paymentMethodId: string;
    description: string;
};

export type Coupon = {
    promoCodeId: string;
    storePromotionId: string;
    promoCode: string;
    itemDescription: string;
};

export type CartOtherItem = {
    orderItemSeqId: string;
    parentItemSeqId?: string;
    itemDescription: string;
    quantity: number;
    unitAmount: number;
    unitListPrice?: number;
};

export type CartProductItem = {
    orderItemSeqId: string;
    parentItemSeqId?: string;
    product?: {
        productId: string;
        productSlug: string;
        productSku: string;
        coverImageUrl?: string;
        virtual?: {
            productId: string;
            productSlug: string;
            productSku: string;
        },
    };
    itemDescription: string;
    quantity: number;
    unitAmount: number;
    unitListPrice?: number;
    quantityUnit?: string;
    variantFeatures?: Record<string, string>;
};

export type CartItem = CartProductItem;

export type Cart = {
    orderHeader: {
        orderId: string;
        externalId?: string;
        currencyUomId: string;
        entryDate: string;
        placedDate?: string;
        statusId: string;
        grandTotal?: number;
    };
    orderPart: {
        orderPartSeqId: string;
        telecomContactMechId?: string;
        postalContactMechId?: string;
        carrierPartyId?: string;
        shipmentMethodEnumId?: string;
        shippingInstructions?: string;
        statusId: string;
        partTotal?: number;
    };
    orderItemProductList: CartProductItem[];
    orderItemDiscountList: CartOtherItem[];
    orderItemShippingList: CartOtherItem[];
    orderItemTaxList: CartOtherItem[];
    orderPromoCodeDetailList: Coupon[];
    paymentsTotal?: number;
    totalUnpaid?: number;
    postalAddress?: {
        addressId: string;
        alias?: string;
        address1: string;
        address2?: string;
        postalCode?: string;
        city?: string;
        stateId?: string;
        countryId: string;
        phone?: string;
    }
};
