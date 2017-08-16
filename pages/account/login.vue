<template>
  <!--<div class="col-lg-10 offset-lg-1 col-sm-12">-->
  <!--<div class="checkout">-->
    <div class="checkout__content">
      <div class="row login">
        <login-form class="checkout__content__col" :register="false">Login</login-form>
        <div class="col-12 col-md-6 register login__form__panel checkout__content__col">
          <h3>Don't have an account yet?</h3>
          <div class="login__form">
            <nuxt-link class="register-btn" :to="{name: 'account-create'}">
              Register
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  <!--</div>-->
  <!--</div>-->
</template>

<script>
  import LoginForm from '../../components/account/LoginForm'

  const pirateImages = {
    oneTime: require('../../assets/images/pirate_login.png'),
    twoTimes: require('../../assets/images/pirate_login2x.png')
  }

  export default {
    components: {LoginForm},
    name: 'Login',
    data: function () {
      return {
        pirateImages: pirateImages
      }
    }
  }

</script>
