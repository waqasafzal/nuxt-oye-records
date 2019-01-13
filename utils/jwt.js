import jwtDecode from 'jwt-decode'

export const isUpToDate = (jwt) => {
  console.log('sss', jwt)
  const exp = jwt['exp']
  if (exp) {
    const expMs = exp * 1000
    const in30Secs = Date.now() + 30 * 1000
    const isValid = new Date(expMs) > new Date(in30Secs)
    console.log('isUptTodate', isValid)
    return isValid
  } else {
    console.log('isUptTodate, does not exist but yes')
    return true
  }
}

export const validateJwtToken = (token) => {
  const decoded = jwtDecode(token)
  if (decoded) {
    return isUpToDate(decoded)
  } else {
    false
  }
}