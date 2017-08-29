
export const validateEmail = function (email) {
  // eslint-disable-next-line no-useless-escape
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export const creditCardFormat = function (value) {
  var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  var matches = v.match(/\d{4,16}/g)
  var match = matches && matches[0] || ''
  var parts = []

  for (var i = 0; i < match.length;) {
    parts.push(match.substring(i, i + 4))
    i += 4
  }

  if (parts.length) {
    return parts.join(' ')
  } else {
    return value
  }
}
