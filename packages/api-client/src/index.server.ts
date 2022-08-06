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

  client.interceptors.request.use(
    (axiosConfig) => {
      console.log('client/interceptor/request');
      // axiosConfig = {
      //   ...axiosConfig,
      //   headers: {
      //     ...axiosConfig.headers
      //   }
      // };

      return axiosConfig;
    });

  client.interceptors.response.use(
    (response) => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // console.log('client/interceptor/response');
      return response;
    },
    (error: AxiosError) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      // if (!!error.response?.headers?.moquisessiontoken) {
      //   LocalStorage.set(
      //     'moquiSessionToken',
      //     error.response.headers.moquisessiontoken
      //   );
      // }
      // console.log(
      //   `AXIOS.JS:::    ERROR_CODE  => ${String(error?.response?.status)}`
      // );
      // console.log(
      //   `AXIOS.JS:::    ERROR_MSG   => ${String(error?.response?.data)}`
      // );
      // console.log(error?.response?.data)

      if (error?.response && [401, 403].includes(error.response.status)) {
        console.log(
          `AXIOS.AUTH:::    ERROR_CODE  => ${String(error?.response?.status)}`
        );
        console.log(
          'AXIOS.JS:::    ERROR_MSG   => '
        );
        console.log(error?.response?.data);

        // Not authrized, clear cookies?
        // config.state.setCsrfToken(undefined);
        // config.state.setSessionId(undefined);
      }
      throw {
        message: error.response?.data?.errors || error.message,
        code: error.response?.data?.errorCode || error.code
      };
    }
  );

  return {
    config: config,
    client
  };
};

function onCreate(config: Config): { config: Config, client: AxiosInstance } {
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
  extensions: [
    forwardSetCookies
  ]
});

export {
  createApiClient,
  init
};
