/**
 * Created by tillkolter on 19/03/17.
 */

const fetchCart = {
  beforeCreate () {
    const store = this.$store
    return new Promise((resolve, reject) => {
      if (store.state.cart) {
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
