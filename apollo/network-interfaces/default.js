import { createNetworkInterface } from 'apollo-client'

console.log('api: ' + __API__)

export default ctx => {
  return createNetworkInterface({
    uri: __API__ + '/graphql',
    opts: {
      credentials: 'same-origin'
    }
  })
}
