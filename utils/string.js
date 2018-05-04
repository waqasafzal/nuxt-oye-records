
export const capitalizeFirstLetter = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const stripped = function (str) {
  let strippedText = str.substring(0, 200)
  if (strippedText.length === 200) {
    strippedText = strippedText + '...'
  }
  return strippedText
}

export const getMedium = function (format) {
  if (format.includes('"')) {
    return 'Vinyl'
  }
  return format
}
