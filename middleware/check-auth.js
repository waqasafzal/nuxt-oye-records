import { getUserFromCookie, getUserFromLocalStorage } from '~/utils/auth'

export default function ({ isServer, store, req }) {
  // If nuxt generate, pass this middleware
  if (req) {
    console.log('checkout ' + req.url)
  }
  if (isServer && !req) return
  const loggedUser = isServer ? getUserFromCookie(req) : getUserFromLocalStorage()

  if (loggedUser) {
    console.log('logged user')
    store.commit('SET_USER', loggedUser)
  } else {
    store.commit('SET_USER', {
      user: {
        authenticated: false
      }
    })
  }
}
