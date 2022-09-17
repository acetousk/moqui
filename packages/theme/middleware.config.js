module.exports = {
  integrations: {
    moqui: {
      location: '@vue-storefront/moqui-api/server',
      configuration: {
        api: 'http://localhost:8080',
        basePath: '/rest/s1/vsf',
        gatewayBasePath: '/rest/s1/accept',
        defaultStoreId: 'POPC_DEFAULT',
        cookies: {
          currencyCookieName: 'vsf-currency',
          countryCookieName: 'vsf-country',
          localeCookieName: 'vsf-locale',
          // not used atm
          // cartCookieName: 'vsf-cart',
          // customerCookieName: 'vsf-customer',
          // storeCookieName: 'vsf-store',
          // messageCookieName: 'vsf-message',
          // Moqui specific
          sessionCookieName: 'JSESSIONID',
          xsrfCookieName: 'x-csrf-token',
        },
      }
    }
  }
};
