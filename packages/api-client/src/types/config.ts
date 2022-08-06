import { AxiosInstance } from 'axios';

export type ConfigState = {
    getSessionId(): string;
    setSessionId(sessionId?: string | null): void;
    getCsrfToken(): string;
    setCsrfToken(token?: string | null): void;
};

export interface Config {
    api: string;
    basePath: string;
    defaultStoreId: string;
    client?: AxiosInstance;
    cookies: {
        currencyCookieName: string;
        countryCookieName: string;
        localeCookieName: string;
        cartCookieName: string;
        customerCookieName: string;
        storeCookieName: string;
        messageCookieName: string;
        // moqui-specific
        sessionCookieName: string;
        xsrfCookieName: string;
    },
    state: ConfigState;
}
