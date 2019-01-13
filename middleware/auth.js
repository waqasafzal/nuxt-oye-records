import {
  getUserFromCookie, getUserFromLocalStorage,
  getUserFromToken
} from '../utils/auth'

export default function ({ app, store, req }) {
  // If nuxt generate, pass this middleware
  console.log('check-auth')
  const isServer = process.server
  console.log('isServer ' + isServer)
  if (isServer && !req) return
  const token = app.$apolloHelpers.getToken()
  const loggedUser = token && getUserFromToken(token)
  if (loggedUser) {
    store.commit('SET_USER', loggedUser)
  } else {
    store.commit('SET_USER', {
      user: {
        authenticated: false
      }
    })
    console.log('logout')
    app.$apolloHelpers.onLogout()
  }
}
