<template>
  <div class="account__create__form">
    <form>
      <fieldset>
        <div class="form-group">
          <div :class="['form-group-item', 'input-validation', firstNameError ? 'has-danger': '']">
            <input 
              id="first"
              ref="first"
              v-model="account.firstName"
              class="form-control"
              type="text"
              placeholder="First name *"
              required>
            <div 
              v-if="firstNameError" 
              class="error">{{ firstNameError }}</div>
          </div>
          <div :class="['form-group-item', 'input-validation', lastNameError ? 'has-danger': '']">
            <input 
              v-model="account.lastName"
              class="form-control"
              type="text"
              placeholder="Last name *"
              required>
            <div 
              v-if="lastNameError" 
              class="error">{{ lastNameError }}</div>
          </div>
        </div>
        <div :class="['form-group', 'input-validation', emailError ? 'has-danger': '']">
          <div class="form-group-item">
            <input 
              v-model="account.email"
              class="form-control"
              type="text"
              placeholder="Email account *"
              required>
            <div 
              v-if="emailError" 
              class="error">{{ emailError }}</div>
          </div>
        </div>
        <div :class="['form-group']">
          <div :class="['form-group-item', 'input-validation', passwordError ? 'has-danger': '']">
            <input 
              id="password"
              ref="password"
              v-model="account.password"
              class="form-control"
              type="password"
              placeholder="Password *"
              required>
            <div 
              v-if="passwordError" 
              class="error">{{ passwordError }}</div>
          </div>
          <div :class="['form-group-item', 'input-validation', passwordConfirmationError ? 'has-danger': '']">
            <input 
              v-model="account.passwordConfirmation"
              class="form-control"
              type="password"
              placeholder="Confirm password *"
              required>
            <div 
              v-if="passwordConfirmationError" 
              class="error">{{ passwordConfirmationError }}</div>
          </div>
        </div>
      </fieldset>
    </form>
    <div class="newsletter-flags">
      <div class="newsletter-toggles">
        <form>
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                v-model="account.registerNewsletter" 
                type="checkbox" 
                name="weekly">Subscribe to our newsletter
            </label>
          </div>
        </form>
      </div>
    </div>
    <button 
      class="account__create__btn btn primary" 
      @click="onSubmit">Create Account</button>
  </div>
</template>

<script>
import { signup } from '../../utils/auth/index'
export default {
  name: 'CreateAccountForm',
  data: function() {
    return {
      account: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        weekly: false,
        monthly: false,
        registerNewsletter: false
      }
    }
  },
  computed: {
    firstNameError() {
      return this.$store.getters.getUserFormFirstNameError
    },
    lastNameError() {
      return this.$store.getters.getUserFormLastNameError
    },
    emailError() {
      return this.$store.getters.getUserFormEmailError
    },
    passwordError() {
      return this.$store.getters.getUserFormPasswordError
    },
    passwordConfirmationError() {
      return this.$store.getters.getUserFormPasswordConfirmationError
    }
  },
  methods: {
    async onSubmit() {
      let user = {
        lastName: this.account.lastName,
        firstName: this.account.firstName,
        email: this.account.email,
        password: this.account.password,
        passwordConfirm: this.account.passwordConfirmation,
        registerNewsletter: this.account.registerNewsletter
      }
      var validateUser = this.$store.dispatch('validateUserForm', {
        user: user
      })
      var isValid = await validateUser
      if (isValid) {
        signup(
          this,
          {
            username: this.account.email,
            email: this.account.email,
            password: this.account.password,
            first_name: this.account.firstName,
            last_name: this.account.lastName,
            newsletter: this.account.registerNewsletter
          },
          () => {
            this.$emit('account-created')
          }
        )
      }
    }
  }
}
</script>

<style lang="scss">
.account__create {
  &__btn {
    margin-top: 2rem;
    width: 100%;
  }
}
</style>
