<template>
  <div class="checkout container-fluid">
    <div class="row justify-content-center checkout__content">
      <template v-if="passwordChanged">
        <div class="complete">
          <h2>Your password has been changed!</h2>
          <div class="complete__summary">
            Your password has been changed. Please go to the <nuxt-link :to="{name: 'account-login'}">login</nuxt-link>
            section.<br/>
            You can also <nuxt-link to="/">continue shopping</nuxt-link> and login on checkout.
          </div>
        </div>
      </template>
      <template v-else>
        <div class="col-12 col-md-8 reset-password__panel">
          <h3>Password reset confirmation</h3>
          <div class="description">Please enter your new password twice so we can verify you typed it in correctly.</div>
          <password-reset-form @success="onSuccess"></password-reset-form>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import PasswordResetForm from '../components/account/PasswordResetForm'
  export default {
    components: {PasswordResetForm},
    name: 'ChangeResetPassword',
    data: function () {
      return {
        passwordChanged: false
      }
    },
    methods: {
      onSuccess () {
        this.passwordChanged = true
      }
    }
  }
</script>
