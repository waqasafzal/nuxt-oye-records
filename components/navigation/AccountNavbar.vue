<template>
  <div class="navbar__account hidden-sm-down">
    <div class="container">
      <div class="row">
        <div class="col-6">
          <p class="text-left">HEADER TEXT</p>
        </div>
        <div class="col-6">
          <ul class="float-right">
            <template v-if="user.authenticated">
              <li>
                <nuxt-link :to="{name: 'account-details'}">Your account</nuxt-link>
              </li>
              <li>
                <nuxt-link to="/" @click.native="logout()">Log out</nuxt-link>
              </li>
            </template>
            <template v-else>
              <li>
                <nuxt-link :to="{name: 'account-signup'}">Register</nuxt-link>
              </li>
              <li>
                <nuxt-link :to="{name: 'account-login'}">Log in</nuxt-link>
              </li>
            </template>
            <!--<div class="navbar__account__cart float-right" v-on:mouseenter="showCart" v-on:mouseleave="hideCart">-->
            <li>
              <nuxt-link :class="['cart__icon', isVisibleCart ? 'hover': '']" to="/cart">
                <span class="cart-label hidden-sm-down">Your Cart</span>
                <img class="navbar__account__cart__icon"
                     src="../../assets/images/cart.svg" alt="Cart">
                <span :class="['badge', cartCount === undefined ? 'empty': '']">
                  <template v-if="cartCount !== undefined">{{ cartCount }}</template>
                  <template v-else>0</template>
                </span>
              </nuxt-link>
              <div :class="['cart-dropdown', 'hidden-md-down', isVisibleCart ? 'show': '']">
                <cart-dropdown></cart-dropdown>
              </div>
            </li>
            <!--</div>-->
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {logout} from '~/utils/auth'
  import {fetchCart} from '../../components/cart/fetch-cart-mixin'

  export default {
    name: 'AccountNavbar',
    props: ['isOpenMobile'],
    mixins: [fetchCart],
    computed: {
      user: function () {
        return this.$store.state.user
      }
    },
    data: function () {
      return {
        cartCount: 0,
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
