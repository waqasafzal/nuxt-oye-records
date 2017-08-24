<template>
  <div class="navbar__account d-sm">
    <div class="container navbar__account-row">
      <div class="navbar__account__oye">
        <div class="ah-link navbar__account__oye__newsletter">
          <nuxt-link to="/">Newsletter</nuxt-link>
        </div>
        <div class="ah-link navbar__oye__faq">
          <nuxt-link :to="{name: 'info'}">Customer Information</nuxt-link>
        </div>
      </div>
      <div class="float-right navbar__account__buttons">
        <template v-if="isAuthenticated">
          <div class="ah-link account-link">
            <nuxt-link :to="{name: 'account-details'}">Your account</nuxt-link>
          </div>
          <div class="ah-link">
            <nuxt-link to="/" @click.native="logout()">Log out</nuxt-link>
          </div>
        </template>
        <template v-else>
          <div class="ah-link account-link">
            <nuxt-link :to="{name: 'account-login'}">Log in</nuxt-link>
          </div>
        </template>
        <div class="ah-link cart">
          <nuxt-link :class="[isVisibleCart ? 'hover': '']" to="/cart" class="cart-link">
            <span class="cart-label d-sm">
              <span>My Cart</span>
              <template v-if="cartCount > 0"> ({{ cartCount }})</template>
            </span>
            <div class="cart-icon-box">
              <cart-svg></cart-svg>
              <span :class="['badge', cartCount === 0 ? 'empty': '']"></span>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { logout } from '~/utils/auth'
  import { fetchCart, fetchUserProfile } from '../../components/cart/fetch-cart-mixin'
  import CartSvg from '../shared/Cart'

  export default {
    components: {CartSvg},
    name: 'AccountNavbar',
    props: ['isOpenMobile'],
    mixins: [fetchCart, fetchUserProfile],
    computed: {
      isAuthenticated () {
        return this.$store.getters.isAuthenticated
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
        logout(this)
      }
    }
  }
</script>

<style lang="scss">
  .account-link {
    justify-content: flex-end;
    padding-right: 12px;
  }
</style>
