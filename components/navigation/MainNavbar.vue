<template>
  <div :class="['navbar__menu', $store.getters.hasMobileMenu ? 'mobile': '']">
    <template v-if="!$store.getters.hasMobileMenu && isCheckout">
      <div class="navbar__checkout navigation">
        <div class="checkout__navbar">
          <div :class="['nav-item', 'active', canSelectCheckout ? 'clickable': '']">
            <div class="checkout-state">
              <div class="checkout-num" @click="setCheckoutState(1)">1</div>
              <div class="checkout-name" @click="setCheckoutState(1)">Checkout Method</div>
            </div>
          </div>
          <div :class="['nav-item', checkoutState > 1 ? 'active': '', hasCheckoutMethod ? 'clickable': '']">
            <div class="checkout-state">
              <div class="checkout-num" @click="setCheckoutState(2)">2</div>
              <div class="checkout-name" @click="setCheckoutState(2)">Address / Shipping</div>
            </div>
          </div>
          <div :class="['nav-item', checkoutState > 2 ? 'active': '', hasShipping ? 'clickable': '']">
            <div class="checkout-state">
              <div class="checkout-num" @click="setCheckoutState(3)">3</div>
              <div class="checkout-name" @click="setCheckoutState(3)">Payment</div>
            </div>
          </div>
          <div :class="['nav-item', checkoutState > 3 ? 'active': '', hasPayment ? 'clickable': '']">
            <div class="checkout-state">
              <div class="checkout-num" @click="setCheckoutState(4)">4</div>
              <div class="checkout-name" @click="setCheckoutState(4)">Order Review</div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <nav v-on-clickaway="onClick" @click="onClick" v-if="!$store.getters.hasMobileMenu || $store.state.showMobile" :class="['navigation']">
        <ul :class="['nav', 'navbar-nav', isHomeUrl ? 'no-border' : '']">
          <li class="nav-item" v-if="$store.getters.hasMobileMenu">
            <nuxt-link class="nav-link" to="/" exact>Home</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" :to="{name: 'releases-new'}">New Releases</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" :to="{name: 'genres'}">Genres</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" :to="{name: 'releases-upcoming'}">Upcoming</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" :to="{name: 'charts'}">Charts</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" :to="{name: 'releases-used'}">Second Hand</nuxt-link>
          </li>
        </ul>
      </nav>
    </template>
  </div>
</template>

<script>
  import { mixin as clickaway } from 'vue-clickaway'

  import * as types from '../../store/types'
  export default {
    name: 'MainNavbar',
    mixins: [ clickaway ],
    computed: {
      user () {
        return this.$store.state.user
      },
      canSelectCheckout () {
        return this.$store.state.checkout.guest
      },
      hasCheckoutMethod () {
        return this.user.authenticated || this.$store.state.checkout.guest
      },
      isCheckout () {
        return this.$route.name === 'checkout'
      },
      hasShipping () {
        return this.$store.getters.isShippingAddressConfirmed
      },
      hasPayment () {
        return this.$store.getters.isPaymentOptionConfirmed
      },
      isHomeUrl () {
        return this.$route.path === '/'
      },
      checkoutState () {
        return this.$store.getters.getCheckoutState
      }
    },
    methods: {
      onClick (value) {
        console.log('v')
        this.$store.commit(types.SET_MOBILE_NAV, false)
      },
      setCheckoutState (value) {
        if (value === 1 && !this.canSelectCheckout) {
          // do nothing
          return
        }
        if (value <= this.$store.getters.getMaximumCheckoutState) {
          this.$store.commit(types.SET_CURRENT_CHECKOUT_STATE, value)
        }
      }
    },
    mounted () {
    }
  }
</script>
