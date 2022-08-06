// forward-set-cookie.ts
// This plugin is setup in nuxt.config.js to run server-side only

import SetCookieParser from 'set-cookie-parser';

export default ({
  $vsf, $cookies
}) => {
  console.log('### PLUGIN RUN => [\'~plugins/forward-set-cookie.ts\']');
  // on each response, we want to find any Set-Cookie headers and explicitly set it to client's cookie jar.
  // this is done serverside by using the nuxt-universal-cookie library which exposes $cookies in the nuxt app context.
  // $vsf.$moqui.client.defaults.withCredentials = true;
  $vsf.$moqui?.client?.interceptors.response.use((response) => {
    console.log('### PLUGIN INTR. RESPONSE => [\'~plugins/forward-set-cookie.ts\']');
    // for each cookie in the Set-Cookie header, use $cookies.set
    const cookies = SetCookieParser.parse(response);
    cookies.forEach((cookie) => {
      const { name, value, ...options } = cookie;
      $cookies.set(name, value, options);
    });
    // if response contains an x-csrf-token, let's use it as a cookie. Alternative would be to save it elsewhere.. (localStorage, etc..)
    if (response.headers['x-csrf-token'])
      $cookies.set('x-csrf-token', response.headers['x-csrf-token']);

    return response;
  });

  $vsf.$moqui.client.interceptors.request.use((config) => {
    console.log('### PLUGIN INTR. REQUEST => [\'~plugins/forward-set-cookie.ts\']');
    // similarily, on each request going out, we want to add session id & csrf-token to the Cookie header, if they exist.
    config = {
      ...config,
      headers: {
        ...($cookies.get('JSESSIONID') && { Cookie: 'JSESSIONID=' + $cookies.get('JSESSIONID') + '; ' + ($cookies.get('x-csrf-token') ? ('x-csrf-token=' + $cookies.get('x-csrf-token') + ';') : '') })
      }
    };
    return config;
  });

};
