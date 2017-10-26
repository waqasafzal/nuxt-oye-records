<template>
  <div>
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

<script>
  import { changePassword } from '../utils/auth/index'
  export default {
    name: 'PasswordResetForm',
    data () {
      return {
        password: '',
        passwordConfirm: ''
      }
    },
    methods: {
      onConfirmPassword () {
        let userHash = this.$route.query.user
        let token = this.$route.query.token
        this.$store.dispatch(
          'passwordValidation',
          {password: this.password, passwordConfirm: this.passwordConfirm}
        ).then(
          isValid => {
            if (isValid) {
              let params = {password: this.password, token: token, uidb64: userHash}
              changePassword(this, params, () => {
                this.$emit('success')
                this.$store.dispatch('addAlert', {
                  message: 'Successfully reset your password!',
                  level: 'info'
                })
              }, () => {
                this.$store.dispatch('addAlert', {
                  message: 'Something is wrong with your credentials',
                  level: 'error'
                })
              })
            }
          }
        )
      }
    },
    computed: {
      passwordError () {
        return this.$store.getters.getUserFormPasswordError
      },
      passwordConfirmationError () {
        return this.$store.getters.getUserFormPasswordConfirmationError
      }
    }
  }
</script>
