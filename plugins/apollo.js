/**
 * Created by tillkolter on 28/04/17.
 */

import 'babel-polyfill'
import { ApolloClient, createNetworkInterface } from 'apollo-client'
import 'isomorphic-fetch'

let hostUrl = __API__

const networkInterface = createNetworkInterface({
  uri: hostUrl + '/graphql',
  transportBatching: true,
  opts: {
    credentials: 'same-origin'
  }
})
//

const apolloClient = new ApolloClient({
  networkInterface: networkInterface
})

export default apolloClient

// export default ({app}) => {
//   app.apolloClient = new ApolloClient({
//     networkInterface: networkInterface
//   })
// }
