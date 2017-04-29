/**
 * Created by tillkolter on 15/03/17.
 */

export const xsBreakpoint = 576
export const smBreakpoint = 768
export const mdBreakpoint = 992
export const lgBreakpoint = 1200

var _getReleaseListColumnNumber
if (process.BROWSER_BUILD) {
  _getReleaseListColumnNumber = function () {
    if (window.innerWidth < xsBreakpoint) {
      return 1
    } else if (window.innerWidth < smBreakpoint) {
      return 3
    } else if (window.innerWidth < mdBreakpoint) {
      return 4
    } else {
      return 6
    }
  }
} else {
  _getReleaseListColumnNumber = function () {
    return 6
  }
}

export const getReleaseListColumnNumber = _getReleaseListColumnNumber
