<template>
  <div class="container-fluid">
    <div class="checkout__content">
      <div class="row login">
        <login-form 
          :register="false" 
          class="checkout__content__col">Login</login-form>
        <div class="col-12 col-md-6 register login__form__panel checkout__content__col">
          <h3>Don't have an account yet?</h3>
          <div class="login__form">
            <nuxt-link 
              :to="{name: 'account-create'}" 
              class="register-btn">
              Register
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '../../components/account/LoginForm'

export default {
  name: 'Login',
  components: { LoginForm }
}
</script>
