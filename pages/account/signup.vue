<template>
  <div class="col-lg-10 offset-lg-1 col-sm-12">
    <div class="row login">
      <template v-if="!accountCreated">
        <div class="col-md-6 login__register">
          <div class="login__register-link">
            <h3>Already have an account?</h3>
            <img class="signup-img" src="../../assets/images/pirate_login.png"
                 :srcset="`${pirateImages.oneTime} 1x, ${pirateImages.twoTimes} 2x`">
            <p>
              <nuxt-link :to="{name: 'account-login'}" class="btn secondary">
                Log in
              </nuxt-link
              >
            </p>
          </div>
        </div>
        <div class="col-md-6 login__form">
          <h3>Create an account</h3>
          <fieldset>
            <div class="form-group">
              <label class="form-control-label" for="id_username">Username*</label>
              <input class="form-control" id="id_username" maxlength="75" name="username" title="" type="text" v-model="credentials.username" required />
            </div>
            <div class="form-group relative">
              <label class="form-control-label" for="id_password">
                Password*
              </label>
              <input class="form-control" id="id_password" name="password" title="" type="password" v-model="credentials.password" required />
              <img class="passIcon" src="../../assets/images/pass-invisible.svg" />
            </div>
            <div class="form-group relative">
              <label class="form-control-label" for="id_email">
                Email*
              </label>
              <input class="form-control" id="id_email" name="email" title="" type="email" v-model="credentials.email" required />
            </div>
          </fieldset>
          <button type="submit" class="btn btn primary" @click="submit()">Create an account</button>
        </div>
      </template>
      <template v-else>
        <div class="col-12 login__register">
          <h3>Your account has been created.</h3>
          <div class="login__register__instructions">
            To fulfill your registration please check your mailbox and
            follow the confirmation link that we sent you.
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import {signup} from '~/utils/auth'

  const pirateImages = {
    oneTime: require('../../assets/images/pirate_login.png'),
    twoTimes: require('../../assets/images/pirate_login2x.png')
  }

  export default {
    name: 'Signup',
    data: function () {
      return {
        pirateImages: pirateImages,
        credentials: {
          username: '',
          password: ''
        },
        accountCreated: false
      }
    },
    methods: {
      submit: function () {
        var credentials = {
          username: this.credentials.username,
          password: this.credentials.password,
          email: this.credentials.email
        }
        signup(this, credentials, response => {
          this.accountCreated = true
        })

        // Leave no trace
        this.credentials.password = ''
        this.credentials.username = ''
        this.credentials.email = ''
      }
    }
  }
</script>
