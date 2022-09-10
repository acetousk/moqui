import { AxiosInstance } from 'axios';

export type ConfigState = {
  getSessionId(): string;
  setSessionId(sessionId?: string | null): void;
  getCsrfToken(): string;
  setCsrfToken(token?: string | null): void;
  getCustomerLoggedIn(): boolean;
  setCustomerLoggedIn(state?: boolean | null): void;
  getLocale(): string | null;
  getCountry(): string | null;
};

export interface Config {
  api: string;
  basePath: string;
  gatewayBasePath: string;
  defaultStoreId: string;
  client?: AxiosInstance;
  cookies: {
    currencyCookieName: string;
    countryCookieName: string;
    localeCookieName: string;
    // not used atm.
    // cartCookieName: string;
    // customerCookieName: string;
    // storeCookieName: string;
    // messageCookieName: string;
    // moqui-specific
    sessionCookieName: string;
    xsrfCookieName: string;
    authCookieName: string;
  };
  state: ConfigState;
}
