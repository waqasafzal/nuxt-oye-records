/**
 * Created by tillkolter on 19/03/17.
 */

const fetchCart = {
  mounted () {
    const store = this.$store
    if (!store.state.cart) {
      store.dispatch('getCart', {app: this}).catch(e => console.log(e))
    }
  }
}

const fetchUserProfile = {
  mounted () {
    const store = this.$store
    store.dispatch('getProfile', {app: this}).catch(e => console.log(e))
  }
}

export {fetchCart, fetchUserProfile}
