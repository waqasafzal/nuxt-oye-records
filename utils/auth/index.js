import Vue from 'vue'
import jwtDecode from 'jwt-decode'
import * as types from '../../store/types'
import {isUpToDate} from '../jwt'

// URL and endpoint constants
const LOGIN_URL = `${__API__}/oye/api-token-auth/`
const LOGOUT_URL = `${__API__}/oye/api-token-logout/`
const SIGNUP_URL = `${__API__}/oye/signup/`
const RESET_URL = `${__API__}/oye/password-reset/`
const CHANGE_PASSWORD_URL = `${__API__}/oye/change-password/`

// User object will let us check authentication status

// Send a request to the login URL and save the returned JWT
export const login = (context, creds, redirect) => {
  const headers = {}
  const cart = context.$cookie.get('cart')
  if (cart) {
    headers['X-CART-TOKEN'] = cart
  }

  context.$axios.post(LOGIN_URL, creds, { headers })
    .then(
      response => {
        let data = response.data
        console.log('Data ' + JSON.stringify(data))
        const tokenExpires = new Date().getTime() + 15 * 60 * 1000
        context.$apolloHelpers.onLogin(data.token, undefined, tokenExpires)

        setToken(data.token, context.$store)
        context.$store.dispatch('getCart')
        context.$store.dispatch('getProfile').then(profile => {
          if (profile && profile.unpaidOrder) {
            context.$store.dispatch('getPaymentOptions', {
              country: profile.shippingAddresses[0].country
            })
          }
        })
        // Redirect to a specified route
        if (redirect) {
          context.$router.push(redirect)
        }
      },
      err => {
        if (err.status === 400) {
          context.$store.dispatch('addAlert', {
            message:
              'Unable to login with the provided credentials. <br/> Please make sure you spelled everything correctly and that your user is confirmed.',
            level: 'error'
          })
        }
      }
    )
}

export const signup = (context, creds, callback) => {
  context.$axios.post(SIGNUP_URL, creds).then(callback, err => {
    context.error = err
  })
}

// To log out, we just need to remove the token
export const logout = function(context, redirect) {
  let headers = {
    Authorization: getAuthHeader(context)
  }
  var cart = context.$cookie.get('cart')
  if (cart) {
    headers['X-CART-TOKEN'] = cart
  }

  context.$axios.post(LOGOUT_URL, {}, { headers: headers }).then(
    response => {
      unsetToken(context)
      context.$store.dispatch('addAlert', {
        message: 'You have been logged out.',
        level: 'info'
      })
    },
    err => {
      context.$store.dispatch('addAlert', {
        message: 'You could not log out correctly. Please try again.',
        level: 'error'
      })
      unsetToken(context)
      console.error('err: ' + err)
    }
  )
  context.$router.push(redirect)
}

// The object to be passed as a header for authenticated requests
export const getAuthHeader = (context) => {
  console.log('getAuthHeader')
  var jwt = Vue.cookie.get('jwt')
  if (jwt) {
    var decoded = jwtDecode(jwt)
    if (decoded) {
      if (isUpToDate(decoded)) {
        return 'JWT ' + jwt
      } else {
        unsetToken(context)
      }
    }
  }
}

export const setToken = (token, store) => {
  if (process.SERVER_BUILD) return
  let decodedToken = jwtDecode(token)
  window.localStorage.setItem('user', JSON.stringify(decodedToken))
  Vue.cookie.set('jwt', token)

  store.dispatch('setUser', {
      user: Object.assign({ authenticated: true }, decodedToken)
    }).then(user => {})
}

export const unsetToken = context => {
  const store = context.$store
  context.$apolloHelpers.onLogout()
  if (process.SERVER_BUILD) return
  window.localStorage.removeItem('user')
  Vue.cookie.delete('jwt')
  store.commit(types.RESET_USER_DATA)
  store.dispatch('getCart')
}

export const getUserFromToken = token => {
  console.log('getUserfromtoken')
  let decoded = jwtDecode(token)
  console.log('decoded', decoded)
  if (isUpToDate(decoded)) {
    return Object.assign({ authenticated: true }, decoded)
  } else {
    return undefined
  }
}

export const getUserFromCookie = req => {
  console.log('getuserfromcookie ')
  if (!req.headers.cookie) return
  const jwtCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith('jwt='))
  if (!jwtCookie) return
  const jwt = jwtCookie.split('=')[1]
  return getUserFromToken(jwt)
}

export const getUserFromLocalStorage = () => {
  const json = window.localStorage.user
  console.log('getUserfromlocalstorage ' + json)
  if (json) {
    var userData = JSON.parse(json)
    if (isUpToDate(userData)) {
      return Object.assign({ authenticated: true }, userData)
    }
  }
  return undefined
}
//
// export const jwtUpToDate = jwt => {
//   console.log('check jwt')
//   console.trace()
//   let exp = jwt['exp']
//   if (exp) {
//     let expMs = exp * 1000
//     let in30Secs = Date.now() + 30 * 1000
//     return new Date(expMs) > new Date(in30Secs)
//   } else {
//     return true
//   }
// }

export const resetEmail = (context, email, callback) => {
  context.$axios.post(RESET_URL, { email: email }).then(callback)
}

export const changePassword = (context, params, callback, errorCallback) => {
  context.$axios
    .post(CHANGE_PASSWORD_URL, params, {
      headers: {
        Authorization: getAuthHeader(context.$store)
      }
    })
    .then(callback)
    .catch(errorCallback)
}
