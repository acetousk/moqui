module.exports = {
  integrations: {
    moqui: {  // name of your integration
      location: '@vue-storefront/moqui-api/server',  // name of your api-client package followed by `/server`
      configuration: {
        api: {
          url: 'http://localhost:8080' // URL of your e-commerce platform
        }
      }
    }
  }
};
