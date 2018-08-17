/**
 * Created by tillkolter on 15/03/17.
 */

// export const xsBreakpoint = 576
// export const smBreakpoint = 768
// export const mdBreakpoint = 992
// export const lgBreakpoint = 1200
//
// var _getReleaseListColumnNumber
// if (process.BROWSER_BUILD) {
//   _getReleaseListColumnNumber = function () {
//     let column = 4
//     // if (window.innerWidth < xsBreakpoint) {
//     //   column = 2
//     // } else if (window.innerWidth < smBreakpoint) {
//     //   column = 3
//     // } else if (window.innerWidth < mdBreakpoint) {
//     //   column = 4
//     // }
//     console.log('columnet ' + column)
//     return column
//   }
// } else {
//   _getReleaseListColumnNumber = function () {
//     return 4
//   }
// }

export const getReleaseListColumnNumber = function () {
  return 4
}

const ROWS = 5
export const getPageSize = function () {
  return getReleaseListColumnNumber() * ROWS
}
