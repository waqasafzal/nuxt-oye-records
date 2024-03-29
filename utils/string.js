
export const capitalizeFirstLetter = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const stripped = function (str) {
  let strippedText = str.substring(0, 120)
  if (strippedText.length === 120) {
    strippedText = strippedText + '...'
  }
  return strippedText
}

export const getMedium = function (format) {
  if (format.includes('"') || format.includes('&quot;') || (format.includes('LP'))) {
    return 'Vinyl'
  }
  return format
}
