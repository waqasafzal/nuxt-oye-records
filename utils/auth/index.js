import Vue from 'vue'
import store from '../../store'
import jwtDecode from 'jwt-decode'
import * as types from '../../store/types'

// URL and endpoint constants
const LOGIN_URL = __API__ + '/oye/api-token-auth/'
const SIGNUP_URL = __API__ + '/oye/signup/'

// User object will let us check authentication status

// Send a request to the login URL and save the returned JWT
export const login = (context, creds, redirect) => {
  context.$http.post(LOGIN_URL, creds).then(response => {
    let data = response.data
    setToken(data.token)
    context.$store.dispatch('getCart')

    // Redirect to a specified route
    if (redirect) {
      context.$router.push(redirect)
    }
  }, err => {
    context.$store.dispatch('addAlert', {
      message: 'You did enter the wrong credentials',
      level: 'error'
    })
    console.log('err: ' + err)
  })
}

export const signup = (context, creds, redirect) => {
  context.$http.post(SIGNUP_URL, creds).then(response => {
    let data = response.data
    localStorage.setItem('token', data.token)

    if (redirect) {
      context.$router.go(redirect)
    }
  }, (err) => {
    context.error = err
  })
}

// To log out, we just need to remove the token
export const logout = function () {
  unsetToken()
}

// The object to be passed as a header for authenticated requests
export const getAuthHeader = () => {
  var jwt = Vue.cookie.get('jwt')
  if (jwt) {
    var decoded = jwtDecode(jwt)
    if (decoded) {
      if (jwtUpToDate(decoded)) {
        return 'JWT ' + localStorage.getItem('token')
      } else {
        unsetToken()
      }
    }
  }
}

export const setToken = (token) => {
  if (process.SERVER_BUILD) return
  window.localStorage.setItem('token', token)
  let decodedToken = jwtDecode(token)
  window.localStorage.setItem('user', JSON.stringify(decodedToken))
  Vue.cookie.set('jwt', token)

  store.dispatch('setUser', {
    user: Object.assign({authenticated: true}, decodedToken)
  }).then(user => {
  })
}

export const unsetToken = () => {
  if (process.SERVER_BUILD) return
  window.localStorage.removeItem('token')
  window.localStorage.removeItem('user')
  Vue.cookie.delete('jwt')
  store.dispatch('setUser', {
    user: {
      authenticated: false
    }
  })
  store.commit(types.SET_CART, null)
}

export const getUserFromCookie = (req) => {
  if (!req.headers.cookie) return
  const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='))
  if (!jwtCookie) return
  const jwt = jwtCookie.split('=')[1]
  let decoded = jwtDecode(jwt)
  if (jwtUpToDate(decoded)) {
    return Object.assign({authenticated: true}, decoded)
  } else {
    return undefined
  }
}

export const getUserFromLocalStorage = () => {
  const json = window.localStorage.user
  if (json) {
    var userData = JSON.parse(json)
    if (jwtUpToDate(userData)) {
      return Object.assign({authenticated: true}, userData)
    }
  }
  return undefined
}

export const jwtUpToDate = (jwt) => {
  let expMs = jwt['exp'] * 1000
  let in30Secs = Date.now() + 30 * 1000
  return new Date(expMs) > new Date(in30Secs)
}
