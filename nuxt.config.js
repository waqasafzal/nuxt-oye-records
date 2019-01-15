import {apiHost} from './config/host'

const webpack = require('webpack')

if (!process.env.NODE_ENV && process.env.npm_lifecycle_event !== 'dev') {
  process.env.NODE_ENV = 'production'
}

const adyenScript = process.env.ADYEN_CSE
  ? process.env.ADYEN_CSE
  : 'https://test.adyen.com/hpp/cse/js/8214959999792925.shtml'

const adyenSkin = process.env.ADYEN_SKIN_URL
  ? process.env.ADYEN_SKIN_URL
  : "'https://test.adyen.com/hpp/skipDetails.shtml'"

const gaUrl = process.env.GA_URL ? process.env.GA_URL : "'UA-100941329-2'"

module.exports = {
  mode: 'universal',
  router: {
    middleware: 'auth',
    extendRoutes (routes, resolve) {
      routes.push(
        {
          name: 'genres-slug-subslug',
          path: '/genres/:slug/:subslug',
          component: resolve(__dirname, 'pages/genres/_slug/index.vue')
        }
      )
      routes.push(
        {
          name: 'metagenres-slug',
          path: '/metagenres/:slug',
          component: resolve(__dirname, 'pages/genres/_slug/index.vue')
        }
      )
    }
  },
  head: {
    title: 'OYE Records - Webshop',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'keywords', name: 'keywords', content: 'vinyl,records,house,disco,jazz,techno,prenzlauer berg,berlin,neukölln,mailorder,germany'},
      {name: 'robots', content: 'index, follow'},
      {hid: 'description', name: 'description', content: 'Oye Records houses a fantastic range of music. Mostly devoted to house and disco there is also enough hip hop, jazz, and brand new electronic 12-inches.'},
      {
        hid: 'url',
        property: 'og:url',
        content: apiHost
      },
      {name: 'google-site-verification', content: '97DMLXlRhOGBHBXejItwpPsvTogTeoo376AIzxtoDI0'},
      {
        hid: 'type',
        property: 'og:type',
        content: 'website'
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'OYE Records'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'A is for Afro, B is for Breaks, C is for Cosmic, D is for Disco, E is for Electro, F is for Funk, G is for G-Funk, H is for House, Get it all and more at OYE!'
      }
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {
        rel: 'stylesheet',
        href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
        integrity: 'sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm',
        crossorigin: 'anonymous'
      },
      // {
      //   rel: 'stylesheet',
      //   href: 'https://fonts.googleapis.com/css?family=Roboto+Condensed',
      // },
      {
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
        rel: 'stylesheet',
      }
    ],
    script: [
      {src: adyenScript, async: true}
    ]
  },
  modules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/axios',
    '@nuxtjs/apollo',
    '@nuxtjs/proxy',
    [
      '@nuxtjs/google-analytics',
      {
        id: gaUrl,
        ecommerce: {
          enabled: true
        }
      }
    ]
  ],
  apollo: {
    authenticationType: 'JWT',
    includeNodeModules: true,
    errorHandler(error) {
      console.log(
        '%cError',
        'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;',
        error.message
      )
    },
    clientConfigs: {
      default: '~/plugins/apollo-config'
    },
  },
  proxy: {
    '/media': 'http://local.oye.com:8000/',
    '/admin': 'http://local.oye.com:8000/',
    '/static': 'http://local.oye.com:8000/',
    '/oye': 'http://local.oye.com:8000/'
  },

  /*
  ** Customize the progress-bar color
  */
  loading: {color: '#30C46C'},

  /*
  ** Global CSS
  */
  // css: [
  //   './node_modules/bootstrap/dist/css/bootstrap.css',
  // ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {src: '~/plugins/vue-cookie'},
    {src: '~/plugins/vue-agile', ssr: false},
    {src: '~/plugins/vue-cookie-law', ssr: false},
    {src: '~/plugins/vue-social-sharing'},
  ],

  /*
  ** Axios module configuration
  */
  axios: {
  },
  styleResources: {
    sass: [
      './assets/css/storefront/storefront.scss',
    ]
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        __API__: "'" + apiHost + "'",
        __ADYEN_SKIN__: adyenSkin,
        __GA_URL__: gaUrl
      })
    ],
    loaders: {
      vueStyle: {
          ssrId: true
      }
    },
    optimization: {
      minimize: process.env.NODE_ENV === 'production'
    },
    optimizeCSS: process.env.NODE_ENV === 'production',
    postcss: true,
    cssSourceMap: false,
    extractCSS: false
    // cache: true,
    // analyze: true
  },
  render: {
    http2: {push: true}
  }
}
