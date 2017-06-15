import { ApolloClient, createNetworkInterface } from 'apollo-client'
let hostUrl = __API__

var networkInterface = createNetworkInterface({
  uri: hostUrl + '/graphql',
  transportBatching: true,
  opts: {
    credentials: 'same-origin'
  }
})

const apolloClient = new ApolloClient({
  networkInterface: networkInterface
})

export default apolloClient
