<template>
  <div>
    <form @submit.prevent="onConfirmPassword" style="padding-bottom: 2rem;">
      <fieldset>
        <div v-if="confirmOld" class="form-group">
          <div :class="['form-group-item', 'input-validation', passwordError ? 'has-danger': '']">
            <input class="form-control"
                   type="password"
                   placeholder="Old Password *"
                   v-model="oldPassword"
                   required>
            <div v-if="oldPasswordError" class="error">{{ oldPasswordError }}</div>
          </div>
        </div>
        <div class="form-group">
          <div :class="['form-group-item', 'input-validation', passwordError ? 'has-danger': '']">
            <input class="form-control"
                   type="password"
                   :placeholder="confirmOld ? 'Password *' : 'New Password *'"
                   v-model="password"
                   required>
            <div v-if="passwordError" class="error">{{ passwordError }}</div>
          </div>
        </div>
        <div class="form-group">
          <div :class="['form-group-item', 'input-validation', passwordConfirmationError ? 'has-danger': '']">
            <input class="form-control"
                   type="password"
                   :placeholder="confirmOld ? 'Confirm Password *' : 'Confirm new Password *'"
                   v-model="passwordConfirm"
                   required>
            <div v-if="passwordConfirmationError" class="error">{{ passwordConfirmationError }}</div>
          </div>
        </div>
      </fieldset>
    </form>
    <button type="submit" class="btn primary">Change My Password</button>
  </div>
</template>

<script>
  import { changePassword } from '../../utils/auth/index'
  export default {
    name: 'PasswordResetForm',
    props: {
      confirmOld: false
    },
    data () {
      return {
        oldPassword: '',
        oldPasswordError: '',
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
              if (this.confirmOld) {
                if (this.oldPassword) {
                  this.oldPasswordError = ''
                  params['old_password'] = this.oldPassword
                } else {
                  this.oldPasswordError = 'Password is empty'
                  isValid = false
                }
              }
              if (isValid) {
                changePassword(this, params, () => {
                  this.$emit('success')
                  this.$store.dispatch('addAlert', {
                    message: 'Successfully reset your password!',
                    level: 'info'
                  })
                  this.oldPassword = ''
                  this.oldPasswordError = ''
                  this.password = ''
                  this.passwordConfirm = ''
                }, () => {
                  this.$store.dispatch('addAlert', {
                    message: 'Something is wrong with your credentials',
                    level: 'error'
                  })
                })
              }
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
