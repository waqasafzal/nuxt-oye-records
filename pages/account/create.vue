<template>
  <div class="checkout">
    <div :class="['checkout__content', accountCreated ? 'created': '']">
      <div class="row">
        <div :class="['col-12', 'login__form__panel', 'centered-form-panel', accountCreated ? 'created': '']">
          <template v-if="accountCreated">
            <div :class="['col-12', 'login__register', accountCreated ? 'created': '']">
              <h3>Your account has been created.</h3>
              <div class="login__register__instructions">
                To fulfill your registration please check your mailbox and
                follow the confirmation link that we sent you.
              </div>
            </div>
          </template>
          <template v-else>
            <h3>Create an account</h3>
            <create-account-form @account-created="onCreated"></create-account-form>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CreateAccountForm from '../../components/account/CreateAccountForm'
  export default {
    components: {CreateAccountForm},
    name: 'CreateAccount',
    data: function () {
      return {
        accountCreated: false
      }
    },
    methods: {
      onCreated () {
        this.accountCreated = true
      }
    }
  }
</script>

<style>
  .centered-form-panel {
    max-width: 765px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
