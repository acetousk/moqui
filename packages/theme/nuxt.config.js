import webpack from 'webpack';
import theme from './themeConfig';
import { getRoutes } from './routes';

export default {
  server: {
    port: 3000,
    host: '0.0.0.0'
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Vue Storefront',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'crossorigin'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Raleway:300,400,400i,500,600,700|Roboto:300,300i,400,400i,500,700&display=swap'
      }
    ]
  },

  loading: { color: '#fff' },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/set-cookie.ts', mode: 'server' },
    { src: '@/plugins/axios-auth.ts' },
    { src: '@/plugins/vee-validate.js' },
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // to core
    '@nuxtjs/composition-api/module',
    '@nuxt/typescript-build',
    '@nuxtjs/style-resources',
    ['@vue-storefront/nuxt', {
      // @core-development-only-start
      coreDevelopment: true,
      // @core-development-only-end
      useRawSource: {
        dev: [
          '@vue-storefront/moqui',
          '@vue-storefront/core'
        ],
        prod: [
          '@vue-storefront/moqui',
          '@vue-storefront/core'
        ]
      },
      // performance: {
      //   purgeCSS: {
      //     enabled: process.env.NODE_ENV === 'production',
      //     paths: [
      //       '**/*.vue'
      //     ]
      //   }
      // }
    }],
    // @core-development-only-start
    ['@vue-storefront/nuxt-theme', {
      generate: {
        replace: {
          apiClient: '@vue-storefront/moqui-api',
          composables: '@vue-storefront/moqui'
        }
      },
      routes: false
    }],
    // @core-development-only-end
    /* project-only-start
    ['@vue-storefront/nuxt-theme'],
    project-only-end */
    ['@vue-storefront/moqui/nuxt', {
      i18n: {
        useNuxtI18nConfig: true,
      },
    }]
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    ['nuxt-i18n', {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000'
    }],
    'cookie-universal-nuxt',
    'vue-scrollto/nuxt',
    '@vue-storefront/middleware/nuxt',
    '@nuxt/image'
  ],

  i18n: {
    currency: 'EGP',
    country: 'EG',
    countries: [
      { name: 'EG', label: 'Egypt' },
      { name: 'US', label: 'United States', states: ['California', 'Nevada'] },
      { name: 'DE', label: 'Germany' },
      { name: 'NL', label: 'Netherlands' }
    ],
    currencies: [
      { name: 'USD', label: 'Dollar' },
      { name: 'EGP', label: 'Egyptian Pound' }
    ],
    locales: [
      { code: 'en', label: 'English', file: 'en.js', iso: 'en', dir: 'ltr' },
      { code: 'de', label: 'German', file: 'de.js', iso: 'de', dir: 'ltr' },
      { code: 'ar', label: 'Arabic', file: 'ar.js', iso: 'ar', dir: 'rtl' }
    ],
    defaultLocale: 'en',
    lazy: true,
    seo: true,
    langDir: 'lang/',
    vueI18n: {
      fallbackLocale: 'en',
      numberFormats: {
        en: {
          currency: {
            style: 'currency', currency: 'USD', currencyDisplay: 'symbol'
          }
        },
        ar: {
          currency: {
            style: 'currency', currency: 'EGP', currencyDisplay: 'symbol'
          }
        },
        de: {
          currency: {
            style: 'currency', currency: 'EUR', currencyDisplay: 'symbol'
          }
        }
      }
    },
    detectBrowserLanguage: false
  },

  styleResources: {
    scss: [require.resolve('@storefront-ui/shared/styles/_helpers.scss', { paths: [process.cwd()] })]
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      'vee-validate/dist/rules',
      '@storefront-ui'
    ],
    plugins: [
      new webpack.DefinePlugin({
        'process.VERSION': JSON.stringify({
          // eslint-disable-next-line global-require
          version: require('./package.json').version,
          lastCommit: process.env.LAST_COMMIT || ''
        })
      })
    ]
  },

  router: {
    extendRoutes(routes) {
      getRoutes(`${__dirname}/_theme`)
        .forEach((route) => routes.unshift(route));
    },
    middleware: ['checkout'],
    scrollBehavior(_to, _from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      } else {
        return { x: 0, y: 0 };
      }
    }
  },
  publicRuntimeConfig: {
    theme,
    middlewareUrl: process.env.BASE_URL || 'http://0.0.0.0:3000'
  },
  pwa: {
    meta: {
      theme_color: '#AF8936'
    }
  }
};
