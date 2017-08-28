const webpack = require('webpack')
const axios = require('axios')
const fetch = require('node-fetch')
require('karma')

global.fetch = fetch

var utils = require('./build/utils')

var apiHost = "'http://localhost:8000'"

if (!process.env.NODE_ENV && process.env.npm_lifecycle_event !== 'dev') {
  process.env.NODE_ENV = 'production'
}

var setupAPI = function () {
  apiHost = "'http://localhost:8000'"
  switch (process.env.NODE_ENV) {
    case 'production':
      // apiHost = "'https://oye-records.com'"
      apiHost = "'https://oye.kolter.it'"
      break
    case 'testing':
      apiHost = "'https://oye.kolter.it'"
      break
    case 'develop':
    default:
      apiHost = "'http://localhost:8000'"
      break
  }
}

if (process.env.API_ROOT) {
  apiHost = process.env.API_ROOT
} else {
  setupAPI()
}

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
        content: 'OYE Records - The place to put the records on!'
      },
      {
        hid: 'description',
        property: 'og:description',
        content: 'Find you favorite records in a place where the music is the key to your heart'
      }
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {href: 'https://fonts.googleapis.com/icon?family=Material+Icons', rel: 'stylesheet'}
    ],
    script: [
      {src: 'https://test.adyen.com/hpp/cse/js/8214959999792925.shtml'}
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
    // {src: '~plugins/ua', ssr: false, injectAs: 'ua'}
    {src: '~plugins/ga', ssr: false}
  ],
  router: {
    middleware: ['check-auth', 'payment-duty'],
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
  // devProxy: {
  //   'localhost:3000/media': 'http://local.oye.com:8000/',
  //   'localhost:3000/admin': 'http://local.oye.com:8000/',
  //   'localhost:3000/static/admin/css': 'http://local.oye.com:8000/',
  //   'localhost:3000/oye': 'http://local.oye.com:8000/'
  // },
  generate: {
    routes: function () {
      console.log(apiHost)
      let cleanHostUrl = apiHost.replace(/'/g, '')
      var nextPage = cleanHostUrl + '/oye/api/releases?limit=1000'
      //
      // while (nextPage) {
      //
      // }
      return axios.get(nextPage)
        .then((res) => {
          console.log(res)
          return res.data.results.map((release) => {
            return 'releases/' + release.slug
          })
        })
    },
    dir: 'test-pkg',
    interval: 500,
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
