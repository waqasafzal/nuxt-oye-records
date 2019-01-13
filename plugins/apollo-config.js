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

console.log('API HOST ' + apiHost)

export default function(context) {
  return {
    // required
    httpEndpoint: `${apiHost}/graphql`,
    httpLinkOptions: {
      credentials: 'same-origin'
    },
    tokenName: 'apollo-token',
    validateToken: isUpToDate
  }
}
