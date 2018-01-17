import Vue from 'vue'
import store from '../../store'
import jwtDecode from 'jwt-decode'
import * as types from '../../store/types'

// URL and endpoint constants
const LOGIN_URL = __API__ + '/oye/api-token-auth/'
const LOGOUT_URL = __API__ + '/oye/api-token-logout/'
const SIGNUP_URL = __API__ + '/oye/signup/'
const RESET_URL = __API__ + '/oye/password-reset/'
const CHANGE_PASSWORD_URL = __API__ + '/oye/change-password/'

// User object will let us check authentication status

// Send a request to the login URL and save the returned JWT
export const login = (context, creds, redirect) => {
  let headers = {}
  var cart = context.$cookie.get('cart')
  if (cart) {
    headers['X-CART-TOKEN'] = cart
  }

  context.$http.post(LOGIN_URL, creds, {
    headers: headers
  }).then(response => {
    let data = response.data
    setToken(data.token)
    context.$store.dispatch('getCart')
    context.$store.dispatch('getProfile').then(
      (profile) => {
        if (profile.unpaidOrder) {
          context.$store.dispatch('getPaymentOptions', {country: profile.shippingAddresses[0].country})
          context.$router.push({name: 'checkout'})
        }
      }
    )
    // Redirect to a specified route
    if (redirect) {
      context.$router.push(redirect)
    }
  }, err => {
    if (err.status === 400) {
      context.$store.dispatch('addAlert', {
        message: 'Unable to login with the provided credentials. <br/> Please make sure you spelled everything correctly and that your user is confirmed.',
        level: 'error'
      })
    }
  })
}

export const signup = (context, creds, callback) => {
  context.$http.post(SIGNUP_URL, creds).then(callback, (err) => {
    context.error = err
  })
}

// To log out, we just need to remove the token
export const logout = function (context, redirect) {
  let headers = {
    Authorization: getAuthHeader()
  }
  var cart = context.$cookie.get('cart')
  if (cart) {
    headers['X-CART-TOKEN'] = cart
  }

  context.$http.post(LOGOUT_URL, {}, {headers: headers}).then(response => {
    unsetToken()
    context.$store.dispatch('addAlert', {
      message: 'You have been logged out.',
      level: 'info'
    })
  }, err => {
    context.$store.dispatch('addAlert', {
      message: 'You could not log out correctly. Please try again.',
      level: 'error'
    })
    unsetToken()
    console.error('err: ' + err)
  })
  context.$router.push(redirect)
}

// The object to be passed as a header for authenticated requests
export const getAuthHeader = () => {
  var jwt = Vue.cookie.get('jwt')
  if (jwt) {
    var decoded = jwtDecode(jwt)
    if (decoded) {
      if (jwtUpToDate(decoded)) {
        return 'JWT ' + jwt
      } else {
        unsetToken()
      }
    }
  }
}

export const setToken = (token) => {
  if (process.SERVER_BUILD) return
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
  window.localStorage.removeItem('user')
  Vue.cookie.delete('jwt')
  store.commit(types.RESET_USER_DATA)
  store.dispatch('getCart')
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
  let exp = jwt['exp']
  if (exp) {
    let expMs = exp * 1000
    let in30Secs = Date.now() + 30 * 1000
    return new Date(expMs) > new Date(in30Secs)
  } else {
    return true
  }
}

export const resetEmail = (context, email, callback) => {
  context.$http.post(RESET_URL, {email: email}).then(callback)
}

export const changePassword = (context, params, callback, errorCallback) => {
  context.$http.post(
    CHANGE_PASSWORD_URL,
    params,
    {headers: {
      'Authorization': getAuthHeader()
    }}
  ).then(callback).catch(errorCallback)
}
