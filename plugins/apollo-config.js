import {validateJwtToken} from '../utils/jwt'
import {apiHost} from '../config/host'

export default function(context) {
  return {
    httpEndpoint: `${apiHost}/graphql`,
    httpLinkOptions: {
      credentials: 'same-origin'
    },
    validateToken: validateJwtToken
  }
}
