<template>
  <div class="account__create__form">
    <form>
      <fieldset>
        <div class="form-group">
          <div :class="['form-group-item', 'input-validation', firstNameError ? 'has-danger': '']">
            <input class="form-control"
                   type="text"
                   id="first"
                   ref="first"
                   placeholder="First name *"
                   v-model="account.firstName"
                   required>
            <div v-if="firstNameError" class="error">{{ firstNameError }}</div>
          </div>
          <div :class="['form-group-item', 'input-validation', lastNameError ? 'has-danger': '']">
            <input class="form-control"
                   type="text"
                   placeholder="Last name *"
                   v-model="account.lastName"
                   required>
            <div v-if="lastNameError" class="error">{{ lastNameError }}</div>
          </div>
        </div>
        <div :class="['form-group', 'input-validation', emailError ? 'has-danger': '']">
          <div class="form-group-item">
            <input class="form-control"
                   type="text"
                   placeholder="Email account *"
                   v-model="account.email"
                   required>
            <div v-if="emailError" class="error">{{ emailError }}</div>
          </div>
        </div>
        <div :class="['form-group']">
          <div :class="['form-group-item', 'input-validation', passwordError ? 'has-danger': '']">
            <input class="form-control"
                   type="password"
                   id="password"
                   ref="password"
                   placeholder="Password *"
                   v-model="account.password"
                   required>
            <div v-if="passwordError" class="error">{{ passwordError }}</div>
          </div>
          <div :class="['form-group-item', 'input-validation', passwordConfirmationError ? 'has-danger': '']">
            <input class="form-control"
                   type="password"
                   placeholder="Confirm password *"
                   v-model="account.passwordConfirmation"
                   required>
            <div v-if="passwordConfirmationError" class="error">{{ passwordConfirmationError }}</div>
          </div>
        </div>
      </fieldset>
    </form>
    <div class="newsletter-flags">
      <div class="newsletter-toggles">
        <form>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" name="weekly" v-model="account.registerNewsletter">Subscribe to our newsletter
            </label>
          </div>
        </form>
      </div>
    </div>
    <button class="account__create__btn btn primary" @click="onSubmit">Create Account</button>
  </div>
</template>

<script>
  import { signup } from '../../utils/auth/index'
  export default {
    name: 'CreateAccountForm',
    data: function () {
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
      firstNameError () {
        return this.$store.getters.getUserFormFirstNameError
      },
      lastNameError () {
        return this.$store.getters.getUserFormLastNameError
      },
      emailError () {
        return this.$store.getters.getUserFormEmailError
      },
      passwordError () {
        return this.$store.getters.getUserFormPasswordError
      },
      passwordConfirmationError () {
        return this.$store.getters.getUserFormPasswordConfirmationError
      }
    },
    methods: {
      async onSubmit () {
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
          signup(this, {
            username: this.account.email,
            email: this.account.email,
            password: this.account.password,
            first_name: this.account.firstName,
            last_name: this.account.lastName,
            newsletter: this.account.registerNewsletter
          }, () => {
            this.$emit('account-created')
          })
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
