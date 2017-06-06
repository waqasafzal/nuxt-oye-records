export default function ({ store, route, redirect }) {
  if (!store.getters.isAuthenticated) {
    return redirect('/account/login')
  } else {
    var slug = route.params['slug']
    var artists = store.getters.artists
    var doRedirect = true
    if (artists) {
      for (var i = 0; i < artists.length; i++) {
        if (artists[i].slug === slug) {
          doRedirect = false
          break
        }
      }
    }
    if (doRedirect) {
      return redirect('/not-allowed')
    }
  }
}
