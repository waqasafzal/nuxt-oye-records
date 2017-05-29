<template>
  <div class="navbar__account hidden-sm-down">
    <div class="container navbar__account-row">
      <div class="navbar__account__oye">
        <div class="ah-link navbar__account__oye__newsletter">
          <nuxt-link to="/">Newsletter</nuxt-link>
        </div>
        <div class="ah-link navbar__oye__faq">
          <nuxt-link to="/">Questions & Help</nuxt-link>
        </div>
      </div>
      <div class="float-right navbar__account__buttons">
        <template v-if="user.authenticated">
          <div class="ah-link">
            <nuxt-link :to="{name: 'account-details'}">Your account</nuxt-link>
          </div>
          <div class="ah-link">
            <nuxt-link to="/" @click.native="logout()">Log out</nuxt-link>
          </div>
        </template>
        <template v-else>
          <div class="ah-link">
            <nuxt-link :to="{name: 'account-signup'}">Register</nuxt-link>
          </div>
          <div class="ah-link">
            <nuxt-link :to="{name: 'account-login'}">Log in</nuxt-link>
          </div>
        </template>
        <!--<div class="navbar__account__cart float-right" v-on:mouseenter="showCart" v-on:mouseleave="hideCart">-->
        <div class="ah-link cart">
          <nuxt-link :class="[isVisibleCart ? 'hover': '']" to="/cart" class="cart-link">
            <span class="cart-label hidden-sm-down">
              <span>My Cart</span>
              <template v-if="cartCount > 0"> ({{ cartCount }})</template>
            </span>
            <div class="cart-icon-box">
              <!--<cart-svg></cart-svg>-->
              <img src="../../assets/images/cart.svg" />
            </div>
          </nuxt-link>
          <span :class="['badge', cartCount === 0 ? 'empty': '']">
              </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { logout } from '~/utils/auth'
  import { fetchCart } from '../../components/cart/fetch-cart-mixin'
  import CartSvg from '../shared/Cart'
  import NuxtLink from '../../.nuxt/components/nuxt-link'

  export default {
    components: {NuxtLink, CartSvg},
    name: 'AccountNavbar',
    props: ['isOpenMobile'],
    mixins: [fetchCart],
    computed: {
      user () {
        return this.$store.state.user
      },
      cartCount () {
        return this.$store.getters.cartItemCount
      }
    },
    data: function () {
      return {
        isVisibleCart: false
      }
    },
    methods: {
      logout: function () {
        logout()
      }
    }
  }
</script>
