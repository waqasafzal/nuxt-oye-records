
export const roundFixed = function (value, decimalPlaces = 2) {
  return Number(Math.round(value + `e${decimalPlaces}`) + `e-${decimalPlaces}`).toFixed(2)
}

export const getPrice = function (price, {vatExcluded, vatRate}) {
  let parsedPrice = parseFloat(price)
  if (vatExcluded) {
    parsedPrice = parsedPrice * ((100 - vatRate) / 100)
  }
  return roundFixed(parsedPrice, 2)
}
