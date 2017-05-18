
export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export const getCurrentMonth = function () {
  return getMonth(new Date())
}

export const getMonthFromString = function (isoDate) {
  return getMonth(new Date(isoDate))
}

export const getMonth = function (date) {
  let month = date.getMonth()
  return {
    value: month,
    name: monthNames[month]
  }
}
