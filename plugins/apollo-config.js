import {validateJwtToken} from '../utils/jwt'
import {apiHost} from '../config/host'

export default function(context) {
  console.log('context', context)
  return {
    // required
    httpEndpoint: `${apiHost}/graphql`,
    httpLinkOptions: {
      credentials: 'same-origin'
    },
    tokenName: 'apollo-token',
    validateToken: validateJwtToken
  }
}
