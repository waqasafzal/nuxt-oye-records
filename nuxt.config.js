/* eslint-disable no-unused-vars */
const webpack = require('webpack')
const fetch = require('node-fetch')

global.fetch = fetch

var utils = require('./build/utils')

var apiHost = '\'http://localhost:8000\''

if (!process.env.NODE_ENV && process.env.npm_lifecycle_event !== 'dev') {
  process.env.NODE_ENV = 'production'
}

var setupAPI = function () {
  apiHost = '\'http://localhost:8000\''
  switch (process.env.NODE_ENV) {
    case 'production':
      // apiHost = "'https://oye-records.com'"
      apiHost = '\'https://oye.kolter.it\''
      break
    case 'testing':
      apiHost = '\'https://oye.kolter.it\''
      break
    case 'develop':
    default:
      apiHost = '\'http://localhost:8000\''
      break
  }
}

if (process.env.API_ROOT) {
  apiHost = process.env.API_ROOT
} else {
  setupAPI()
}

let adyenScript = process.env.ADYEN_CSE
  ? process.env.ADYEN_CSE
  : 'https://test.adyen.com/hpp/cse/js/8214959999792925.shtml'
  //
  // : ((process.env.NODE_ENV === 'production')
  //   ? 'https://live.adyen.com/hpp/cse/js/1115135975200408.shtml' : )

module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: 'OYE Records - Webshop',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'Nuxt.js project'},
      {
        hid: 'url',
        property: 'og:url',
        content: apiHost
      },
      {
        hid: 'type',
        property: 'og:type',
        content: 'website'
      },
      {
        hid: 'title',
        property: 'og:title',
        content: 'OYE Records - On your ears'
      },
      {
        hid: 'description',
        property: 'og:description',
        content: 'A is for Afro, B is for Breaks, C is for Cosmic, D is for Disco, E is for Electro, F is for Funk, G is for G-Funk, H is for House, Get it all and more at OYE!'
      }
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {
        href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css',
        rel: 'stylesheet',
        integrity: 'sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M',
        crossorigin: 'anonymous'
      },
      {href: 'https://fonts.googleapis.com/icon?family=Material+Icons', rel: 'stylesheet'}
    ],
    script: [
      {src: adyenScript}
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {color: '#3B8070'},
  /*
   ** Build configuration
   */
  build: {
    /*
     ** Run ESLINT on save
     */
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    loaders: [
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ],
    plugins: [
      new webpack.DefinePlugin({
        __API__: apiHost
      })
    ],
    vendor: ['vue-cookie']
  },
  // modules: [
  //   ['@nuxtjs/google-analytics', { ua: 'UA-100941329-1' }]
  // ],
  plugins: [
    {src: '~plugins/vue-cookie', injectAs: 'cookie'},
    {src: '~plugins/apollo.js', injectAs: 'apolloProvider'},
    {src: '~plugins/vue-resource'},
    {src: '~plugins/vue-social-sharing'},
    {src: '~plugins/ga', ssr: false},
    {src: '~plugins/vue-cookie-law.js', ssr: false}
  ],
  router: {
    middleware: ['check-auth'],
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
  css: [
    {src: '~assets/css/storefront/storefront.scss', lang: 'scss'}
  ],
  devProxy: {
    'localhost:3000/media': 'http://local.oye.com:8000/',
    'localhost:3000/admin': 'http://local.oye.com:8000/',
    'localhost:3000/static': 'http://local.oye.com:8000/',
    'localhost:3000/oye': 'http://local.oye.com:8000/'
  },
  generate: {
    routes: function () {
      let cleanHostUrl = apiHost.replace(/'/g, '')
      // var nextPage = cleanHostUrl + '/oye/api/releases?limit=-1'

      // var generate = function (url) {
      //   axios.get(url)
      //     .then((res) => {
      //       var nextPage = res.data.next
      //       if (nextPage) {
      //         generate(nextPage)
      //       }
      //       return res.data.results.map((release) => {
      //         return '/releases/' + release.slug
      //       })
      //     })
      // }
      // generate(nextPage)karma

      const axios = require('axios')
      return axios.get(cleanHostUrl + '/oye/api/releases?limit=-1')
        .then((res) => {
          return res.data.map((release) => {
            return '/releases/' + release.slug
          })
        })
      // }
    },
    dir: 'test-pkg',
    interval: 1000,
    minify: {
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      decodeEntities: true,
      minifyCSS: false,
      minifyJS: false,
      processConditionalComments: true,
      removeAttributeQuotes: false,
      removeComments: false,
      removeEmptyAttributes: true,
      removeOptionalTags: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: false,
      removeStyleLinkTypeAttributes: false,
      removeTagWhitespace: false,
      sortAttributes: true,
      sortClassName: true,
      trimCustomFragments: true,
      useShortDoctype: true
    }
  }
}
