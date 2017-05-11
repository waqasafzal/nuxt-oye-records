<template>
  <div class="col-md-6 login__form">
    <h3>Log in</h3>
    <!--<form v-on:submit="submit" novalidate>-->
    <!--{% csrf_token %}-->
    <fieldset>
      <div class="form-group">
        <label class="form-control-label" for="id_login">Username</label>
        <input class="form-control" id="id_login" maxlength="75" name="login" title="" type="text" v-model="credentials.login" required />
      </div>
      <div class="form-group relative">
        <label class="form-control-label" for="id_password">
          Password
        </label>
        <input class="form-control" id="id_password" name="password" title="" type="password" v-model="credentials.password" required />
        <img class="passIcon" src="../../assets/images/pass-invisible.svg" />
      </div>
      <!--{% if redirect_field_value %}-->
      <!--<input type="hidden" name="next" name="{{ redirect_field_name }}"-->
      <!--value="{{ redirect_field_value }}"/>-->
      <!--{% endif %}-->
    </fieldset>
    <div class="row login__btn-group">
      <div class="col-sm-12">
        <button class="btn primary" @click="submit">
          Log in
        </button>
        <router-link :to="{name: 'account-reset'}">
          Forgot password?
        </router-link>
      </div>
    </div>
    <!--</form>-->
  </div>
</template>

<script>
  import {login} from '~/utils/auth'
  export default {
    name: 'LoginForm',
    data: function () {
      return {
        credentials: {
          email: '',
          login: '',
          password: ''
        }
      }
    },
    methods: {
      submit: function () {
        var credentials = {
          login: this.credentials.login,
          password: this.credentials.password
        }
        // We need to pass the component's this context
        // to properly make use of http in the auth service
        login(this, credentials, '/')

        // Leave no trace
        this.credentials.password = ''
        this.credentials.login = ''
      }
    }
  }
</script>
