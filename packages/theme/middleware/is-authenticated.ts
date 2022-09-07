import { Logger } from '@vue-storefront/core';
import { Middleware } from '@nuxt/types';

const middleware: Middleware = ({ app, localeRoute, redirect }) => {
  const authCookie = app.$cookies.get('vsf-auth');
  if (!authCookie || authCookie === 'false') {
    Logger.warn('User not logged in, redirecting');
    const homepage = localeRoute({ name: 'home' });
    redirect(homepage);
  }
};
export default middleware;
