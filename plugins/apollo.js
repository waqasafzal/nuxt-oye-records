/**
 * Created by tillkolter on 28/04/17.
 */

import 'babel-polyfill'
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { ApolloClient, createNetworkInterface } from 'apollo-client'

Vue.use(VueApollo)

let hostUrl = __API__
// let hostUrl = 'http://local.oye.com:8000'

const apolloClient = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: hostUrl + '/graphql',
    transportBatching: true,
    opts: {
      credentials: 'same-origin'
    }
  })
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

export default apolloProvider
