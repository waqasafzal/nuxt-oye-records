
export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export const getCurrentMonth = function () {
  var d = new Date()
  let month = d.getMonth()
  return {
    value: month,
    name: monthNames[month]
  }
}
