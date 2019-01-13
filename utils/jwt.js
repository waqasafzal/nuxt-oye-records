import jwtDecode from 'jwt-decode'

export const isUpToDate = (jwt) => {
  const exp = jwt['exp']
  if (exp) {
    const expMs = exp * 1000
    const in30Secs = Date.now() + 30 * 1000
    return new Date(expMs) > new Date(in30Secs)
  } else {
    return true
  }
}

export const validateJwtToken = (token) => {
  const decoded = jwtDecode(token)
  if (decoded) {
    return isUpToDate(decoded)
  } else {
    return false
  }
}