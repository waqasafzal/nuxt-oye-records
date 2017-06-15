/**
 * Created by tillkolter on 28/04/17.
 */

import 'babel-polyfill'
import { ApolloClient, createNetworkInterface } from 'apollo-client'
import 'isomorphic-fetch'
import { getAuthHeader } from '../utils/auth/index'

let hostUrl = __API__

export default ({app, isServer}) => {
  const networkInterface = createNetworkInterface({
    uri: hostUrl + '/graphql',
    transportBatching: true,
    opts: {
      credentials: 'same-origin'
    }
  })

  const apolloClient = new ApolloClient({
    networkInterface: networkInterface
  })

  // if (process.BROWSER_BUILD) {
  networkInterface.use([{
    applyMiddleware (req, next) {
      if (!req.options.headers) {
        req.options.headers = {}  // Create the header object if needed.
      }

      if (!isServer) {
        console.log('Vue.$cookie ' + app.$cookie)
        console.log('Vue.cookie ' + app.cookie)
        var jwt = app.cookie.get('jwt')
        console.log('Vue.cookie correct')

        if (jwt) {
          var header = getAuthHeader()
          if (header) {
            req.options.headers['Authorization'] = header
          }
        }
        var cart = app.cookie.get('cart')
        if (cart) {
          req.options.headers['X-CART-TOKEN'] = cart
        }
      }

      next()
    }
  }])
  // }

  app.apollo = app.$apollo = apolloClient
}
