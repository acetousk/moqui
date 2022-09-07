/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Context,
  FactoryParams,
  PlatformApi,
  Composable,
  CustomQuery,
  configureFactoryParams,
  sharedRef,
  ComputedProperty,
  Logger
} from '@vue-storefront/core';
import { computed, Ref } from '@nuxtjs/composition-api';

export interface UsePaymentErrors {
  getPaymentProviderList: Error;
  getPaymentLink: Error;
  getPaymentConfirmation: Error;
}
export interface UsePayment<
  PAYMENT_PROVIDER,
  PAYMENT_RESPONSE,
  PAYMENT_CONFIRMATION,
  API extends PlatformApi = any
> extends Composable<API> {
  error: ComputedProperty<UsePaymentErrors>;
  loading: ComputedProperty<boolean>;
  providerList: Ref<PAYMENT_PROVIDER[]>;
  paymentLink: Ref<PAYMENT_RESPONSE>;
  paymentConfirmation: Ref<PAYMENT_CONFIRMATION>;

  getPaymentProviderList(
    providerList: PAYMENT_PROVIDER
  ): Promise<PAYMENT_PROVIDER[]>;

  getPaymentLink(): Promise<PAYMENT_RESPONSE>;
  getPaymentConfirmation(params): Promise<PAYMENT_CONFIRMATION>;
}

export interface UsePaymentFactoryParams<
  PAYMENT_PROVIDER,
  PAYMENT_RESPONSE,
  PAYMENT_CONFIRMATION,
  API extends PlatformApi = any
> extends FactoryParams<API> {
  getPaymentProviderList: (
    context: Context,
    params: { customQuery?: CustomQuery }
  ) => Promise<PAYMENT_PROVIDER[]>;
  getPaymentLink: (
    context: Context,
    params: { customQuery?: CustomQuery }
  ) => Promise<PAYMENT_RESPONSE>;
  getPaymentConfirmation: (
    context: Context,
    params: { customQuery?: CustomQuery }
  ) => Promise<PAYMENT_CONFIRMATION>;
}

export const usePaymentFactory = <
  PAYMENT_PROVIDER,
  PAYMENT_RESPONSE,
  PAYMENT_CONFIRMATION,
  API extends PlatformApi = any
>(
    factoryParams: UsePaymentFactoryParams<
    PAYMENT_PROVIDER,
    PAYMENT_RESPONSE,
    PAYMENT_CONFIRMATION,
    API
  >
  ) =>
    function usePayment(
      id: string
    ): UsePayment<PAYMENT_PROVIDER, PAYMENT_RESPONSE, PAYMENT_CONFIRMATION, API> {
      const ssrKey = id || 'usePayment';
      const _factoryParams = configureFactoryParams(factoryParams);

      const providerList = sharedRef(null, `${ssrKey}-providerList`);
      const paymentLink = sharedRef(null, `${ssrKey}-paymentLink`);
      const paymentConfirmation = sharedRef(
        null,
        `${ssrKey}-paymentConfirmation`
      );
      const loading = sharedRef<boolean>(false, `${ssrKey}-loading`);
      const error = sharedRef<UsePaymentErrors>(
        {
          getPaymentProviderList: null,
          getPaymentLink: null,
          getPaymentConfirmation: null
        },
        `${ssrKey}-error`
      );

      const getPaymentProviderList = async (
        params
      ): Promise<PAYMENT_PROVIDER[]> => {
        try {
          loading.value = true;
          const response = await _factoryParams.getPaymentProviderList(params);
          providerList.value = response;
          error.value.getPaymentProviderList = null;
          return response;
        } catch (err) {
          error.value.getPaymentProviderList = err;
          Logger.error(`usePayment/${id}/getPaymentProviderList`, err);
        } finally {
          loading.value = false;
        }
      };

      const getPaymentLink = async (): Promise<PAYMENT_RESPONSE> => {
        try {
          loading.value = true;
          const response = await _factoryParams.getPaymentLink();
          paymentLink.value = response;
          error.value.getPaymentLink = null;
          return response;
        } catch (err) {
          error.value.getPaymentLink = err;
          Logger.error(`usePayment/${id}/getPaymentLink`, err);
        } finally {
          loading.value = false;
        }
      };

      const getPaymentConfirmation = async (params): Promise<PAYMENT_CONFIRMATION> => {
        try {
          loading.value = true;
          const response = await _factoryParams.getPaymentConfirmation(params);
          paymentConfirmation.value = response;
          error.value.getPaymentConfirmation = null;
          return response;
        } catch (err) {
          error.value.getPaymentConfirmation = err;
          Logger.error(`usePayment/${id}/getPaymentConfirmation`, err);
        } finally {
          loading.value = false;
        }
      };

      return {
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        providerList,
        paymentLink,
        paymentConfirmation,
        getPaymentProviderList,
        getPaymentLink,
        getPaymentConfirmation
      };
    };
