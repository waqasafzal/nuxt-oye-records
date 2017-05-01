import store from '../../store'

// URL and endpoint constants
const LOGIN_URL = __API__ + '/oye/login/'
const SIGNUP_URL = __API__ + '/oye/signup/'

export default {

  // User object will let us check authentication status

  // Send a request to the login URL and save the returned JWT
  login (context, creds, redirect) {
    context.$http.post(LOGIN_URL, creds).then(response => {
      let data = response.data
      localStorage.setItem('token', data.token)

      store.dispatch('setUser', {
        user: {
          authenticated: true
        }
      }).then(user => {
      })

      // Redirect to a specified route
      if (redirect) {
        context.$router.push(redirect)
      }
    }, (err) => {
      context.error = err
    })
  },

  signup (context, creds, redirect) {
    context.$http.post(SIGNUP_URL, creds).then(response => {
      let data = response.data
      localStorage.setItem('token', data.token)

      if (redirect) {
        context.$router.go(redirect)
      }
    }, (err) => {
      context.error = err
    })
  },

  // To log out, we just need to remove the token
  logout () {
    localStorage.removeItem('token')
    store.dispatch('setUser', {
      user: {
        authenticated: false
      }
    }).then(user => {
    })
  },

  checkAuth () {
    var jwt = localStorage.getItem('token')
    var authenticated = false
    if (jwt) {
      authenticated = true
    }
    store.dispatch('setUser', {
      user: {
        authenticated: authenticated
      }
    }).then(user => {
    })
  },

  // The object to be passed as a header for authenticated requests
  getAuthHeader () {
    return {
      'Authorization': 'Token ' + localStorage.getItem('token')
    }
  }
}
