<template>
  <div class="checkout">
    <div class="checkout__content">
      <div class="row">
        <div class="col-12 login__form__panel centered-form-panel">
          <h3>Success</h3>
          <div class="success-summary">
            Congratulations! Your account has been activated and you can continue
            shopping. You can edit your settings in the
            <nuxt-link :to="{name: 'account-details'}">My Account</nuxt-link> section.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { setToken } from '~/utils/auth/index'
  export default {
    name: 'AccountSuccess',
    data: function () {
      return {
        jwtToken: this.$route.params.token
      }
    },
    mounted () {
      var jwtToken = this.jwtToken
      setToken(jwtToken)
    }
  }
</script>
