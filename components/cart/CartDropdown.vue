<template>

  <div class="container">
    <template v-if="cart && cart.quantity > 0">
      <div id="cart-dropdown-list" :class="['cart-dropdown__list', lines.length <= 2 ? 'overflow': '']">
        <div :class="['row', 'item', line.not_available]" :key="i" v-for="(line, i) in lines">
          <div class="col-md-10">
            <nuxt-link :to="{name: 'release-id-slug', params: {id: line.release.pk, slug: line.release.slug}}">
              <img class="cart-dropdown__image" :src="line.smallImageUrl" :alt="artistName(line.release) + ' ' + line.release.title" />
              <h3>
                <div class="row">
                  <div class="col-10">
                    <span>{{ artistName(line.release) }}</span>
                    <span>{{ line.release.title }}</span>
                  </div>
                  <div class="col-2">
                    <span>x {{ line.quantity }}</span>
                  </div>
                  <div class="col-1">
                    <template v-if="line.notAvailable">
                      (Reserve)
                    </template>
                  </div>
                </div>
              </h3>
            </nuxt-link>
          </div>
          <div class="col-md-2">
            <div class="float-right">
              <h3>{{ line.lineTotal }}</h3>
            </div>
          </div>
        </div>
      </div>
      <div class="row cart-dropdown__total">
        <div class="col-md-10">
          <h3>Subtotal
            <br/>
            <span>(Delivery calculated at checkout)</span></h3>
        </div>
        <div class="col-md-2">
          <h3 :class="['float-md-right', 'price', lines.length <= 2 ? 'single': '']">
            <p>{{ cart.totalAvailable }}</p>
          </h3>
        </div>
      </div>
      <div class="row cart-dropdown__actions">
        <div class="col-md-5 offset-md-1">
          <nuxt-link to="/cart/" class="btn secondary float-md-right">Go to cart</nuxt-link>
        </div>
        <div class="col-md-5">
          <nuxt-link to="/checkout/login" class="btn primary">Checkout</nuxt-link>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="text-md-center cart-dropdown__empty">
        <h3>There are no products in your shopping cart.</h3>
        <img :srcset="`${carts.one} 1x, ${carts.two} 2x`" src="../../assets/images/pirate_cart.png">
        <nuxt-link to="/" class="btn primary">Check out our sales</nuxt-link>
      </div>
    </template>
  </div>
</template>

<script>
  import {fetchCart} from './fetch-cart-mixin'

  const carts = {
    one: require('../../assets/images/pirate_cart.png'),
    two: require('../../assets/images/pirate_cart2x.png')

  }

  export default {
    name: 'CartDropdown',
    mixins: [fetchCart],
    data: function () {
      return {
        quantity: 0
      }
    },
    computed: {
      carts () {
        return carts
      },
      lines () {
        return this.cart.lines
      },
      cart () {
        return this.$store.state.cart
      }
    },
    methods: {
      artistName (release) {
        return (release.artistFirstName + ' ' + release.artistLastName).replace(/^\s+|\s+$/g, '')
      }
    }
  }

</script>
