import { getUserFromCookie, getUserFromLocalStorage } from '../utils/auth'

export default function ({ store, req }) {
  // If nuxt generate, pass this middleware
  console.log('check-auth')
  const isServer = process.server
  console.log('isServer ' + isServer)
  if (isServer && !req) return
  const loggedUser = isServer ? getUserFromCookie(req) : getUserFromLocalStorage()

  if (loggedUser) {
    store.commit('SET_USER', loggedUser)
  } else {
    store.commit('SET_USER', {
      user: {
        authenticated: false
      }
    })
  }
}
