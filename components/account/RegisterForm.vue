<template>
  <div class="register__form__panel">
    <form id="register">
      <fieldset>
        <div class="form-group input-validation">
          <input class="form-control" placeholder="Username *" name="newname" v-model="user.name" type="text" required>
          <div v-if="usernameError" class="error">{{ usernameError }}</div>
        </div>
        <div class="form-group input-validation">
          <input class="form-control" placeholder="Email *" name="email" v-model="user.email" type="email"/>
          <div v-if="emailError" class="error">{{ emailError }}</div>
        </div>
        <div class="form-group input-validation">
          <input class="form-control" placeholder="Password *" name="newpwd" v-model="user.password" type="password" required>
          <div v-if="passwordError"  class="error">{{ passwordError }}</div>
        </div>
        <div class="form-group input-validation">
          <input class="form-control" placeholder="Confirm Password *" name="passwordConfirm" v-model="user.passwordConfirm" type="password"/>
          <div v-if="passwordConfirmationError" class="error">{{ passwordConfirmationError }}</div>
        </div>
      </fieldset>
      <button type="submit" form="register" v-if="submit">Register</button>
    </form>
  </div>
</template>

<script>
  export default {
    name: 'RegisterForm',
    props: {
      submit: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        user: {
          name: '',
          password: '',
          passwordConfirm: '',
          email: ''
        }
      }
    },
    computed: {
      formValidation () {
        return this.$store.state.userFormErrors
      },
      usernameError () {
        return this.$store.getters.getUserFormNameError
      },
      passwordError () {
        return this.$store.getters.getUserFormPasswordError
      },
      passwordConfirmationError () {
        return this.$store.getters.getUserFormPasswordConfirmationError
      },
      emailError () {
        return this.$store.getters.getUserFormEmailError
      }
    },
    mounted () {
      let vm = this
      this.$watch(
        'user',
        function () {
          vm.$emit('user-changed', vm.user)
        }, {
          deep: true
        })
    }
  }
</script>
