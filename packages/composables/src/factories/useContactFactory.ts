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

export interface UseContactErrors {
  sendContactRequest: Error;
}
export interface UseContact<CONTACT_REQUEST, API extends PlatformApi = any>
  extends Composable<API> {
  error: ComputedProperty<UseContactErrors>;
  loading: ComputedProperty<boolean>;

  sendContactRequest(request: CONTACT_REQUEST): Promise<void>;
}

export interface UseContactFactoryParams<
  CONTACT_REQUEST,
  API extends PlatformApi = any
> extends FactoryParams<API> {
  sendContactRequest: (
    context: Context,
    params: { request: CONTACT_REQUEST; customQuery?: CustomQuery }
  ) => Promise<void>;
}

export const useContactFactory = <
  CONTACT_REQUEST,
  API extends PlatformApi = any
>(
    factoryParams: UseContactFactoryParams<CONTACT_REQUEST, API>
  ) =>
    function useContact(id: string): UseContact<CONTACT_REQUEST, API> {
      const ssrKey = id || 'useContact';
      const _factoryParams = configureFactoryParams(factoryParams);

      const loading = sharedRef<boolean>(false, `${ssrKey}-loading`);
      const error = sharedRef<UseContactErrors>(
        {
          sendContactRequest: null
        },
        `${ssrKey}-error`
      );

      const sendContactRequest = async (params): Promise<void> => {
        try {
          loading.value = true;
          const response = await _factoryParams.sendContactRequest(params);
          error.value.sendContactRequest = null;
          return response;
        } catch (err) {
          error.value.sendContactRequest = err;
          Logger.error(`useContact/${id}/sendContactRequest`, err);
        } finally {
          loading.value = false;
        }
      };

      return {
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        sendContactRequest
      };
    };
