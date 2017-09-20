<template>
  <div class="navbar__brand">
    <div class="container-fluid">
      <div class="navbar__brand-box">
        <div class="row no-gutters">
          <div class="col-2 col-md-1 navbar__logo">
            <nuxt-link to="/">
              <img :src="`${oyeLogo}`" alt="Oye Records"
                   height="50">
            </nuxt-link>
          </div>
          <main-navbar class="col-8 col-md-9"></main-navbar>
          <search v-if="!isCheckout" class="col-1 col-md-2"></search>
          <div class="col-1 menu-icon-mobile d-md-none">
            <img class="navbar__brand__menu-toggle closed open"
                 src="../../assets/images/mobile-bar.svg" @click="toggleMobileNav">
            <!--<span>menu</span>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import CartDropdown from '../../components/cart/CartDropdown.vue'
  import MainNavbar from './MainNavbar'
  import Search from '../search/Search'
  import * as types from '../../store/types'

  Vue.component('cart-dropdown', CartDropdown)

  const oyeLogo = require('../../assets/images/oye_logo.svg')

  export default {
    components: {Search, MainNavbar},
    name: 'BrandNavbar',
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
        this.$store.commit(types.SET_MOBILE_NAV, !this.isVisibleMenu)
      },
      closeMobileNav () {
        this.$emit('closemenu')
        this.isVisibleMenu = false
        this.$store.commit(types.SET_MOBILE_NAV, false)
      }
    },
    computed: {
      isVisibleMenu () {
        return this.$store.state.showMobile
      },
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
