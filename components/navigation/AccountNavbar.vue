<template>
  <div class="navbar__account hidden-sm-down">
    <div class="container">
      <div class="navbar__account__oye">

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
            <span class="cart-label hidden-sm-down">My Cart</span>
            <div class="cart-icon-box">
              <img class="navbar__account__cart__icon"
                   src="../../assets/images/cart.svg" alt="Cart">
            </div>
          </nuxt-link>
          <span :class="['badge', cartCount === undefined ? 'empty': '']">
                <template v-if="cartCount !== undefined">{{ cartCount }}</template>
                <template v-else>0</template>
              </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { logout } from '~/utils/auth'
  import { fetchCart } from '../../components/cart/fetch-cart-mixin'

  export default {
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
