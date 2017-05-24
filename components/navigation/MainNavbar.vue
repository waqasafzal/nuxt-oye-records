<template>
  <div class="navbar__menu">
    <template v-if="isCheckout">
      <div class="navbar__checkout navigation">
        <div class="checkout__navbar">
          <div class="nav-item active">
            <div class="checkout-state">
              <div class="checkout-num">1</div>
              <div class="checkout-name">Checkout Method</div>
            </div>
          </div>
          <div :class="['nav-item', hasCheckoutMethod ? 'active': '', hasCheckoutMethod ? 'clickable': '']">
            <div class="checkout-state">
              <div class="checkout-num">2</div>
              <div class="checkout-name">Address / Shipping</div>
            </div>
          </div>
          <div :class="['nav-item', hasShipping ? 'active': '', hasShipping ? 'clickable': '']">
            <div class="checkout-state">
              <div class="checkout-num">3</div>
              <div class="checkout-name">Payment</div>
            </div>
          </div>
          <div :class="['nav-item', hasPayment ? 'active': '', hasPayment ? 'clickable': '']">
            <div class="checkout-state">
              <div class="checkout-num">4</div>
              <div class="checkout-name">Order Review</div>
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
  export default {
    name: 'MainNavbar',
    props: ['isOpenMobile'],
    computed: {
      user () {
        return this.$store.state.user
      },
      hasCheckoutMethod () {
        return this.user.authenticated || this.$store.state.checkout.guest
      },
      isCheckout () {
        return this.$route.name === 'checkout'
      },
      hasShipping () {
        return this.user.shippingAddresses && this.user.shippingAddresses.length > 0
      },
      hasPayment () {
        return this.$store.state.paymentMethods && this.$store.state.paymentMethods.length > 0
      },
      isHomeUrl () {
        return this.$route.path === '/'
      }
    }
  }
</script>
