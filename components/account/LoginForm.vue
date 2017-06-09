<template>
  <div class="col-md-6 login__form__panel">
    <h3>I already have an account</h3>
    <form ref="login" id="login" class="login__form" method="post" @submit.prevent="submit" autocomplete="off">
      <fieldset>
        <div class="form-group">
          <input class="form-control"
                 id="id_login"
                 maxlength="75"
                 name="username"
                 type="text"
                 v-model="credentials.login"
                 placeholder="Username"
                 required/>
        </div>
        <div class="form-group relative">
          <template v-if="passwordVisible">
            <!--suppress XmlDuplicatedId -->
            <input class="form-control password"
                   id="id_password"
                   name="password"
                   type="text"
                   v-model="credentials.password"
                   placeholder="Password"
                   autocomplete="off"
                   required/>
          </template>
          <template v-else>
            <!--suppress XmlDuplicatedId -->
            <input class="form-control password"
                   id="id_password"
                   name="password"
                   type="password"
                   v-model="credentials.password"
                   placeholder="Password"
                   required/>
          </template>
          <img @click="togglePasswordVisible" class="passIcon" src="../../assets/images/pass-invisible.svg"/>
        </div>
      </fieldset>
      <div>
        <proceed-button type="submit" form="login" class="btn primary">Login</proceed-button>
      </div>
    </form>
    <nuxt-link :to="{name: 'account-reset'}">
      Lost your password?
    </nuxt-link>
  </div>
</template>

<script>
  import { login } from '~/utils/auth'
  import ProceedButton from '../shared/ProceedButton'
  export default {
    components: {ProceedButton},
    name: 'LoginForm',
    props: {
      redirect: {
        type: String,
        default: '/account/details'
      }
    },
    data: function () {
      return {
        credentials: {
          email: '',
          login: '',
          password: ''
        },
        passwordVisible: false
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
        login(this, credentials, this.redirect === '#' ? null : this.redirect)
      },
      togglePasswordVisible () {
        this.passwordVisible = !this.passwordVisible
      }
    }
  }
</script>
