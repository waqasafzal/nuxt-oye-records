<template>
  <div class="row checkout__content checkout__method">
      <login-form redirect="#" class="checkout__content__col"></login-form>
      <div class="col-12 col-md-6 login__form__panel checkout__content__col">
        <h3 class="checkout-box__header">Checkout as guest</h3>
        <div class="login__form">
          <proceed-button class="guest-btn" @click="setGuestCheckout">Continue as guest</proceed-button>
        </div>
      </div>
    </div>
</template>

<script>
  import LoginForm from '../account/LoginForm'
  import * as types from '~/store/types'
  import ProceedButton from '../shared/ProceedButton'
  export default {
    components: {ProceedButton, LoginForm},
    name: 'CheckoutMethod',
    methods: {
      setGuestCheckout () {
        this.$store.commit(types.SET_GUEST_CHECKOUT)
      }
    }
  }
</script>

<style>
  .guest-btn {
    margin-top: auto;
    height: 56px;
    line-height: 56px;
  }
</style>
