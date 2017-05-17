export default function ({ store, router, redirect }) {
  if (!store.getters.isAuthenticated) {
    return redirect('/account/login')
  }
}
