

const getApiHost = () => {
  // override API
  if (process.env.API_ROOT) {
    return process.env.API_ROOT
  }
  switch (process.env.NODE_ENV) {
    case 'production':
      return 'https://oye.kolter.it'
    case 'testing':
      return 'https://oye.kolter.it'
    case 'develop':
    default:
      return 'http://localhost:8000'
  }
}

module.exports = {
  apiHost: getApiHost()
}
