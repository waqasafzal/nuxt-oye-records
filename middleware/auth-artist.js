export default function ({ store, route, redirect }) {
  if (!store.getters.isAuthenticated) {
    return redirect('/account/login')
  } else {
    var slug = route.params['slug']
    console.log('slug ' + slug)
    var artists = store.getters.artists
    var doRedirect = true
    console.log('artists ' + artists)
    if (artists) {
      for (var i = 0; i < artists.length; i++) {
        console.log('artist slug ' + artists[i].slug)
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
