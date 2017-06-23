<template>
  <div class="col-lg-10 offset-lg-1 col-sm-12">
    <div class="row login">
      <login-form class="offset-md-6"></login-form>
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
