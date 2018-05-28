<template>
  <div class="account__customer-data">
    <div class="row">
      <div class="col-12">
        <div class="summary__header">
          <div class="category">Login Details</div>
        </div>
        <table class="table">
          <tr class="customer-email">
            <td>Email</td>
            <td class="data-value">
                <span v-show="!emailEditMode">{{ email }}</span>
                <input v-show="emailEditMode"id="email" ref="email" class="form-control" v-model="changeEmail" type="text" />
            </td>
            <td class="link edit" @click="toggleEmailEditMode">{{ !emailEditMode ? "Edit" : "Save" }}</td>
          </tr>
          <tr>
            <td>Password</td>
            <td><span>******</span></td>
            <td class="link edit" @click="togglePasswordEditMode">{{ !passwordEditMode ? "Edit" : "Cancel" }}</td>
          </tr>
        </table>
        <div v-if="passwordEditMode" class="password-change__panel">
          <password-reset-form @success="onPasswordResetSuccess" confirmOld="true"></password-reset-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import PasswordResetForm from './PasswordResetForm'
  import * as types from '../../store/types'
  export default {
    components: {PasswordResetForm},
    name: 'CustomerData',
    data () {
      return {
        emailEditMode: false,
        passwordEditMode: false,
        changeEmail: this.$store.state.user.email
      }
    },
    watch: {
      email (value) {
        this.changeEmail = value
      }
    },
    computed: {
      email () {
        return this.$store.state.user.email
      }
    },
    methods: {
      onPasswordResetSuccess () {
        this.passwordEditMode = false
      },
      toggleEmailEditMode () {
        let nextEditMode = !this.emailEditMode
        if (nextEditMode) {
          this.emailEditMode = nextEditMode
          let email = this.$refs['email']
          if (email) {
            email.focus()
          }
        } else {
          let changeEmail = this.changeEmail
          if (this.email !== changeEmail) {
            this.$store.dispatch('emailValidation', {email: changeEmail}).then(
              isValid => {
                this.emailEditMode = nextEditMode
                if (isValid) {
                  this.$store.commit(types.SET_USER_EMAIL, this.changeEmail)
                  this.$store.dispatch('updateUser', {email: changeEmail})
                }
              }
            )
          } else {
            this.emailEditMode = nextEditMode
          }
        }
      },
      togglePasswordEditMode () {
        this.passwordEditMode = !this.passwordEditMode
      }
    }
  }
</script>
