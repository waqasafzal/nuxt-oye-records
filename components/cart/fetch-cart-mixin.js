/**
 * Created by tillkolter on 19/03/17.
 */

const fetchCart = {
  mounted () {
    const store = this.$store
    if (!store.getters.getCart) {
      store.dispatch('getCart').catch(e => console.error(e))
    }
  }
}

const fetchUserProfile = {
  mounted () {
    const store = this.$store
    store.dispatch('getProfile').catch(e => console.error(e))
  }
}

export {fetchCart, fetchUserProfile}
