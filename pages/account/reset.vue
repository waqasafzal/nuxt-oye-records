<template>
  <div class="checkout">
    <div class="checkout__content row">
      <div class="checkout__content__col col-12">
        <div class="row justify-content-center">
          <div class="col-8 reset-password__panel">
            <h3>Forgot your password?</h3>
            <div class="description">Please enter your email on the form below</div>
            <form>
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
            <button @click="onResetPassword" class="btn primary">Reset My Password</button>
          </div>
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
        this.$store.dispatch('emailValidation', {email: this.email}).then(
          isValid => {
            if (isValid) {
              resetEmail(this, this.email, () => {
                this.emailSent = true
                this.$store.dispatch('addAlert', {
                  message: `A email was sent out to ${this.email}`,
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
