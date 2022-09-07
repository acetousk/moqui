export type OrderItem = {
    orderItemSeqId: string;
    productSlug?: string;
    productSku?: string;
    itemDescription?: string;
    quantity: number;
    unitAmount: number;
    isTax: boolean;
    isDiscount: boolean;
    isProduct: boolean;
    isShipping: boolean;
};

export type Order = {
    orderId: string;
    externalId: string;
    entryDate: string;
    placedDate?: string;
    statusDescription: string;
    grandTotal: number;
    orderItemList: OrderItem[];
};

export type CustomerOrders = {
    orderInfoList: Order[];
    orderInfoListPageIndex: number;
    orderInfoListPageSize: number;
    orderInfoListPageMaxIndex: number;
    orderInfoListPageRangeLow: number;
    orderInfoListPageRangeHigh: number;
    orderInfoListCount: number;
};
