import { Context } from './context';
import { Geo, Store } from './models/store';
import { AxiosResponseHeaders } from 'axios';
import { UserShippingAddress, User, ContactRequest } from './models/user';
import {
  Cart,
  Category,
  Order,
  PaymentProvider,
  Product,
  ProductFilter,
  Review,
  ShippingProvider
} from '.';

/*
    getStore
*/
export interface GetStoreParams {
  productStoreId?: string;
}

export type GetStoreResponse = Store;

/*
    getGeoList
*/
export interface GetGeoParams {
  parentGeoId?: string;
}

export type GetGeoResponse = Geo[];

/*
    addContactRequest
*/
export type AddContactRequestParams = ContactRequest;

export type AddContactRequestResponse = Record<string, never>;

/*
    Register
*/
export interface UserRegisterParams {
  emailAddress: string;
  firstName: string;
  lastName: string;
  password: string;
}
export type UserRegisterResponse = {
  moquiSessionToken?: string;
  customerInfo?: User;
};

/*
    Login
*/
export interface UserLoginParams {
  username: string;
  password: string;
}
export type UserLoginResponse = {
  moquiSessionToken?: string;
  customerInfo?: User;
  forcePasswordChange?: boolean;
};

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
    Change Password
*/
export interface UserChangePasswordParams {
  username: string;
  oldPassword: string;
  newPassword: string;
}
export type UserChangePasswordResponse = User;

/*
    Update User
*/
export interface UserUpdateParams {
  firstName: string;
  lastName: string;
}
export type UserUpdateResponse = User;

/*
    Reset/Forgot Password
*/
export type ResetPasswordParams = {
  email: string;
};
export type ResetPasswordResponse = Record<string, never>;

/*
    Set New Password (Forgot flow)
*/
export type SetNewPasswordParams = {
  email: string;
  token: string;
  newPassword: string;
};
export type SetNewPasswordResponse = {
  updateSuccessful: boolean;
  passwordIssues: boolean;
};

/*
    GET customerInfo/shippingAddresses
*/
export type ShippingAddressGetParams = Record<string, never>;
export type ShippingAddressGetResponse = {
  postalAddressList: UserShippingAddress;
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
  postalAddressList: UserShippingAddress;
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
  postalAddressList: UserShippingAddress;
};

/*
    DELETE customerInfo/shippingAddresses
*/
export type ShippingAddressDeleteParams = {
  addressId: string;
};
export type ShippingAddressDeleteResponse = {
  postalAddressList: UserShippingAddress;
};

/*
    POST customerInfo/shippingAddresses/setDefault
*/
export type ShippingAddressSetDefaultParams = {
  addressId: string;
};

export type ShippingAddressSetDefaultResponse = {
  postalAddressList: UserShippingAddress;
};

/*
    GET products/category
*/
export type CategoryProductsGetParams = {
  productCategoryId?: string;
  categorySlug?: string;
  filters?: Record<string, string[]>;
  page?: number;
  pageSize?: number;
  sort?: string;
};
export type CategoryProductsGetResponse = {
  categoryTree: Category[];
  productList: Product[];
  featureList: ProductFilter[];
  productListCount: number;
  productListPageSize: number;
  productListPageMaxIndex: number;
  productListPageRangeLow: number;
  productListPageRangeHigh: number;
};

/*
    GET products/search
*/
export type ProductSearchGetParams = {
  term: string;
  orderBy?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  filters?: Record<string, string[]>;
};
export type ProductSearchGetResponse = {
  productSearchResults: {
    categoryTree: Category[];
    categoryList: Category[];
    productList: Product[];
    featureList: ProductFilter[];
    productListCount: number;
    productListPageSize: number;
    productListPageMaxIndex: number;
    productListPageRangeLow: number;
    productListPageRangeHigh: number;
  };
};

/*
    GET products/category
*/
export type ProductGetParams = {
  productId?: string;
  productSlug?: string;
  filters?: Record<string, string[]>;
};
export type ProductGetResponse = Product;

/*
    GET products/featured
*/
export type FeaturedProductsGetParams = {
  pageSize?: number;
};
export type FeaturedProductsGetResponse = {
  productList: Product[];
};

/*
    GET products/related
*/
export type RelatedProductsGetParams = {
  productSlug?: string;
  productId?: string;
  pageSize?: number;
};
export type RelatedProductsGetResponse = {
  productList: Product[];
};

export type ReviewsGetParams = {
  productId: string;
  itemsPerPage?: number;
  page?: number;
};
export type ReviewsGetResponse = Review;

export type ReviewsAddParams = {
  productId: string;
  productRating: number;
  productReview: string;
};
export type ReviewsAddResponse = Review;

export type CartGetParams = Record<string, never>;
export type CartGetResponse = Cart | null;

export type CartAddParams = {
  productId: string;
  quantity: number;
};
export type CartAddResponse = Cart;

export type CartUpdateParams = {
  productId: string;
  quantity: number;
};
export type CartUpdateResponse = Cart;

export type CartRemoveParams = {
  productId: string;
  quantity: number;
  addToQuantity?: boolean;
};
export type CartRemoveResponse = Cart;

export type CartSetShippingParams = {
  addressId: string;
};
export type CartSetShippingResponse = Cart;

export type CartAddPromoParams = {
  promoCode: string;
};
export type CartAddPromoResponse = Cart;

export type CartRemovePromoParams = {
  promoCodeId: string;
};
export type CartRemovePromoResponse = Cart;

export type ShippingProviderGetParams = Record<string, never>;
export type ShippingProviderGetResponse = {
  shippingOptions: ShippingProvider;
};

export type ShippingProviderSaveParams = {
  shipmentMethodId: string;
  carrierId: string;
};
export type ShippingProviderSaveResponse = {
  shippingOptions: ShippingProvider;
};

export type PaymentProviderGetParams = Record<string, never>;
export type PaymentProviderGetResponse = {
  paymentOptions: PaymentProvider;
};

export type CustomerOrderGetParams = {
  itemsPerPage: number;
  page: number;
};
export type CustomerOrderGetResponse = {
  orderInfoList: Order[];
  orderInfoListPageIndex: number;
  orderInfoListPageSize: number;
  orderInfoListPageMaxIndex: number;
  orderInfoListPageRangeLow: number;
  orderInfoListPageRangeHigh: number;
  orderInfoListCount: number;
};

export type MakerOrderParams = {
  paymentMethodId: string;
};
export type MakeOrderResponse = Order;

// Payment gateway
export type PaymobLinkGetParams = {
  orderId: string;
};
export type PaymobLinkGetResponse = {
  iframeUrl: string;
};

export type PaymobConfirmationGetParams = {
  hmac: string;
  amount_cents: string;
  created_at: string;
  currency: string;
  error_occured: string;
  has_parent_transaction: string;
  id: string;
  integration_id: string;
  is_3d_secure: string;
  is_auth: string;
  is_capture: string;
  is_refunded: string;
  is_standalone_payment: string;
  is_voided: string;
  order: string;
  owner: string;
  pending: string;
  'source_data.sub_type': string;
  'source_data.type': string;
  'source_data.pan': string;
  success: string;
};
export type PaymobConfirmationGetResponse = {
  isValid: boolean;
  isPending: boolean;
  isSuccessful: boolean;
  isRejected: boolean;
};

export type Endpoints = {
  getStore: (
    context: Context,
    params: GetStoreParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: GetStoreResponse;
  }>;
  getGeoList: (
    context: Context,
    params: GetGeoParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: GetGeoResponse;
  }>;
  registerUser: (
    context: Context,
    params: UserRegisterParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: UserRegisterResponse;
  }>;
  loginUser: (
    context: Context,
    params: UserLoginParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: UserLoginResponse;
  }>;
  logoutUser: (
    context: Context,
    params: UserLogoutParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: UserLogoutResponse;
  }>;
  loadUser: (
    context: Context,
    params: UserLoadParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: UserLoadResponse;
  }>;
  updateUser: (
    context: Context,
    params: UserUpdateParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: UserUpdateResponse;
  }>;
  changePassword: (
    context: Context,
    params: UserChangePasswordParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: UserChangePasswordResponse;
  }>;
  resetPassword: (
    context: Context,
    params: ResetPasswordParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: ResetPasswordResponse;
  }>;
  setNewPassword: (
    context: Context,
    params: SetNewPasswordParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: SetNewPasswordResponse;
  }>;
  getCustomerAddresses: (
    context: Context,
    params: ShippingAddressGetParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: ShippingAddressGetResponse;
  }>;
  createCustomerAddress: (
    context: Context,
    params: ShippingAddressAddParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: ShippingAddressAddResponse;
  }>;
  updateCustomerAddress: (
    context: Context,
    params: ShippingAddressUpdateParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: ShippingAddressUpdateResponse;
  }>;
  deleteCustomerAddress: (
    context: Context,
    params: ShippingAddressDeleteParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: ShippingAddressDeleteResponse;
  }>;
  setDefaultCustomerAddress: (
    context: Context,
    params: ShippingAddressSetDefaultParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: ShippingAddressSetDefaultResponse;
  }>;
  getCategoryProducts: (
    context: Context,
    params: CategoryProductsGetParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: CategoryProductsGetResponse;
  }>;
  getProductSearch: (
    context: Context,
    params: ProductSearchGetParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: ProductSearchGetResponse;
  }>;
  getProduct: (
    context: Context,
    params: ProductGetParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: ProductGetResponse;
  }>;
  getFeaturedProducts: (
    context: Context,
    params: FeaturedProductsGetParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: FeaturedProductsGetResponse;
  }>;
  getRelatedProducts: (
    context: Context,
    params: RelatedProductsGetParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: RelatedProductsGetResponse;
  }>;
  getReviews: (
    context: Context,
    params: ReviewsGetParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: ReviewsGetResponse;
  }>;
  addReview: (
    context: Context,
    params: ReviewsAddParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: ReviewsAddResponse;
  }>;
  getCart: (
    context: Context,
    params: CartGetParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: CartGetResponse;
  }>;
  addItemToCart: (
    context: Context,
    params: CartAddParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: CartAddResponse;
  }>;
  updateCartItemQty: (
    context: Context,
    params: CartUpdateParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: CartUpdateResponse;
  }>;
  removeCartItem: (
    context: Context,
    params: CartRemoveParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: CartRemoveResponse;
  }>;
  addCartPromo: (
    context: Context,
    params: CartAddPromoParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: CartAddPromoResponse;
  }>;
  removeCartPromo: (
    context: Context,
    params: CartRemovePromoParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: CartRemovePromoResponse;
  }>;
  setCartShippingAddress: (
    context: Context,
    params: CartSetShippingParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: CartSetShippingResponse;
  }>;
  getShippingProvider: (
    context: Context,
    params: ShippingProviderGetParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: ShippingProviderGetResponse;
  }>;
  saveShippingProvider: (
    context: Context,
    params: ShippingProviderSaveParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: ShippingProviderSaveResponse;
  }>;
  getPaymentProviders: (
    context: Context,
    params: PaymentProviderGetParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: PaymentProviderGetResponse;
  }>;
  getCustomerOrders: (
    context: Context,
    params: CustomerOrderGetParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: CustomerOrderGetResponse;
  }>;
  makeOrder: (
    context: Context,
    params: MakerOrderParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: MakeOrderResponse;
  }>;
  getPaymobPaymentLink: (
    context: Context,
    params: PaymobLinkGetParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: PaymobLinkGetResponse;
  }>;
  getPaymobPaymentConfirmation: (
    context: Context,
    params: PaymobConfirmationGetParams
  ) => Promise<{
    headers: AxiosResponseHeaders;
    data: PaymobConfirmationGetResponse;
  }>;
};
