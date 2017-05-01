/**
 * Created by tillkolter on 19/03/17.
 */

const fetchCart = {
  mounted () {
    const store = this.$store
    return new Promise((resolve, reject) => {
      if (store.state.cart) {
        console.log('fetchCart.resolve')
        resolve()
      } else {
        return store
          .dispatch('getCart')
          .catch(e => console.log(e))
      }
    })
  }
}

export {fetchCart}
