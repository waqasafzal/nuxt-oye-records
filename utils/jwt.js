
export const isUpToDate = (jwt) => {
  let exp = jwt['exp']
  if (exp) {
    let expMs = exp * 1000
    let in30Secs = Date.now() + 30 * 1000
    return new Date(expMs) > new Date(in30Secs)
  } else {
    return false
  }
}

export const abc = () => {}