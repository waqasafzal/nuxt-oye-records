import { createNetworkInterface } from 'apollo-client'

console.log('api: ' + __API__)

export default ctx => {
  const network = createNetworkInterface({
    uri: __API__ + '/graphql',
    opts: {
      credentials: 'same-origin'
    }
  })
  // network.use([
  //   {
  //     applyMiddleware(req, next) {
  //       console.log('apply heasder')
  //       if (!req.options.headers) {
  //         req.options.headers = {} // Create the header object if needed.
  //       }
  //
  //       console.log('sasd')
  //       if (process.client) {
  //         var jwt = Vue.cookie.get('jwt')
  //         var header = null
  //         if (jwt) {
  //           header = getAuthHeader(this.$store)
  //         }
  //         if (header) {
  //           req.options.headers['Authorization'] = header
  //         }
  //         var cart = Vue.cookie.get('cart')
  //         if (cart) {
  //           req.options.headers['X-CART-TOKEN'] = cart
  //         }
  //       }
  //       next()
  //     }
  //   }
  // ])
  // network.useAfter([
  //   {
  //     applyAfterware({ response }, next) {
  //       console.log('action after ....')
  //       if (response.status === 401) {
  //         // TODO error
  //         console.log('errr')
  //       }
  //       next()
  //     }
  //   }
  // ])
  return network
}
