/**
 * Created by tillkolter on 28/04/17.
 */

// import Vue from 'vue'
import 'babel-polyfill'
import { ApolloClient, createNetworkInterface } from 'apollo-client'
import 'isomorphic-fetch'

let hostUrl = __API__

let networkInterface = createNetworkInterface({
  uri: hostUrl + '/graphql',
  transportBatching: true,
  opts: {
    credentials: 'same-origin'
  }
})

const apolloClient = new ApolloClient({
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
