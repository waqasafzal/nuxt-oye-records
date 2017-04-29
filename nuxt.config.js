const webpack = require('webpack')
const fetch = require('node-fetch')
require('karma')

global.fetch = fetch

var utils = require('./build/utils')

var apiHost = "'http://localhost:8000'"

var setupAPI = function () {
  apiHost = "'http://localhost:8000'"
  switch (process.env.NODE_ENV) {
    case 'production':
      apiHost = "'https://oye-records.com'"
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

setupAPI()

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'starter',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },
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
    vendor: ['vue-slider-component'],
    plugins: [
      new webpack.DefinePlugin({
        __API__: apiHost
      })
    ]
  },
  plugins: [
    {
      src: '~plugins/vue-slider-component',
      ssr: false
    },
    { src: '~plugins/apollo.js', injectAs: 'apolloProvider' },
    {src: '~plugins/vue-cookie'}
  ],
  router: {
    middleware: ['apollo'],
    extendRoutes (routes, resolve) {
      routes.push(
        {
          name: 'genre-id-slug',
          path: '/genre/:id-:slug',
          component: resolve(__dirname, 'pages/genres/_id.vue')
        },
        {
          name: 'subgenre-id-slug',
          path: '/genres/:genreId-:slug/:subGenreId-:subSlug',
          component: resolve(__dirname, 'pages/genres/_id.vue')
        },
        {
          name: 'release-id-slug',
          path: '/releases/:id-:slug',
          component: resolve(__dirname, 'pages/releases/_id.vue')
        }
      )
    }
  },
  css: [
    { src: '~assets/css/storefront/storefront.scss', lang: 'scss' }
  ],
  devProxy: {
    'localhost:3000/media': 'http://local.oye.com:8000/',
    'localhost:3000/admin': 'http://local.oye.com:8000/',
    'localhost:3000/static/admin/css': 'http://local.oye.com:8000/'
  },
}
