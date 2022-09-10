import { apiClientFactory } from '@vue-storefront/core';
import axios, { AxiosInstance, AxiosError } from 'axios';
import type { Config } from './types/config';
import type { Endpoints } from './types/api';
import * as api from './api';
import forwardSetCookies from './extensions/forward-set-cookies';

const init = (config: Config) => {
  const client = axios.create({
    baseURL: config.api,
    xsrfHeaderName: 'x-csrf-token',
    withCredentials: true
  });

  client.interceptors.request.use((axiosConfig) => {
    const locale = config.state.getLocale();
    const country = config.state.getCountry();
    axiosConfig = {
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        Cookie:
          (axiosConfig.headers.Cookie ? axiosConfig.headers.Cookie + ';' : '') +
          (locale ? 'vsf-locale=' + locale + ';' : '') +
          (country ? 'vsf-country=' + country + ';' : '')
      }
    };

    return axiosConfig;
  });

  client.interceptors.response.use(
    (response) => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      return response;
    },
    (error: AxiosError) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      if (error?.response && [401, 403].includes(error.response.status)) {
        console.log(
          `api-client/axios-response/ ERROR_CODE  => ${String(
            error?.response?.status
          )}`
        );
        config.state.setCustomerLoggedIn(false);
        // // Not authrized, clear cookies
        // config.state.setCsrfToken(undefined);
        // config.state.setSessionId(undefined);
      }
      throw {
        // @ts-expect-error error type
        message: error.response?.data?.errors || error.message,
        // @ts-expect-error error type
        code: error.response?.data?.errorCode || error.code
      };
    }
  );

  return {
    config: config,
    client
  };
};

function onCreate(config: Config): { config: Config; client: AxiosInstance } {
  if (!config?.client) {
    return init(config);
  }
  return {
    config: config,
    client: config.client
  };
}

const { createApiClient } = apiClientFactory<Config, Endpoints>({
  onCreate,
  api,
  extensions: [forwardSetCookies]
});

export { createApiClient, init };
