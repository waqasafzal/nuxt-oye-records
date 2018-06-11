<template>
  <div class="navbar__brand">
    <div class="container-fluid vmargin-auto">
      <div class="navbar__brand-box">
        <div class="row no-gutters">
          <div class="col-2 col-sm-1 navbar__logo">
            <nuxt-link to="/">
              <img :src="`${oyeLogo}`" alt="Oye Records"
                   height="50">
            </nuxt-link>
          </div>
          <div class="col-4 col-lg-9 col-sm-8">
            <main-navbar class="d-none d-lg-block"></main-navbar>
          </div>
          <search class="col-2 col-lg-2 col-sm-1"></search>
          <nuxt-link :to="{name: 'cart'}" class="d-inline-block vmargin-auto d-lg-none col-2 col-sm-1 cart__icon">
            <div class="cart-icon-box d-flex justify-content-center">
              <cart-svg class="vmargin-auto"></cart-svg>
              <span :class="['badge', cartItemCount === 0 ? reservationCount > 0 ? 'reserve': 'empty' : '']"></span>
            </div>
          </nuxt-link>
          <div class="col-2 col-sm-1 menu-icon-mobile d-lg-none">
            <div class="d-flex vmargin-auto" style="margin-left: auto; padding-top: 8px;">
              <div @click.stop="toggleMobileNav" class="burger-menu">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import MainNavbar from './MainNavbar'
  import Search from '../search/Search'
  import * as types from '../../store/types'
  import CartSvg from '../shared/Cart'
  import { mapGetters } from 'vuex'

  const oyeLogo = require('../../assets/images/oye_logo.svg')

  export default {
    components: {CartSvg, Search, MainNavbar},
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
        this.$store.commit(types.SET_MOBILE_NAV, !this.showMobile)
      }
    },
    computed: {
      ...mapGetters(['cartItemCount', 'reservationCount']),
      cartCount () {
        var cart = this.$store.state.getters.getCart
        return cart ? cart.quantity : 0
      },
      isCheckout () {
        return this.$route.name === 'checkout' &&
          this.$store.getters.getCheckoutState &&
          this.$store.getters.getCheckoutState !== 6
      },
      ...mapGetters(['showMobile'])
    }
  }
</script>
