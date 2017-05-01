<template>
  <div class="navbar__brand">
    <div class="container">
      <div class="row no-gutters">
        <div class="col-8 col-md-2 navbar__logo">
          <div class="menu-icon-mobile hidden-md-up">
            <img class="navbar__brand__menu-toggle closed open"
                 src="../../assets/images/mobile-bar.svg" v-on:click="toggleMobileNav" v-on-clickaway="closeMobileNav">
            <span>menu</span>
          </div>
          <nuxt-link to="/">
            <img src="../../assets/images/oye-logo.svg" alt="Oye Records"
                 height="50">
          </nuxt-link>
        </div>
        <main-navbar class="col-2 col-md-8"></main-navbar>
        <div class="col-2 col-md-2 navbar__search static">
          <img class="hidden-md-up mobile-search-icon float-right"
               src="../../assets/images/search-icon.svg">
          <form class="form-inline navbar__brand__search"
                action="search/search">
            <div class="mobile-close-search hidden-md-up">
              <img src="../../assets/images/close-icon.svg">
            </div>
            <input class="form-control search-input" type="text" name="q" :value="query">
            <button class="btn btn-link" type="submit">
              <img src="../../assets/images/search-icon.svg">
            </button>
          </form>
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

  Vue.component('cart-dropdown', CartDropdown)

  export default {
    components: {MainNavbar},
    name: 'BrandNavbar',
    mixins: [ clickaway ],
    data: function () {
      return {
        user: {
          is_authenticated: false,
          is_staff: false
        },
        query: '',
        isVisibleCart: false
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
      },
      closeMobileNav () {
        this.$emit('closemenu')
      }
    },
    computed: {
      cartCount () {
        var cart = this.$store.state.cart
        return cart ? cart.quantity : 0
      }
    }
  }
</script>

