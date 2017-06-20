/**
 * Created by tillkolter on 28/04/17.
 */

import 'babel-polyfill'
import { ApolloClient, createNetworkInterface } from 'apollo-client'
import 'isomorphic-fetch'

let hostUrl = __API__

console.log('hostUrl: ' + hostUrl)

const networkInterface = createNetworkInterface({
  uri: hostUrl + '/graphql',
  transportBatching: true,
  opts: {
    credentials: 'same-origin'
  }
})

var apolloClient = new ApolloClient({
  networkInterface: networkInterface
})

export default apolloClient
