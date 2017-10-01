import { getMonth } from './date'

export const appendCharts = function (oldChartsMap, chartsEdges) {
  let chartsMap = Object.assign({}, oldChartsMap)
  for (var i = 0; i < chartsEdges.length; i++) {
    let chart = chartsEdges[i]
    let parts = chart.node.date.split('.')
    let year = parts[2]
    let date = new Date(
      parseInt(year, 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[0], 10)
    )
    let readableMonth = getMonth(date).name
    let yearCharts = chartsMap[year]
    if (typeof yearCharts === 'undefined') {
      yearCharts = {}
      chartsMap[year] = yearCharts
    }
    let monthCharts = yearCharts[readableMonth]
    if (typeof monthCharts === 'undefined') {
      monthCharts = []
      yearCharts[readableMonth] = monthCharts
    }
    monthCharts.push(chart.node)
  }

  return chartsMap
}

