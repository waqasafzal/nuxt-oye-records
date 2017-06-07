<template>
  <div class="navbar__menu">
    <template v-if="isCheckout">
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
      <nav :class="['navigation', isOpenMobile ? 'open': '']">
        <ul :class="['nav', 'navbar-nav', isHomeUrl ? 'no-border' : '']">
          <li class="nav-item">
            <nuxt-link class="nav-link" :to="{name: 'releases-new'}">New Releases</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/genres">Genres</nuxt-link>
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
  import * as types from '../../store/types'
  export default {
    name: 'MainNavbar',
    props: ['isOpenMobile'],
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
        return this.$store.state.shippingAddressConfirmed
      },
      hasPayment () {
        return this.$store.state.paymentOptionConfirmed
      },
      isHomeUrl () {
        return this.$route.path === '/'
      },
      checkoutState () {
        return this.$store.getters.getCheckoutState
      }
    },
    methods: {
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
