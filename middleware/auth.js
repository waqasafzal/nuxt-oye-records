import {
  getUserFromCookie, getUserFromLocalStorage,
  getUserFromToken
} from '../utils/auth'

export default function ({ app, store, req }) {
  // If nuxt generate, pass this middleware
  const isServer = process.server
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
    app.$apolloHelpers.onLogout()
  }
}
