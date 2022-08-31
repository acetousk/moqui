export type ProductVariant = {
    productId: string;
    productSku?: string;
    productSlug: string;
    productName: string;
    descriptionSmall?: string;
    descriptionLong?: string;
    quantity?: number;
    prices?: {
        price?: number,
        priceUomId?: string;
    };
    contentList: Array<any>;
    isReadyForSales?: boolean;
    salesDates?: {
        salesIntroDate?: string;
        salesDiscontinueDate?: string;
    }
    features: {
        [featureId: string]: string;
    }
}
export type Product = {
    productId: string;
    productSlug: string;
    productSku?: number;
    productName: string;
    descriptionSmall?: string;
    descriptionLong?: string;
    price: number;
    listPrice: number;
    priceUomId: number;
    hasVariants: boolean;
    imageList: {
        small: string;
        medium: string;
        large: string;
        isCover?: boolean;
    }[];
    defaultVariant: {
        id: string,
        slug: string
    }
    standardFeatureList?: {
        productFeatureId: string;
        productFeatureTypeEnumId: string;
        typeDescription: string;
        description: string;
    }[];
    variantOptions?: ProductVariant[];
    availableFeatures?: {
        [featureId: string]: {
            label?: string;
            options: {
                id: string;
                label?: string;
                abbrev?: string;
            }[]
        }
    };
    isReadyForSales?: boolean;
    salesDates?: {
        salesIntroDate?: string;
        salesDiscontinueDate?: string;
    };
    categoryPath?: {
        productCategoryId: string;
        categorySlug: string;
        categoryName: string;
    }[];
    productReviewCount: number;
    productRating: number
};

export type ProductFilter = {
    id: string;
    label: string;
    type: string;
    allowMultiple: boolean;
    shouldDisplay: boolean;
    options: {
        id: string;
        label: string;
        type: string;
        count: number;
    }[]
};

export type ReviewItem = {
    productReviewId: string;
    productReview: string;
    status: string;
    isOwner: boolean;
    postedAnonymous: boolean;
    postedByName: string;
    postedTimestamp: number;
    productRating: number;
};

export type Review = {
    reviewItems: ReviewItem[];
    productRating: number;
    reviewListPageIndex: number;
    reviewListPageSize: number;
    reviewListPageMaxIndex: number;
    reviewListPageRangeLow: number;
    reviewListPageRangeHigh: number;
    reviewListCount: number;
};
