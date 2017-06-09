
export const roundFixed = function (value, decimalPlaces = 2) {
  return Number(Math.round(value + `e${decimalPlaces}`) + `e-${decimalPlaces}`).toFixed(2)
}
