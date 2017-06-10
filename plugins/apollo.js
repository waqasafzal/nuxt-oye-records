/**
 * Created by tillkolter on 28/04/17.
 */

// import Vue from 'vue'
import 'babel-polyfill'
import { ApolloClient, createNetworkInterface } from 'apollo-client'
import 'isomorphic-fetch'
// import { getAuthHeader } from '../utils/auth/index'

let hostUrl = __API__

const networkInterface = createNetworkInterface({
  uri: hostUrl + '/graphql',
  transportBatching: true,
  opts: {
    credentials: 'same-origin'
  }
})

// if (process.BROWSER) {
// networkInterface.use([{
//   applyMiddleware (req, next) {
//     console.log('applyMiddleware...')
//
//     let cookie = Vue.cookie
//     if (typeof cookie === 'undefined') {
//       console.log('Vue.cookie does not exist')
//     } else {
//       if (!req.options.headers) {
//         req.options.headers = {}  // Create the header object if needed.
//       }
//
//       var jwt = cookie.get('jwt')
//
//       console.log('jwt ' + jwt)
//       if (jwt) {
//         var header = getAuthHeader()
//         if (header) {
//           console.log(`set apollo auth header ${header}`)
//           req.options.headers['Authorization'] = header
//         } else {
//           console.log('no headers')
//         }
//       }
//       var cart = cookie.get('cart')
//       if (cart) {
//         req.options.headers['X-CART-TOKEN'] = cart
//       }
//     }
//     next()
//   }
// }])
// }

var apolloClient = new ApolloClient({
  networkInterface: networkInterface
})
//
// apolloClient.use([{
//   applyMiddleware (req, next) {
//     if (!req.options.headers) {
//       req.options.headers = {}  // Create the header object if needed.
//     }
//
//     var jwt = Vue.cookie.get('jwt')
//     if (jwt) {
//       console.log('jwt exists')
//       var header = getAuthHeader()
//       if (header) {
//         console.log(`set apollo auth header ${header}`)
//         req.options.headers['Authorization'] = header
//       }
//     } else {
//       console.log('jwt does not exist')
//     }
//     var cart = Vue.cookie.get('cart')
//     if (cart) {
//       req.options.headers['X-CART-TOKEN'] = cart
//     }
//     next()
//   }
// }])

export default apolloClient
