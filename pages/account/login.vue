<template>
  <div class="col-lg-10 offset-lg-1 col-sm-12">
    <div class="row login">
      <div class="col-md-6 login__register">
        <div class="login__register-link">
          <h3>Don't have an account yet?</h3>
          <img src="../../assets/images/pirate_login.png"
               :srcset="`${pirateImages.oneTime} 1x, ${pirateImages.twoTimes} 2x`">
          <nuxt-link :to="{name: 'account-signup'}" class="btn secondary">
            Register
          </nuxt-link>
        </div>
      </div>
      <login-form></login-form>
    </div>
  </div>
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
