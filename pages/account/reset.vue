<template>
  <div class="checkout container-fluid">
    <div class="checkout__content row">
      <div class="checkout__content__col col-12">
        <div class="row justify-content-center">
          <template v-if="!emailSent">
            <div class="col-8 reset-password__panel">
              <h3>Forgot your password?</h3>
              <div class="description">Please enter your email on the form below</div>
              <form @submit.prevent="onResetPassword">
                <fieldset>
                  <div class="form-group">
                    <div :class="['form-group-item', 'input-validation']">
                      <input class="form-control"
                             type="email"
                             placeholder="E-Mail Address *"
                             v-model="email"
                             required>
                    </div>
                  </div>
                </fieldset>
              </form>
              <button type="submit" class="btn primary">Reset My Password</button>
            </div>
          </template>
          <template v-else>
            <div class="col-8">
              <h3>Email sent</h3>
              <div>We sent a link to <span class="green"><strong>{{email}}</strong></span> to reset your password.</div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { resetEmail } from '../../utils/auth/index'
  export default {
    name: 'ResetPassword',
    data: function () {
      return {
        email: '',
        emailSent: false
      }
    },
    methods: {
      onResetPassword () {
        let vm = this
        this.$store.dispatch('emailValidation', {email: this.email}).then(
          isValid => {
            if (isValid) {
              resetEmail(this, this.email, () => {
                vm.emailSent = true
                this.$store.dispatch('addAlert', {
                  message: `An email was sent out to ${this.email}`,
                  level: 'info'
                })
              })
            }
          }
        )
      }
    }
  }
</script>
