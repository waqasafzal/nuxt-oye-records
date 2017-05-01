/**
 * Created by tillkolter on 28/04/17.
 */

import 'babel-polyfill'
// import Vue from 'vue'
// import VueApollo from 'vue-apollo'
import { ApolloClient, createNetworkInterface } from 'apollo-client'
import 'isomorphic-fetch'

// Vue.use(VueApollo)

let hostUrl = __API__
console.log(hostUrl)
// let hostUrl = 'http://local.oye.com:8000'

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
// const apolloProvider = new VueApollo({
//   defaultClient: apolloClient
// })

export default apolloClient
