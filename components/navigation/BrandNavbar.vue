<template>
  <div class="navbar__brand">
    <div class="container navbar__brand-box">
      <div class="row no-gutters">
        <div class="col-2 col-md-1 navbar__logo">
          <nuxt-link :class="[isCheckout ? 'not-active': '']" to="/">
            <img :src="`${oyeLogo}`" alt="Oye Records"
                 height="50">
          </nuxt-link>
        </div>
        <main-navbar class="col-7 col-md-8"></main-navbar>
        <search v-if="!isCheckout" class="col-1 col-md-2 d-md-none"></search>
        <div class="col-1 menu-icon-mobile d-md-none">
          <img class="navbar__brand__menu-toggle closed open"
               src="../../assets/images/mobile-bar.svg" @click="toggleMobileNav" v-on-clickaway="closeMobileNav">
          <!--<span>menu</span>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import CartDropdown from '../../components/cart/CartDropdown.vue'
  import { mixin as clickaway } from 'vue-clickaway'
  import MainNavbar from './MainNavbar'
  import Search from '../search/Search'
  import * as types from '../../store/types'

  Vue.component('cart-dropdown', CartDropdown)

  const oyeLogo = require('../../assets/images/oye_logo.svg')

  export default {
    components: {Search, MainNavbar},
    name: 'BrandNavbar',
    mixins: [ clickaway ],
    data: function () {
      return {
        isVisibleCart: false,
        isVisibleMenu: false,
        oyeLogo: oyeLogo
      }
    },
    methods: {
      showCart () {
        this.isVisibleCart = true
      },
      hideCart () {
        this.isVisibleCart = false
      },
      toggleMobileNav () {
        this.$emit('togglemenu')
        console.log('toggle ' + this.isVisibleMenu)
        this.isVisibleMenu = !this.isVisibleMenu
        this.$store.commit(types.SET_MOBILE_NAV, this.isVisibleMenu)
      },
      closeMobileNav () {
        this.$emit('closemenu')
        this.isVisibleMenu = false
      }
    },
    computed: {
      cartCount () {
        var cart = this.$store.state.getters.getCart
        return cart ? cart.quantity : 0
      },
      isCheckout () {
        return this.$route.name === 'checkout' &&
          this.$store.getters.getCheckoutState &&
          this.$store.getters.getCheckoutState !== 6
      }
    }
  }
</script>
