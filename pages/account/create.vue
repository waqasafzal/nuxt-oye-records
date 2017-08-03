<template>
  <div class="checkout">
    <div class="checkout__content">
      <div class="row">
        <div class="col-12 login__form__panel account__create__panel">
          <h3>Create an account</h3>
          <create-account-form></create-account-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CreateAccountForm from '../../components/account/CreateAccountForm'
  export default {
    components: {CreateAccountForm}, name: 'CreateAccount'
  }
</script>

<style>
  .account__create__panel {
    max-width: 765px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
