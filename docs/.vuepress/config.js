const { resolve } = require('path');
const GTM_TAG = 'GTM-WMDC3CP';

module.exports = {
  title: 'Vue Storefront 2 for Moqui',
  base: '/',
  description: 'Documentation for the Moqui connector for Vue Storefront 2',
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    // Google Tag Manager
    [
      'script',
      {},
      [
        `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM_TAG}');
    `,
      ],
    ],
  ],

  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#configurewebpack
   */
  configureWebpack: (config) => {
    // Add support for webp images
    config.module.rules.push({
      test: /\.(webp)(\?.*)?$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'assets/img/[name].[hash:8].[ext]',
          },
        },
      ],
    });

    // Fix image loading. Ref: https://github.com/vuejs/vue-loader/issues/1612#issuecomment-559366730
    config.module.rules = config.module.rules.map((rule) => {
      rule.use =
        rule.use &&
        rule.use.map((useRule) => {
          if (useRule.loader === 'url-loader') {
            useRule.options.esModule = false;
          }

          return useRule;
        });

      return rule;
    });
  },

  /**
   * Ref：https://v1.vuepress.vuejs.org/plugin/
   */
  theme: 'vsf-docs',

  plugins: [resolve(__dirname, './plugins/meta/index.js')],

  /**
   * Ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    GTM_TAG,
    repo: 'https://github.com/vuestorefront-community/moqui',
    editLinks: false,
    docsDir: 'docs',
    docsBranch: 'develop',
    editLinkText: 'Edit this page',
    logo: '/vsf-full.svg',
    sidebarDepth: 0,
    sidebar: [
      {
        title: '',
        collapsable: false,
        children: [
          ['/', 'Introduction'],
          ['/guide/getting-started', 'Getting started'],
          ['/guide/about', 'About'],
          ['https://demo.moqui.org/toolstatic/lib/swagger-ui/index.html?url=https://demo.moqui.org/rest/service.swagger/pop', 'Demo Moqui API'],
        ]
      },
      {
        title: 'Composables',
        collapsable: true,
        children: [
          ['/guide/composables/useBootstrap', 'useBootstrap'],
          ['/guide/composables/useCart', 'useCart'],
          ['/guide/composables/useCountryList', 'useCountryList'],
          ['/guide/composables/useFacet', 'useFacet'],
          ['/guide/composables/useMakeOrder', 'useMakeOrder'],
          ['/guide/composables/usePayment', 'usePayment'],
          ['/guide/composables/useProduct', 'useProduct'],
          ['/guide/composables/useReview', 'useReview'],
          ['/guide/composables/useUser', 'useUser'],
          ['/guide/composables/useUserShipping', 'useUserShipping'],
        ]
      }
    ]
  }
};
