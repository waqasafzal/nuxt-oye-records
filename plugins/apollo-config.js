import {isUpToDate} from '../utils/jwt'


var apiHost = 'http://localhost:8000'

if (!process.env.NODE_ENV && process.env.npm_lifecycle_event !== 'dev') {
  process.env.NODE_ENV = 'production'
}

var setupAPIHost = function() {
  apiHost = 'http://localhost:8000'
  switch (process.env.NODE_ENV) {
    case 'production':
      // apiHost = "'https://oye-records.com'"
      apiHost = 'https://oye.kolter.it'
      break
    case 'testing':
      apiHost = 'https://oye.kolter.it'
      break
    case 'develop':
    default:
      apiHost = 'http://localhost:8000'
      break
  }
}

setupAPIHost()

export default function(context) {
  return {
    // required
    httpEndpoint: `${apiHost}/graphql`,
    httpLinkOptions: {
      credentials: 'omit'
    },
    tokenName: 'apollo-token',
    validateToken: (jwt) => {
      console.log('validate')
      let exp = jwt['exp']
      if (exp) {
        let expMs = exp * 1000
        let in30Secs = Date.now() + 30 * 1000
        const valid = new Date(expMs) > new Date(in30Secs)
        console.log('valid:', valid)
        return valid
      } else {
        console.log('valid')
        return false
      }
    }
  }
}
