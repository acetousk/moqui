// axios-auth.ts
/*
 * Main ideas here are:
 * [1] If we recieve a response with an x-csrf-token, we set it as a cookie, so that it gets sent with future requests.
 * [2] If we end up with a response of codes [401,403], log out the user and clear cookies.
 */
export default (context) => {
  const { $vsf, $cookies } = context;

  $vsf.$moqui?.client?.interceptors.response.use(
    (response) => {
      if (response.headers?.['x-csrf-token'])
        $cookies.set('x-csrf-token', response.headers['x-csrf-token']);
      return response;
    },
    (error) => {
      if (error?.response && [401, 403].includes(error.response.status)) {
        // console.error(
        //   `PLUGIN/AXIOS.AUTH:::ERROR_CODE  => ${String(
        //     error?.response?.status
        //   )}`
        // );
        $cookies.remove('vsf-auth');
        // $cookies.remove('x-csrf-token');
        // $cookies.remove('JSESSIONID');
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  );
};
