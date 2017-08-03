<template>
  <div class="account__create__form">
    <form>
      <fieldset>
        <div :class="['form-group', firstNameError ? 'has-danger': '']">
          <div class="form-group-item">
            <input class="form-control"
                   type="text"
                   id="first"
                   ref="first"
                   placeholder="First name *"
                   v-model="account.firstName"
                   required>
            <div v-if="firstNameError" class="error">{{ firstNameError }}</div>
          </div>
          <div class="form-group-item">
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
            <div v-if="lastNameError" class="error">{{ emailError }}</div>
          </div>
        </div>
        <div :class="['form-group', firstNameError ? 'has-danger': '']">
          <div class="form-group-item">
            <input class="form-control"
                   type="text"
                   id="password"
                   ref="password"
                   placeholder="Password *"
                   v-model="account.password"
                   required>
            <div v-if="passwordError" class="error">{{ passwordError }}</div>
          </div>
          <div class="form-group-item">
            <input class="form-control"
                   type="text"
                   placeholder="Confirm password *"
                   v-model="account.passwordConfirmation"
                   required>
            <div v-if="passwordConfirmationError" class="error">{{ passwordConfirmationError }}</div>
          </div>
        </div>
      </fieldset>
    </form>
    <div class="newsletter-form">
      <h4>Subscribe to our newsletters</h4>
      <div class="newsletter-toggles">
        <form>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" name="weekly" v-model="account.weekly">Weekly News
            </label>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" name="monthly" v-model="account.monthly">Monthly Bestsellers
            </label>
          </div>
        </form>
      </div>
    </div>
    <button class="account__create__btn btn primary">Create Account</button>
  </div>
</template>

<script>
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
          monthly: false
        }
      }
    }
  }
</script>

<style lang="scss">
  .newsletter {
    &-toggles {
      margin-top: 0.5rem;
      .form-group {
        margin-bottom: 6px;
      }
    }
    &-form {
      margin-top: 0.5rem;
    }
  }

  .checkbox-label {
    margin-bottom: 0px;
    input[type=checkbox] {
      -moz-appearance: none;
      -webkit-appearance: none;
      border: 1px solid #cacece;
      padding: 7px;
      border-radius: 0px;
      display: inline-block;
      position: relative;
      margin-right: 10px;
      top: 2px;
      &:checked {
        background-color: white;
        border: 1px solid #adb8c0;
        color: #99a1a7;
        &:after {
          content: '\2713';
          font-size: 14px;
          position: absolute;
          top: -3px;
          left: 2px;
          color: #30C46C;
        }
      }
      &:focus {
        outline: none;
        background-color: white;
      }
    }
    &:before {
      border-radius: 0px;
    }
  }
  .account__create {
    &__btn {
      margin-top: 2rem;
      width: 100%;
    }
  }
</style>
