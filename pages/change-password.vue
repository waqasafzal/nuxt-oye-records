<template>
  <div class="checkout">
    <div class="row justify-content-center checkout__content">
      <template v-if="passwordChanged">
        <div class="complete">
          <h2>Your password has been changed!</h2>
          <div class="complete__summary">
            You are already logged in and can <nuxt-link to="/">continue shopping</nuxt-link> now.<br/>
            If you want to change your password again, please go to the
            <nuxt-link :to="{name: 'account-details'}">Your Account</nuxt-link> section.
          </div>
        </div>
      </template>
      <template v-else>
        <div class="col-8 reset-password__panel">
          <h3>Password reset confirmation</h3>
          <div class="description">Please enter your new password twice so we can verify you typed it in correctly.</div>
          <form>
            <fieldset>
              <div class="form-group">
                <div :class="['form-group-item', 'input-validation', passwordError ? 'has-danger': '']">
                  <input class="form-control"
                         type="password"
                         placeholder="Password *"
                         v-model="password"
                         required>
                  <div v-if="passwordError" class="error">{{ passwordError }}</div>
                </div>
              </div>
              <div class="form-group">
                <div :class="['form-group-item', 'input-validation', passwordConfirmationError ? 'has-danger': '']">
                  <input class="form-control"
                         type="password"
                         placeholder="Confirm Password *"
                         v-model="passwordConfirm"
                         required>
                  <div v-if="passwordConfirmationError" class="error">{{ passwordConfirmationError }}</div>
                </div>
              </div>
            </fieldset>
          </form>
          <button @click="onConfirmPassword" class="btn primary">Change My Password</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import { changePassword } from '../utils/auth/index'
  export default {
    name: 'ChangeResetPassword',
    middleware: ['authenticated'],
    data: function () {
      return {
        password: '',
        passwordConfirm: '',
        passwordChanged: false
      }
    },
    computed: {
      passwordError () {
        return this.$store.getters.getUserFormPasswordError
      },
      passwordConfirmationError () {
        return this.$store.getters.getUserFormPasswordConfirmationError
      }
    },
    methods: {
      onConfirmPassword () {
        this.$store.dispatch(
          'passwordValidation',
          {password: this.password, passwordConfirm: this.passwordConfirm}
        ).then(
          isValid => {
            if (isValid) {
              changePassword(this, this.password, () => {
                this.passwordChanged = true
                this.$store.dispatch('addAlert', {
                  message: 'Successfully reset your password!',
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
