<template>
  <div>
    <div class="page__header">Cart</div>
    <div class="cart">
      <template v-if="cart && cart.lines">
        <div class="cart__table-header hidden-sm-down">
          <div class="row">
            <div class="col-md-5">
              <h5>Release</h5>
            </div>
            <div class="col-md-2 text-right">
              <h5>Price</h5>
            </div>
            <div class="col-md-1"></div>
            <div class="col-md-1">
              <h5>Quantity</h5>
            </div>
            <div class="col-md-2 text-right">
              <h5>Total</h5>
            </div>
          </div>
        </div>
        <div :class="['cart__line', i === (cart.lines.length - 1) ? 'last' : '']" :key="i"
             v-for="(line, i) in cart.lines">
          <div class="row">
            <div class="col-5 cart__line__product">
              <nuxt-link
                  :to="{name: 'releases-slug', params: {'id': line.release.pk, 'slug': line.release.slug}}">
                <img :src="line.smallImageUrl" alt=""/>
                <div class="cart__line__product__info">
                  <div class="release__name">{{ line.release.artistFirstName }} {{ line.release.artistLastName }}</div>
                  <div class="release__title">{{ line.release.title }}</div>
                  <div class="release__shipping">
                    <template v-if="!line.preorder">
                      Ready for shipping

                    </template>
                    <template v-else>
                      Shipping as soon as possible

                    </template>
                  </div>
                </div>
              </nuxt-link>
            </div>
            <div class="col-2 cart__line__cell">
              <release-price class="cart-cell-center flex-align-right" :price="line.release.price"></release-price>
            </div>
            <div class="col-1"></div>
            <div class="col-1 cart__line__cell">
              <div class="cart__line__quantity cart-cell-center">
                <form class="form-cart">
                  <div :class="[line.quantity.errors ? 'has-error': '']" tabindex="-1">
                    <input id="id_quantity" max="50" min="0" type="number"
                           v-on:change.prevent="onChange($event, line)" :value="line.quantity" required>
                  </div>
                </form>
              </div>
            </div>
            <div class="col-2 cart__line__cell">
              <p class="flex-align-right cart-cell-center">
                <release-price :price="line.release.price"></release-price>
              </p>
            </div>
            <div class="cart-item-delete col-1 cart__line__cell">
              <div class="flex-align-right cart-cell-center" @click="onDelete(line)">&times;</div>
            </div>
          </div>
        </div>
        <div class="row cart__subtotal">
          <div class="col-8"></div>
          <div class="col-2 cart__total__subtotal cart__line__cell">
            <h4 class="cart-cell-center">Subtotal</h4>
          </div>
          <div class="col-1 cart__line__cell">
            <h4 class="flex-align-right cart-cell-center text-right">{{ cart.totalAvailableNet }} &euro;</h4>
          </div>
        </div>
        <div class="row cart__total">
          <div class="col-8"></div>
          <div class="col-2 cart__line__cell">
            <h4 class="cart-cell-center">Total</h4>
          </div>
          <div class="col-1 cart__line__cell">
            <h4 class="flex-align-right cart-cell-center text-right"><b>{{ cart.totalAvailable }} &euro;</b></h4>
          </div>
        </div>
        <div class="cart__bottom-bar row">
          <div class="col-8">
            <nuxt-link class="cart__continue-button" to="/">
              <div>
                <span class="helper"></span>
                <img src="../assets/images/arrow_right_green.svg" class="arrow-rotated"/>Continue shopping
              </div>
            </nuxt-link>
          </div>
          <div class="col-4">
            <nuxt-link to="/checkout/login">
              <div class="cart__checkout-button">
                <span>Go to checkout</span>
              </div>
            </nuxt-link>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="cart__empty">
          <img src="../assets/images/pirate_cart.png"
               :srcset="`${cartPictures.one} 1x, ${cartPictures.two} 2x`">
          <h2>There are no products in your shopping cart.</h2>
          <a href="/" class="btn primary">Check out our sales</a>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import ReleasePrice from '../components/releases/ReleasePrice'

  const cartPictures = {
    one: require('~assets/images/pirate_cart.png'),
    two: require('~assets/images/pirate_cart2x.png')
  }

  export default {
    components: {ReleasePrice},
    name: 'CartPage',
    computed: {
      cartPictures () {
        return cartPictures
      },
      cart () {
        return this.$store.state.cart
      },
      cartUpdating () {
        return this.$store.state.cartUpdating
      }
    },
    methods: {
      onChange: function (e, line) {
        let targetValue = parseInt(e.target.value)
        let quantity = line.quantity
        if (targetValue !== quantity) {
          this.$store.dispatch('updateCart', {
            release: line.release,
            preorder: line.preorder,
            // line.quantity is not trustworthy since the value is not changed at the fist call
            quantity: targetValue
          })
        }
      },
      onDelete: function (line) {
        this.$store.dispatch('removeCartLine', {
          pk: line.release.pk,
          preorder: line.preorder
        })
      }
    }
  }

</script>
